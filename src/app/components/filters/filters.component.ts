import { Component, OnDestroy } from '@angular/core';
import { PriceFilterComponent } from '../price-filter/price-filter.component';
import { SelectComponent, SelectOption } from '../select/select.component';
import { ProductStateService } from '../../state/product-state.service';
import { map, Observable, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';


type SortValue = 'price_asc' | 'price_desc' | 'title_asc' | 'title_desc';

const SORT_OPTIONS: SelectOption[] = [
    { value: 'price_asc', label: 'Lowest price' },
    { value: 'price_desc', label: 'Highest price' },
    { value: 'title_asc', label: 'A to Z' },
    { value: 'title_desc', label: 'Z to A' }
];

@Component({
    selector: 'app-filters',
    templateUrl: './filters.component.html',
    styleUrl: './filters.component.scss',
    imports: [
        PriceFilterComponent,
        SelectComponent,
        CommonModule,
        MatButton
    ]
})
export class FiltersComponent {
    sortOptions = SORT_OPTIONS;

    categoryOptions: SelectOption[] = [];

    areFiltersActive$: Observable<boolean>;

    get currentSortValue$(): Observable<string> {
        return this.productStateService.currentSortValue$;
    }

    get currentCategoryValue$(): Observable<string | undefined> {
        return this.productStateService.currentCategoryValue$;
    }

    get currentPriceRange$(): Observable<{ min: number, max: number } | undefined> {
        return this.productStateService.currentPriceRange$;
    }

    constructor(private productStateService: ProductStateService) {
        this.areFiltersActive$ = this.productStateService.areFiltersActive$;
        productStateService.productCategories$.pipe(take(2)).subscribe(categories => {
            this.categoryOptions = categories.map(category => ({ value: category.slug, label: category.name }));
        });
    }

    /**
     * Handles the sort change event.
     * @param {string} value - The selected sort value.
     */
    onSortChange(value: string): void {
        const sortBy: SortValue = value as SortValue;
    
        switch (sortBy) {
            case 'price_asc':
                this.productStateService.setSortFilter('price', 'asc');
                break;
            case 'price_desc':
                this.productStateService.setSortFilter('price', 'desc');
                break;
            case 'title_asc':
                this.productStateService.setSortFilter('title', 'asc');
                break;
            case 'title_desc':
                this.productStateService.setSortFilter('title', 'desc');
                break;
            default:
                this.productStateService.clearSortFilter();
                break;
        }
    }

    /**
     * Handles the category change event.
     * @param {string} value - The selected category value.
     */
    onCategoryChange(value: string): void {
        this.productStateService.setFilterParams({ category: value || undefined });
    }

    /**
     * Clears all filters.
     */
    clearFilters(): void {
        this.productStateService.clearFilterParams();
    }
}