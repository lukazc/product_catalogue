import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild, ElementRef } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { ProductStateService } from '../../state/product-state.service';

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
export class SelectComponent implements OnDestroy {
    @Input() selectedValue: string | null | undefined = '';
    @Input() options: SelectOption[] = [];
    @Input() placeholder: string = 'Select an option';
    @Output() selectionChange = new EventEmitter<string>();
    @ViewChild('selectElement') selectElement!: ElementRef<HTMLSelectElement>;

    private resetFiltersSubscription: Subscription;

    constructor(private productStateService: ProductStateService) {
        this.resetFiltersSubscription = this.productStateService.resetFilters$.subscribe(() => {
            const element = this.selectElement?.nativeElement;
            if (element) {
                element.selectedIndex = 0;
            }
        });
    }

    ngOnDestroy(): void {
        this.resetFiltersSubscription.unsubscribe();
    }

    /**
     * Handles selection change events.
     * @param event - The selection change event.
     */
    onSelectionChange(event: Event): void {
        const selectedValue = (event.target as HTMLSelectElement).value;
        this.selectionChange.emit(selectedValue);
    }
}