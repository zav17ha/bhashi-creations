import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { deleteUnusedMedia, mediaOf, readProjects, saveProjects, storageMode } from "@/lib/store";
import { cleanProjects } from "@/lib/validate";

export const dynamic = "force-dynamic";

const unauthorized = () => NextResponse.json({ error: "Please sign in again." }, { status: 401 });

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  const { projects, fromSeed } = await readProjects();
  return NextResponse.json({ projects, fromSeed, storage: storageMode() });
}

/** Replaces the whole project list (create / edit / delete / reorder all go through here). */
export async function PUT(req: Request) {
  if (!(await isAdmin())) return unauthorized();
  let next;
  try {
    const body = await req.json();
    next = cleanProjects(body?.projects);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
  try {
    const { projects: prev } = await readProjects();
    await saveProjects(next);
    // Remove uploaded files that no project uses any more.
    await deleteUnusedMedia(prev.flatMap(mediaOf)).catch((e) => console.error("Media cleanup failed", e));
    return NextResponse.json({ projects: next, fromSeed: false, storage: storageMode() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: (e as Error).message || "Saving failed." }, { status: 500 });
  }
}
