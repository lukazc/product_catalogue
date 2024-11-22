import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { ProductStateService } from '../../state/product-state.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-header',
    imports: [MatToolbarModule, SearchBarComponent, CommonModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    currentSearchQuery$: Observable<string>;

    constructor(private productStateService: ProductStateService) {
        this.currentSearchQuery$ = this.productStateService.currentSearchQuery$;
    }

    onSearch(searchTerm: string) {
        this.productStateService.setSearchFilter(searchTerm);
    }
}
