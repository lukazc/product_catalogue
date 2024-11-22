
import { Component } from '@angular/core';
import { CategoryFilterComponent } from '../category-filter/category-filter.component';
import { PriceFilterComponent } from '../price-filter/price-filter.component';
import { SortComponent } from '../sort/sort.component';

@Component({
    selector: 'app-filters',
    templateUrl: './filters.component.html',
    styleUrl: './filters.component.scss',
    imports: [
        CategoryFilterComponent,
        PriceFilterComponent,
        SortComponent
    ]
})
export class FiltersComponent {}