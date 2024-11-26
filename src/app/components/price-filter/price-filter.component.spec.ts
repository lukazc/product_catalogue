import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PriceFilterComponent } from './price-filter.component';
import { ProductStateService } from '../../state/product-state.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('PriceFilterComponent', () => {
  let component: PriceFilterComponent;
  let fixture: ComponentFixture<PriceFilterComponent>;
  let productStateServiceSpy: jasmine.SpyObj<ProductStateService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProductStateService', ['setPriceRangeFilter'],
        {
            currentPriceRange$: of({ min: 0, max: 1000 }),
            resetFilters$: of(null)
        },
    );

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, PriceFilterComponent],
      providers: [
        { provide: ProductStateService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PriceFilterComponent);
    component = fixture.componentInstance;
    productStateServiceSpy = TestBed.inject(ProductStateService) as jasmine.SpyObj<ProductStateService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set price range filter on value change', (done) => {
    component.priceForm.setValue({ priceMin: 100, priceMax: 500 });
    setTimeout(() => {
        expect(productStateServiceSpy.setPriceRangeFilter).toHaveBeenCalledWith(100, 500);
        done();
    }, 500);
  });
});