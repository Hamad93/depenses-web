import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateExpenseCategoryDto, ExpenseCategory, UpdateExpenseCategoryDto } from '../models';

@Injectable({ providedIn: 'root' })
export class ExpenseCategoriesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/expense-categories`;

  findAll(): Observable<ExpenseCategory[]> {
    return this.http.get<ExpenseCategory[]>(this.baseUrl);
  }

  create(dto: CreateExpenseCategoryDto): Observable<ExpenseCategory> {
    return this.http.post<ExpenseCategory>(this.baseUrl, dto);
  }

  update(id: number, dto: UpdateExpenseCategoryDto): Observable<ExpenseCategory> {
    return this.http.patch<ExpenseCategory>(`${this.baseUrl}/${id}`, dto);
  }

  remove(id: number): Observable<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`${this.baseUrl}/${id}`);
  }
}
