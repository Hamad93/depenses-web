export interface ImportedMonthResult {
  monthId: number;
  label: string;
  incomes: number;
  expenses: number;
  weeklyExpenses: number;
}

export interface ImportResult {
  imported: ImportedMonthResult[];
}
