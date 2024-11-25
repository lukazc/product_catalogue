import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { LocalCart, LocalCartItem } from '../models/cart.model';
import { CartService } from '../services/cart.service';
import { UserStateService } from './user-state.service';
import { Product } from '../models/product.model';

@Injectable({
    providedIn: 'root'
})
export class CartStateService {
    private cartSubject: BehaviorSubject<LocalCart | null> = new BehaviorSubject<LocalCart | null>(null);
    public cart$: Observable<LocalCart | null> = this.cartSubject.asObservable();

    public totalQuantity$: Observable<number> = this.cart$.pipe(map(cart => cart?.totalQuantity || 0));

    constructor(
        private cartService: CartService,
        private userStateService: UserStateService
    ) {
        this.userStateService.user$.subscribe(user => {
            const anonymousCart = this.cartSubject.value;
            if (user?.id && anonymousCart?.totalQuantity) {
                this.mergeCart(user.id, anonymousCart)
            } else {
                this.loadCart(user?.id || 0);
            }
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
    addProduct(product: Product | LocalCartItem): void {
        const cart = this.cartSubject.value;
        if (cart) {
            cart.totalQuantity += 1;
            cart.totalPrice += product.price;

            const existingProduct = cart.products.find(p => p.id === product.id);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                const cartItem: LocalCartItem = {
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    thumbnail: product.thumbnail,
                    quantity: 1
                };
                cart.products.push(cartItem);
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
            const product = cart.products.find(p => p.id === productId);
            if (product) {
                if (product.quantity === 1) {
                    this.removeProduct(productId);
                } else {
                    product.quantity -= 1;
                    cart.totalQuantity -= 1;
                    cart.totalPrice -= product.price;
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
            const product = cart.products.find(p => p.id === productId);
            if (product) {
                cart.totalQuantity -= product.quantity;
                cart.totalPrice -= product.price * product.quantity;
                cart.totalProducts -= 1;
                
                cart.products = cart.products.filter(p => p.id !== productId);
                this.updateCart(cart);
            }
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
        this.cartService.updateCart(userId, cart).subscribe((cart) => {
            this.cartSubject.next(cart);
        });
    }

    /**
     * Merges the anonymous cart with the user's cart.
     * @param userId - The ID of the user.
     * @param anonymousCart - The anonymous cart to merge.
     */
    private mergeCart(userId: number, anonymousCart: LocalCart): void {
        this.cartService.mergeCarts(userId, anonymousCart).subscribe(cart => {
            this.cartSubject.next(cart);
        });
    }
    
}
