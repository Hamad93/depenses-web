import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Month } from '../../../core/models';
import { MonthsService } from '../../../core/services/months.service';
import { MonthFormDialogComponent } from '../month-form-dialog/month-form-dialog.component';

@Component({
  selector: 'app-months-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './months-list.component.html',
  styleUrl: './months-list.component.scss',
})
export class MonthsListComponent {
  private readonly monthsService = inject(MonthsService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  readonly months = signal<Month[]>([]);
  readonly loading = signal(true);
  readonly includeSimulations = signal(false);

  readonly displayedColumns = ['label', 'periode', 'type', 'actions'];

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.monthsService.findAll(this.includeSimulations()).subscribe({
      next: (months) => {
        this.months.set(months);
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement des mois', 'Fermer', { duration: 4000 });
        this.loading.set(false);
      },
    });
  }

  toggleSimulations(): void {
    this.includeSimulations.set(!this.includeSimulations());
    this.load();
  }

  openMonth(month: Month): void {
    this.router.navigate(['/months', month.id]);
  }

  create(): void {
    const ref = this.dialog.open(MonthFormDialogComponent, { width: '420px' });
    ref.afterClosed().subscribe((dto) => {
      if (!dto) return;
      this.monthsService.create(dto).subscribe({
        next: () => {
          this.snackBar.open('Mois cree', 'Fermer', { duration: 3000 });
          this.load();
        },
        error: (err) => this.snackBar.open(err?.error?.message ?? 'Erreur a la creation', 'Fermer', { duration: 4000 }),
      });
    });
  }

  edit(month: Month, event: Event): void {
    event.stopPropagation();
    const ref = this.dialog.open(MonthFormDialogComponent, { width: '420px', data: { month } });
    ref.afterClosed().subscribe((dto) => {
      if (!dto) return;
      this.monthsService.update(month.id, dto).subscribe({
        next: () => {
          this.snackBar.open('Mois mis a jour', 'Fermer', { duration: 3000 });
          this.load();
        },
        error: (err) => this.snackBar.open(err?.error?.message ?? 'Erreur a la mise a jour', 'Fermer', { duration: 4000 }),
      });
    });
  }

  remove(month: Month, event: Event): void {
    event.stopPropagation();
    if (!confirm(`Supprimer le mois "${month.label}" et toutes ses lignes ?`)) return;
    this.monthsService.remove(month.id).subscribe({
      next: () => {
        this.snackBar.open('Mois supprime', 'Fermer', { duration: 3000 });
        this.load();
      },
      error: (err) => this.snackBar.open(err?.error?.message ?? 'Erreur a la suppression', 'Fermer', { duration: 4000 }),
    });
  }
}
