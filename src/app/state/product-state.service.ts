import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap, combineLatest } from 'rxjs';
import { Product, ProductApiResponse } from '../models/product.model';
import { FilterParams } from '../models/filter-params.model';
import { ProductService } from '../services/product.service';
import { Category } from '../models/category.model';

const DEFAULT_FILTER_PARAMS: FilterParams = { limit: 20, select: 'id,title,description,price,thumbnail,images,category' };

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

    private resetFiltersSubject = new BehaviorSubject<void>(undefined);
    public resetFilters$ = this.resetFiltersSubject.asObservable();

    private totalItemsSubject = new BehaviorSubject<number>(0);
    public totalItems$ = this.totalItemsSubject.asObservable();

    private currentPageSubject = new BehaviorSubject<number>(1);
    public currentPage$ = this.currentPageSubject.asObservable();

    public categoryName$: Observable<string | undefined> = combineLatest([
        this.productCategories$,
        this.filterParams$
    ]).pipe(
        map(([categories, filterParams]) => categories.find(category => category.slug === filterParams.category)?.name)
    );

    public currentSearchQuery$: Observable<string> = this.filterParams$.pipe(
        map(params => params.q || '')
    );

    public currentSortValue$: Observable<string> = this.filterParams$.pipe(
        map(params => params.sortBy ? `${params.sortBy}_${params.order}` : '')
    );

    public currentPriceRange$: Observable<{ min: number, max: number } | undefined> = this.filterParams$.pipe(
        map(params => params.priceMin && params.priceMax ? { min: params.priceMin, max: params.priceMax } : undefined)
    );

    public currentCategoryValue$: Observable<string | undefined> = this.filterParams$.pipe(
        map(params => params.category)
    );

    public areFiltersActive$: Observable<boolean> = this.filterParams$.pipe(
        map(params => JSON.stringify(params) !== JSON.stringify(DEFAULT_FILTER_PARAMS))
    );

    private isResettingFilters = false;

    private allProducts: ProductApiResponse | undefined;

    constructor(private productService: ProductService) {
        this.loadCategories();
    }

    loadProducts(): void {
        this.isLoadingSubject.next(true);
        const params = { ...this.filterParamsSubject.value, skip: (this.currentPageSubject.value - 1) * (this.filterParamsSubject.value.limit || 20) };
        
        const priceRangeIsSet: boolean = params.priceMin !== undefined && params.priceMax !== undefined;
        const categoryAndSearchAreBothSet: boolean = params.category !== undefined && params.q !== undefined;
        if (priceRangeIsSet || categoryAndSearchAreBothSet) {
            this.loadAllProducts(params).subscribe();
        } else {
            this.loadFilteredProducts(params).subscribe();
        }
    }

    loadAllProducts(params: FilterParams): Observable<ProductApiResponse> {
        if (this.allProducts) {
            const response = this.productService.filterProducts(this.allProducts.products, params);
            this.setProducts(response.products);
            this.totalItemsSubject.next(response.total);
            return new Observable<ProductApiResponse>();
        }

        return this.productService.getAllProducts().pipe(
            tap(response => {
                this.allProducts = response;
                const filteredResponse = this.productService.filterProducts(response.products, params);
                this.setProducts(filteredResponse.products);
                this.totalItemsSubject.next(filteredResponse.total);
            })
        );
    }

    loadFilteredProducts(params: FilterParams): Observable<ProductApiResponse> {
        return this.productService.getFilteredProducts(params).pipe(
            tap(response => {
                this.setProducts(response.products);
                this.totalItemsSubject.next(response.total);
            })
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
        if (this.isResettingFilters) return;
        this.filterParamsSubject.next(Object.assign({}, DEFAULT_FILTER_PARAMS, this.filterParamsSubject.value, params));
        this.currentPageSubject.next(1);
        this.loadProducts();
    }

    clearFilterParams() {
        this.pauseFilters();
        this.filterParamsSubject.next(DEFAULT_FILTER_PARAMS);
        this.resetFiltersSubject.next();
        this.loadProducts();
    }

    setPriceRangeFilter(min: number, max: number) {
        if (this.isResettingFilters) return;
        const currentParams = this.filterParamsSubject.value;
        this.filterParamsSubject.next({ ...currentParams, priceMin: min, priceMax: max, skip: 0 });
        this.currentPageSubject.next(1);
        this.loadProducts();
    }

    pauseFilters() {
        this.isResettingFilters = true;
        setTimeout(() => {
            this.isResettingFilters = false;
        }, 200);
    }

    setSearchFilter(searchTerm: string) {
        if (this.isResettingFilters) return;
        const currentParams = this.filterParamsSubject.value;
        this.filterParamsSubject.next(Object.assign({}, DEFAULT_FILTER_PARAMS, currentParams, { q: searchTerm }));
        this.currentPageSubject.next(1);
        this.loadProducts();
    }

    setSortFilter(sortBy: keyof Product, order: 'asc' | 'desc') {
        if (this.isResettingFilters) return;
        const currentParams = this.filterParamsSubject.value;
        this.setFilterParams({ ...currentParams, sortBy, order });
    }

    clearSortFilter() {
        if (this.isResettingFilters) return;
        const currentParams = this.filterParamsSubject.value;
        delete currentParams.sortBy;
        delete currentParams.order;
        this.setFilterParams(currentParams);
    }

    setPage(page: number) {
        if (this.isResettingFilters) return;
        this.currentPageSubject.next(page);
        this.loadProducts();
    }

    setPageSize(size: number) {
        if (this.isResettingFilters) return;
        if (size === this.filterParamsSubject.value.limit) return;
        const currentParams = this.filterParamsSubject.value;
        this.filterParamsSubject.next({ ...currentParams, limit: size });
        this.currentPageSubject.next(1);
        this.loadProducts();
    }

    getProductById(productId: number): Observable<Product> {
        return this.productService.getProductById(productId);
    }
}
