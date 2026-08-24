export interface Expense {
  id: number;
  monthId: number;
  libelle: string;
  quantite: number;
  type: string;
  montant: number;
  total: number;
  categorie: string | null;
  localisation: string | null;
  description: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseDto {
  libelle: string;
  quantite?: number;
  type: string;
  montant: number;
  categorie?: string;
  localisation?: string;
  description?: string;
  date?: string;
}

export type UpdateExpenseDto = Partial<CreateExpenseDto>;
