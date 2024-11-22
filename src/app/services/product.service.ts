import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { FilterParams } from '../models/filter-params.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = '/api';

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    const params = new HttpParams().set('limit', '0');
    return this.http.get<Product[]>(`${this.baseUrl}/products`, { params });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/products/categories`);
  }

  /**
   * Fetches products with optional filtering parameters.
   * @param params - The filtering parameters.
   * @returns An Observable of filtered products.
   */
  getFilteredProducts(params: FilterParams = {}): Observable<Product[]> {
    const endpoint = params.q ? 'products/search' : 'products';
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      const value = params[key as keyof FilterParams];
      if (value !== undefined) {
        httpParams = httpParams.set(key, value);
      }
    });

    return this.http.get<Product[]>(`${this.baseUrl}/${endpoint}`, { params: httpParams });
  }

  /**
   * Filters products based on the given parameters.
   * Mocks the missing server-side filtering features.
   * @param products - The products to filter.
   * @param params - The filtering parameters.
   * @returns The filtered products.
   */
  private filterProducts(products: Product[], params: FilterParams): Product[] {
    return products.filter(product => {
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
      if (params.q && !product.title.toLowerCase().includes(params.q.toLowerCase())) {
        matches = false;
      }

      return matches;
    }).sort((a, b) => {
      if (params.sortBy) {
        const order = params.order === 'desc' ? -1 : 1;
        if (a[params.sortBy] < b[params.sortBy]) {
          return -1 * order;
        }
        if (a[params.sortBy] > b[params.sortBy]) {
          return 1 * order;
        }
      }
      return 0;
    }).slice(params.skip || 0, (params.skip || 0) + (params.limit || products.length));
  }
}
