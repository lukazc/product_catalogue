import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStateService } from '../state/user-state.service';
import { switchMap, take } from 'rxjs/operators';

/**
 * Interceptor to add Authorization header to HTTP requests.
 * @param {HttpRequest<any>} req - The outgoing HTTP request.
 * @param {HttpHandlerFn} next - The next handler in the chain.
 * @returns {Observable<HttpEvent<any>>} An observable of the HTTP event.
 */
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
    const userStateService = inject(UserStateService);

    // Skip adding Authorization header for auth endpoints
    const authEndpointPattern = /^\/api\/auth\//;
    if (authEndpointPattern.test(req.url)) {
        return next(req);
    }

    // Add Authorization header if user is authenticated
    return userStateService.user$.pipe(
        take(1),
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
