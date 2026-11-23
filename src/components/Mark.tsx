type Props = { className?: string; title?: string };

/** The Bhashi "B" mark, redrawn as a single vector path (72 × 141). */
export const MARK_PATH =
  "M0 0 L46 52 L38 61 L72 103 L0 141 Z M10 26.6 L32 52 L10 74 Z M10 88 L30.4 67.6 L56.6 100 L10 124.4 Z";

export function Mark({ className, title }: Props) {
  return (
    <svg
      className={className}
      viewBox="-2 -2 76 145"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d={MARK_PATH} fillRule="evenodd" />
    </svg>
  );
}
