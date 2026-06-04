import type { ParsedRow } from '../types/excel';
import { makeMatchKey, normalizeText } from './normalizeText';

export function getRowMatchKey(row: ParsedRow): string {
  if (!row.normalizedTaskName) {
    return '';
  }

  return makeMatchKey(row.taskName, row.assignee);
}

export function groupRowsByMatchKey(rows: ParsedRow[]): Map<string, ParsedRow[]> {
  const groups = new Map<string, ParsedRow[]>();

  for (const row of rows) {
    const key = getRowMatchKey(row);
    if (!key) {
      continue;
    }

    const group = groups.get(key) ?? [];
    group.push(row);
    groups.set(key, group);
  }

  return groups;
}

function levenshteinDistance(left: string, right: string): number {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  const current = Array.from({ length: right.length + 1 }, () => 0);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    current[0] = leftIndex;

    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitutionCost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + substitutionCost,
      );
    }

    previous.splice(0, previous.length, ...current);
  }

  return previous[right.length];
}

function similarity(left: string, right: string): number {
  if (!left || !right) {
    return 0;
  }

  const maxLength = Math.max(left.length, right.length);
  if (maxLength === 0) {
    return 1;
  }

  return 1 - levenshteinDistance(left, right) / maxLength;
}

export function findSuggestedMatches(row: ParsedRow, previousRows: ParsedRow[]): ParsedRow[] {
  if (!row.normalizedAssignee || !row.normalizedTaskName) {
    return [];
  }

  return previousRows
    .filter((candidate) => candidate.normalizedAssignee === row.normalizedAssignee)
    .map((candidate) => ({
      row: candidate,
      score: similarity(normalizeText(row.taskName), normalizeText(candidate.taskName)),
    }))
    .filter(({ score }) => score >= 0.72 && score < 1)
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map(({ row: candidate }) => candidate);
}
