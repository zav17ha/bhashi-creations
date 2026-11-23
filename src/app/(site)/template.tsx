/** Re-mounts on every navigation so each page gets a fresh entrance. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page">{children}</div>;
}
