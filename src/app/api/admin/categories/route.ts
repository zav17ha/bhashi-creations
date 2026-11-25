import { NextResponse } from "next/server";
import { APPAREL } from "@/content/projects";
import { isAdmin } from "@/lib/auth";
import { readCategories, readProjects, saveCategories, saveProjects } from "@/lib/store";
import { cleanCategories } from "@/lib/validate";

export const dynamic = "force-dynamic";

const unauthorized = () => NextResponse.json({ error: "Please sign in again." }, { status: 401 });

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  return NextResponse.json(await readCategories());
}

/**
 * Replaces the portfolio category list.
 * Optional `rename: { from, to }` also moves every project in `from` to `to`.
 * A category still used by projects can't be removed.
 */
export async function PUT(req: Request) {
  if (!(await isAdmin())) return unauthorized();
  let next: string[];
  let rename: { from: string; to: string } | null = null;
  try {
    const body = await req.json();
    next = cleanCategories(body?.categories);
    if (body?.rename && typeof body.rename.from === "string" && typeof body.rename.to === "string") {
      rename = { from: body.rename.from, to: body.rename.to.trim() };
      if (!next.includes(rename.to)) throw new Error("Renamed category is missing from the list.");
    }
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
  try {
    let { projects } = await readProjects();
    if (rename) {
      const moved = projects.map((p) => (p.category === rename!.from ? { ...p, category: rename!.to } : p));
      if (moved.some((p, i) => p !== projects[i])) {
        await saveProjects(moved);
        projects = moved;
      }
    }
    const orphaned = projects.filter((p) => p.category !== APPAREL && !next.includes(p.category));
    if (orphaned.length) {
      const names = [...new Set(orphaned.map((p) => p.category))].join(", ");
      return NextResponse.json(
        { error: `${names} is still used by ${orphaned.length} project${orphaned.length > 1 ? "s" : ""}. Move them to another category first.` },
        { status: 400 },
      );
    }
    await saveCategories(next);
    return NextResponse.json({ categories: next, projects });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: (e as Error).message || "Saving failed." }, { status: 500 });
  }
}
