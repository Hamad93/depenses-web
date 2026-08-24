import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateExpenseDto, Expense, UpdateExpenseDto } from '../models';

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  findAllForMonth(monthId: number): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.baseUrl}/months/${monthId}/expenses`);
  }

  create(monthId: number, dto: CreateExpenseDto): Observable<Expense> {
    return this.http.post<Expense>(`${this.baseUrl}/months/${monthId}/expenses`, dto);
  }

  update(id: number, dto: UpdateExpenseDto): Observable<Expense> {
    return this.http.patch<Expense>(`${this.baseUrl}/expenses/${id}`, dto);
  }

  remove(id: number): Observable<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`${this.baseUrl}/expenses/${id}`);
  }
}
