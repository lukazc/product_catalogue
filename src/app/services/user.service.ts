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

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/auth/me`, { withCredentials: true });
  }

  login(credentials: { username: string, password: string }): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/auth/login`, credentials, { withCredentials: true });
  }

  refreshSession(refreshToken: string, expiresInMins: number = 60): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.baseUrl}/auth/refresh`, 
      { refreshToken, expiresInMins }, 
      { withCredentials: true }
    );
  }
}
