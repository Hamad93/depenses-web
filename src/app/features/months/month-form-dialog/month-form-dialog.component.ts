import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CreateMonthDto, Month } from '../../../core/models';
import { formatMonthLabel, MONTH_LABELS_FR } from '../../../core/utils/current-month.util';

export interface MonthFormDialogData {
  month?: Month;
  prefill?: CreateMonthDto;
}

@Component({
  selector: 'app-month-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './month-form-dialog.component.html',
})
export class MonthFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<MonthFormDialogComponent>);
  readonly data = inject<MonthFormDialogData>(MAT_DIALOG_DATA);

  readonly isEdit = !!this.data?.month;

  readonly monthOptions = MONTH_LABELS_FR.map((name, idx) => ({ value: idx + 1, name }));

  readonly form = this.fb.nonNullable.group({
    year: [this.data?.month?.year ?? this.data?.prefill?.year ?? new Date().getFullYear(), [Validators.required]],
    monthNumber: [
      this.data?.month?.monthNumber ?? this.data?.prefill?.monthNumber ?? new Date().getMonth() + 1,
      [Validators.required, Validators.min(1), Validators.max(12)],
    ],
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { year, monthNumber } = this.form.getRawValue();
    const dto: CreateMonthDto = { label: formatMonthLabel(monthNumber, year), year, monthNumber };
    this.dialogRef.close(dto);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
