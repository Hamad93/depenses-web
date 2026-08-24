import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Month, MonthSummary } from '../../core/models';
import { MonthsService } from '../../core/services/months.service';
import { getCurrentMonthInfo, isCurrentMonth, sortMonthsDesc } from '../../core/utils/current-month.util';
import { MonthFormDialogComponent } from '../months/month-form-dialog/month-form-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DecimalPipe,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private readonly monthsService = inject(MonthsService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  readonly currentMonthInfo = getCurrentMonthInfo();

  readonly months = signal<Month[]>([]);
  readonly loadingMonths = signal(true);
  readonly selectedMonthId = signal<number | null>(null);
  readonly summary = signal<MonthSummary | null>(null);
  readonly loadingSummary = signal(false);

  readonly sortedMonths = computed(() => sortMonthsDesc(this.months()));
  readonly hasCurrentMonthEntry = computed(() => this.months().some((m) => isCurrentMonth(m)));

  readonly tableColumns = ['label', 'periode', 'actions'];

  constructor() {
    this.loadMonths();
  }

  loadMonths(onLoaded?: (months: Month[]) => void): void {
    this.loadingMonths.set(true);
    this.monthsService.findAll(false).subscribe({
      next: (months) => {
        this.months.set(months);
        this.loadingMonths.set(false);
        if (onLoaded) {
          onLoaded(months);
        } else {
          this.selectDefaultMonth(months);
        }
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement des mois', 'Fermer', { duration: 4000 });
        this.loadingMonths.set(false);
      },
    });
  }

  private selectDefaultMonth(months: Month[]): void {
    const current = months.find((m) => isCurrentMonth(m));
    const fallback = sortMonthsDesc(months)[0] ?? null;
    const target = current ?? fallback;
    if (target) {
      this.selectMonth(target.id);
    }
  }

  selectMonth(id: number): void {
    this.selectedMonthId.set(id);
    this.loadingSummary.set(true);
    this.monthsService.getSummary(id).subscribe({
      next: (summary) => {
        this.summary.set(summary);
        this.loadingSummary.set(false);
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement du resume', 'Fermer', { duration: 4000 });
        this.loadingSummary.set(false);
      },
    });
  }

  onSelectChange(id: number): void {
    this.selectMonth(id);
  }

  isCurrent(month: Month): boolean {
    return isCurrentMonth(month);
  }

  openDetail(): void {
    const id = this.selectedMonthId();
    if (id) this.router.navigate(['/months', id]);
  }

  createMonth(prefillCurrent = false): void {
    const ref = this.dialog.open(MonthFormDialogComponent, {
      width: '420px',
      data: prefillCurrent
        ? {
            prefill: {
              label: this.currentMonthInfo.label,
              year: this.currentMonthInfo.year,
              monthNumber: this.currentMonthInfo.monthNumber,
            },
          }
        : undefined,
    });
    ref.afterClosed().subscribe((dto) => {
      if (!dto) return;
      this.monthsService.create(dto).subscribe({
        next: (month) => {
          this.snackBar.open('Mois cree', 'Fermer', { duration: 3000 });
          this.loadMonths(() => this.selectMonth(month.id));
        },
        error: (err) => this.snackBar.open(err?.error?.message ?? 'Erreur a la creation', 'Fermer', { duration: 4000 }),
      });
    });
  }
}
