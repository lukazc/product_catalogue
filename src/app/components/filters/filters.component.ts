
import { Component } from '@angular/core';
import { PriceFilterComponent } from '../price-filter/price-filter.component';
import { SelectComponent, SelectOption } from '../select/select.component';
import { ProductStateService } from '../../state/product-state.service';
import { Category } from '../../models/category.model';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatDivider } from '@angular/material/divider';


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
        MatDivider
    ]
})
export class FiltersComponent {
    sortOptions = SORT_OPTIONS;

    get categoryOptions(): Observable<SelectOption[]> {
        return this.productStateService.productCategories$.pipe(
            map(categories => categories.map(category => ({ value: category.slug, label: category.name })))
        )
    }

    constructor(private productStateService: ProductStateService) {}

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

    onCategoryChange(value: string): void {
        this.productStateService.setFilterParams({ category: value });
    }
}