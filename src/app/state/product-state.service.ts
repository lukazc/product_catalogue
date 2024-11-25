import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap, combineLatest } from 'rxjs';
import { Product, ProductApiResponse } from '../models/product.model';
import { FilterParams } from '../models/filter-params.model';
import { ProductService } from '../services/product.service';
import { Category } from '../models/category.model';
import { Router } from '@angular/router';

/**
 * The default filter parameters.
 */
const DEFAULT_FILTER_PARAMS: FilterParams = { limit: 20, select: 'id,title,description,price,thumbnail,images,category' };

@Injectable({
    providedIn: 'root'
})
export class ProductStateService {
    // Indicates if products are being loaded
    private isLoadingSubject = new BehaviorSubject<boolean>(false);
    public isLoading$ = this.isLoadingSubject.asObservable();

    // Holds the list of products
    private productsSubject = new BehaviorSubject<Product[]>([]);
    public products$ = this.productsSubject.asObservable();

    // Holds the current filter parameters
    private filterParamsSubject = new BehaviorSubject<FilterParams>(DEFAULT_FILTER_PARAMS);
    public filterParams$ = this.filterParamsSubject.asObservable();

    // Holds the list of product categories
    private productCategoriesSubject = new BehaviorSubject<Category[]>([]);
    public productCategories$ = this.productCategoriesSubject.asObservable();

    // Triggers when filters are reset
    private resetFiltersSubject = new BehaviorSubject<void>(undefined);
    public resetFilters$ = this.resetFiltersSubject.asObservable();

    // Holds the total number of items
    private totalItemsSubject = new BehaviorSubject<number>(0);
    public totalItems$ = this.totalItemsSubject.asObservable();

    // Holds the current page number
    private currentPageSubject = new BehaviorSubject<number>(1);
    public currentPage$ = this.currentPageSubject.asObservable();

    // Observable for the current category name
    public categoryName$: Observable<string | undefined> = combineLatest([
        this.productCategories$,
        this.filterParams$
    ]).pipe(
        map(([categories, filterParams]) => categories.find(category => category.slug === filterParams.category)?.name)
    );

    // Observable for the current search query
    public currentSearchQuery$: Observable<string> = this.filterParams$.pipe(
        map(params => params.q || '')
    );

    // Observable for the current sort value
    public currentSortValue$: Observable<string> = this.filterParams$.pipe(
        map(params => params.sortBy ? `${params.sortBy}_${params.order}` : '')
    );

    // Observable for the current price range
    public currentPriceRange$: Observable<{ min: number, max: number } | undefined> = this.filterParams$.pipe(
        map(params => params.priceMin && params.priceMax ? { min: params.priceMin, max: params.priceMax } : undefined)
    );

    // Observable for the current category value
    public currentCategoryValue$: Observable<string | undefined> = this.filterParams$.pipe(
        map(params => params.category)
    );

    // Observable to check if filters are active
    public areFiltersActive$: Observable<boolean> = this.filterParams$.pipe(
        map(params => JSON.stringify(params) !== JSON.stringify(DEFAULT_FILTER_PARAMS))
    );

    // Flag to indicate if filters are being reset
    private isResettingFilters = false;

    // Holds all products data
    private allProducts: ProductApiResponse | undefined;

    constructor(private productService: ProductService, private router: Router) {
        this.loadCategories();
    }

    /**
     * Loads products based on the current filter parameters.
     */
    loadProducts(): void {
        this.isLoadingSubject.next(true);
        const params = this.getUpdatedParams();

        if (this.shouldLoadAllProducts(params)) {
            this.loadAllProducts(params).subscribe();
        } else {
            this.loadFilteredProducts(params).subscribe();
        }
    }

    /**
     * Loads all products and filters them based on the provided parameters.
     * @param params - The filter parameters.
     * @returns An observable of the filtered products.
     */
    loadAllProducts(params: FilterParams): Observable<ProductApiResponse> {
        if (this.allProducts) {
            this.applyFiltersAndSetProducts(this.allProducts.products, params);
            return new Observable<ProductApiResponse>();
        }

        return this.productService.getAllProducts().pipe(
            tap(response => {
                this.allProducts = response;
                this.applyFiltersAndSetProducts(response.products, params);
            })
        );
    }

    /**
     * Loads filtered products based on the provided parameters.
     * @param params - The filter parameters.
     * @returns An observable of the filtered products.
     */
    loadFilteredProducts(params: FilterParams): Observable<ProductApiResponse> {
        return this.productService.getFilteredProducts(params).pipe(
            tap(response => {
                this.setProducts(response.products);
                this.totalItemsSubject.next(response.total);
            })
        );
    }

    /**
     * Loads the product categories.
     */
    loadCategories(): void {
        this.productService.getCategories().subscribe(categories => {
            this.productCategoriesSubject.next(categories);
        });
    }

    /**
     * Sets the list of products.
     * @param products - The list of products.
     */
    setProducts(products: Product[]) {
        this.productsSubject.next(products);
        this.isLoadingSubject.next(false);
    }

    /**
     * Clears the list of products.
     */
    clearProducts() {
        this.productsSubject.next([]);
    }

    /**
     * Sets the filter parameters and loads products.
     * @param params - The filter parameters.
     */
    setFilterParams(params: FilterParams) {
        if (this.isResettingFilters) return;
        this.filterParamsSubject.next(Object.assign({}, DEFAULT_FILTER_PARAMS, this.filterParamsSubject.value, params));
        this.currentPageSubject.next(1);
        this.loadProducts();
    }

    /**
     * Clears the filter parameters and loads products.
     */
    clearFilterParams() {
        this.pauseFilters();
        this.resetFiltersSubject.next();
        this.currentPageSubject.next(1);
        this.filterParamsSubject.next(DEFAULT_FILTER_PARAMS);
        this.loadProducts();
    }

    /**
     * Clears the filter parameters and sets a search query.
     * @param query - The search query.
     */
    clearFilterParamsWithSearch(query: string) {
        this.currentPageSubject.next(1);
        this.filterParamsSubject.next({ ...DEFAULT_FILTER_PARAMS, q: query || undefined });
    }

    /**
     * Sets the price range filter and loads products.
     * @param min - The minimum price.
     * @param max - The maximum price.
     */
    setPriceRangeFilter(min: number, max: number) {
        if (this.isResettingFilters) return;
        const currentParams = this.filterParamsSubject.value;
        this.filterParamsSubject.next({ ...currentParams, priceMin: min, priceMax: max, skip: 0 });
        this.currentPageSubject.next(1);
        this.loadProducts();
    }

    /**
     * Pauses the filter reset process.
     */
    pauseFilters() {
        this.isResettingFilters = true;
        setTimeout(() => {
            this.isResettingFilters = false;
        }, 200);
    }

    /**
     * Sets the search filter and loads products.
     * @param searchTerm - The search term.
     */
    setSearchFilter(searchTerm: string) {
        if (this.isResettingFilters) return;
        const currentParams = this.filterParamsSubject.value;
        const searchTermChanged = currentParams.q !== searchTerm;
        this.filterParamsSubject.next(Object.assign({}, DEFAULT_FILTER_PARAMS, currentParams, { q: searchTerm || undefined }));
        if (searchTermChanged) {
            this.currentPageSubject.next(1);
            this.loadProducts();
        }
    }

    /**
     * Sets the sort filter and loads products.
     * @param sortBy - The field to sort by.
     * @param order - The sort order.
     */
    setSortFilter(sortBy: keyof Product, order: 'asc' | 'desc') {
        if (this.isResettingFilters) return;
        const currentParams = this.filterParamsSubject.value;
        this.setFilterParams({ ...currentParams, sortBy, order });
    }

    /**
     * Clears the sort filter and loads products.
     */
    clearSortFilter() {
        if (this.isResettingFilters) return;
        const currentParams = this.filterParamsSubject.value;
        delete currentParams.sortBy;
        delete currentParams.order;
        this.setFilterParams(currentParams);
    }

    /**
     * Sets the current page and loads products.
     * @param page - The page number.
     */
    setPage(page: number) {
        if (this.isResettingFilters) return;
        this.currentPageSubject.next(page);
        this.loadProducts();
    }

    /**
     * Sets the page size and loads products.
     * @param size - The page size.
     */
    setPageSize(size: number) {
        if (this.isResettingFilters) return;
        const currentParams = this.filterParamsSubject.value;
        if (size === currentParams.limit) return;
        DEFAULT_FILTER_PARAMS.limit = size;
        this.filterParamsSubject.next({ ...currentParams, limit: size });
        this.currentPageSubject.next(1);
        this.loadProducts();
    }

    /**
     * Gets a product by its ID.
     * @param productId - The ID of the product.
     * @returns An observable of the product.
     */
    getProductById(productId: number): Observable<Product> {
        return this.productService.getProductById(productId);
    }

    /**
     * Returns updated filter parameters with pagination.
     * @returns The updated filter parameters.
     */
    private getUpdatedParams(): FilterParams {
        return { ...this.filterParamsSubject.value, skip: (this.currentPageSubject.value - 1) * (this.filterParamsSubject.value.limit || 20) };
    }

    /**
     * Checks if all products should be loaded based on the filter parameters.
     * @param params - The filter parameters.
     * @returns True if all products should be loaded, false otherwise.
     */
    private shouldLoadAllProducts(params: FilterParams): boolean {
        return params.priceMin !== undefined && params.priceMax !== undefined || params.category !== undefined && params.q !== undefined;
    }

    /**
     * Applies filters to the products and sets the filtered products.
     * @param products - The list of products.
     * @param params - The filter parameters.
     */
    private applyFiltersAndSetProducts(products: Product[], params: FilterParams): void {
        const response = this.productService.filterProducts(products, params);
        this.setProducts(response.products);
        this.totalItemsSubject.next(response.total);
    }
}
