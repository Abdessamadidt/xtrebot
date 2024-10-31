import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface TransactionRequest {
  email: string;
  coin: string;
  amount: number;
  address: string;
  network: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})



export class TransactionsService {

  

  private apiUrl = 'http://localhost:8080/api/transactions'; // Remplacez par l'URL de votre API


  constructor(private http: HttpClient) { }

  createTransaction(transactionRequest: TransactionRequest): Observable<any> {
    return this.http.post(this.apiUrl, transactionRequest);
  }

  // Obtenir tous les coins
  getTransactions(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  getWithdrawals(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`+"/withdrawals");
  }
  getDeposits(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`+"/deposits");
  }

  getTransactionsByEmail(email: any): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}`+"/"+email);
  }

  // Mettre à jour le prix d'un coin

}
