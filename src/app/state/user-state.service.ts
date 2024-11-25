import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Injectable({
    providedIn: 'root'
})
export class UserStateService {
    private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(this.getUserFromLocalStorage());
    public user$: Observable<User | null> = this.userSubject.asObservable();
    public loginSuccess: Subject<void> = new Subject<void>();

    constructor(private userService: UserService) {
        this.user$.subscribe(user => this.saveUserToLocalStorage(user));
    }

    /**
     * Sets the current user.
     * @param user - The user to set.
     */
    setUser(user: User): void {
        this.userSubject.next(user);
    }

    /**
     * Clears the current user.
     */
    clearUser(): void {
        this.userSubject.next(null);
    }

    /**
     * Gets the current user ID.
     * @returns The ID of the current user, or 0 for anonymous user.
     */
    getUserId(): number {
        const user = this.userSubject.value;
        return user ? user.id : 0;
    }

    /**
     * Logs in the user with the provided credentials.
     * @param username - The username.
     * @param password - The password.
     */
    login(username: string, password: string): void {
        this.userService.login({ username, password }).subscribe(user => {
            this.setUser(user);
            this.loginSuccess.next();
        });
    }

    /**
     * Logs out the current user.
     */
    logout(): void {
        this.clearUser();
    }

    /**
     * Persists the user in local storage.
     * @param user - The user to save.
     */
    private saveUserToLocalStorage(user: User | null): void {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }

    /**
     * Retrieves the user from local storage.
     * @returns The user object, or null if not found.
     */
    private getUserFromLocalStorage(): User | null {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
}
