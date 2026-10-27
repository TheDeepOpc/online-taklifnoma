export function PhotoGallery({
  photos,
  className,
  itemClassName,
  alt = "Kelin-kuyov",
}: {
  photos: string[];
  /** Suratlar tavsifi (masalan, kelin-kuyov ismlari) — har biriga tartib raqami qo'shiladi. */
  alt?: string;
  /** Grid/wrapper class supplied by the calling family's CSS module. */
  className?: string;
  /** Class applied to each <img>, supplied by the calling family's CSS module. */
  itemClassName?: string;
}) {
  if (photos.length === 0) return null;

  return (
    <div className={className}>
      {photos.map((url, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={url + i} src={url} alt={`${alt} — surat ${i + 1}`} className={itemClassName} loading="lazy" />
      ))}
    </div>
  );
}
