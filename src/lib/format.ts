/** Money in South-Asian grouping: Rs 1,85,000. */
export function rs(amount: number): string {
  return `Rs ${Math.round(amount).toLocaleString('en-IN')}`;
}

export function rsCompact(amount: number): string {
  if (amount >= 100_000) return `Rs ${(amount / 100_000).toFixed(1).replace(/\.0$/, '')}L`;
  if (amount >= 1_000) return `Rs ${Math.round(amount / 1_000)}k`;
  return rs(amount);
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}
