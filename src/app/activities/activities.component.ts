import { Component } from '@angular/core';
import { TransactionsService } from '../services/transactions.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.css'
})
export class ActivitiesComponent {

  ext = ".svg"
  lassets = "../../assets/coins/"

  transactions: any[] = [];

  constructor(private transactionsService: TransactionsService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionsService.getTransactionsByEmail(this.authService.getEmail()).subscribe(
      data => {
        this.transactions = data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        console.log(this.transactions)

      },
      error => console.error('Erreur lors de la récupération des retraits', error)
    );
  }
  

}
