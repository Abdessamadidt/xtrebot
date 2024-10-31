import { Component, OnInit } from '@angular/core';
import { TransactionsService } from '../services/transactions.service';

@Component({
  selector: 'app-withdrawals',
  templateUrl: './withdrawals.component.html',
  styleUrl: './withdrawals.component.css'
})
export class WithdrawalsComponent implements OnInit{
  ext = ".svg"
  lassets = "../../assets/coins/"

  transactions: any[] = [];

  constructor(private transactionsService: TransactionsService) {}

  ngOnInit(): void {
    this.loadWithdrawals();
    console.log(this.lassets+this.transactions[0].litnom.toUpperCase()+this.ext)
  }

  loadWithdrawals(): void {
    this.transactionsService.getWithdrawals().subscribe(
      data => {
        this.transactions = data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        console.log(this.transactions)

      },
      error => console.error('Erreur lors de la récupération des retraits', error)
    );
  }
  

}
