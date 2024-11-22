import { CurrencyPipe, SlicePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-product-card',
    standalone: true,
    imports: [MatCardModule, CurrencyPipe, SlicePipe],
    templateUrl: './product-card.component.html',
    styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
    @Input() product: any;
}
