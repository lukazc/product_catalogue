import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { debounceTime } from 'rxjs/operators';
import { ProductStateService } from '../../state/product-state.service';

@Component({
  selector: 'app-price-filter',
  templateUrl: './price-filter.component.html',
  styleUrls: ['./price-filter.component.scss'],
  imports: [MatSliderModule, ReactiveFormsModule]
})
export class PriceFilterComponent implements OnInit {
  priceForm: FormGroup;

  constructor(private fb: FormBuilder, private productStateService: ProductStateService) {
    this.priceForm = this.fb.group({
      priceMin: [0],
      priceMax: [40000]
    });
  }

  ngOnInit(): void {
    this.priceForm.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(values => {
      this.productStateService.setFilterParams({
        priceMin: values.priceMin,
        priceMax: values.priceMax
      });
    });
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }
}
