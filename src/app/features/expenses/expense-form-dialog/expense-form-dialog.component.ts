import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CreateExpenseDto, Expense, ExpenseLibelle } from '../../../core/models';
import { ExpenseLibellesService } from '../../../core/services/expense-libelles.service';
import { EXPENSE_LOCALISATION_OPTIONS } from '../../../core/utils/expense-options.util';

export interface ExpenseFormDialogData {
  expense?: Expense;
}

function withExisting(options: string[], existing: string | null | undefined): string[] {
  return existing && !options.includes(existing) ? [existing, ...options] : options;
}

@Component({
  selector: 'app-expense-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
  templateUrl: './expense-form-dialog.component.html',
  styleUrl: './expense-form-dialog.component.scss',
})
export class ExpenseFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ExpenseFormDialogComponent>);
  private readonly libellesService = inject(ExpenseLibellesService);
  readonly data = inject<ExpenseFormDialogData>(MAT_DIALOG_DATA);

  readonly isEdit = !!this.data?.expense;

  readonly libelles = signal<ExpenseLibelle[]>([]);
  readonly libelleOptions = signal<string[]>(
    withExisting([], this.data?.expense?.libelle),
  );
  readonly localisationOptions = withExisting(EXPENSE_LOCALISATION_OPTIONS, this.data?.expense?.localisation);

  readonly form = this.fb.nonNullable.group({
    libelle: [this.data?.expense?.libelle ?? '', [Validators.required]],
    quantite: [this.data?.expense?.quantite ?? 1, [Validators.required, Validators.min(0.01)]],
    type: [this.data?.expense?.type ?? 'fixe', [Validators.required]],
    montant: [this.data?.expense?.montant ?? 0, [Validators.required]],
    date: [this.data?.expense?.date ? new Date(this.data.expense.date) : new Date(), [Validators.required]],
    categorie: [{ value: this.data?.expense?.categorie ?? '', disabled: true }],
    localisation: [this.data?.expense?.localisation ?? ''],
    description: [this.data?.expense?.description ?? ''],
  });

  constructor() {
    this.libellesService.findAll().subscribe({
      next: (libelles) => {
        this.libelles.set(libelles);
        this.libelleOptions.set(withExisting(libelles.map((l) => l.label), this.data?.expense?.libelle));
      },
    });

    this.form.controls.libelle.valueChanges.subscribe((label) => {
      const matched = this.libelles().find((l) => l.label === label);
      this.form.controls.categorie.setValue(matched?.category.label ?? '');
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const dto: CreateExpenseDto = {
      ...raw,
      date: raw.date.toISOString(),
      categorie: raw.categorie || undefined,
      localisation: raw.localisation || undefined,
      description: raw.description || undefined,
    };
    this.dialogRef.close(dto);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
