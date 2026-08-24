import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateMonthDto, Month, MonthDetail, MonthSummary, UpdateMonthDto } from '../models';

@Injectable({ providedIn: 'root' })
export class MonthsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/months`;

  findAll(includeSimulations = false): Observable<Month[]> {
    return this.http.get<Month[]>(this.baseUrl, {
      params: { includeSimulations: String(includeSimulations) },
    });
  }

  findOne(id: number): Observable<MonthDetail> {
    return this.http.get<MonthDetail>(`${this.baseUrl}/${id}`);
  }

  getSummary(id: number): Observable<MonthSummary> {
    return this.http.get<MonthSummary>(`${this.baseUrl}/${id}/summary`);
  }

  create(dto: CreateMonthDto): Observable<Month> {
    return this.http.post<Month>(this.baseUrl, dto);
  }

  update(id: number, dto: UpdateMonthDto): Observable<Month> {
    return this.http.patch<Month>(`${this.baseUrl}/${id}`, dto);
  }

  remove(id: number): Observable<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`${this.baseUrl}/${id}`);
  }
}
