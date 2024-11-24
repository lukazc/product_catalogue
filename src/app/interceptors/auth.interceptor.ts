import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStateService } from '../state/user-state.service';
import { switchMap } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
    const userStateService = inject(UserStateService);
    return userStateService.user$.pipe(
        switchMap(user => {
            if (user && user.accessToken) {
                req = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${user.accessToken}`
                    }
                });
            }
            return next(req);
        })
    );
};
