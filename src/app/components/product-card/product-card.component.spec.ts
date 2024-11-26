import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductCardComponent } from './product-card.component';
import { CartStateService } from '../../state/cart-state.service';
import { UserStateService } from '../../state/user-state.service';
import { UserService } from '../../services/user.service';
import { ProductService } from '../../services/product.service';
import { provideHttpClient } from '@angular/common/http';
import { Product } from '../../models/product.model';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    description: 'This is a test product description.',
    price: 100,
    thumbnail: 'http://example.com/image.jpg',
    images: [],
    category: 'Test Category'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [
        CartStateService,
        UserStateService,
        UserService,
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = mockProduct; // Set the mock product
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});