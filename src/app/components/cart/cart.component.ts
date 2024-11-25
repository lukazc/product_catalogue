import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalCart, LocalCartItem } from '../../models/cart.model';
import { CartStateService } from '../../state/cart-state.service';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss'],
    imports: [CommonModule, MatIcon, MatIconButton, MatButton, RouterLink]
})
export class CartComponent {
    cart$: Observable<LocalCart | null>;
    totalQuantity$: Observable<number>;

    constructor(private cartStateService: CartStateService) {
        this.cart$ = this.cartStateService.cart$;
        this.totalQuantity$ = this.cartStateService.totalQuantity$;
    }

    /**
     * Adds one quantity of a product to the cart.
     * @param productId - The ID of the product to add.
     * 
     */
    addProductQuantity(product: LocalCartItem): void {
        this.cartStateService.addProduct(product);
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
