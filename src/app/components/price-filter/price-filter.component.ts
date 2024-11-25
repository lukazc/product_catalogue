import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, take } from 'rxjs/operators';
import { ProductStateService } from '../../state/product-state.service';

@Component({
    selector: 'app-price-filter',
    templateUrl: './price-filter.component.html',
    styleUrls: ['./price-filter.component.scss'],
    imports: [MatSliderModule, ReactiveFormsModule]
})
export class PriceFilterComponent implements OnInit, OnDestroy {
    @Input() currentPriceRange$: Observable<{ min: number, max: number } | undefined> = new Observable(); 
    priceForm: FormGroup;
    private resetFiltersSubscription: Subscription;

    constructor(private fb: FormBuilder, private productStateService: ProductStateService) {
        this.priceForm = this.fb.group({
            priceMin: [0],
            priceMax: [40000]
        });

        this.resetFiltersSubscription = this.productStateService.resetFilters$.subscribe(() => {
            this.priceForm.setValue({ priceMin: 0, priceMax: 40000 }, { emitEvent: false });
        });
    }

    /**
     * Initializes the component and sets up subscriptions.
     */
    ngOnInit(): void {
        this.currentPriceRange$.pipe(take(1)).subscribe(range => {
            if (range) {
                this.priceForm.setValue({ priceMin: range.min, priceMax: range.max }, { emitEvent: false });
            }
        });

        this.priceForm.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(values => {
            this.productStateService.setPriceRangeFilter(values.priceMin, values.priceMax);
        });
    }

    /**
     * Cleans up subscriptions when the component is destroyed.
     */
    ngOnDestroy(): void {
        this.resetFiltersSubscription.unsubscribe();
    }

    /**
     * Formats the slider label.
     * @param {number} value - The value to format.
     * @returns {string} The formatted label.
     */
    formatLabel(value: number): string {
        if (value >= 1000) {
            return Math.round(value / 1000) + 'k';
        }

        return `${value}`;
    }
}
