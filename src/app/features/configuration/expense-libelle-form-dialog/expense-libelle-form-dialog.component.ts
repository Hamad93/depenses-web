import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CreateExpenseLibelleDto, ExpenseCategory, ExpenseLibelle } from '../../../core/models';

export interface ExpenseLibelleFormDialogData {
  libelle?: ExpenseLibelle;
  categories: ExpenseCategory[];
}

@Component({
  selector: 'app-expense-libelle-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './expense-libelle-form-dialog.component.html',
})
export class ExpenseLibelleFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ExpenseLibelleFormDialogComponent>);
  readonly data = inject<ExpenseLibelleFormDialogData>(MAT_DIALOG_DATA);

  readonly isEdit = !!this.data?.libelle;

  readonly form = this.fb.nonNullable.group({
    label: [this.data?.libelle?.label ?? '', [Validators.required, Validators.minLength(1)]],
    categoryId: [this.data?.libelle?.categoryId ?? this.data?.categories[0]?.id ?? 0, [Validators.required]],
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const dto: CreateExpenseLibelleDto = this.form.getRawValue();
    this.dialogRef.close(dto);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
