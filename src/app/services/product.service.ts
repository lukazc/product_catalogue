import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductApiResponse } from '../models/product.model';
import { Category } from '../models/category.model';
import { FilterParams } from '../models/filter-params.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private baseUrl = '/api';

    constructor(private http: HttpClient) { }

    /**
     * Fetches all products.
     * @returns An Observable of all products.
     */
    getAllProducts(): Observable<ProductApiResponse> {
        const params = new HttpParams().set('limit', '0');
        return this.http.get<ProductApiResponse>(`${this.baseUrl}/products`, { params });
    }

    /**
     * Fetches a product by ID.
     * @param id - The ID of the product to fetch.
     * @returns An Observable of the product.
     */
    getProductById(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
    }

    /**
     * Fetches all categories.
     * @returns An Observable of all categories.
     */
    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.baseUrl}/products/categories`);
    }

    /**
     * Fetches products with optional filtering parameters.
     * @param params - The filtering parameters.
     * @returns An Observable of filtered products.
     */
    getFilteredProducts(params: FilterParams = {}): Observable<ProductApiResponse> {
        let endpoint = 'products';
        if (params.q) {
            endpoint = 'products/search';
        }
        if (params.category) {
            endpoint = `products/category/${params.category}`;
        }

        let httpParams = new HttpParams();
        Object.keys(params).forEach(key => {
            const value = params[key as keyof FilterParams];
            if (value !== undefined) {
                httpParams = httpParams.set(key, value);
            }
        });

        return this.http.get<ProductApiResponse>(`${this.baseUrl}/${endpoint}`, { params: httpParams });
    }

    /**
     * Filters products based on the given parameters.
     * Mocks the missing server-side filtering features.
     * @param products - The products to filter.
     * @param params - The filtering parameters.
     * @returns The filtered products.
     */
    public filterProducts(products: Product[], params: FilterParams): ProductApiResponse {
        let filteredProducts = products.filter(product => {
            let matches = true;

            if (params.category && product.category !== params.category) {
                matches = false;
            }
            if (params.priceMin !== undefined && product.price < params.priceMin) {
                matches = false;
            }
            if (params.priceMax !== undefined && product.price > params.priceMax) {
                matches = false;
            }
            if (params.q && (!product.title.toLowerCase().includes(params.q.toLowerCase()) || !product.description.toLowerCase().includes(params.q.toLowerCase()))) {
                matches = false;
            }

            return matches;
        });

        if (params.sortBy !== undefined) {
            const order = params.order === 'desc' ? -1 : 1;
            filteredProducts = filteredProducts.sort((a, b) => {
                // @ts-ignore
                const aVal = a[params.sortBy];
                // @ts-ignore
                const bVal = b[params.sortBy];
                if (aVal === undefined || bVal === undefined) {
                    return 0;
                }
                if (aVal < bVal) {
                    return -1 * order;
                }
                if (aVal > bVal) {
                    return 1 * order;
                }
                return 0;
            });
        }

        const skip = params.skip || 0;
        const limit = params.limit || filteredProducts.length;
        const paginatedProducts = filteredProducts.slice(skip, skip + limit);

        return {
            products: paginatedProducts,
            total: filteredProducts.length,
            limit,
            skip
        };
    }
}
