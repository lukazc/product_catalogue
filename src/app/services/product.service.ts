import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';

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

  sortProducts(sortBy: string, order: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`, { params: { sortBy, order } });
  }

  limitAndSkipProducts(limit: number, skip: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`, { params: { limit, skip } });
  }

  selectProducts(select: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`, { params: { select } });
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products/search`, { params: { q: query } });
  }
}
