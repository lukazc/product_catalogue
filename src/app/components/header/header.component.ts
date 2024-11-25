import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatRipple } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { CartStateService } from '../../state/cart-state.service';
import { ProductStateService } from '../../state/product-state.service';
import { UserStateService } from '../../state/user-state.service';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { LoginComponent } from '../login/login.component';

@Component({
    selector: 'app-header',
    imports: [MatToolbarModule, SearchBarComponent, CommonModule, MatBadge, MatIcon, MatRipple, RouterLink, LoginComponent],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    currentSearchQuery$: Observable<string>;
    totalProductsInCart$: Observable<number>;
    showLoginForm: boolean = false;

    constructor(
        private productStateService: ProductStateService,
        private cartStateService: CartStateService,
        private userStateService: UserStateService,
        private router: Router
    ) {
        this.currentSearchQuery$ = this.productStateService.currentSearchQuery$;
        this.totalProductsInCart$ = this.cartStateService.totalQuantity$;

        this.userStateService.loginSuccess.subscribe(() => {
            this.showLoginForm = false;
        });
    }

    /**
     * Handles the search event and sets the search filter.
     * @param searchTerm - The search term to filter products.
     */
    onSearch(searchTerm: string): void {
        if (this.router.url !== '/') {
            this.productStateService.clearFilterParamsWithSearch(searchTerm);
            this.router.navigate(['/']);
        } else {
            this.productStateService.setSearchFilter(searchTerm);
        }
    }

    onPressHome(): void {
        this.productStateService.clearFilterParams();
        this.router.navigate(['/']);
    }

    toggleLoginForm(): void {
        this.showLoginForm = !this.showLoginForm;
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (this.showLoginForm && !target.closest('.login-form-container') && !target.closest('.user-button')) {
            this.showLoginForm = false;
        }
    }
}
