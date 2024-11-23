import { CurrencyPipe, SlicePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { Product } from '../../models/product.model';
import { CartStateService } from '../../state/cart-state.service';

@Component({
    selector: 'app-product-card',
    standalone: true,
    imports: [MatCardModule, CurrencyPipe, SlicePipe, MatButtonModule, MatIconModule, MatBadgeModule],
    templateUrl: './product-card.component.html',
    styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit, OnDestroy {
    @Input() product!: Product;
    isImageLoaded: boolean = false;
    productQuantity = 0;
    private subscriptions: Subscription = new Subscription();

    constructor(private cartStateService: CartStateService) { }

    /**
     * Initializes the component and subscribes to the cart state.
     */
    ngOnInit(): void {
        this.subscriptions.add(
            this.cartStateService.cart$.subscribe(cart => {
                if (cart) {
                    const cartItem = cart.products.find(p => p.id === this.product.id);
                    this.productQuantity = cartItem ? cartItem.quantity : 0;
                }
            })
        );
    }

    /**
     * Cleans up subscriptions when the component is destroyed.
     */
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * Adds the product to the cart.
     */
    addProductToCart(): void {
        this.cartStateService.addProduct(this.product);
    }
}
