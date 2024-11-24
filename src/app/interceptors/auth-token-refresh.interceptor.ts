import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { UserStateService } from '../state/user-state.service';
import { UserService } from '../services/user.service';

export const authTokenRefreshInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
    const userStateService = inject(UserStateService);
    const userService = inject(UserService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            return userStateService.user$.pipe(
                switchMap(user => {
                    if (error.status === 401 && user && user.refreshToken) {
                        return userService.refreshSession(user.refreshToken).pipe(
                            switchMap(tokens => {
                                userStateService.setUser({ ...user, accessToken: tokens.accessToken });
                                return next(req.clone());
                            })
                        );
                    }
                    return throwError(() => error);
                })
            );
        })
    );
};