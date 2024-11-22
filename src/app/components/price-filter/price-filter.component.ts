import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductStateService } from '../../state/product-state.service';

@Component({
    selector: 'app-price-filter',
    templateUrl: './price-filter.component.html',
    styleUrls: ['./price-filter.component.scss'],
    imports: [MatSliderModule, ReactiveFormsModule]
})
export class PriceFilterComponent implements OnInit, OnDestroy {
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

    ngOnInit(): void {
        this.priceForm.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(values => {
            this.productStateService.setFilterParams({
                priceMin: values.priceMin,
                priceMax: values.priceMax
            });
        });
    }

    ngOnDestroy(): void {
        this.resetFiltersSubscription.unsubscribe();
    }

    formatLabel(value: number): string {
        if (value >= 1000) {
            return Math.round(value / 1000) + 'k';
        }

        return `${value}`;
    }
}
