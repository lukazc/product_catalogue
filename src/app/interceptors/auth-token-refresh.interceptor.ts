import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, take, finalize, filter } from 'rxjs/operators';
import { UserStateService } from '../state/user-state.service';
import { UserService } from '../services/user.service';

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

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

            if (isRefreshing) {
                return refreshTokenSubject.pipe(
                    filter(token => token !== null),
                    take(1),
                    switchMap(token => {
                        return next(req);
                    })
                );
            } else {
                isRefreshing = true;
                refreshTokenSubject.next(null);

                return userStateService.user$.pipe(
                    take(1),
                    switchMap(user => {
                        if (user && user.refreshToken) {
                            return userService.refreshSession(user.refreshToken).pipe(
                                switchMap(tokens => {
                                    userStateService.setUser({ ...user, accessToken: tokens.accessToken });
                                    refreshTokenSubject.next(tokens.accessToken);
                                    return next(req);
                                }),
                                catchError(err => {
                                    userStateService.logout();
                                    refreshTokenSubject.next(null);
                                    return throwError(() => err);
                                }),
                                finalize(() => {
                                    isRefreshing = false;
                                })
                            );
                        }
                        return throwError(() => error);
                    })
                );
            }
        })
    );
};