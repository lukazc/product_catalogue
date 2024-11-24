import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { UserStateService } from '../state/user-state.service';
import { UserService } from '../services/user.service';

export const authTokenRefreshInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
    const userStateService = inject(UserStateService);
    const userService = inject(UserService);

    const refreshEndpoint = '/api/auth/refresh';
    const isRefreshEndpoint = req.url.includes(refreshEndpoint);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status !== 401 || isRefreshEndpoint) {
                return throwError(() => error);
            }
            return userStateService.user$.pipe(
                take(1),
                switchMap(user => {
                    if (user && user.refreshToken) {
                        return userService.refreshSession(user.refreshToken).pipe(
                            switchMap(tokens => {
                                userStateService.setUser({ ...user, accessToken: tokens.accessToken });
                                return next(req.clone());
                            })
                        );
                    }
                    return throwError(() => error);
                }),
                catchError(() => throwError(() => error))
            );
        })
    );
};