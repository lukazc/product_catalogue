import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';
import { FilterParams } from '../models/filter-params.model';

@Injectable({
  providedIn: 'root'
})
export class ProductStateService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  private filterParamsSubject = new BehaviorSubject<FilterParams>({});
  filterParams$ = this.filterParamsSubject.asObservable();

  constructor() { }

  setProducts(products: Product[]) {
    this.productsSubject.next(products);
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
