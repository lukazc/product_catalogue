import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { AuthTokens } from '../models/auth-tokens.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = '/api';

  constructor(private http: HttpClient) { }

  /**
   * Fetches the current authenticated user.
   * @returns An observable of the user.
   */
  getUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/auth/me`, { withCredentials: true });
  }

  /**
   * Logs in a user with the provided credentials.
   * @param credentials - The login credentials.
   * @returns An observable of the logged-in user.
   */
  login(credentials: { username: string, password: string }): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/auth/login`, credentials, { withCredentials: true });
  }

  /**
   * Refreshes the session using the provided refresh token.
   * @param refreshToken - The refresh token.
   * @param expiresInMins - The expiration time in minutes (default is 60).
   * @returns An observable of the new authentication tokens.
   */
  refreshSession(refreshToken: string, expiresInMins: number = 60): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.baseUrl}/auth/refresh`, 
      { refreshToken, expiresInMins }, 
      { withCredentials: true }
    );
  }
}
