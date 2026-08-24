import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CreateIncomeDto, Income } from '../../../core/models';
import { INCOME_LIBELLE_OPTIONS } from '../../../core/utils/income-options.util';

export interface IncomeFormDialogData {
  income?: Income;
}

@Component({
  selector: 'app-income-form-dialog',
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
  templateUrl: './income-form-dialog.component.html',
  styleUrl: './income-form-dialog.component.scss',
})
export class IncomeFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<IncomeFormDialogComponent>);
  readonly data = inject<IncomeFormDialogData>(MAT_DIALOG_DATA);

  readonly isEdit = !!this.data?.income;

  readonly libelleOptions = (() => {
    const existing = this.data?.income?.libelle;
    return existing && !INCOME_LIBELLE_OPTIONS.includes(existing)
      ? [existing, ...INCOME_LIBELLE_OPTIONS]
      : INCOME_LIBELLE_OPTIONS;
  })();

  readonly form = this.fb.nonNullable.group({
    libelle: [this.data?.income?.libelle ?? '', [Validators.required]],
    quantite: [this.data?.income?.quantite ?? 1, [Validators.required, Validators.min(0.01)]],
    type: [this.data?.income?.type ?? 'fixe', [Validators.required]],
    montant: [this.data?.income?.montant ?? 0, [Validators.required]],
    date: [this.data?.income?.date ? new Date(this.data.income.date) : new Date(), [Validators.required]],
    description: [this.data?.income?.description ?? ''],
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const dto: CreateIncomeDto = {
      ...raw,
      date: raw.date.toISOString(),
      description: raw.description || undefined,
    };
    this.dialogRef.close(dto);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
