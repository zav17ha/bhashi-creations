/**
 * Global site settings: edit contact details, socials, ventures and experience here.
 */
export const site = {
  name: "Bhashi Creations",
  legalName: "Bhashi Creations (Pvt) Ltd",
  tagline: "Where creativity reigns.",
  description:
    "Bhashi Creations is a creative studio led by Dhanika Bhashitha Karunanayake, offering digital marketing, graphic design, 3D and VFX for brands that want to be remembered.",
  owner: "Dhanika Bhashitha Karunanayake",
  ownerShort: "Dhanika Bhashitha",
  ownerRole: "Founder & Creative Director",
  // Change to the production domain once it is connected in Vercel.
  url: "https://bhashicreations.com",
  location: "Sri Lanka & UAE",
  timezone: "Asia/Colombo",
  /** Clocks shown in the nav, footer and contact page. */
  clocks: [
    { label: "LK", place: "Sri Lanka", timeZone: "Asia/Colombo" },
    { label: "UAE", place: "Dubai", timeZone: "Asia/Dubai" },
  ],
  // International format, digits only (Sri Lanka +94).
  whatsapp: "94743279381",
  whatsappDisplay: "+94 74 327 9381",
  // Optional: add an address to show it on the contact page and footer.
  email: "",
  disciplines: ["Digital Marketing", "Graphic Design", "3D", "VFX", "Motion", "Esports Apparel"],
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/BhashiCreations.lk" },
    { label: "Instagram", href: "https://www.instagram.com/bhashi_47/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/dhanika-bhashitha-2410b9324/" },
    { label: "WhatsApp", href: "https://wa.me/94743279381" },
    { label: "Linktree", href: "https://linktr.ee/bhashicreations0" },
  ],
  craxe: { label: "Craxe", href: "https://www.craxe.org" },
} as const;

export type Role = { org: string; title: string; href?: string; text?: string };

/** "Business ventures & leadership" on the About page. */
export const ventures: Role[] = [
  { org: "Dudes (Pvt) Ltd", title: "Director" },
  { org: "Craxe (Pvt) Ltd", title: "Director", href: "https://www.craxe.org" },
  {
    org: "MX3 Esports",
    title: "Co-Founder",
    text: "Leading an esports organization dedicated to developing Sri Lanka’s esports industry through team management, player sponsorships, esports event partnerships, and supporting competitive gaming teams and players.",
  },
];

/** "Professional experience" on the About page, grouped by country. */
export const experience: { region: string; roles: { org: string; title: string }[] }[] = [
  {
    region: "United Arab Emirates (UAE)",
    roles: [
      { org: "HYM Investments", title: "Marketing Manager" },
      { org: "YAM Holding", title: "Digital Marketing Manager" },
      { org: "Barkley House Real Estate", title: "Social Media Manager" },
    ],
  },
  {
    region: "Sri Lanka",
    roles: [
      { org: "Maximum Esports", title: "Head of Design" },
      { org: "Supreme Sports TV", title: "GFX Artist" },
      { org: "Deew GamerNet (Pvt) Ltd", title: "GFX & VFX Artist" },
    ],
  },
];

export type Client = { name: string; logo?: string };

/**
 * "Who I worked with" on the home page, one tab per group.
 * Logos go in public/clients/<group>/. Without a logo, the name is shown instead.
 * Logos look best trimmed to their edges on a white or transparent background.
 */
export type ClientGroup = { id: string; label: string; clients: Client[] };

/** Starter list: after the first save in /admin → Brands, the admin's copy is used instead. */
export const clientGroups: ClientGroup[] = [
  {
    id: "sri-lanka",
    label: "Sri Lanka",
    clients: [
      { name: "MSI Gaming Sri Lanka", logo: "/clients/sri-lanka/msi.webp" },
      { name: "Maximum Esports", logo: "/clients/sri-lanka/maximum-esports.webp" },
      { name: "TV Supreme", logo: "/clients/sri-lanka/tv-supreme.webp" },
      { name: "Deew GamerNet", logo: "/clients/sri-lanka/deew-gamernet.webp" },
      { name: "ORS Motors", logo: "/clients/sri-lanka/ors-motors.webp" },
      { name: "Trident Corporation" },
      { name: "1HIT Esports" },
      { name: "Seethawaka Tourism Zone" },
      { name: "The Comic Dude" },
    ],
  },
  {
    id: "dubai",
    label: "Dubai",
    clients: [
      { name: "Skydive Dubai", logo: "/clients/dubai/skydive-dubai.webp" },
      { name: "Abu Dhabi Skydive", logo: "/clients/dubai/abu-dhabi-skydive.webp" },
      { name: "Prime Lease Car Rentals", logo: "/clients/dubai/prime-lease.webp" },
      { name: "Dambo", logo: "/clients/dubai/dambo.webp" },
      { name: "White Boutique", logo: "/clients/dubai/white-boutique.webp" },
      { name: "HYM Investments" },
      { name: "Barkley House Real Estate" },
    ],
  },
];

export const services = [
  {
    code: "01",
    title: "Digital Marketing",
    text: "Social strategy, content calendars and paid campaigns built around a clear brand voice, so every post earns its place in the feed.",
    tags: ["Social media", "Campaigns", "Content strategy", "Paid ads"],
  },
  {
    code: "02",
    title: "Graphic Design",
    text: "Logos, identities, key visuals, esports branding and print. Sharp systems that stay consistent from a profile picture to a billboard.",
    tags: ["Logo design", "Brand identity", "Key visuals", "Apparel"],
  },
  {
    code: "03",
    title: "3D & Visualization",
    text: "Product renders, 3D logos and architectural visualization that let people see a space or object before it exists.",
    tags: ["3D modelling", "Arch-viz", "Product renders", "3D logos"],
  },
  {
    code: "04",
    title: "VFX & Video",
    text: "Shooting, editing, compositing and colour, from sports highlights to skydive reels, cut for the platform it lives on.",
    tags: ["Videography", "Editing", "Compositing", "Colour"],
  },
  {
    code: "05",
    title: "Motion & 2D Animation",
    text: "Animated logos, explainers and social motion graphics that make a static brand move.",
    tags: ["Logo animation", "Explainers", "Social motion"],
  },
  {
    code: "06",
    title: "Esports Apparel",
    text: "Team jerseys, hoodies and streetwear through Dudes Streetwear, designed around each roster's identity and sponsor line-up.",
    tags: ["Team jerseys", "Hoodies", "Sponsor layouts", "Streetwear"],
    href: "/apparel",
  },
] as const;
