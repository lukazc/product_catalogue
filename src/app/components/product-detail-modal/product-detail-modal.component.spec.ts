import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailModalComponent } from './product-detail-modal.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ProductDetailModalComponent', () => {
    let component: ProductDetailModalComponent;
    let fixture: ComponentFixture<ProductDetailModalComponent>;

    beforeEach(async () => {
        const matDialogSpy = jasmine.createSpyObj('MatDialogRef', ['onNoClick', 'closeDialog']);

        await TestBed.configureTestingModule({
            imports: [ProductDetailModalComponent],
            providers: [
                {
                    provide: MatDialogRef,
                    useValue: matDialogSpy
                },
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: { productId: 1 }
                },
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ProductDetailModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
