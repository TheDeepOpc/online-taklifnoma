import { SparkleIcon, FlowerIcon, LeafIcon } from "./icons";

const POSITIONS = [5, 15, 25, 40, 55, 65, 78, 90];

const EMOJI_ICONS: Record<
  string,
  { Icon: (props: { className?: string }) => React.ReactElement; color: string }
> = {
  "✨": { Icon: SparkleIcon, color: "#e8c766" },
  "🌸": { Icon: FlowerIcon, color: "#eda9c2" },
  "🌿": { Icon: LeafIcon, color: "#7cad74" },
};

export function FloatingDecoration({
  emoji,
  previewMode = false,
}: {
  emoji: string;
  previewMode?: boolean;
}) {
  const iconEntry = EMOJI_ICONS[emoji];

  return (
    <div
      aria-hidden
      className={`pointer-events-none ${previewMode ? "absolute" : "fixed"} inset-0 z-0 overflow-hidden`}
    >
      {POSITIONS.map((left, i) => (
        <span
          key={i}
          className="animate-float-down absolute opacity-70"
          style={{
            left: `${left}%`,
            animationDuration: `${10 + (i % 4) * 3}s`,
            animationDelay: `${i * 1.3}s`,
          }}
        >
          {iconEntry ? (
            <span style={{ color: iconEntry.color }}>
              <iconEntry.Icon className="h-6 w-6" />
            </span>
          ) : (
            emoji
          )}
        </span>
      ))}
    </div>
  );
}
