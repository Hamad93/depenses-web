export interface WeeklyExpense {
  id: number;
  monthId: number;
  semaine: string;
  date: string;
  libelle: string;
  montant: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWeeklyExpenseDto {
  semaine: string;
  date: string;
  libelle: string;
  montant: number;
}

export type UpdateWeeklyExpenseDto = Partial<CreateWeeklyExpenseDto>;

export interface WeeklyExpenseGroup {
  semaine: string;
  total: number;
}
