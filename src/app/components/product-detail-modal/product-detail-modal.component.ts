import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProductStateService } from '../../state/product-state.service';
import { Product } from '../../models/product.model';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-detail-modal',
  templateUrl: './product-detail-modal.component.html',
  styleUrl: './product-detail-modal.component.scss',
  imports: [MatDialogModule, CommonModule, MatDialogModule, CurrencyPipe]
})
export class ProductDetailModalComponent implements OnInit {
  product: Product | null = null;

  constructor(
    private dialogRef: MatDialogRef<ProductDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { productId: number },
    private productStateService: ProductStateService
  ) {}

  ngOnInit(): void {
    this.productStateService.getProductById(this.data.productId).subscribe(product => {
      this.product = product;
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
