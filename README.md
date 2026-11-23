# Bhashi Creations: website

Multipage studio site for **Bhashi Creations (Pvt) Ltd**: Dhanika Bhashitha Karunanayake.
Built with **Next.js 16 (App Router) + React 19 + TypeScript** and plain CSS.
Every page is statically generated, so it deploys to Vercel with zero config.

Web solutions by [Craxe](https://www.craxe.org).

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel → **Add New Project** → import the repo. The framework is detected as Next.js; no settings needed.
3. After connecting the real domain, update `url` in `src/content/site.ts` (used for SEO, sitemap and social previews).

## Pages

| Route | What it is |
| --- | --- |
| `/` | Hero (interactive dot grid + tilting 3D mark), studio intro, client logos (Sri Lanka / Dubai), disciplines, founder |
| `/portfolio` | Filterable project grid |
| `/apparel` | Esports apparel gallery: image + title, opens full-size on click |
| `/portfolio/[slug]` | Project page: cover, overview, video, gallery, external link, next project |
| `/services` | Five disciplines + process |
| `/about` | Dhanika's bio, Director at Craxe, roles & brands |
| `/contact` | Brief form that opens WhatsApp with the message pre-written (no backend needed) |
| `/admin` | Password-protected portfolio manager (see below) |

## Portfolio admin (`/admin`)

Dhanika manages the site's work at **`/admin`**: no code needed. It has three tabs:

- **Portfolio**: add, edit, delete and reorder projects; upload a cover image, gallery images and a video
  (or paste a YouTube / Vimeo link).
- **Brands**: the "Who I worked with" logos on the home page: add, rename, reorder and delete countries
  (each becomes a tab), and add brands with a name and an optional logo. Countries with no brands are hidden.
- **Apparel**: jerseys, kits and hoodies: just a title and a kit image. Kits appear only on `/apparel` (not in the
  portfolio); clicking one opens it full-size in an overlay.
Changes go live immediately; the public pages stay static and are refreshed on each save.

### One-time setup on Vercel

1. **Connect storage:** Vercel dashboard → this project → **Storage** → **Create** → **Blob** → connect it to the project.
   This adds `BLOB_READ_WRITE_TOKEN` automatically.
2. **Set the password:** Settings → **Environment Variables** → add `ADMIN_PASSWORD` (a long, unique password).
   Optionally add `ADMIN_SECRET` (any random string).
3. **Redeploy**, then visit `https://<domain>/admin`.

Changing `ADMIN_PASSWORD` signs out every existing session.

### How it works

- Images and videos upload **directly from the browser to Vercel Blob** (up to 500 MB, so no serverless size limit).
- The project list and the brand list are saved as JSON files in the same Blob store; the 5 most recent versions are kept as backups.
- Deleting a project, or removing an image, also deletes the uploaded file.
- Until the first save, the admin shows the starter projects from `src/content/projects.ts`; the first save copies them into storage.
- `/admin` and `/api/` are excluded from search engines.

### Trying it locally

Copy `.env.example` to `.env.local` and set `ADMIN_PASSWORD`. Without a `BLOB_READ_WRITE_TOKEN`, uploads and the
project list are stored in `./.data` (git-ignored), so the full admin works with `npm run dev`.
To test against the real Blob store, run `vercel env pull .env.local`.

## Editing content

- **Contact details, socials, roles, services:** `src/content/site.ts`
- **Client logos:** `/admin` → Brands (starter list in `clientGroups` in `src/content/site.ts`)
- **Projects:** `/admin` (starter content in `src/content/projects.ts`)
- **Colours & fonts:** tokens at the top of `src/app/globals.css`; fonts are loaded in `src/app/layout.tsx`
  (Michroma for display, Inter Tight for body, JetBrains Mono for labels).

## Built-in details

- Angled two-panel page transition with the B mark and destination name; first-visit loader with a counter
- Native scrolling and cursor; text-scramble nav links and word-by-word headline reveals
- Hero grid of tiny square dots that drift away from the pointer and spring back (animates only while moving)
- Chamfered "cut corner" frames taken from the logo's angles
- `prefers-reduced-motion` respected throughout; skip link, keyboard focus styles, semantic markup
- Sitemap, robots.txt, Open Graph image (banner) and SVG favicon generated automatically
