import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProductStateService } from '../../state/product-state.service';
import { Product } from '../../models/product.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-product-detail-modal',
  templateUrl: './product-detail-modal.component.html',
  styleUrl: './product-detail-modal.component.scss',
  imports: [MatDialogModule, CommonModule, MatDialogModule, CurrencyPipe, MatButton, MatIcon]
})
export class ProductDetailModalComponent implements OnInit {
  product: Product | null = null;
  currentSlide = 0;
  imageLoaded: boolean[] = [];

  constructor(
    private dialogRef: MatDialogRef<ProductDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { productId: number },
    private productStateService: ProductStateService
  ) {}

  ngOnInit(): void {
    this.productStateService.getProductById(this.data.productId).subscribe(product => {
      this.product = product;
      this.imageLoaded = new Array(product.images.length).fill(false);
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  prevSlide(): void {
    if (this.product) {
      this.currentSlide = (this.currentSlide > 0) ? this.currentSlide - 1 : this.product.images.length - 1;
    }
  }

  nextSlide(): void {
    if (this.product) {
      this.currentSlide = (this.currentSlide < this.product.images.length - 1) ? this.currentSlide + 1 : 0;
    }
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  onImageLoad(index: number): void {
    this.imageLoaded[index] = true;
  }
}
