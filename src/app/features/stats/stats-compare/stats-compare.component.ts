import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { CompareResult, Month } from '../../../core/models';
import { MonthsService } from '../../../core/services/months.service';
import { StatsService } from '../../../core/services/stats.service';

@Component({
  selector: 'app-stats-compare',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './stats-compare.component.html',
  styleUrl: './stats-compare.component.scss',
})
export class StatsCompareComponent {
  private readonly monthsService = inject(MonthsService);
  private readonly statsService = inject(StatsService);
  private readonly snackBar = inject(MatSnackBar);

  readonly months = signal<Month[]>([]);
  readonly selectedIds = signal<number[]>([]);
  readonly result = signal<CompareResult | null>(null);
  readonly loading = signal(false);

  readonly monthColumns = ['label', 'totalRevenu', 'totalDepense', 'diff', 'pctDepense'];
  readonly evolutionColumns = ['periode', 'evolutionRevenu', 'evolutionDepense', 'evolutionDiff'];

  constructor() {
    this.monthsService.findAll(true).subscribe({
      next: (months) => this.months.set(months),
      error: () => this.snackBar.open('Erreur lors du chargement des mois', 'Fermer', { duration: 4000 }),
    });
  }

  compare(): void {
    const ids = this.selectedIds();
    if (ids.length === 0) {
      this.snackBar.open('Selectionnez au moins un mois', 'Fermer', { duration: 3000 });
      return;
    }
    this.loading.set(true);
    this.statsService.compare(ids).subscribe({
      next: (result) => {
        this.result.set(result);
        this.loading.set(false);
      },
      error: (err) => {
        this.snackBar.open(err?.error?.message ?? 'Erreur lors de la comparaison', 'Fermer', { duration: 4000 });
        this.loading.set(false);
      },
    });
  }
}
