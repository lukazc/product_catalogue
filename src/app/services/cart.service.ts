import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cart } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = '/api';

  constructor(private http: HttpClient) { }

  // mock API call by returning a cart from localStorage
  getCart(cartId: number): Cart {
    const cart: string | null = localStorage.getItem(this.getCartKey(cartId));
    return cart ? JSON.parse(cart) : this.getNewCart();
  }

  // mock API call by removing the cart from localStorage
  clearCart(cartId: number): void {
    localStorage.removeItem(this.getCartKey(cartId));
  }

  updateCart(cartId: number, products: { id: number, quantity: number }[], merge: boolean = false): void {
    const url = `${this.baseUrl}/carts/${cartId}`;
    const body = { merge, products };

    this.http.put<Cart>(url, body)
      .subscribe({
        next: updatedCart => {
            localStorage.setItem(this.getCartKey(cartId), JSON.stringify(updatedCart));
          },
        error: error => {
            console.error('Error updating cart:', error);
        }
      });
  }

  private getCartKey(cartId: number): string {
    return `cart-${cartId}`;
  }

  private getNewCart(): Cart {
    return {"id": 0, "userId": 0, "products": [], "total": 0, "discountedTotal": 0, "totalProducts": 0, "totalQuantity": 0};
  }
}
