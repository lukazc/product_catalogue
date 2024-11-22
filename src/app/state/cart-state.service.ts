import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartStateService {
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$ = this.cartSubject.asObservable();

  constructor() { }

  setCart(cart: Cart) {
    this.cartSubject.next(cart);
  }

  clearCart() {
    this.cartSubject.next(null);
  }
}
