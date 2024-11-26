
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FiltersComponent } from './filters.component';
import { ProductStateService } from '../../state/product-state.service';
import { of } from 'rxjs';

describe('FiltersComponent', () => {
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;
  let productStateServiceSpy: jasmine.SpyObj<ProductStateService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProductStateService', ['setFilterParams', 'clearFilterParams', 'setSortFilter', 'clearSortFilter', 'productCategories$']);

    await TestBed.configureTestingModule({
      imports: [FiltersComponent],
      providers: [
        { provide: ProductStateService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;
    productStateServiceSpy = TestBed.inject(ProductStateService) as jasmine.SpyObj<ProductStateService>;
    productStateServiceSpy.productCategories$ = of([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle category change', () => {
    component.onCategoryChange('electronics');
    expect(productStateServiceSpy.setFilterParams).toHaveBeenCalledWith({ category: 'electronics' });
  });

  it('should clear filters', () => {
    component.clearFilters();
    expect(productStateServiceSpy.clearFilterParams).toHaveBeenCalled();
  });

  it('should handle sort change', () => {
    component.onSortChange('price_asc');
    expect(productStateServiceSpy.setSortFilter).toHaveBeenCalledWith('price', 'asc');
  });
});