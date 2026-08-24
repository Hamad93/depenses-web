import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImportResult } from '../../../core/models';
import { ImportService } from '../../../core/services/import.service';

@Component({
  selector: 'app-import-page',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './import-page.component.html',
  styleUrl: './import-page.component.scss',
})
export class ImportPageComponent {
  private readonly importService = inject(ImportService);
  private readonly snackBar = inject(MatSnackBar);

  readonly selectedFile = signal<File | null>(null);
  readonly uploading = signal(false);
  readonly result = signal<ImportResult | null>(null);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedFile.set(file);
    this.result.set(null);
  }

  upload(): void {
    const file = this.selectedFile();
    if (!file) return;
    this.uploading.set(true);
    this.importService.importFile(file).subscribe({
      next: (result) => {
        this.result.set(result);
        this.uploading.set(false);
        this.snackBar.open('Import termine', 'Fermer', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open(err?.error?.message ?? "Erreur lors de l'import", 'Fermer', { duration: 4000 });
        this.uploading.set(false);
      },
    });
  }
}
