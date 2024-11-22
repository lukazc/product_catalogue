import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilterParams } from '../../models/filter-params.model';
import { Product } from '../../models/product.model';
import { ProductStateService } from '../../state/product-state.service';
import { FiltersDialogComponent } from '../filters-dialog/filters-dialog.component';
import { FiltersComponent } from '../filters/filters.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { ProductDetailModalComponent } from '../product-detail-modal/product-detail-modal.component';

@Component({
    selector: 'app-product-catalog',
    imports: [CommonModule, ProductCardComponent, FiltersComponent, PaginationComponent],
    templateUrl: './product-catalog.component.html',
    styleUrls: ['./product-catalog.component.scss']
})
export class ProductCatalogComponent implements OnInit {
    products$: Observable<Product[]>;
    filterParams$: Observable<FilterParams>;
    categoryName$: Observable<string | undefined>;
    isLoading$: Observable<boolean>;
    totalItems$: Observable<number>;
    currentPage$: Observable<number>;
    pageSize$: Observable<number | undefined>;

    constructor(private productStateService: ProductStateService, private dialog: MatDialog) {
        this.products$ = this.productStateService.products$;
        this.filterParams$ = this.productStateService.filterParams$;
        this.categoryName$ = this.productStateService.categoryName$;
        this.isLoading$ = this.productStateService.isLoading$;
        this.totalItems$ = this.productStateService.totalItems$;
        this.currentPage$ = this.productStateService.currentPage$;
        this.pageSize$ = this.productStateService.filterParams$.pipe(map(params => params.limit));
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

    openProductDetailsModal(product: Product): void {
        this.dialog.open(ProductDetailModalComponent, {
            data: { productId: product.id },
            width: '100%',
            height: '80%',
            panelClass: 'product-detail-modal'
        });
    }

    onPageChange(page: number) {
        this.productStateService.setPage(page);
    }

    onPageSizeChange(size: number) {
        this.productStateService.setPageSize(size);
    }
}
