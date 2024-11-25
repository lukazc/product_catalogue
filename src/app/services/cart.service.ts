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
    updateCart(userId: number, cart: LocalCart): Observable<LocalCart> {
        return new Observable<LocalCart>(observer => {
            localStorage.setItem(this.getCartKey(userId), JSON.stringify(cart));
            observer.next(cart);
            observer.complete();
        });
    }

    /**
     * Merges an anonymous cart with a user's cart, updating the user's cart in localStorage.
     * @param userId - The ID of the user.
     * @param anonymousCart - The anonymous cart to merge.
     * @returns An observable of the merged cart.
     */
    mergeCarts(userId: number, anonymousCart: LocalCart): Observable<LocalCart> {
        return new Observable<LocalCart>(observer => {
            const userCart: string | null = localStorage.getItem(this.getCartKey(userId));
            const cart = userCart ? JSON.parse(userCart) : this.getNewCart(userId);
            const mergedCart = this.addCarts(cart, anonymousCart);
            localStorage.setItem(this.getCartKey(userId), JSON.stringify(mergedCart));
            localStorage.removeItem(this.getCartKey(0));
            observer.next(mergedCart);
            observer.complete();
        });
    }

    /**
     * Adds the products from an anonymous cart to a user's cart.
     * @param userCart - The user's cart.
     * @param anonCart - The anonymous cart.
     * @returns The updated cart with the products added.
     */
    private addCarts(userCart: LocalCart, anonCart: LocalCart): LocalCart {
        const products = userCart.products.map(product1 => {
            const product2 = anonCart.products.find(p => p.id === product1.id);
            if (product2) {
                return { ...product1, quantity: product1.quantity + product2.quantity };
            }
            return product1;
        }).concat(anonCart.products.filter(p => !userCart.products.find(p1 => p1.id === p.id)));

        const totalPrice = userCart.totalPrice + anonCart.totalPrice;
        const totalProducts = products.length;
        const totalQuantity = products.reduce((acc, product) => acc + product.quantity, 0);
        return { userId: userCart.userId, products, totalPrice, totalProducts, totalQuantity };
    }

    /**
     * Generates the localStorage key for a user's cart.
     * @param userId - The ID of the user.
     * @returns The localStorage key for the user's cart.
     */
    private getCartKey(userId: number): string {
        return `cart-${userId}`;
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
