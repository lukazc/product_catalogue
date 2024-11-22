import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

export interface SelectOption {
    value: string;
    label: string;
}

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    imports: [CommonModule, MatIcon]
})
export class SelectComponent {
    @Input() options: SelectOption[] = [];
    @Input() placeholder: string = 'Select an option';
    @Output() selectionChange = new EventEmitter<string>();

    onSelectionChange(event: Event): void {
        const selectedValue = (event.target as HTMLSelectElement).value;
        this.selectionChange.emit(selectedValue);
    }
}