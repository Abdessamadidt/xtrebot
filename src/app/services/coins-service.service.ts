import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoinsService {
  private apiUrl = environment.apiUrl+'coins'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) {}

  // Obtenir tous les coins
  getCoins(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  // Mettre à jour le prix d'un coin
  updateCoin(coin: any): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.put(`${this.apiUrl}/${coin.id}`, coin, { headers });
  }
  
  addCoin(coinRequest: { name: string; litnom: string; price: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, coinRequest);
  }

  deleteCoin(coinId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${coinId}`);
  }
}
