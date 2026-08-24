import { Expense } from './expense.model';
import { Income } from './income.model';
import { WeeklyExpense, WeeklyExpenseGroup } from './weekly-expense.model';

export interface Month {
  id: number;
  label: string;
  year: number;
  monthNumber: number;
  isSimulation: boolean;
  baseMonthId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface MonthDetail extends Month {
  incomes: Income[];
  expenses: Expense[];
  weeklyExpenses: WeeklyExpense[];
}

export interface CreateMonthDto {
  label: string;
  year: number;
  monthNumber: number;
}

export type UpdateMonthDto = Partial<CreateMonthDto>;

export interface BreakdownEntry {
  label: string;
  total: number;
  pourcentage: number;
}

export interface MonthSummary {
  month: Pick<Month, 'id' | 'label' | 'year' | 'monthNumber' | 'isSimulation' | 'baseMonthId'>;
  totalRevenu: number;
  totalDepense: number;
  diff: number;
  pctDepense: number;
  pctDiff: number;
  incomes: (Income & { pourcentage: number })[];
  expenses: (Expense & { pourcentage: number })[];
  parCategorie: BreakdownEntry[];
  parLocalisation: BreakdownEntry[];
  weeklyExpenses: WeeklyExpenseGroup[];
}
