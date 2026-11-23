import type { MetadataRoute } from "next";
import { getPortfolio } from "@/lib/store";
import { site } from "@/content/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPortfolio();
  const pages = ["", "/portfolio", "/apparel", "/services", "/about", "/contact"].map((p) => ({ url: `${site.url}${p}` }));
  return [...pages, ...projects.map((p) => ({ url: `${site.url}/portfolio/${p.slug}` }))];
}
