const CYRILLIC_TO_LATIN: Record<string, string> = {
  ў: "u",
  қ: "q",
  ғ: "g",
  ҳ: "h",
};

export function slugify(text: string): string {
  const normalized = text
    .toLowerCase()
    .split("")
    .map((ch) => CYRILLIC_TO_LATIN[ch] ?? ch)
    .join("");

  return normalized
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function generateInvitationSlug(groomName: string, brideName: string): string {
  const base = slugify(`${groomName}-${brideName}`) || "taklifnoma";
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}
