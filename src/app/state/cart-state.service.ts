import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalCart, LocalCartItem } from '../models/cart.model';
import { CartService } from '../services/cart.service';
import { UserStateService } from './user-state.service';

@Injectable({
    providedIn: 'root'
})
export class CartStateService {
    private cartSubject: BehaviorSubject<LocalCart | null> = new BehaviorSubject<LocalCart | null>(null);
    public cart$: Observable<LocalCart | null> = this.cartSubject.asObservable();

    constructor(
        private cartService: CartService,
        private userStateService: UserStateService
    ) {
        this.userStateService.user$.subscribe(user => {
            const userId = userStateService.getUserId();
            this.loadCart(userId);
        });
    }

    /**
     * Loads the cart for the current user.
     * @param userId - The ID of the user.
     */
    private loadCart(userId: number): void {
        this.cartService.loadCart(userId).subscribe(cart => {
            this.cartSubject.next(cart);
        });
    }

    /**
     * Adds one quantity of a product to the cart.
     * @param product - The product to add.
     */
    addProduct(product: LocalCartItem): void {
        const cart = this.cartSubject.value;
        if (cart) {
            const existingProduct = cart.products.find(p => p.productId === product.productId);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.products.push({ ...product, quantity: 1 });
            }
            this.updateCart(cart);
        }
    }

    /**
     * Removes one quantity of a product from the cart.
     * @param productId - The ID of the product to remove.
     */
    removeProductQuantity(productId: number): void {
        const cart = this.cartSubject.value;
        if (cart) {
            const product = cart.products.find(p => p.productId === productId);
            if (product) {
                product.quantity -= 1;
                if (product.quantity <= 0) {
                    this.removeProduct(productId);
                } else {
                    this.updateCart(cart);
                }
            }
        }
    }

    /**
     * Removes a product from the cart regardless of quantity.
     * @param productId - The ID of the product to remove.
     */
    removeProduct(productId: number): void {
        const cart = this.cartSubject.value;
        if (cart) {
            cart.products = cart.products.filter(p => p.productId !== productId);
            this.updateCart(cart);
        }
    }

    /**
     * Clears the entire cart.
     */
    clearCart(): void {
        const userId = this.userStateService.getUserId();
        this.cartService.clearCart(userId).subscribe(cart => {
            this.cartSubject.next(cart);
        });
    }

    /**
     * Updates the cart in the state and localStorage.
     * @param cart - The updated cart.
     */
    private updateCart(cart: LocalCart): void {
        const userId = this.userStateService.getUserId();
        this.cartService.updateCart(userId, cart).subscribe(() => {
            this.cartSubject.next(cart);
        });
    }
}
