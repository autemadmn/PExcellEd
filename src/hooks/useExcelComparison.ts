import { useMemo, useState } from 'react';
import type { ComparedRow } from '../types/comparison';
import type { ParsedPlannerSheet, UploadSlot } from '../types/excel';
import { comparePlannerSheets } from '../services/comparisonEngine';
import { readPlannerExcel } from '../services/excelReader';
import { createMockSheets } from '../services/mockData';

interface UploadState {
  fileName: string | null;
  parsedSheet: ParsedPlannerSheet | null;
  error: string | null;
}

interface UseExcelComparisonResult {
  previous: UploadState;
  current: UploadState;
  comparedRows: ComparedRow[];
  isProcessing: boolean;
  isReady: boolean;
  loadFile: (slot: UploadSlot, file: File) => Promise<void>;
  loadDemoData: () => void;
}

const initialUploadState: UploadState = {
  fileName: null,
  parsedSheet: null,
  error: null,
};

function errorMessageFromUnknown(error: unknown): string {
  return error instanceof Error ? error.message : 'No se ha podido procesar el archivo.';
}

export function useExcelComparison(): UseExcelComparisonResult {
  const [previous, setPrevious] = useState<UploadState>(initialUploadState);
  const [current, setCurrent] = useState<UploadState>(initialUploadState);
  const [isProcessing, setIsProcessing] = useState(false);

  const comparedRows = useMemo(() => {
    if (!previous.parsedSheet || !current.parsedSheet) {
      return [];
    }

    return comparePlannerSheets(previous.parsedSheet, current.parsedSheet);
  }, [current.parsedSheet, previous.parsedSheet]);

  const loadFile = async (slot: UploadSlot, file: File): Promise<void> => {
    const setState = slot === 'previous' ? setPrevious : setCurrent;

    setState({
      fileName: file.name,
      parsedSheet: null,
      error: null,
    });

    setIsProcessing(true);
    try {
      const parsedSheet = await readPlannerExcel(file);
      setState({
        fileName: file.name,
        parsedSheet,
        error: null,
      });
    } catch (error) {
      setState({
        fileName: file.name,
        parsedSheet: null,
        error: errorMessageFromUnknown(error),
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const loadDemoData = (): void => {
    const demo = createMockSheets();
    setPrevious({
      fileName: demo.previous.fileName,
      parsedSheet: demo.previous,
      error: null,
    });
    setCurrent({
      fileName: demo.current.fileName,
      parsedSheet: demo.current,
      error: null,
    });
  };

  return {
    previous,
    current,
    comparedRows,
    isProcessing,
    isReady: Boolean(previous.parsedSheet && current.parsedSheet),
    loadFile,
    loadDemoData,
  };
}
