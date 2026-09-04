export function formatSom(amount: number): string {
  const withSpaces = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${withSpaces} so'm`;
}
