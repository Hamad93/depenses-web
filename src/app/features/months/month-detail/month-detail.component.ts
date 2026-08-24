import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { forkJoin } from 'rxjs';
import { Expense, Income, MonthDetail, MonthSummary } from '../../../core/models';
import { ExpensesService } from '../../../core/services/expenses.service';
import { IncomesService } from '../../../core/services/incomes.service';
import { MonthsService } from '../../../core/services/months.service';
import { DetailDialogComponent, DetailField } from '../../../shared/detail-dialog/detail-dialog.component';
import { ExpenseFormDialogComponent } from '../../expenses/expense-form-dialog/expense-form-dialog.component';
import { IncomeFormDialogComponent } from '../../incomes/income-form-dialog/income-form-dialog.component';

const datePipe = new DatePipe('fr-FR');

function formatDate(value: string): string {
  return datePipe.transform(value, 'dd/MM/yyyy') ?? value;
}

function formatDateTime(value: string): string {
  return datePipe.transform(value, 'dd/MM/yyyy HH:mm') ?? value;
}

@Component({
  selector: 'app-month-detail',
  standalone: true,
  imports: [
    DecimalPipe,
    MatCardModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './month-detail.component.html',
  styleUrl: './month-detail.component.scss',
})
export class MonthDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly monthsService = inject(MonthsService);
  private readonly incomesService = inject(IncomesService);
  private readonly expensesService = inject(ExpensesService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly monthId = Number(this.route.snapshot.paramMap.get('id'));

  readonly month = signal<MonthDetail | null>(null);
  readonly summary = signal<MonthSummary | null>(null);
  readonly loading = signal(true);

  readonly incomeColumns = ['libelle', 'quantite', 'type', 'montant', 'total', 'actions'];
  readonly expenseColumns = ['libelle', 'quantite', 'type', 'montant', 'total', 'categorie', 'localisation', 'actions'];

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    forkJoin({
      month: this.monthsService.findOne(this.monthId),
      summary: this.monthsService.getSummary(this.monthId),
    }).subscribe({
      next: ({ month, summary }) => {
        this.month.set(month);
        this.summary.set(summary);
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement du mois', 'Fermer', { duration: 4000 });
        this.loading.set(false);
      },
    });
  }

  back(): void {
    this.router.navigate(['/months']);
  }

  // --- Incomes ---
  addIncome(): void {
    const ref = this.dialog.open(IncomeFormDialogComponent, { width: '560px' });
    ref.afterClosed().subscribe((dto) => {
      if (!dto) return;
      this.incomesService.create(this.monthId, dto).subscribe({
        next: () => {
          this.snackBar.open('Revenu ajoute', 'Fermer', { duration: 3000 });
          this.load();
        },
        error: (err) => this.snackBar.open(err?.error?.message ?? 'Erreur', 'Fermer', { duration: 4000 }),
      });
    });
  }

  editIncome(income: Income): void {
    const ref = this.dialog.open(IncomeFormDialogComponent, { width: '560px', data: { income } });
    ref.afterClosed().subscribe((dto) => {
      if (!dto) return;
      this.incomesService.update(income.id, dto).subscribe({
        next: () => {
          this.snackBar.open('Revenu mis a jour', 'Fermer', { duration: 3000 });
          this.load();
        },
        error: (err) => this.snackBar.open(err?.error?.message ?? 'Erreur', 'Fermer', { duration: 4000 }),
      });
    });
  }

  removeIncome(income: Income): void {
    if (!confirm(`Supprimer le revenu "${income.libelle}" ?`)) return;
    this.incomesService.remove(income.id).subscribe({
      next: () => {
        this.snackBar.open('Revenu supprime', 'Fermer', { duration: 3000 });
        this.load();
      },
      error: (err) => this.snackBar.open(err?.error?.message ?? 'Erreur', 'Fermer', { duration: 4000 }),
    });
  }

  viewIncomeDetails(income: Income): void {
    const fields: DetailField[] = [
      { label: 'Libelle', value: income.libelle },
      { label: 'Description', value: income.description || 'Aucune description', muted: !income.description },
      { label: 'Quantite', value: String(income.quantite) },
      { label: 'Type', value: income.type },
      { label: 'Montant unitaire', value: `${income.montant.toFixed(2)}` },
      { label: 'Total', value: `${income.total.toFixed(2)}` },
      { label: 'Date', value: formatDate(income.date) },
      { label: 'Cree le', value: formatDateTime(income.createdAt), muted: true },
    ];
    this.dialog.open(DetailDialogComponent, {
      width: '440px',
      data: { title: income.libelle, subtitle: 'Details du revenu', fields },
    });
  }

  // --- Expenses ---
  addExpense(): void {
    const ref = this.dialog.open(ExpenseFormDialogComponent, { width: '560px' });
    ref.afterClosed().subscribe((dto) => {
      if (!dto) return;
      this.expensesService.create(this.monthId, dto).subscribe({
        next: () => {
          this.snackBar.open('Depense ajoutee', 'Fermer', { duration: 3000 });
          this.load();
        },
        error: (err) => this.snackBar.open(err?.error?.message ?? 'Erreur', 'Fermer', { duration: 4000 }),
      });
    });
  }

  editExpense(expense: Expense): void {
    const ref = this.dialog.open(ExpenseFormDialogComponent, { width: '560px', data: { expense } });
    ref.afterClosed().subscribe((dto) => {
      if (!dto) return;
      this.expensesService.update(expense.id, dto).subscribe({
        next: () => {
          this.snackBar.open('Depense mise a jour', 'Fermer', { duration: 3000 });
          this.load();
        },
        error: (err) => this.snackBar.open(err?.error?.message ?? 'Erreur', 'Fermer', { duration: 4000 }),
      });
    });
  }

  removeExpense(expense: Expense): void {
    if (!confirm(`Supprimer la depense "${expense.libelle}" ?`)) return;
    this.expensesService.remove(expense.id).subscribe({
      next: () => {
        this.snackBar.open('Depense supprimee', 'Fermer', { duration: 3000 });
        this.load();
      },
      error: (err) => this.snackBar.open(err?.error?.message ?? 'Erreur', 'Fermer', { duration: 4000 }),
    });
  }

  viewExpenseDetails(expense: Expense): void {
    const fields: DetailField[] = [
      { label: 'Libelle', value: expense.libelle },
      { label: 'Description', value: expense.description || 'Aucune description', muted: !expense.description },
      { label: 'Quantite', value: String(expense.quantite) },
      { label: 'Type', value: expense.type },
      { label: 'Montant unitaire', value: `${expense.montant.toFixed(2)}` },
      { label: 'Total', value: `${expense.total.toFixed(2)}` },
      { label: 'Categorie', value: expense.categorie || 'Non renseignee', muted: !expense.categorie },
      { label: 'Localisation', value: expense.localisation || 'Non renseignee', muted: !expense.localisation },
      { label: 'Date', value: formatDate(expense.date) },
      { label: 'Cree le', value: formatDateTime(expense.createdAt), muted: true },
    ];
    this.dialog.open(DetailDialogComponent, {
      width: '440px',
      data: { title: expense.libelle, subtitle: 'Details de la depense', fields },
    });
  }
}
