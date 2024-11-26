import { TestBed } from '@angular/core/testing';

import { UserStateService } from './user-state.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UserStateService', () => {
    let service: UserStateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });
        service = TestBed.inject(UserStateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
