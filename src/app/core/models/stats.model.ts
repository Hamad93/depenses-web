import { BreakdownEntry } from './month.model';

export interface MonthCompareEntry {
  id: number;
  label: string;
  isSimulation: boolean;
  totalRevenu: number;
  totalDepense: number;
  diff: number;
  pctDepense: number;
  parCategorie: BreakdownEntry[];
  parLocalisation: BreakdownEntry[];
}

export interface MonthEvolutionEntry {
  de: string;
  vers: string;
  evolutionRevenu: number;
  evolutionDepense: number;
  evolutionDiff: number;
}

export interface CompareResult {
  months: MonthCompareEntry[];
  evolution: MonthEvolutionEntry[];
}
