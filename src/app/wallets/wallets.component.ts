import { Component, OnInit } from '@angular/core';
import { TransactionsService } from '../services/transactions.service';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { CoinsService } from '../services/coins-service.service';


@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.css']
})
export class WalletsComponent implements OnInit {
  isCopied = false
  adressStatic: string = '0x23228db1b75ba8bcb175a079e2d582ede04c28ee';
  coins: any[] = []

 
  selectedCoin = 0;
  user: any;
  ext = '.svg'
  lassets = '../../assets/coins/'


  transactionRequest = {
    email: '',
    coin: this.coins.length ? this.coins[this.selectedCoin].litnom : '',
    amount: 0,
    address: this.adressStatic,
    network: '',
    type: ''
  };

  selectedNetwork = '';

  constructor(
    private transactionService: TransactionsService,
    private authService: AuthService,
    private coinsService: CoinsService
  ) { }

  ngOnInit(): void {
    this.loadCoins()
    this.transactionRequest.email = this.authService.getEmail();
    const email = this.authService.getEmail(); // Replace this with the actual email
    this.authService.getUserByEmail(email).subscribe(
      (data) => {
        this.user = data;
      }
    );
  }

  loadCoins(): void {
    this.coinsService.getCoins().subscribe(
      data => {
        this.coins = data.sort((a: any, b: any) => a.name.localeCompare(b.name));
        this.selectCoin(0);
      },
    );

  }

  selectCoin(index: number): void {
    this.selectedCoin = index;
    this.transactionRequest.coin = this.coins[index].litnom;
    this.transactionRequest.address = this.coins[index].adress
  }

  selectNetwork(network: string): void {
    this.selectedNetwork = network;
    this.transactionRequest.network = network;
  }

  isFormValidForWithraw(): boolean {
    return Boolean(
      this.transactionRequest.coin &&
      this.transactionRequest.network &&
      this.transactionRequest.amount > 0
    );
  }
  isFormValidForDeposit(): boolean {
    return Boolean(
      this.transactionRequest.coin
    );
  }

  submitWithdraw(): void {
    this.transactionRequest.type = 'withdraw';
    this.transactionService.createTransaction(this.transactionRequest).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Withdraw Successful',
          text: 'Your withdraw transaction was successfully created.',
          confirmButtonText: 'OK'
        }).then(() => {
          // Redirige vers /wallets après la confirmation de l'utilisateur
        });
        this.resetFormat();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Withdraw Failed',
          text: 'There was an error creating your withdraw transaction. Please try again.',
          confirmButtonText: 'Retry'
        });
      }
    );
  }



  submitDeposit(): void {
    this.transactionRequest.type = 'deposit';
    this.transactionRequest.address = this.adressStatic
    this.transactionService.createTransaction(this.transactionRequest).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Deposit Successful',
          text: 'Your deposit transaction was successfully created.',
          confirmButtonText: 'OK'
        });
        this.resetFormat();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Deposit Failed',
          text: 'There was an error creating your deposit transaction. Please try again.',
          confirmButtonText: 'Retry'
        });
      }
    );
  }

  resetFormat() {
    this.transactionRequest = {
      email: '',
      coin: this.coins[this.selectedCoin].litnom,
      amount: 0,
      address: '',
      network: '',
      type: ''
    };
    this.selectedNetwork = "";
  }

  copyAddress() {
    navigator.clipboard.writeText(this.adressStatic);
    this.isCopied = !this.isCopied
  }

}
