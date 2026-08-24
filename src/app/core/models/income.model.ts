export interface Income {
  id: number;
  monthId: number;
  libelle: string;
  quantite: number;
  type: string;
  montant: number;
  total: number;
  description: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIncomeDto {
  libelle: string;
  quantite?: number;
  type: string;
  montant: number;
  description?: string;
  date?: string;
}

export type UpdateIncomeDto = Partial<CreateIncomeDto>;
