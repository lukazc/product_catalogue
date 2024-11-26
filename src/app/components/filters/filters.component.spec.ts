import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FiltersComponent } from './filters.component';
import { ProductStateService } from '../../state/product-state.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SelectComponent } from '../select/select.component';
import { PriceFilterComponent } from '../price-filter/price-filter.component';

describe('FiltersComponent', () => {
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;
  let productStateServiceSpy: jasmine.SpyObj<ProductStateService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProductStateService', ['setFilterParams', 'clearFilterParams', 'setSortFilter', 'clearSortFilter'], {
      productCategories$: of([]),
      resetFilters$: of(null),
      currentPriceRange$: of({ min: 0, max: 1000 }),
      currentCategoryValue$: of(''),
      currentSortValue$: of(''),
      areFiltersActive$: of(false)
    });

    await TestBed.configureTestingModule({
      imports: [CommonModule, MatIconModule, FiltersComponent, SelectComponent, PriceFilterComponent],
      providers: [
        { provide: ProductStateService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;
    productStateServiceSpy = TestBed.inject(ProductStateService) as jasmine.SpyObj<ProductStateService>;
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