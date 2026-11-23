"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { usePageTransition } from "./Providers";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string; label?: string };

/** Internal link that plays the page-transition curtain before navigating. */
export function TLink({ href, label, onClick, children, ...rest }: Props) {
  const { navigate } = usePageTransition();
  const pathname = usePathname();

  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        if (rest.target === "_blank" || !href.startsWith("/") || href.includes("#")) return;
        e.preventDefault();
        if (href === pathname) {
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        navigate(href, label);
      }}
    >
      {children}
    </Link>
  );
}
