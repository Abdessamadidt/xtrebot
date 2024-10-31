import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginResponse {
  token: string;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = environment.apiUrl+'auth/login';
  private signupUrl = environment.apiUrl+'auth/register';
  private userpUrl = environment.apiUrl+'users';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<LoginResponse>(this.loginUrl, { email, password }, { headers }).pipe(
      tap((response: LoginResponse) => {
        this.setToken(response.token);
        this.setUsername(response.username);
        this.setEmail(response.email); 
      })
      
    );
    
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private setUsername(username: string): void {
    localStorage.setItem('username', username);
  }

  getUsername(): string {
    return localStorage.getItem('username') || '';
  }

  private setEmail(email: string): void {
    localStorage.setItem('email', email);
  }


  getEmail(): string {
    return localStorage.getItem('email') || '';
  }

  signup(data: any): Observable<any> {
    return this.http.post<any>(this.signupUrl, data);
  }

  getUserByEmail(email: string): Observable<any> {
    const url = `${this.userpUrl}/${email}`;
    return this.http.get<any>(url);
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.userpUrl}`);
  }

  updateUser(user: any): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.put(`${this.userpUrl}/${user.id}`, user, { headers });
  }
}
