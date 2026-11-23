import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { deleteUnusedMedia, logosOf, readClients, saveClients } from "@/lib/store";
import { cleanClientGroups } from "@/lib/validate";

export const dynamic = "force-dynamic";

const unauthorized = () => NextResponse.json({ error: "Please sign in again." }, { status: 401 });

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  return NextResponse.json(await readClients());
}

/** Replaces all countries and brands ("Who I worked with"). */
export async function PUT(req: Request) {
  if (!(await isAdmin())) return unauthorized();
  let next;
  try {
    const body = await req.json();
    next = cleanClientGroups(body?.groups);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
  try {
    const { groups: prev } = await readClients();
    await saveClients(next);
    // Remove logo files no brand (or project) uses any more.
    await deleteUnusedMedia(logosOf(prev)).catch((e) => console.error("Logo cleanup failed", e));
    return NextResponse.json({ groups: next, fromSeed: false });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: (e as Error).message || "Saving failed." }, { status: 500 });
  }
}
