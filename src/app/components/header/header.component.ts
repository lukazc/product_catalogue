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
import { LogoutComponent } from '../logout/logout.component';

@Component({
    selector: 'app-header',
    imports: [MatToolbarModule, SearchBarComponent, CommonModule, MatBadge, MatIcon, MatRipple, RouterLink, LoginComponent, LogoutComponent],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    currentSearchQuery$: Observable<string>;
    totalProductsInCart$: Observable<number>;
    showUserForm: boolean = false;
    isLoggedIn: boolean = false;

    constructor(
        private productStateService: ProductStateService,
        private cartStateService: CartStateService,
        private userStateService: UserStateService,
        private router: Router
    ) {
        this.currentSearchQuery$ = this.productStateService.currentSearchQuery$;
        this.totalProductsInCart$ = this.cartStateService.totalQuantity$;

        this.userStateService.user$.subscribe(user => {
            this.isLoggedIn = !!user;
        });

        this.userStateService.loginSuccess.subscribe(() => {
            this.showUserForm = false;
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

    toggleUserForm(): void {
        this.showUserForm = !this.showUserForm;
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (this.showUserForm && !target.closest('.user-form-container') && !target.closest('.user-button')) {
            this.showUserForm = false;
        }
    }
}
