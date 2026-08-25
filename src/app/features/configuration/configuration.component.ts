import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { forkJoin } from 'rxjs';
import { ExpenseCategory, ExpenseLibelle } from '../../core/models';
import { ExpenseCategoriesService } from '../../core/services/expense-categories.service';
import { ExpenseLibellesService } from '../../core/services/expense-libelles.service';
import { ExpenseCategoryFormDialogComponent } from './expense-category-form-dialog/expense-category-form-dialog.component';
import { ExpenseLibelleFormDialogComponent } from './expense-libelle-form-dialog/expense-libelle-form-dialog.component';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss',
})
export class ConfigurationComponent {
  private readonly categoriesService = inject(ExpenseCategoriesService);
  private readonly libellesService = inject(ExpenseLibellesService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly categories = signal<ExpenseCategory[]>([]);
  readonly libelles = signal<ExpenseLibelle[]>([]);
  readonly loading = signal(true);

  readonly categoryColumns = ['label', 'count', 'actions'];
  readonly libelleColumns = ['label', 'category', 'actions'];

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    forkJoin({
      categories: this.categoriesService.findAll(),
      libelles: this.libellesService.findAll(),
    }).subscribe({
      next: ({ categories, libelles }) => {
        this.categories.set(categories);
        this.libelles.set(libelles);
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement de la configuration', 'Fermer', { duration: 4000 });
        this.loading.set(false);
      },
    });
  }

  // --- Categories ---
  addCategory(): void {
    const ref = this.dialog.open(ExpenseCategoryFormDialogComponent, { width: '420px' });
    ref.afterClosed().subscribe((dto) => {
      if (!dto) return;
      this.categoriesService.create(dto).subscribe({
        next: () => {
          this.snackBar.open('Categorie creee', 'Fermer', { duration: 3000 });
          this.load();
        },
        error: (err) => this.snackBar.open(err?.error?.message ?? 'Erreur', 'Fermer', { duration: 4000 }),
      });
    });
  }

  editCategory(category: ExpenseCategory): void {
    const ref = this.dialog.open(ExpenseCategoryFormDialogComponent, { width: '420px', data: { category } });
    ref.afterClosed().subscribe((dto) => {
      if (!dto) return;
      this.categoriesService.update(category.id, dto).subscribe({
        next: () => {
          this.snackBar.open('Categorie mise a jour', 'Fermer', { duration: 3000 });
          this.load();
        },
        error: (err) => this.snackBar.open(err?.error?.message ?? 'Erreur', 'Fermer', { duration: 4000 }),
      });
    });
  }

  removeCategory(category: ExpenseCategory): void {
    if (!confirm(`Supprimer la categorie "${category.label}" ?`)) return;
    this.categoriesService.remove(category.id).subscribe({
      next: () => {
        this.snackBar.open('Categorie supprimee', 'Fermer', { duration: 3000 });
        this.load();
      },
      error: (err) => this.snackBar.open(err?.error?.message ?? 'Erreur', 'Fermer', { duration: 5000 }),
    });
  }

  // --- Libelles ---
  addLibelle(): void {
    if (this.categories().length === 0) {
      this.snackBar.open('Creez d\'abord une categorie', 'Fermer', { duration: 3000 });
      return;
    }
    const ref = this.dialog.open(ExpenseLibelleFormDialogComponent, {
      width: '420px',
      data: { categories: this.categories() },
    });
    ref.afterClosed().subscribe((dto) => {
      if (!dto) return;
      this.libellesService.create(dto).subscribe({
        next: () => {
          this.snackBar.open('Libelle cree', 'Fermer', { duration: 3000 });
          this.load();
        },
        error: (err) => this.snackBar.open(err?.error?.message ?? 'Erreur', 'Fermer', { duration: 4000 }),
      });
    });
  }

  editLibelle(libelle: ExpenseLibelle): void {
    const ref = this.dialog.open(ExpenseLibelleFormDialogComponent, {
      width: '420px',
      data: { libelle, categories: this.categories() },
    });
    ref.afterClosed().subscribe((dto) => {
      if (!dto) return;
      this.libellesService.update(libelle.id, dto).subscribe({
        next: () => {
          this.snackBar.open('Libelle mis a jour', 'Fermer', { duration: 3000 });
          this.load();
        },
        error: (err) => this.snackBar.open(err?.error?.message ?? 'Erreur', 'Fermer', { duration: 4000 }),
      });
    });
  }

  removeLibelle(libelle: ExpenseLibelle): void {
    if (!confirm(`Supprimer le libelle "${libelle.label}" ?`)) return;
    this.libellesService.remove(libelle.id).subscribe({
      next: () => {
        this.snackBar.open('Libelle supprime', 'Fermer', { duration: 3000 });
        this.load();
      },
      error: (err) => this.snackBar.open(err?.error?.message ?? 'Erreur', 'Fermer', { duration: 4000 }),
    });
  }
}
