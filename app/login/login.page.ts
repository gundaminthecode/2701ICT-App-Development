import { Component, OnInit } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList, IonIcon, IonCheckbox, IonItem, IonInput 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logInOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports : [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList, IonIcon, IonCheckbox, IonItem, IonInput, FormsModule
  ]
})
export class LoginPage implements OnInit {

  username: string = '';
  password: string = '';
  Count: number = 0;

  constructor(
    private router: Router, 
    private loginService: LoginService,
    private storage: Storage,
    private alertController: AlertController,
  ) {
    addIcons({ logInOutline });
  }

  ngOnInit(): void {
    this.storage.create();
  }

  incrementCounter() {
    this.Count += 1;
  }

  async login() {
    this.incrementCounter();
    const storedUsername = await this.storage.get('username');
    const storedPassword = await this.storage.get('password');

    // Check if inputted username and password are the same as in storage
    if (this.username === storedUsername && this.password === storedPassword) {
      this.loginService.login(); // Tell app that user is logged in
      this.router.navigate(['']); // Redirect to home page
      this.username = '';
      this.password = '';
    } else {
      this.showErrorAlert();
    }
  }

  async showErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Login Failed',
      message: 'Invalid username or password.',
      buttons: ['OK']
    });

    await alert.present();
  }

}

