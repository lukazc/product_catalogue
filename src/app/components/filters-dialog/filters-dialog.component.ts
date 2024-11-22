import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FiltersComponent } from '../filters/filters.component';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-filters-dialog',
    templateUrl: './filters-dialog.component.html',
    styleUrls: ['./filters-dialog.component.scss'],
    imports: [FiltersComponent, MatDialogModule, MatButton]
})
export class FiltersDialogComponent {
    constructor(private dialogRef: MatDialogRef<FiltersDialogComponent>) {}

    closeDialog(): void {
        this.dialogRef.close();
    }
}