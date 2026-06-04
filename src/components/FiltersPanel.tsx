import type { ActiveFilters, ChangeStatusFilter, FilterOption } from '../types/comparison';
import { MultiSelectFilter } from './MultiSelectFilter';

interface FiltersPanelProps {
  filters: ActiveFilters;
  nameOptions: FilterOption[];
  assigneeOptions: FilterOption[];
  onFiltersChange: (filters: ActiveFilters) => void;
  onClearFilters: () => void;
}

const statusOptions: Array<{ value: ChangeStatusFilter; label: string }> = [
  { value: 'all', label: 'Todas las tareas' },
  { value: 'changed', label: 'Solo tareas con fechas modificadas' },
  { value: 'unchanged', label: 'Solo tareas sin cambios de fecha' },
  { value: 'unmatched', label: 'Sin coincidencia en semana anterior' },
];

export function FiltersPanel({
  filters,
  nameOptions,
  assigneeOptions,
  onFiltersChange,
  onClearFilters,
}: FiltersPanelProps) {
  const hasActiveFilters =
    filters.names.length > 0 || filters.assignees.length > 0 || filters.status !== 'all';

  return (
    <section className="filters-panel" aria-label="Filtros de comparación">
      <MultiSelectFilter
        label="Nombre"
        placeholder="Buscar y seleccionar nombres"
        options={nameOptions}
        value={filters.names}
        onChange={(names) => onFiltersChange({ ...filters, names })}
      />
      <MultiSelectFilter
        label="Asignado a"
        placeholder="Buscar responsables"
        options={assigneeOptions}
        value={filters.assignees}
        onChange={(assignees) => onFiltersChange({ ...filters, assignees })}
      />
      <label className="filter-field">
        <span>Estado de fechas</span>
        <select
          value={filters.status}
          onChange={(event) =>
            onFiltersChange({ ...filters, status: event.currentTarget.value as ChangeStatusFilter })
          }
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <button
        className="secondary-button filters-clear"
        type="button"
        onClick={onClearFilters}
        disabled={!hasActiveFilters}
      >
        Limpiar filtros
      </button>
    </section>
  );
}
