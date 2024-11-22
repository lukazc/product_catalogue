import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap, combineLatest } from 'rxjs';
import { Product, ProductApiResponse } from '../models/product.model';
import { FilterParams } from '../models/filter-params.model';
import { ProductService } from '../services/product.service';
import { Category } from '../models/category.model';

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

    private productCategoriesSubject = new BehaviorSubject<Category[]>([]);
    public productCategories$ = this.productCategoriesSubject.asObservable();

    public categoryName$: Observable<string | undefined> = combineLatest([
        this.productCategories$,
        this.filterParams$
    ]).pipe(
        map(([categories, filterParams]) => categories.find(category => category.slug === filterParams.category)?.name)
    );
    
    constructor(private productService: ProductService) {
        this.loadCategories();
    }

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

    loadCategories(): void {
        this.productService.getCategories().subscribe(categories => {
            this.productCategoriesSubject.next(categories);
        });
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
        this.loadProducts();
    }

    clearFilterParams() {
        this.filterParamsSubject.next({});
    }

    setSearchFilter(searchTerm: string) {
        const currentParams = this.filterParamsSubject.value;
        this.setFilterParams({ ...currentParams, q: searchTerm });
        this.loadProducts();
    }

    setSortFilter(sortBy: keyof Product, order: 'asc' | 'desc') {
        const currentParams = this.filterParamsSubject.value;
        this.setFilterParams({ ...currentParams, sortBy, order });
        this.loadProducts();
    }

    clearSortFilter() {
        const currentParams = this.filterParamsSubject.value;
        delete currentParams.sortBy;
        delete currentParams.order;
        this.setFilterParams(currentParams);
        this.loadProducts();
    }
}
