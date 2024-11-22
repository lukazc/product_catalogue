import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductStateService } from '../../state/product-state.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../../models/product.model';
import { map, Observable, tap } from 'rxjs';
import { FilterParams } from '../../models/filter-params.model';
import { FiltersComponent } from '../filters/filters.component';

@Component({
    selector: 'app-product-catalog',
    imports: [CommonModule, ProductCardComponent, FiltersComponent],
    templateUrl: './product-catalog.component.html',
    styleUrls: ['./product-catalog.component.scss']
})
export class ProductCatalogComponent implements OnInit {
    products$: Observable<Product[]>;
    filterParams$: Observable<FilterParams>;
    categoryName$: Observable<string | undefined>;
    isLoading$: Observable<boolean>;

    constructor(private productStateService: ProductStateService) {
        this.products$ = this.productStateService.products$;
        this.filterParams$ = this.productStateService.filterParams$;
        this.categoryName$ = this.productStateService.categoryName$;
        this.isLoading$ = this.productStateService.isLoading$;
    }

    ngOnInit() {
        this.productStateService.loadProducts();
    }

    onFilterChange(filterParams: any): void {
        this.productStateService.loadFilteredProducts(filterParams);
    }

    openFiltersDialog(): void {
     
    }
}
