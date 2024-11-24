import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Injectable({
    providedIn: 'root'
})
export class UserStateService {
    private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
    public user$: Observable<User | null> = this.userSubject.asObservable();

    constructor(private userService: UserService) {}

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
        });
    }

    /**
     * Logs out the current user.
     */
    logout(): void {
        this.clearUser();
    }
}
