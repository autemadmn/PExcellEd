import { useMemo } from 'react';
import type { ActiveFilters, ComparedRow, FilteredRowsResult, FilterOption } from '../types/comparison';

function uniqueOptionsByNormalized(options: FilterOption[]): FilterOption[] {
  const seen = new Set<string>();
  const unique: FilterOption[] = [];

  for (const option of options) {
    if (!option.normalized || seen.has(option.normalized)) {
      continue;
    }

    seen.add(option.normalized);
    unique.push(option);
  }

  return unique.sort((left, right) => left.normalized.localeCompare(right.normalized, 'es'));
}

function matchesStatus(row: ComparedRow, status: ActiveFilters['status']): boolean {
  switch (status) {
    case 'changed':
      return row.changedFields.length > 0;
    case 'unchanged':
      return Boolean(row.previousRow) && row.changedFields.length === 0;
    case 'unmatched':
      return row.status === 'unmatched';
    case 'all':
    default:
      return true;
  }
}

export function useFilterOptions(rows: ComparedRow[]): {
  nameOptions: FilterOption[];
  assigneeOptions: FilterOption[];
} {
  return useMemo(() => {
    const nameOptions = uniqueOptionsByNormalized(
      rows.map((row) => ({
        value: row.currentRow.normalizedTaskName,
        label: row.currentRow.taskName,
        normalized: row.currentRow.normalizedTaskName,
        indentationLevel: row.currentRow.indentationLevel,
        isBold: row.currentRow.isBold,
      })),
    );

    const assigneeOptions = uniqueOptionsByNormalized(
      rows.map((row) => ({
        value: row.currentRow.normalizedAssignee,
        label: row.currentRow.assignee,
        normalized: row.currentRow.normalizedAssignee,
      })),
    );

    return { nameOptions, assigneeOptions };
  }, [rows]);
}

export function useFilteredRows(rows: ComparedRow[], filters: ActiveFilters): FilteredRowsResult {
  return useMemo(() => {
    const selectedNames = new Set(filters.names.map((option) => option.normalized));
    const selectedAssignees = new Set(filters.assignees.map((option) => option.normalized));

    const filteredRows = rows.filter((row) => {
      const matchesName =
        selectedNames.size === 0 || selectedNames.has(row.currentRow.normalizedTaskName);
      const matchesAssignee =
        selectedAssignees.size === 0 || selectedAssignees.has(row.currentRow.normalizedAssignee);

      return matchesName && matchesAssignee && matchesStatus(row, filters.status);
    });

    return {
      rows: filteredRows,
      visibleCount: filteredRows.length,
      changedCount: filteredRows.filter((row) => row.changedFields.length > 0).length,
      unmatchedCount: filteredRows.filter((row) => row.status === 'unmatched').length,
    };
  }, [filters.assignees, filters.names, filters.status, rows]);
}
