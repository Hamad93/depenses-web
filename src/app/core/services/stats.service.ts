import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CompareResult } from '../models';

@Injectable({ providedIn: 'root' })
export class StatsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/stats`;

  compare(monthIds: number[]): Observable<CompareResult> {
    return this.http.get<CompareResult>(`${this.baseUrl}/compare`, {
      params: { months: monthIds.join(',') },
    });
  }
}
