type IconProps = { className?: string };

export function MapPinIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21.5c4-4.2 7-8.06 7-11.5a7 7 0 1 0-14 0c0 3.44 3 7.3 7 11.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function HeartIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 20.3 3.6 12A5.4 5.4 0 0 1 12 5.4 5.4 5.4 0 0 1 20.4 12L12 20.3Z" />
    </svg>
  );
}

export function MusicNoteIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 17.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M11.5 15V4.8l7-1.6v9.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M18.5 14.7a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export function MusicMuteIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 9.5v5h3.6L13 19V5L7.6 9.5H4Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="m16.5 9.5 4 5m0-5-4 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function SparkleIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2c.6 4.3 2.2 6.9 6 8-3.8 1.1-5.4 3.7-6 8-.6-4.3-2.2-6.9-6-8 3.8-1.1 5.4-3.7 6-8Z" />
    </svg>
  );
}

export function FlowerIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="12"
            cy="7.2"
            rx="2.6"
            ry="4"
            transform={`rotate(${deg} 12 12)`}
          />
        ))}
      </g>
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function LeafIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 19c-.6-6.5 2-13 14-14-1 12-7.4 14-14 14Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M6 18c3-3.6 6.4-6.6 11.5-11.6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}
