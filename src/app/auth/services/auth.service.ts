import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { AuthStatus, CheckTokenResponseDto, LoginResponseDto, User } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl: string = environment.baseUrl;
  private readonly httpClient = inject(HttpClient);

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  private setAuthData({ user, token }: { user: User; token: string }): boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);
    return true;
  }

  public logout() {
    localStorage.removeItem('token');
    this._authStatus.set(AuthStatus.notAuthenticated);
    this._currentUser.set(null);
  }

  public login(email: string, password: string): Observable<boolean> {
    return this.httpClient
      .post<LoginResponseDto>(`${this.baseUrl}/auth/login`, { email, password })
      .pipe(
        map(({ user, token }) => {
          return this.setAuthData({ user, token });
        }),
        catchError((err: HttpErrorResponse) => throwError(() => err.error?.message)),
      );
  }

  public checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      this._authStatus.set(AuthStatus.notAuthenticated);
      this._currentUser.set(null);
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.httpClient
      .get<CheckTokenResponseDto>(`${this.baseUrl}/auth/check-token`, { headers })
      .pipe(
        map(({ token, user }) => {
          return this.setAuthData({ token, user });
        }),
        catchError(() => {
          this._authStatus.set(AuthStatus.notAuthenticated);
          return of(false);
        }),
      );
  }
}
