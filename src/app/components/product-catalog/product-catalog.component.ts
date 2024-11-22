import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ProductStateService } from '../../state/product-state.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../../models/product.model';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-product-catalog',
    imports: [CommonModule, ProductCardComponent],
    templateUrl: './product-catalog.component.html',
    styleUrls: ['./product-catalog.component.scss']
})
export class ProductCatalogComponent implements OnInit {
    products$: Observable<Product[]>;

    constructor(private productStateService: ProductStateService) {
        this.products$ = this.productStateService.products$;
    }

    ngOnInit() {
        this.productStateService.loadProducts();
    }

    onFilterChange(filterParams: any): void {
        this.productStateService.loadFilteredProducts(filterParams);
    }
}
