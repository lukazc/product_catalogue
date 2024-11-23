import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalCart } from '../../models/cart.model';
import { CartStateService } from '../../state/cart-state.service';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss'],
    imports: [CommonModule]
})
export class CartComponent implements OnInit {
    cart$: Observable<LocalCart | null>;
    totalQuantity$: Observable<number>;

    constructor(private cartStateService: CartStateService) {
        this.cart$ = this.cartStateService.cart$;
        this.totalQuantity$ = this.cartStateService.totalQuantity$;
    }

    ngOnInit(): void {
        // Initialization logic if needed
    }

    /**
     * Removes one quantity of a product from the cart.
     * @param productId - The ID of the product to remove.
     */
    removeProductQuantity(productId: number): void {
        this.cartStateService.removeProductQuantity(productId);
    }

    /**
     * Removes a product from the cart regardless of quantity.
     * @param productId - The ID of the product to remove.
     */
    removeProduct(productId: number): void {
        this.cartStateService.removeProduct(productId);
    }

    /**
     * Clears the entire cart.
     */
    clearCart(): void {
        this.cartStateService.clearCart();
    }
}
