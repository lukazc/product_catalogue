import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Product, ProductApiResponse } from '../models/product.model';
import { FilterParams } from '../models/filter-params.model';
import { ProductService } from '../services/product.service';

const DEFAULT_FILTER_PARAMS: FilterParams = { limit: 20 };

@Injectable({
    providedIn: 'root'
})
export class ProductStateService {
    private isLoadingSubject = new BehaviorSubject<boolean>(false);
    public isLoading$ = this.isLoadingSubject.asObservable();

    private productsSubject = new BehaviorSubject<Product[]>([]);
    public products$ = this.productsSubject.asObservable();

    private filterParamsSubject = new BehaviorSubject<FilterParams>(DEFAULT_FILTER_PARAMS);
    public filterParams$ = this.filterParamsSubject.asObservable();

    constructor(private productService: ProductService) { }

    loadProducts(): void {
        this.isLoadingSubject.next(true);
        if(Object.keys(this.filterParamsSubject.value)) {
            this.loadFilteredProducts(this.filterParamsSubject.value).subscribe();
        } else {
            this.loadAllProducts().subscribe();
        }
    }

    loadAllProducts(): Observable<ProductApiResponse> {
        return this.productService.getAllProducts().pipe(
            tap(response => this.setProducts(response.products))
        );
    }

    loadFilteredProducts(params: FilterParams): Observable<ProductApiResponse> {
        return this.productService.getFilteredProducts(params).pipe(
            tap(response => this.setProducts(response.products))
        );
    }

    setProducts(products: Product[]) {
        this.productsSubject.next(products);
        this.isLoadingSubject.next(false);
    }

    clearProducts() {
        this.productsSubject.next([]);
    }

    setFilterParams(params: FilterParams) {
        this.filterParamsSubject.next(params);
    }

    clearFilterParams() {
        this.filterParamsSubject.next({});
    }
}
