import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateIncomeDto, Income, UpdateIncomeDto } from '../models';

@Injectable({ providedIn: 'root' })
export class IncomesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  findAllForMonth(monthId: number): Observable<Income[]> {
    return this.http.get<Income[]>(`${this.baseUrl}/months/${monthId}/incomes`);
  }

  create(monthId: number, dto: CreateIncomeDto): Observable<Income> {
    return this.http.post<Income>(`${this.baseUrl}/months/${monthId}/incomes`, dto);
  }

  update(id: number, dto: UpdateIncomeDto): Observable<Income> {
    return this.http.patch<Income>(`${this.baseUrl}/incomes/${id}`, dto);
  }

  remove(id: number): Observable<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`${this.baseUrl}/incomes/${id}`);
  }
}
