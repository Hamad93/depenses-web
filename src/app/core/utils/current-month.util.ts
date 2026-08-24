import { Month } from '../models';

export interface CurrentMonthInfo {
  year: number;
  monthNumber: number;
  label: string;
}

export const MONTH_LABELS_FR = [
  'Janvier',
  'Fevrier',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Aout',
  'Septembre',
  'Octobre',
  'Novembre',
  'Decembre',
];

export function formatMonthLabel(monthNumber: number, year: number): string {
  return `${MONTH_LABELS_FR[monthNumber - 1]} ${String(year).slice(-2)}`;
}

export function getCurrentMonthInfo(now = new Date()): CurrentMonthInfo {
  const year = now.getFullYear();
  const monthNumber = now.getMonth() + 1;
  return { year, monthNumber, label: formatMonthLabel(monthNumber, year) };
}

export function isCurrentMonth(month: Month, now = new Date()): boolean {
  const info = getCurrentMonthInfo(now);
  return !month.isSimulation && month.year === info.year && month.monthNumber === info.monthNumber;
}

export function sortMonthsDesc(months: Month[]): Month[] {
  return [...months].sort((a, b) => b.year - a.year || b.monthNumber - a.monthNumber);
}
