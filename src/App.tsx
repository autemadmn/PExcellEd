import { useMemo, useState } from 'react';
import { CalendarView } from './components/CalendarView';
import { ComparisonTable } from './components/ComparisonTable';
import { EmptyState } from './components/EmptyState';
import { ErrorAlert } from './components/ErrorAlert';
import { FileUploadCard } from './components/FileUploadCard';
import { FiltersPanel } from './components/FiltersPanel';
import { GridView } from './components/GridView';
import { Header } from './components/Header';
import { PlannerView } from './components/PlannerView';
import { SummaryBar } from './components/SummaryBar';
import { Tabs, type TabKey } from './components/Tabs';
import { useExcelComparison } from './hooks/useExcelComparison';
import { useFilteredRows, useFilterOptions } from './hooks/useFilteredRows';
import { useMasterWorkbook } from './hooks/useMasterWorkbook';
import type { ActiveFilters, ComparedRow } from './types/comparison';
import type { ParsedRow } from './types/excel';

const initialFilters: ActiveFilters = {
  names: [],
  assignees: [],
  status: 'all',
};

function comparedRowsFromCurrentRows(rows: ParsedRow[]): ComparedRow[] {
  return rows.map((row) => ({
    currentRow: row,
    previousRow: null,
    status: 'unmatched',
    changedFields: [],
    changes: [],
    isAmbiguous: false,
    suggestedMatches: [],
  }));
}

function App() {
  const comparison = useExcelComparison();
  const master = useMasterWorkbook();
  const [filters, setFilters] = useState<ActiveFilters>(initialFilters);
  const [activeTab, setActiveTab] = useState<TabKey>('comparison');
  const { nameOptions, assigneeOptions } = useFilterOptions(comparison.comparedRows);
  const filteredRows = useFilteredRows(comparison.comparedRows, filters);
  const currentColumns = comparison.current.parsedSheet?.columns.visibleColumns ?? [];
  const hasAnyError = Boolean(comparison.previous.error || comparison.current.error || master.error);
  const gridRows = useMemo(() => {
    if (comparison.isReady) {
      return comparison.comparedRows;
    }

    return comparison.current.parsedSheet
      ? comparedRowsFromCurrentRows(comparison.current.parsedSheet.rows)
      : [];
  }, [comparison.comparedRows, comparison.current.parsedSheet, comparison.isReady]);
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
            onClearFile={() => comparison.clearFile('previous')}
          />
          <FileUploadCard
            label="Semana actual"
            helperText="Sube el Excel exportado esta semana"
            fileName={comparison.current.fileName}
            error={comparison.current.error}
            isReady={Boolean(comparison.current.parsedSheet)}
            onFileSelected={(file) => void comparison.loadFile('current', file)}
            onClearFile={() => comparison.clearFile('current')}
          />
          <FileUploadCard
            label="Excel maestro"
            helperText="Carga el Excel principal que se actualizará"
            fileName={master.fileName}
            error={master.error}
            isReady={master.isReady}
            onFileSelected={(file) => void master.loadMasterFile(file)}
            onClearFile={master.clearMasterFile}
          />
        </section>

        <section className="state-strip" aria-live="polite">
          {(comparison.isProcessing || master.isProcessing) && (
            <span className="state-pill">Procesando archivos Excel</span>
          )}
          {!comparison.isProcessing && comparison.isReady && (
            <span className="state-pill success">Archivos preparados para comparar</span>
          )}
          {!master.isProcessing && master.isReady && (
            <span className="state-pill success">Excel maestro cargado</span>
          )}
          {!comparison.isProcessing && !comparison.isReady && !hasAnyError && (
            <span className="state-pill muted">{missingText}</span>
          )}
        </section>

        {hasAnyError && (
          <div className="error-stack">
            {comparison.previous.error && <ErrorAlert message={comparison.previous.error} />}
            {comparison.current.error && <ErrorAlert message={comparison.current.error} />}
            {master.error && <ErrorAlert message={master.error} />}
          </div>
        )}

        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'planner' ? (
          <PlannerView rows={comparison.isReady ? comparison.comparedRows : []} />
        ) : activeTab === 'grid' ? (
          <GridView
            rows={gridRows}
            masterWorkbook={master.workbook}
            plannerProjectName={comparison.current.parsedSheet?.projectName ?? ''}
            plannerFileName={comparison.current.fileName}
          />
        ) : comparison.isReady ? (
          <>
            <FiltersPanel
              filters={filters}
              nameOptions={nameOptions}
              assigneeOptions={assigneeOptions}
              onFiltersChange={setFilters}
              onClearFilters={() => setFilters(initialFilters)}
            />

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
            description="Cuando ambos archivos sean válidos, se activarán los filtros, la comparación y el calendario. La vista Planner muestra datos de ejemplo mientras tanto."
          />
        )}
      </main>
    </div>
  );
}

export default App;
