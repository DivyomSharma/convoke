export function Avatar({
  src,
  name,
  size = 32,
}: {
  src?: string;
  name: string;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  return (
    <span
      className="inline-flex items-center justify-center overflow-hidden rounded-full bg-g2 text-ink shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <span className="font-medium tracking-tight">{initials}</span>
      )}
    </span>
  );
}
