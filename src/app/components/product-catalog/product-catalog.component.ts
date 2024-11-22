import { Component, HostListener } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatCardModule, ProductCardComponent],
  templateUrl: './product-catalog.component.html',
  styleUrls: ['./product-catalog.component.scss']
})
export class ProductCatalogComponent {
  products = [
    // Sample product data
    { id: 1, name: 'Product 1', price: 100, description: 'Description 1', imageUrl: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Product 2', price: 200, description: 'Description 2', imageUrl: 'https://via.placeholder.com/150' },
    { id: 1, name: 'Product 1', price: 100, description: 'Description 1', imageUrl: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Product 2', price: 200, description: 'Description 2', imageUrl: 'https://via.placeholder.com/150' },
    { id: 1, name: 'Product 1', price: 100, description: 'Description 1', imageUrl: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Product 2', price: 200, description: 'Description 2', imageUrl: 'https://via.placeholder.com/150' },
    { id: 1, name: 'Product 1', price: 100, description: 'Description 1', imageUrl: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Product 2', price: 200, description: 'Description 2', imageUrl: 'https://via.placeholder.com/150' },
    { id: 1, name: 'Product 1', price: 100, description: 'Description 1', imageUrl: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Product 2', price: 200, description: 'Description 2', imageUrl: 'https://via.placeholder.com/150' },
    { id: 1, name: 'Product 1', price: 100, description: 'Description 1', imageUrl: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Product 2', price: 200, description: 'Description 2', imageUrl: 'https://via.placeholder.com/150' },
    // Add more products as needed
  ];

  constructor() { }
}
