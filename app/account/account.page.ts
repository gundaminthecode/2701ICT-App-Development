import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon,
    CommonModule, FormsModule
  ]
})
export class AccountPage implements OnInit {

  constructor(
    private loginService: LoginService,
    private router: Router,
  ) {
    addIcons({logOutOutline});
  }

  ngOnInit() {
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

}
