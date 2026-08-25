import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateExpenseLibelleDto, ExpenseLibelle, UpdateExpenseLibelleDto } from '../models';

@Injectable({ providedIn: 'root' })
export class ExpenseLibellesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/expense-libelles`;

  findAll(): Observable<ExpenseLibelle[]> {
    return this.http.get<ExpenseLibelle[]>(this.baseUrl);
  }

  create(dto: CreateExpenseLibelleDto): Observable<ExpenseLibelle> {
    return this.http.post<ExpenseLibelle>(this.baseUrl, dto);
  }

  update(id: number, dto: UpdateExpenseLibelleDto): Observable<ExpenseLibelle> {
    return this.http.patch<ExpenseLibelle>(`${this.baseUrl}/${id}`, dto);
  }

  remove(id: number): Observable<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`${this.baseUrl}/${id}`);
  }
}
