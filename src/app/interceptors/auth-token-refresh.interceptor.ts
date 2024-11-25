import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, take, finalize, filter } from 'rxjs/operators';
import { UserStateService } from '../state/user-state.service';
import { UserService } from '../services/user.service';

/**
 * Flag to track if a token refresh is in progress.
 * @type {boolean}
 */
let isRefreshing = false;
/**
 * Subject to notify subscribers when a token refresh is complete.
 * @type {BehaviorSubject<string | null>}
 */
let refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

/**
 * Interceptor to handle token refresh on 401 Unauthorized errors.
 * @param {HttpRequest<any>} req - The outgoing HTTP request.
 * @param {HttpHandlerFn} next - The next handler in the chain.
 * @returns {Observable<HttpEvent<any>>} An observable of the HTTP event.
 */
export const authTokenRefreshInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
    const userStateService = inject(UserStateService);
    const userService = inject(UserService);

    const refreshEndpoint = '/api/auth/refresh';
    const isRefreshEndpoint = req.url.includes(refreshEndpoint);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            // If the error is not 401 or is from the refresh endpoint, throw the error
            if (error.status !== 401 || isRefreshEndpoint) {
                return throwError(() => error);
            }

            // If a token refresh is already in progress, wait for it to complete
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

                // Attempt to refresh the token
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