import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatRipple } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { map, Observable } from 'rxjs';
import { CartStateService } from '../../state/cart-state.service';
import { ProductStateService } from '../../state/product-state.service';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
    selector: 'app-header',
    imports: [MatToolbarModule, SearchBarComponent, CommonModule, MatBadge, MatIcon, MatRipple],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    currentSearchQuery$: Observable<string>;
    totalProductsInCart$: Observable<number>;

    constructor(
        private productStateService: ProductStateService,
        private cartStateService: CartStateService
    ) {
        this.currentSearchQuery$ = this.productStateService.currentSearchQuery$;
        this.totalProductsInCart$ = this.cartStateService.cart$.pipe(
            map(cart => cart ? cart.products.reduce((total, item) => total + item.quantity, 0) : 0)
        );
    }

    onSearch(searchTerm: string) {
        this.productStateService.setSearchFilter(searchTerm);
    }
}
