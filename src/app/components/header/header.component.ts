import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { ProductStateService } from '../../state/product-state.service';

@Component({
    selector: 'app-header',
    imports: [MatToolbarModule, SearchBarComponent],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    constructor(private productStateService: ProductStateService) {}

    onSearch(searchTerm: string) {
        this.productStateService.setSearchFilter(searchTerm);
    }
}
