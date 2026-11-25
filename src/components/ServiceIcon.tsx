/** Simple line icons for the services, keyed by service code ("01" to "06"). */
const PATHS: Record<string, React.ReactNode> = {
  // Digital Marketing: speaker with sound waves
  "01": (
    <>
      <path d="M3 10.5v3a1 1 0 0 0 1 1h2.5L11 18V6L6.5 9.5H4a1 1 0 0 0-1 1z" />
      <path d="M14.5 9a4 4 0 0 1 0 6" />
      <path d="M17.5 6.5a8 8 0 0 1 0 11" />
    </>
  ),
  // Graphic Design: pen nib
  "02": (
    <>
      <path d="M12 3.5l6.5 7L12 20.5l-6.5-10z" />
      <circle cx="12" cy="11.5" r="1.8" />
      <path d="M12 3.5v6.2" />
    </>
  ),
  // 3D & Visualization: cube
  "03": (
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M12 12l8-4.5M12 12L4 7.5M12 12v9" />
    </>
  ),
  // VFX & Video: video camera
  "04": (
    <>
      <rect x="3" y="6.5" width="12.5" height="11" rx="2" />
      <path d="M15.5 10.5l5-3v9l-5-3z" />
    </>
  ),
  // Motion & 2D Animation: speed lines and a moving ball
  "05": (
    <>
      <path d="M3.5 8h7M3.5 12h5M3.5 16h7" />
      <circle cx="16.5" cy="12" r="4" />
    </>
  ),
  // Esports Apparel: t-shirt
  "06": <path d="M8.5 4L3.5 7l2 4 2-1v10h9V10l2 1 2-4-5-3a3.5 3.5 0 0 1-7 0z" />,
};

export function ServiceIcon({ code, className = "" }: { code: string; className?: string }) {
  return (
    <svg
      className={`svc-icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[code] ?? <circle cx="12" cy="12" r="3" />}
    </svg>
  );
}
