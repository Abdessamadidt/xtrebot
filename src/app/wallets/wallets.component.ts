import { Component, OnInit } from '@angular/core';
import { TransactionsService } from '../services/transactions.service';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrl: './wallets.component.css'
})
export class WalletsComponent implements OnInit {

  coins = [
    { name: 'Bitcoin', litname: 'BTC', img: '../../assets/coins/BTC.svg' },
    { name: 'Ethereum', litname: 'ETH', img: '../../assets/coins/ETH.svg' }
  ];
  selectedCoin = 0;
  user: any;


  transactionRequest = {
    email: '', 
    coin: this.coins[this.selectedCoin].litname,
    amount: 0,
    address: '',
    network: '',
    type: ''
  };

  selectedNetwork = '';

  constructor(
    private transactionService: TransactionsService, 
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.transactionRequest.email = this.authService.getEmail();
      const email = this.authService.getEmail(); // Replace this with the actual email
      this.authService.getUserByEmail(email).subscribe(
        (data) => {
          this.user = data;
          console.log('User data:', data);
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
      console.log(this.user) 
    }
  

  selectCoin(index: number): void {
    this.selectedCoin = index;
    this.transactionRequest.coin = this.coins[index].litname;
  }

  selectNetwork(network: string): void {
    this.selectedNetwork = network;
    this.transactionRequest.network = network;
  }

  isFormValid(): boolean {
    return Boolean(
      this.transactionRequest.coin &&
      this.transactionRequest.amount > 0 &&
      this.transactionRequest.address &&
      this.transactionRequest.network
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
          this.router.navigate(['/wallets']);
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
        console.error('Error creating withdraw transaction:', error);
      }
    );
  }


  
  submitDeposit(): void {
    this.transactionRequest.type = 'deposit';
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
        console.error('Error creating deposit transaction:', error);
      }
    );
  }

  resetFormat(){
    this.transactionRequest = {
      email: '', 
      coin: this.coins[this.selectedCoin].litname,
      amount: 0,
      address: '',
      network: '',
      type: ''
    };
    this.selectedNetwork = "";
  }
  
}
