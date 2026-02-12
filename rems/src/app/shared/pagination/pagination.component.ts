import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-pagination',
    standalone: false,
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnChanges {
    @Input() totalItems: number = 0;
    @Input() pageSize: number = 10;
    @Input() currentPage: number = 1;
    @Output() pageChange = new EventEmitter<number>();
    @Output() pageSizeChange = new EventEmitter<number>();

    pages: number[] = [];

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['totalItems'] || changes['pageSize'] || changes['currentPage']) {
            this.calculatePages();
        }
    }

    get totalPages(): number {
        return Math.ceil(this.totalItems / this.pageSize);
    }

    calculatePages(): void {
        const total = this.totalPages;
        if (total <= 1) {
            this.pages = [1];
            return;
        }

        const maxVisible = 5;
        let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(total, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        this.pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.pageChange.emit(page);
        }
    }

    onPageSizeChange(event: any): void {
        const newSize = parseInt(event.target.value, 10);
        this.pageSizeChange.emit(newSize);
    }

    get startItem(): number {
        return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
    }

    get endItem(): number {
        return Math.min(this.currentPage * this.pageSize, this.totalItems);
    }
}
