/**
 * PORTFOLIO: STARTER CONTENT
 * ---------------------------------------------------------------
 * Projects are normally managed at /admin (stored in Vercel Blob).
 * The list below is only used until the first save in the admin;
 * after that the admin's copy is the source of truth.
 *
 * Manual alternative (without the admin):
 *   1. Put its images / videos in  public/portfolio/<slug>/
 *   2. Add an entry to the `projects` array below.
 *   3. Commit & push: Vercel redeploys and the project gets its own page
 *      at /portfolio/<slug>.
 *
 * Every field except slug, title, category and summary is optional.
 * Without a `cover` image the site draws a generated cover in the brand colours.
 */

/** Reserved category: these projects are kits shown only on the /apparel page. */
export const APPAREL = "Apparel";
/** Starter portfolio categories. After the first save in /admin, the admin's list is used. */
export const starterCategories = ["Graphic Design", "3D", "VFX & Video", "Motion", "Marketing"];
export type Category = string;

export type Project = {
  slug: string;
  title: string;
  client?: string;
  category: Category;
  year?: string;
  /** One sentence used on cards. */
  summary: string;
  /** Paragraphs shown on the project page. */
  description?: string[];
  services?: string[];
  /** e.g. "/portfolio/msi-gaming/cover.jpg" */
  cover?: string;
  /** Extra images shown on the project page. */
  gallery?: string[];
  /** Self-hosted video, e.g. "/portfolio/skydive/reel.mp4" */
  video?: string;
  /** YouTube / Vimeo embed URL, e.g. "https://www.youtube.com/embed/VIDEO_ID" */
  embed?: string;
  /** External link (Behance, Drive folder, Instagram post…) */
  link?: { label: string; href: string };
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "infinity-club-jersey",
    title: "Infinity Club Jersey",
    client: "Infinity Club",
    category: "Apparel",
    summary: "Official team jersey with a circuit-line pattern and a gold dragon motif.",
    description: ["An official jersey for Infinity Club: a black base with a fine circuit-line pattern, a gold dragon wrapping the body, and gold trim on the collar and cuffs, with player name, sponsor and flag placements."],
    services: ["Jersey design", "Sponsor placement", "Player names", "Mockups"],
    cover: "/apparel/infinity-club-jersey.webp",
  },
  {
    slug: "young-ladies-jersey",
    title: "Young Ladies Official Jersey",
    client: "Young Ladies",
    category: "Apparel",
    summary: "White and pink official jersey for the Young Ladies roster.",
    description: ["The official jersey for Young Ladies: a white body with a subtle pattern, sweeping pink panels and grey side detailing, with the team crest, player name and partner logos laid out front and back."],
    services: ["Jersey design", "Sponsor placement", "Player names", "Mockups"],
    cover: "/apparel/young-ladies-jersey.webp",
  },
  {
    slug: "2d-esports-kit-2026",
    title: "2D Esports Official Kit 2026",
    client: "2D Esports",
    category: "Apparel",
    year: "2026",
    summary: "White and gold 2026 kit built around the Devil Dad pharaoh crest.",
    description: ["The 2026 official kit for 2D Esports: a white and gold design centred on the team's pharaoh-skull artwork, with gold linework, a black collar panel and the team name running down the side."],
    services: ["Jersey design", "Sponsor placement", "Player names", "Mockups"],
    cover: "/apparel/2d-esports-kit-2026.webp",
  },
  {
    slug: "number-one-esports-kit",
    title: "Number One Esports Official Kit",
    client: "Number One Esports",
    category: "Apparel",
    summary: "Navy and electric-blue kit with black raglan sleeves and tribal stripes.",
    description: ["The official kit for Number One Esports: deep navy with a dotted texture, black raglan sleeves, electric-blue tribal stripes and the N1 mark repeated large on the back."],
    services: ["Jersey design", "Sponsor placement", "Player names", "Mockups"],
    cover: "/apparel/number-one-esports-kit.webp",
  },
  {
    slug: "canzer-agency-2k26-kit",
    title: "Canzer Agency 2K26 Edition Kit",
    client: "Canzer Agency",
    category: "Apparel",
    year: "2026",
    summary: "Black-to-blue grunge kit for the 2K26 season.",
    description: ["The 2K26 edition kit for Canzer Agency: a black top half breaking into bright blue through a grunge texture, with the Canzer mark front and back and thin blue trims."],
    services: ["Jersey design", "Sponsor placement", "Player names", "Mockups"],
    cover: "/apparel/canzer-agency-2k26-kit.webp",
  },
  {
    slug: "deu-x-vt-esports-hoodie",
    title: "DEU x VT Esports Official Hoodie",
    client: "Dead Eye Unit Esports x Vendetta Esports",
    category: "Apparel",
    summary: "Black marble-crack zip hoodie with player name and sponsor line-up.",
    description: ["The official full-zip hoodie for Dead Eye Unit Esports x Vendetta Esports: a black marble base with white crack graphics across the body and sleeves, the player's name across the back and a stacked sponsor layout."],
    services: ["Hoodie design", "Sponsor placement", "Player names", "Mockups"],
    cover: "/apparel/deu-x-vt-esports-hoodie.webp",
  },
  {
    slug: "msi-gaming-sri-lanka",
    title: "MSI Gaming Sri Lanka",
    client: "MSI Gaming Sri Lanka",
    category: "Graphic Design",
    summary: "Social and campaign design as Head of Design for MSI Gaming Sri Lanka.",
    description: [
      "As Head of Design, Dhanika shaped the visual output for MSI Gaming Sri Lanka's social channels: product announcements, promotions and community posts in a consistent, high-energy gaming style.",
    ],
    services: ["Art direction", "Social media design", "Key visuals"],
    link: { label: "View on Facebook", href: "https://www.facebook.com/MSIGamingSriLanka" },
    featured: true,
  },
  {
    slug: "abu-dhabi-skydive",
    title: "Abu Dhabi Skydive",
    category: "VFX & Video",
    summary: "Shot and edited a skydiving reel over Abu Dhabi.",
    description: [
      "Filmed and edited as both videographer and editor: a fast vertical cut built for Instagram Reels, with pacing and colour that keep the adrenaline of the jump.",
    ],
    services: ["Videography", "Editing", "Colour grading"],
    link: { label: "Watch the reel", href: "https://www.instagram.com/reel/DKP4bH-h9ad/" },
    featured: true,
  },
  {
    slug: "architectural-visualization",
    title: "Architectural Visualization",
    category: "3D",
    summary: "Photoreal 3D renders of interiors and exteriors.",
    description: [
      "A collection of architectural visualization work: modelling, lighting, materials and rendering that present spaces before they are built.",
    ],
    services: ["3D modelling", "Lighting", "Rendering"],
    link: {
      label: "Open the gallery",
      href: "https://drive.google.com/drive/folders/1NR6O98CCqO7EbsvgFjhSrnof5Lqv0Voe?usp=sharing",
    },
    featured: true,
  },
  {
    slug: "maximum-esports",
    title: "Maximum Esports",
    client: "Maximum Esports",
    category: "Graphic Design",
    summary: "Esports brand graphics as Head of Design for Maximum Esports.",
    description: [
      "Match-day graphics, roster announcements and social assets for an esports organisation: a bold visual language designed to work at stream size and on a phone screen.",
    ],
    services: ["Esports branding", "Social media design"],
    link: { label: "View on Instagram", href: "https://www.instagram.com/maximum_esports/" },
    featured: true,
  },
  {
    slug: "2d-animations",
    title: "2D Animations",
    category: "Motion",
    summary: "Animated logos, explainers and social motion graphics.",
    description: ["A reel of 2D animation work: logo reveals, explainers and motion graphics for social media."],
    services: ["2D animation", "Motion graphics"],
    link: {
      label: "Open the gallery",
      href: "https://drive.google.com/drive/folders/1kZG0OHrX-ZC8PAiP0WrzwZqGwFwyrcos?usp=drive_link",
    },
  },
  {
    slug: "barkley-house-real-estate",
    title: "Barkley House Real Estate",
    client: "Barkley House Real Estate",
    category: "Marketing",
    summary: "Social media management for a real-estate brand.",
    description: [
      "As Social Media Manager, Dhanika runs Barkley House's social channels: listing content, social campaigns and brand visuals.",
    ],
    services: ["Social media management", "Content", "Campaigns"],
    link: { label: "View on Instagram", href: "https://www.instagram.com/barkleyhouse_re" },
  },
  {
    slug: "dubai-real-estate-guide-2025",
    title: "Dubai Real Estate Guide 2025",
    category: "Marketing",
    summary: "A designed guide to the Dubai property market.",
    description: ["Editorial design for a real-estate guide covering the Dubai market in 2025."],
    services: ["Editorial design", "Layout"],
    link: {
      label: "Open the guide",
      href: "https://drive.google.com/drive/folders/1PuBDGa-mZUx9CHSulFRhcJOymMDJtrca",
    },
  },
  {
    slug: "supreme-sports",
    title: "Supreme Sports",
    client: "Supreme Sports",
    category: "VFX & Video",
    summary: "Video editing and graphics for a sports channel.",
    description: ["Edited videos and designed the graphics package for Supreme Sports' YouTube channel."],
    services: ["Video editing", "Thumbnails", "Graphics"],
    link: { label: "Watch on YouTube", href: "https://www.youtube.com/@supremesportslk/videos" },
  },
  {
    slug: "gfx-collection",
    title: "GFX Collection",
    category: "Graphic Design",
    summary: "Logos, esports marks, apparel and social graphics.",
    description: ["A wider selection of graphic design work: logos, esports tournament marks, oversized t-shirt designs and social posts."],
    services: ["Logo design", "Apparel", "Social media design"],
    link: {
      label: "Open the gallery",
      href: "https://drive.google.com/drive/folders/1ACJ9_MDE3X7BoStwNCjdSbsAswzcPkOT",
    },
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
