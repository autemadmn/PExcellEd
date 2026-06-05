import type { ExcelColumnInfo, ParsedPlannerSheet, ParsedRow } from '../types/excel';
import { normalizeText } from '../utils/normalizeText';

const columns: ExcelColumnInfo[] = [
  { index: 3, letter: 'C', header: 'Nombre', normalizedHeader: 'nombre', role: 'name' },
  { index: 4, letter: 'D', header: 'Asignado a', normalizedHeader: 'asignado a', role: 'assignee' },
  { index: 5, letter: 'E', header: 'Inicio', normalizedHeader: 'inicio', role: 'startDate' },
  { index: 6, letter: 'F', header: 'Finalización', normalizedHeader: 'finalizacion', role: 'endDate' },
  { index: 7, letter: 'G', header: 'Duración', normalizedHeader: 'duracion', role: 'other' },
  { index: 8, letter: 'H', header: 'Depende de', normalizedHeader: 'depende de', role: 'other' },
  {
    index: 9,
    letter: 'I',
    header: 'Dependientes (después)',
    normalizedHeader: 'dependientes (despues)',
    role: 'other',
  },
  { index: 10, letter: 'J', header: '% completado', normalizedHeader: '% completado', role: 'other' },
];

const headers = {
  headerRowNumber: 9,
  nameColumnIndex: 3,
  assigneeColumnIndex: 4,
  startDateColumnIndex: 5,
  endDateColumnIndex: 6,
  visibleColumns: columns,
};

interface MockRowInput {
  rowNumber: number;
  name: string;
  assignee?: string;
  startDate?: string | null;
  endDate?: string | null;
  duration?: string;
  dependsOn?: string;
  dependents?: string;
  completed?: string;
  isBold?: boolean;
  indentationLevel?: number;
}

function formatDate(value: string | null | undefined): string {
  if (!value) {
    return '';
  }

  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

function makeRow(input: MockRowInput): ParsedRow {
  const displayValues: Record<number, string> = {
    3: input.name,
    4: input.assignee ?? '',
    5: formatDate(input.startDate),
    6: formatDate(input.endDate),
    7: input.duration ?? '',
    8: input.dependsOn ?? '',
    9: input.dependents ?? '',
    10: input.completed ?? '',
  };

  const originalValues: Record<number, unknown> = {
    3: input.name,
    4: input.assignee ?? '',
    5: input.startDate ?? null,
    6: input.endDate ?? null,
    7: input.duration ?? '',
    8: input.dependsOn ?? '',
    9: input.dependents ?? '',
    10: input.completed ?? '',
  };

  return {
    excelRowNumber: input.rowNumber,
    originalValues,
    displayValues,
    cells: columns.map((column) => ({
      columnIndex: column.index,
      header: column.header,
      value: originalValues[column.index],
      displayValue: displayValues[column.index],
    })),
    taskName: input.name,
    normalizedTaskName: normalizeText(input.name),
    assignee: input.assignee ?? '',
    normalizedAssignee: normalizeText(input.assignee ?? ''),
    startDate: input.startDate ?? null,
    endDate: input.endDate ?? null,
    isBold: Boolean(input.isBold),
    indentationLevel: input.indentationLevel ?? 0,
  };
}

const previousRows = [
  makeRow({ rowNumber: 10, name: 'Proyecto Alpha', isBold: true, completed: '42%' }),
  makeRow({ rowNumber: 11, name: 'Etapa 1 - Descubrimiento', isBold: true, indentationLevel: 1, completed: '65%' }),
  makeRow({
    rowNumber: 12,
    name: 'Entrevista kickoff',
    assignee: 'Ana López',
    startDate: '2025-04-02',
    endDate: '2025-04-04',
    duration: '3 días',
    completed: '100%',
    indentationLevel: 2,
  }),
  makeRow({
    rowNumber: 13,
    name: 'Entrevista usuarios',
    assignee: 'Ana López',
    startDate: '2025-04-08',
    endDate: '2025-04-11',
    duration: '4 días',
    dependsOn: '12',
    completed: '80%',
    indentationLevel: 2,
  }),
  makeRow({ rowNumber: 14, name: 'Etapa 2 - Diseño', isBold: true, indentationLevel: 1, completed: '20%' }),
  makeRow({
    rowNumber: 15,
    name: 'Wireframes iniciales',
    assignee: 'Bruno Martín',
    startDate: '2025-04-07',
    endDate: '2025-04-18',
    duration: '10 días',
    completed: '35%',
    indentationLevel: 2,
  }),
  makeRow({
    rowNumber: 16,
    name: 'Validación interna',
    assignee: 'Ana López',
    startDate: '2025-04-21',
    endDate: '2025-04-22',
    duration: '2 días',
    completed: '0%',
    indentationLevel: 2,
  }),
  makeRow({
    rowNumber: 17,
    name: 'Validación interna',
    assignee: 'Ana López',
    startDate: '2025-04-24',
    endDate: '2025-04-25',
    duration: '2 días',
    completed: '0%',
    indentationLevel: 2,
  }),
  makeRow({ rowNumber: 18, name: 'Cliente Beta', isBold: true, completed: '15%' }),
];

const currentRows = [
  makeRow({ rowNumber: 10, name: 'Proyecto Alpha', isBold: true, completed: '45%' }),
  makeRow({ rowNumber: 11, name: 'Etapa 1 - Descubrimiento', isBold: true, indentationLevel: 1, completed: '70%' }),
  makeRow({
    rowNumber: 12,
    name: 'Entrevista kickoff',
    assignee: 'Ana López',
    startDate: '2025-04-02',
    endDate: '2025-04-05',
    duration: '4 días',
    completed: '100%',
    indentationLevel: 2,
  }),
  makeRow({
    rowNumber: 13,
    name: 'Entrevista usuarios',
    assignee: 'Ana López',
    startDate: '2025-04-08',
    endDate: '2025-04-11',
    duration: '4 días',
    dependsOn: '12',
    completed: '90%',
    indentationLevel: 2,
  }),
  makeRow({ rowNumber: 14, name: 'Etapa 2 - Diseño', isBold: true, indentationLevel: 1, completed: '30%' }),
  makeRow({
    rowNumber: 15,
    name: 'Wireframes iniciales',
    assignee: 'Bruno Martín',
    startDate: '2025-04-10',
    endDate: '2025-04-18',
    duration: '7 días',
    completed: '55%',
    indentationLevel: 2,
  }),
  makeRow({
    rowNumber: 16,
    name: 'Revisión cliente Norte',
    assignee: 'Carla Ruiz',
    startDate: '2025-04-23',
    endDate: '2025-04-24',
    duration: '2 días',
    completed: '0%',
    indentationLevel: 2,
  }),
  makeRow({
    rowNumber: 17,
    name: 'Validación interna',
    assignee: 'Ana López',
    startDate: '2025-04-21',
    endDate: '2025-04-22',
    duration: '2 días',
    completed: '10%',
    indentationLevel: 2,
  }),
  makeRow({
    rowNumber: 18,
    name: 'Validación interna',
    assignee: 'Ana López',
    startDate: '2025-04-24',
    endDate: '2025-04-29',
    duration: '4 días',
    completed: '0%',
    indentationLevel: 2,
  }),
  makeRow({ rowNumber: 19, name: 'Cliente Beta', isBold: true, completed: '20%' }),
];

export function createMockSheets(): { previous: ParsedPlannerSheet; current: ParsedPlannerSheet } {
  return {
    previous: {
      fileName: 'planner-semana-anterior-demo.xlsx',
      sheetName: 'Planificación',
      projectName: 'Proyecto Alpha',
      columns: headers,
      rows: previousRows,
    },
    current: {
      fileName: 'planner-semana-actual-demo.xlsx',
      sheetName: 'Planificación',
      projectName: 'Proyecto Alpha',
      columns: headers,
      rows: currentRows,
    },
  };
}
