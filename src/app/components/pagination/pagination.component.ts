import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss'],
    imports: [MatPaginator]
})
export class PaginationComponent {
    @Input() totalItems: number = 0;
    @Input() pageSize: number = 20;
    @Input() currentPage: number = 1;
    @Output() pageChange = new EventEmitter<number>();
    @Output() pageSizeChange = new EventEmitter<number>();

    pageSizes: number[] = [10, 20, 50, 100];

    onPageChange(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.pageChange.emit(event.pageIndex + 1);
        this.pageSizeChange.emit(event.pageSize);
    }
}
