import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductStateService } from '../../state/product-state.service';

@Component({
    selector: 'app-search-bar',
    imports: [MatInputModule, MatIconModule, FormsModule],
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnDestroy {
    @Input() searchTerm: string = '';
    @Output() search = new EventEmitter<string>();
    private searchSubject = new Subject<string>();
    private resetFiltersSubscription: Subscription;

    constructor(private productStateService: ProductStateService) {
        this.searchSubject.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(searchTerm => {
            this.search.emit(searchTerm);
        });
        this.resetFiltersSubscription = this.productStateService.resetFilters$.subscribe(() => {
            this.searchTerm = '';
        });
    }

    ngOnDestroy(): void {
        this.resetFiltersSubscription.unsubscribe();
    }

    onSearch() {
        this.searchSubject.next(this.searchTerm);
    }
}
