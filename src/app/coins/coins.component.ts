import { Component, OnInit } from '@angular/core';
import { CoinsService } from '../services/coins-service.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-coins',
  templateUrl: './coins.component.html',
  styleUrls: ['./coins.component.css']
})
export class CoinsComponent implements OnInit {
  coins: any[] = [];
  isPriceSubmited = false;
  ext = ".svg"
  lassets = "../../assets/coins/"

  constructor(private coinsService: CoinsService) { }

  coinRequest = {
    name: '',
    litnom: '',
    price: 0
  };

  ngOnInit(): void {
    this.loadCoins();
  }

  loadCoins(): void {
    this.coinsService.getCoins().subscribe(
      data => {
        this.coins = data.sort((a: any, b: any) => a.name.localeCompare(b.name));
      },
      error => console.error('Erreur lors de la récupération des coins', error)
    );
  }
  submitCoinUpdate(coin: any): void {
    this.coinsService.updateCoin(coin).subscribe(
      updatedCoin => {
        const index = this.coins.findIndex(c => c.id === updatedCoin.id);
        if (index !== -1) {
          this.coins[index] = { ...updatedCoin, isPriceSubmitted: true };
        }
      },
      error => console.error('Erreur lors de la mise à jour du coin', error)
    );
  }

  notSubmitPrice(): void {
    this.isPriceSubmited = false;
  }

  isFormValid(): boolean {
    return Boolean(
      this.coinRequest.name &&
      this.coinRequest.litnom &&
      this.coinRequest.price > 0
    );
  }

  addCoin() {
    if (this.isFormValid()) {
      this.coinsService.addCoin(this.coinRequest).subscribe(
        response => {
          console.log('Coin added successfully', response);
          
          // Show success alert using SweetAlert2
          Swal.fire({
            title: 'Success!',
            text: 'Coin added successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            // Refresh the content of the coin list after the user clicks OK
            this.refreshCoinList();
          });
  
          // Optionally reset the form after successful submission
          this.resetForm();
        },
        error => {
          console.error('Error adding coin', error);
  
          // Show error alert using SweetAlert2
          Swal.fire({
            title: 'Error!',
            text: 'There was an issue adding the coin. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    }
  }
  
  // Method to refresh the coin list
  refreshCoinList() {
    this.coinsService.getCoins().subscribe(
      coins => {
        this.coins = coins; // Update the local coin list with the latest data
      },
      error => {
        console.error('Error fetching updated coin list', error);
      }
    );
  }
  resetForm(){
    this.coinRequest = {
      name: '',
      litnom: '',
      price: 0
    };
  }

  deleteCoin(coin: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete ${coin.name}?`,
      icon: 'warning',  
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.coinsService.deleteCoin(coin.id).subscribe(
          response => {
            Swal.fire('Deleted!', `${coin.name} has been deleted.`, 'success');
            // Remove the coin from the list if needed
            this.coins = this.coins.filter(c => c.id !== coin.id);
          },
          error => {
            Swal.fire('Error!', `Failed to delete ${coin.name}. Please try again.`, 'error');
          }
        );
      }
    });
  }
}
