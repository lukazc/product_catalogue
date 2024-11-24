import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatRipple } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { CartStateService } from '../../state/cart-state.service';
import { ProductStateService } from '../../state/product-state.service';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
    selector: 'app-header',
    imports: [MatToolbarModule, SearchBarComponent, CommonModule, MatBadge, MatIcon, MatRipple, RouterLink],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    currentSearchQuery$: Observable<string>;
    totalProductsInCart$: Observable<number>;

    constructor(
        private productStateService: ProductStateService,
        private cartStateService: CartStateService,
        private router: Router
    ) {
        this.currentSearchQuery$ = this.productStateService.currentSearchQuery$;
        this.totalProductsInCart$ = this.cartStateService.totalQuantity$;
    }

    /**
     * Handles the search event and sets the search filter.
     * @param searchTerm - The search term to filter products.
     */
    onSearch(searchTerm: string): void {
        if (this.router.url !== '/') {
            this.productStateService.clearFilterParams(true);
            this.router.navigate(['/']);
        } else {
            this.productStateService.setSearchFilter(searchTerm);
        }
    }

    onPressHome(): void {
        this.productStateService.clearFilterParams();
        this.router.navigate(['/']);
    }
}
