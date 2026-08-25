export interface ExpenseCategory {
  id: number;
  label: string;
  createdAt: string;
  updatedAt: string;
  _count?: { libelles: number };
}

export interface CreateExpenseCategoryDto {
  label: string;
}

export type UpdateExpenseCategoryDto = Partial<CreateExpenseCategoryDto>;
