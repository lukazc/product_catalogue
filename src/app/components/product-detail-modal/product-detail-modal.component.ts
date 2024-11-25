import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProductStateService } from '../../state/product-state.service';
import { Product } from '../../models/product.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CartStateService } from '../../state/cart-state.service';
import { MatBadge } from '@angular/material/badge';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-product-detail-modal',
    templateUrl: './product-detail-modal.component.html',
    styleUrls: ['./product-detail-modal.component.scss'],
    imports: [MatDialogModule, CommonModule, CurrencyPipe, MatButton, MatIcon, MatBadge]
})
export class ProductDetailModalComponent implements OnInit, OnDestroy {
    product: Product | null = null;
    currentSlide = 0;
    imageLoaded: boolean[] = [];
    productQuantity = 0;
    private subscriptions: Subscription = new Subscription();

    constructor(
        private dialogRef: MatDialogRef<ProductDetailModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { productId: number },
        private productStateService: ProductStateService,
        private cartStateService: CartStateService
    ) { }

    /**
     * Initializes the component and loads the product details.
     */
    ngOnInit(): void {
        this.subscriptions.add(
            this.productStateService.getProductById(this.data.productId).subscribe(product => {
                this.product = product;
                this.imageLoaded = new Array(product.images.length).fill(false);
                this.subscriptions.add(
                    this.cartStateService.cart$.subscribe(cart => {
                        if (cart && this.product) {
                            const cartItem = cart.products.find(p => p.id === this.product?.id);
                            this.productQuantity = cartItem ? cartItem.quantity : 0;
                        }
                    })
                );
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
     * Closes the modal dialog.
     */
    close(): void {
        this.dialogRef.close();
    }

    /**
     * Moves to the previous slide in the product images.
     */
    prevSlide(): void {
        if (this.product) {
            this.currentSlide = (this.currentSlide > 0) ? this.currentSlide - 1 : this.product.images.length - 1;
        }
    }

    /**
     * Moves to the next slide in the product images.
     */
    nextSlide(): void {
        if (this.product) {
            this.currentSlide = (this.currentSlide < this.product.images.length - 1) ? this.currentSlide + 1 : 0;
        }
    }

    /**
     * Moves to a specific slide in the product images.
     * @param index - The index of the slide to move to.
     */
    goToSlide(index: number): void {
        this.currentSlide = index;
    }

    /**
     * Marks an image as loaded.
     * @param index - The index of the image that has loaded.
     */
    onImageLoad(index: number): void {
        this.imageLoaded[index] = true;
    }

    /**
     * Adds the product to the cart.
     */
    addProductToCart(): void {
        if (this.product) {
            this.cartStateService.addProduct(this.product);
        }
    }
}
