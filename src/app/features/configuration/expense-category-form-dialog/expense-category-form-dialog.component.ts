import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CreateExpenseCategoryDto, ExpenseCategory } from '../../../core/models';

export interface ExpenseCategoryFormDialogData {
  category?: ExpenseCategory;
}

@Component({
  selector: 'app-expense-category-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './expense-category-form-dialog.component.html',
})
export class ExpenseCategoryFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ExpenseCategoryFormDialogComponent>);
  readonly data = inject<ExpenseCategoryFormDialogData>(MAT_DIALOG_DATA);

  readonly isEdit = !!this.data?.category;

  readonly form = this.fb.nonNullable.group({
    label: [this.data?.category?.label ?? '', [Validators.required, Validators.minLength(1)]],
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const dto: CreateExpenseCategoryDto = this.form.getRawValue();
    this.dialogRef.close(dto);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
