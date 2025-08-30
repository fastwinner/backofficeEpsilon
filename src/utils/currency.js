// Centralized currency formatting for FCFA
// Usage: formatFCFA(12345.6) -> "12 345,6 FCFA" (fr-FR grouping)
export function formatFCFA(amount) {
  if (amount === null || amount === undefined || isNaN(Number(amount))) return '0 FCFA';
  try {
    const n = Number(amount);
    // Keep 0-2 decimals depending on input
    const hasDecimals = Math.abs(n % 1) > 0;
    const formatted = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: 2,
    }).format(n);
    return `${formatted} FCFA`;
  } catch (e) {
    return `${amount} FCFA`;
  }
}
