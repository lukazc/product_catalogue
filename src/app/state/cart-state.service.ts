import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalCart } from '../models/cart.model';
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
            if (user) {
                this.loadCart(user.id);
            } else {
                this.cartSubject.next(null);
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
     * Clears the cart for the current user.
     */
    clearCart(): void {
        const userId = this.userStateService.getUserId();
        this.cartService.clearCart(userId).subscribe((newCart: LocalCart) => {
            this.cartSubject.next(newCart);
        });
    }

    /**
     * Updates the cart for the current user.
     * @param cart - The updated cart.
     */
    updateCart(cart: LocalCart): void {
        const userId = this.userStateService.getUserId();
        this.cartService.updateCart(userId, cart).subscribe(() => {
            this.cartSubject.next(cart);
        });
    }
}
