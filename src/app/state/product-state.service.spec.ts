import { TestBed } from '@angular/core/testing';
import { ProductStateService } from './product-state.service';
import { ProductService } from '../services/product.service';
import { of } from 'rxjs';
import { Product } from '../models/product.model';

describe('ProductStateService', () => {
  let service: ProductStateService;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  
  const mockCategories = [{ id: 1, name: 'Electronics', slug: 'electronics', url: 'http://example.com/electronics' }];

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ProductService', ['getProductById', 'getAllProducts', 'getFilteredProducts', 'getCategories', 'filterProducts']);

    TestBed.configureTestingModule({
      providers: [
        ProductStateService,
        { provide: ProductService, useValue: spy }
      ]
    });

    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    productServiceSpy.getCategories.and.returnValue(of(mockCategories));
    service = TestBed.inject(ProductStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load products', () => {
    const mockProducts: Product[] = [{ id: 1, title: 'Test Product', description: 'Test Description', price: 100, thumbnail: '', images: [], category: '' }];
    productServiceSpy.getFilteredProducts.and.returnValue(of({ products: mockProducts, total: 1, limit: 10, skip: 0 }));

    service.loadProducts();

    service.products$.subscribe(products => {
      expect(products).toEqual(mockProducts);
    });
  });

  it('should set search filter', () => {
    service.setSearchFilter('test');
    service.filterParams$.subscribe(params => {
      expect(params.q).toBe('test');
    });
  });

  it('should set sort filter', () => {
    service.setSortFilter('price', 'asc');
    service.filterParams$.subscribe(params => {
      expect(params.sortBy).toBe('price');
      expect(params.order).toBe('asc');
    });
  });

  it('should clear sort filter', () => {
    service.clearSortFilter();
    service.filterParams$.subscribe(params => {
      expect(params.sortBy).toBeUndefined();
      expect(params.order).toBeUndefined();
    });
  });

  it('should set page size', () => {
    service.setPageSize(50);
    service.filterParams$.subscribe(params => {
      expect(params.limit).toBe(50);
    });
  });

  it('should get product by id', () => {
    const mockProduct: Product = { id: 1, title: 'Test Product', description: 'Test Description', price: 100, thumbnail: '', images: [], category: '' };
    productServiceSpy.getProductById.and.returnValue(of(mockProduct));

    service.getProductById(1).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });
  });

  it('should load all products', () => {
    const mockProducts: Product[] = [{ id: 1, title: 'Test Product', description: 'Test Description', price: 100, thumbnail: '', images: [], category: '' }];
    productServiceSpy.getAllProducts.and.returnValue(of({ products: mockProducts, total: 1, limit: 10, skip: 0 }));

    service.loadAllProducts({ limit: 10, skip: 0, select: '' }).subscribe();

    service.products$.subscribe(products => {
      expect(products).toEqual(mockProducts);
    });
  });

  it('should load categories', () => {
    service.loadCategories();

    service.productCategories$.subscribe(categories => {
      expect(categories).toEqual(mockCategories);
    });
  });

  it('should apply filters and set products', () => {
    const mockProducts: Product[] = [{ id: 1, title: 'Test Product', description: 'Test Description', price: 100, thumbnail: '', images: [], category: '' }];
    const mockResponse = { products: mockProducts, total: 1, limit: 10, skip: 0 };
    productServiceSpy.filterProducts.and.returnValue(mockResponse);

    service['applyFiltersAndSetProducts'](mockProducts, { limit: 10, skip: 0, select: '' });

    service.products$.subscribe(products => {
      expect(products).toEqual(mockProducts);
    });
  });

  it('should set filter params', () => {
    service.setFilterParams({ category: 'electronics' });
    service.filterParams$.subscribe(params => {
      expect(params.category).toBe('electronics');
    });
  });

  it('should clear filter params', () => {
    service.clearFilterParams();
    service.filterParams$.subscribe(params => {
      expect(params).toEqual(service['DEFAULT_FILTER_PARAMS']);
    });
  });

  it('should clear filter params with search', () => {
    service.clearFilterParamsWithSearch('test');
    service.filterParams$.subscribe(params => {
      expect(params).toEqual({ ...service['DEFAULT_FILTER_PARAMS'], q: 'test' });
    });
  });

  it('should set price range filter', () => {
    service.setPriceRangeFilter(100, 500);
    service.filterParams$.subscribe(params => {
      expect(params.priceMin).toBe(100);
      expect(params.priceMax).toBe(500);
    });
  });

  it('should set page', () => {
    service.setPage(2);
    service['currentPageSubject'].subscribe(page => {
      expect(page).toBe(2);
    });
  });

  it('should pause filters', (done) => {
    service.pauseFilters();
    setTimeout(() => {
      expect(service['isResettingFilters']).toBeFalse();
      done();
    }, 300);
  });
});
