import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';

interface FilterParams {
  sortBy?: keyof Product;
  order?: 'asc' | 'desc';
  limit?: number;
  skip?: number;
  select?: keyof Product;
  q?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = '/api';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`);
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
}
