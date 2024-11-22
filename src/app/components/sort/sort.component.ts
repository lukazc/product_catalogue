import { Component } from '@angular/core';
import { ProductStateService } from '../../state/product-state.service';
import { CommonModule } from '@angular/common';

type SortValue = 'price_asc' | 'price_desc' | 'title_asc' | 'title_desc';

const SORT_OPTIONS: { value: SortValue, label: string }[] = [
    { value: 'price_asc', label: 'Lowest price' },
    { value: 'price_desc', label: 'Highest price' },
    { value: 'title_asc', label: 'A to Z' },
    { value: 'title_desc', label: 'Z to A' }
];

@Component({
    selector: 'app-sort',
    imports: [CommonModule],
    templateUrl: './sort.component.html',
    styleUrls: ['./sort.component.scss']
})
export class SortComponent {
    sortOptions = SORT_OPTIONS;
    constructor(private productStateService: ProductStateService) { }

    onSortChange(event: Event): void {
        const sortBy: SortValue = (event.target as HTMLSelectElement).value as SortValue;
    
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
                break;
        }
    }
}
