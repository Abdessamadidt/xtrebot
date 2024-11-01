import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoinsService {
  private apiUrl = environment.apiUrl + 'coins'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  // Common headers for all requests
  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // This is typically handled on the server-side
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS' // Also typically handled on the server-side
    });
  }

  // Get all coins
  getCoins(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  // Update a coin
  updateCoin(coin: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${coin.id}`, coin, { headers: this.getHeaders() });
  }
  
  // Add a coin
  addCoin(coinRequest: { name: string; litnom: string; price: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, coinRequest, { headers: this.getHeaders() });
  }

  // Delete a coin
  deleteCoin(coinId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${coinId}`, { headers: this.getHeaders() });
  }
}
