import { TestBed } from '@angular/core/testing';
import { CartStateService } from './cart-state.service';
import { CartService } from '../services/cart.service';
import { UserStateService } from './user-state.service';
import { of } from 'rxjs';
import { LocalCart } from '../models/cart.model';
import { User } from '../models/user.model';

describe('CartStateService', () => {
  let service: CartStateService;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let userStateServiceSpy: jasmine.SpyObj<UserStateService>;

  const mockCart: LocalCart = { userId: 1, products: [], totalProducts: 0, totalQuantity: 0, totalPrice: 0 };

  beforeEach(() => {
    const cartSpy = jasmine.createSpyObj('CartService', ['loadCart']);
    const userSpy = jasmine.createSpyObj('UserStateService', [], {
      user$: of({
        id: 1,
        username: 'testUser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        roles: [],
        permissions: [],
        gender: 'male',
        image: 'http://example.com/image.jpg',
        accessToken: 'token',
        refreshToken: 'token'
      } as User)
    });

    TestBed.configureTestingModule({
      providers: [
        CartStateService,
        { provide: CartService, useValue: cartSpy },
        { provide: UserStateService, useValue: userSpy }
      ]
    });

    cartServiceSpy = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    userStateServiceSpy = TestBed.inject(UserStateService) as jasmine.SpyObj<UserStateService>;
    cartServiceSpy.loadCart.and.returnValue(of(mockCart));
    service = TestBed.inject(CartStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load cart for user', () => {
    service['loadCart'](1);

    service.cart$.subscribe(cart => {
      expect(cart).toEqual(mockCart);
    });
  });
});