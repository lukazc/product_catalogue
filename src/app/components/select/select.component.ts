import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
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
    @Input() options: SelectOption[] = [];
    @Input() placeholder: string = 'Select an option';
    @Output() selectionChange = new EventEmitter<string>();

    private resetFiltersSubscription: Subscription;

    constructor(private productStateService: ProductStateService) {
        this.resetFiltersSubscription = this.productStateService.resetFilters$.subscribe(() => {
            (document.querySelector('select') as HTMLSelectElement).selectedIndex = 0;
        });
    }

    ngOnDestroy(): void {
        this.resetFiltersSubscription.unsubscribe();
    }

    onSelectionChange(event: Event): void {
        const selectedValue = (event.target as HTMLSelectElement).value;
        this.selectionChange.emit(selectedValue);
    }
}