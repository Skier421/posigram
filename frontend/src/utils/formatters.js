export function formatDateShort(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
