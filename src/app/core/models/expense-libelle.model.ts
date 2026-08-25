import { ExpenseCategory } from './expense-category.model';

export interface ExpenseLibelle {
  id: number;
  label: string;
  categoryId: number;
  category: ExpenseCategory;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseLibelleDto {
  label: string;
  categoryId: number;
}

export type UpdateExpenseLibelleDto = Partial<CreateExpenseLibelleDto>;
