import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalCart } from '../models/cart.model';

@Injectable({
    providedIn: 'root'
})
export class CartService {

    constructor() { }

    /**
     * Loads the cart for a specific user from localStorage.
     * @param userId - The ID of the user.
     * @returns An observable of the user's cart.
     */
    loadCart(userId: number): Observable<LocalCart> {
        return new Observable<LocalCart>(observer => {
            const cart: string | null = localStorage.getItem(this.getCartKey(userId));
            observer.next(cart ? JSON.parse(cart) : this.getNewCart(userId));
            observer.complete();
        });
    }

    /**
     * Clears the cart for a specific user from localStorage.
     * @param userId - The ID of the user.
     * @returns An observable that completes when the cart is cleared.
     */
    clearCart(userId: number): Observable<LocalCart> {
        return new Observable<LocalCart>(observer => {
            localStorage.removeItem(this.getCartKey(userId));
            observer.next(this.getNewCart(userId));
            observer.complete();
        });
    }

    /**
     * Updates the cart for a specific user in localStorage.
     * @param userId - The ID of the user.
     * @param cart - The updated cart.
     * @returns An observable that completes when the cart is updated.
     */
    updateCart(userId: number, cart: LocalCart): Observable<void> {
        return new Observable<void>(observer => {
            localStorage.setItem(this.getCartKey(userId), JSON.stringify(cart));
            observer.next();
            observer.complete();
        });
    }

    /**
     * Generates the localStorage key for a user's cart.
     * @param userId - The ID of the user.
     * @returns The localStorage key for the user's cart.
     */
    private getCartKey(userId: number): string {
        return `user-${userId}`;
    }

    /**
     * Creates a new empty cart for a user.
     * @param userId - The ID of the user.
     * @returns A new empty cart.
     */
    private getNewCart(userId: number): LocalCart {
        return { userId, products: [], totalPrice: 0, totalProducts: 0, totalQuantity: 0 };
    }
}
