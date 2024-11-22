import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FilterParams } from '../../models/filter-params.model';
import { Product } from '../../models/product.model';
import { ProductStateService } from '../../state/product-state.service';
import { FiltersDialogComponent } from '../filters-dialog/filters-dialog.component';
import { FiltersComponent } from '../filters/filters.component';
import { ProductCardComponent } from '../product-card/product-card.component';

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

    constructor(private productStateService: ProductStateService, private dialog: MatDialog) {
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
        this.dialog.open(FiltersDialogComponent, {
            width: '100%',
            height: '80%',
            position: { bottom: '0' },
            panelClass: 'filters-dialog'
        });
    }
}
