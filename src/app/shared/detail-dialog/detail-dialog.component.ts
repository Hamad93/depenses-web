import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

export interface DetailField {
  label: string;
  value: string;
  muted?: boolean;
}

export interface DetailDialogData {
  title: string;
  subtitle?: string;
  fields: DetailField[];
}

@Component({
  selector: 'app-detail-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './detail-dialog.component.html',
  styleUrl: './detail-dialog.component.scss',
})
export class DetailDialogComponent {
  readonly data = inject<DetailDialogData>(MAT_DIALOG_DATA);
}
