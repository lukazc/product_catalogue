import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductStateService } from '../../state/product-state.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../../models/product.model';
import { Observable } from 'rxjs';
import { FilterParams } from '../../models/filter-params.model';
import { SortComponent } from '../sort/sort.component';

@Component({
    selector: 'app-product-catalog',
    imports: [CommonModule, ProductCardComponent, SortComponent],
    templateUrl: './product-catalog.component.html',
    styleUrls: ['./product-catalog.component.scss']
})
export class ProductCatalogComponent implements OnInit {
    products$: Observable<Product[]>;
    filterParams$: Observable<FilterParams>;
    categoryFilter$: Observable<string | undefined>;
    isLoading$: Observable<boolean>;

    constructor(private productStateService: ProductStateService) {
        this.products$ = this.productStateService.products$;
        this.filterParams$ = this.productStateService.filterParams$;
        this.categoryFilter$ = this.productStateService.categoryFilter$;
        this.isLoading$ = this.productStateService.isLoading$;
    }

    ngOnInit() {
        this.productStateService.loadProducts();
    }

    onFilterChange(filterParams: any): void {
        this.productStateService.loadFilteredProducts(filterParams);
    }
}
