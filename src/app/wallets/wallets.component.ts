import { Component, OnInit } from '@angular/core';
import { TransactionsService } from '../services/transactions.service';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CoinsService } from '../services/coins-service.service';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.css'] // Corrected to plural form
})
export class WalletsComponent implements OnInit {
  tcoins: any[] = [];
  coins: { name: string, litnom: string, img: string }[] = [];
  selectedCoin: number = 0;
  user: any;
  ext = '.svg'
  lassets

  transactionRequest = {
    email: '',
    coin: '',
    amount: 0,
    address: '',
    network: '',
    type: ''
  };

  selectedNetwork: string = '';

  constructor(
    private transactionService: TransactionsService,
    private authService: AuthService,
    private coinsService: CoinsService
  ) { }

  ngOnInit(): void {
    this.loadCoins();
    const email = this.authService.getEmail();
    this.transactionRequest.email = email;
    
    this.authService.getUserByEmail(email).subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  loadCoins(): void {
    this.coinsService.getCoins().subscribe(
      (data) => {
        this.tcoins = data.sort((a: any, b: any) => a.name.localeCompare(b.name));
        this.coins = this.tcoins.map((coin: any) => ({
          name: coin.name,
          litnom: coin.litnom,
          img: coin.img
        }));
        console.log('Loaded coins:', this.tcoins);
      },
      (error) => console.error('Error loading coins:', error)
    );
  }

  selectCoin(index: number): void {
    this.selectedCoin = index;
    this.transactionRequest.coin = this.coins[index]?.litnom || '';
  }

  selectNetwork(network: string): void {
    this.selectedNetwork = network;
    this.transactionRequest.network = network;
  }

  isFormValid(): boolean {
    return Boolean(
      this.transactionRequest.coin &&
      this.transactionRequest.amount > 0 &&
      this.transactionRequest.network
    );
  }

  submitWithdraw(): void {
    this.transactionRequest.type = 'withdraw';
    this.handleTransaction('Withdraw Successful', 'Withdraw Failed');
  }

  submitDeposit(): void {
    this.transactionRequest.type = 'deposit';
    this.handleTransaction('Deposit Successful', 'Deposit Failed');
  }

  private handleTransaction(successTitle: string, errorTitle: string): void {
    this.transactionService.createTransaction(this.transactionRequest).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: successTitle,
          text: `Your ${this.transactionRequest.type} transaction was successfully created.`,
          confirmButtonText: 'OK'
        }).then(() => {
          // Optionally redirect or perform additional actions
        });
        this.resetFormat();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: errorTitle,
          text: `There was an error creating your ${this.transactionRequest.type} transaction. Please try again.`,
          confirmButtonText: 'Retry'
        });
        console.error(`Error creating ${this.transactionRequest.type} transaction:`, error);
      }
    );
  }

  resetFormat(): void {
    this.transactionRequest = {
      ...this.transactionRequest, // Retains the existing email
      coin: this.coins[this.selectedCoin]?.litnom || '',
      amount: 0,
      address: '',
      network: '',
      type: ''
    };
    this.selectedNetwork = '';
  }
}
