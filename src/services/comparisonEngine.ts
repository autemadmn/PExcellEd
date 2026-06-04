import type { ComparedRow, DateChange, RowStatus } from '../types/comparison';
import type { DateFieldKey, ParsedPlannerSheet, ParsedRow } from '../types/excel';
import { findSuggestedMatches, getRowMatchKey, groupRowsByMatchKey } from '../utils/rowMatching';

const DATE_FIELDS: Array<{ field: DateFieldKey; label: string }> = [
  { field: 'startDate', label: 'Inicio' },
  { field: 'endDate', label: 'Finalización' },
];

function getDateValue(row: ParsedRow, field: DateFieldKey): string | null {
  return field === 'startDate' ? row.startDate : row.endDate;
}

function getChangedDates(previousRow: ParsedRow, currentRow: ParsedRow): DateChange[] {
  return DATE_FIELDS.flatMap(({ field, label }) => {
    const previous = getDateValue(previousRow, field);
    const current = getDateValue(currentRow, field);

    if (previous === current) {
      return [];
    }

    return [{ field, label, previous, current }];
  });
}

function resolveStatus(previousRow: ParsedRow | null, changes: DateChange[], isAmbiguous: boolean): RowStatus {
  if (!previousRow) {
    return 'unmatched';
  }

  if (changes.length > 0) {
    return 'date_changed';
  }

  if (isAmbiguous) {
    return 'ambiguous';
  }

  return 'unchanged';
}

export function comparePlannerSheets(
  previousSheet: ParsedPlannerSheet,
  currentSheet: ParsedPlannerSheet,
): ComparedRow[] {
  const previousGroups = groupRowsByMatchKey(previousSheet.rows);
  const currentGroups = groupRowsByMatchKey(currentSheet.rows);
  const currentGroupIndexes = new Map<string, number>();

  return currentSheet.rows.map((currentRow) => {
    const key = getRowMatchKey(currentRow);
    const currentIndex = currentGroupIndexes.get(key) ?? 0;
    currentGroupIndexes.set(key, currentIndex + 1);

    const previousGroup = key ? previousGroups.get(key) ?? [] : [];
    const currentGroup = key ? currentGroups.get(key) ?? [] : [];
    const previousRow = previousGroup[currentIndex] ?? null;
    const isAmbiguous = previousGroup.length > 1 || currentGroup.length > 1;
    const changes = previousRow ? getChangedDates(previousRow, currentRow) : [];
    const status = resolveStatus(previousRow, changes, isAmbiguous);
    const suggestedMatches = previousRow ? [] : findSuggestedMatches(currentRow, previousSheet.rows);

    return {
      currentRow,
      previousRow,
      status,
      changedFields: changes.map((change) => change.field),
      changes,
      isAmbiguous,
      suggestedMatches,
    };
  });
}
