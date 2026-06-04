interface SummaryBarProps {
  visibleCount: number;
  changedCount: number;
  unmatchedCount: number;
}

export function SummaryBar({ visibleCount, changedCount, unmatchedCount }: SummaryBarProps) {
  return (
    <div className="summary-bar" aria-live="polite">
      <strong>{visibleCount}</strong> filas mostradas
      <span aria-hidden="true">|</span>
      <strong>{changedCount}</strong> con fechas modificadas
      <span aria-hidden="true">|</span>
      <strong>{unmatchedCount}</strong> sin coincidencia anterior
    </div>
  );
}
