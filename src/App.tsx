import { useState } from 'react';
import { CalendarView } from './components/CalendarView';
import { ComparisonTable } from './components/ComparisonTable';
import { EmptyState } from './components/EmptyState';
import { ErrorAlert } from './components/ErrorAlert';
import { FileUploadCard } from './components/FileUploadCard';
import { FiltersPanel } from './components/FiltersPanel';
import { Header } from './components/Header';
import { SummaryBar } from './components/SummaryBar';
import { Tabs, type TabKey } from './components/Tabs';
import { useExcelComparison } from './hooks/useExcelComparison';
import { useFilteredRows, useFilterOptions } from './hooks/useFilteredRows';
import type { ActiveFilters } from './types/comparison';

const initialFilters: ActiveFilters = {
  names: [],
  assignees: [],
  status: 'all',
};

function App() {
  const comparison = useExcelComparison();
  const [filters, setFilters] = useState<ActiveFilters>(initialFilters);
  const [activeTab, setActiveTab] = useState<TabKey>('comparison');
  const { nameOptions, assigneeOptions } = useFilterOptions(comparison.comparedRows);
  const filteredRows = useFilteredRows(comparison.comparedRows, filters);
  const currentColumns = comparison.current.parsedSheet?.columns.visibleColumns ?? [];
  const hasAnyError = Boolean(comparison.previous.error || comparison.current.error);
  const missingText = !comparison.previous.parsedSheet
    ? 'Falta cargar y validar la semana anterior.'
    : 'Falta cargar y validar la semana actual.';

  return (
    <div className="app">
      <Header
        onLoadDemoData={() => {
          comparison.loadDemoData();
          setFilters(initialFilters);
        }}
      />

      <main>
        <section className="upload-grid" aria-label="Carga de archivos Excel">
          <FileUploadCard
            label="Semana anterior"
            helperText="Sube el Excel exportado la semana pasada"
            fileName={comparison.previous.fileName}
            error={comparison.previous.error}
            isReady={Boolean(comparison.previous.parsedSheet)}
            onFileSelected={(file) => void comparison.loadFile('previous', file)}
          />
          <FileUploadCard
            label="Semana actual"
            helperText="Sube el Excel exportado esta semana"
            fileName={comparison.current.fileName}
            error={comparison.current.error}
            isReady={Boolean(comparison.current.parsedSheet)}
            onFileSelected={(file) => void comparison.loadFile('current', file)}
          />
        </section>

        <section className="state-strip" aria-live="polite">
          {comparison.isProcessing && <span className="state-pill">Procesando archivos Excel</span>}
          {!comparison.isProcessing && comparison.isReady && (
            <span className="state-pill success">Archivos preparados para comparar</span>
          )}
          {!comparison.isProcessing && !comparison.isReady && !hasAnyError && (
            <span className="state-pill muted">{missingText}</span>
          )}
        </section>

        {hasAnyError && (
          <div className="error-stack">
            {comparison.previous.error && <ErrorAlert message={comparison.previous.error} />}
            {comparison.current.error && <ErrorAlert message={comparison.current.error} />}
          </div>
        )}

        {comparison.isReady ? (
          <>
            <FiltersPanel
              filters={filters}
              nameOptions={nameOptions}
              assigneeOptions={assigneeOptions}
              onFiltersChange={setFilters}
              onClearFilters={() => setFilters(initialFilters)}
            />

            <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 'comparison' ? (
              <section className="results-panel">
                <SummaryBar
                  visibleCount={filteredRows.visibleCount}
                  changedCount={filteredRows.changedCount}
                  unmatchedCount={filteredRows.unmatchedCount}
                />
                <ComparisonTable rows={filteredRows.rows} columns={currentColumns} />
              </section>
            ) : (
              <CalendarView rows={filteredRows.rows} />
            )}
          </>
        ) : (
          <EmptyState
            title="Carga dos exportaciones de Planner"
            description="Cuando ambos archivos sean válidos, se activarán los filtros, la comparación y el calendario."
          />
        )}
      </main>
    </div>
  );
}

export default App;
