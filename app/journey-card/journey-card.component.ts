import { Component, OnInit, Input } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonButton, IonButtons, IonIcon, IonInput, IonCard, IonCardContent, IonCheckbox, IonLabel, IonCardHeader, IonCardTitle, IonCardSubtitle, IonItemOption, IonItemOptions, IonThumbnail
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AllTripsPage } from '../all-trips/all-trips.page';
import { Trip } from '../models/trip.model';
import { TripServiceService } from '../services/trip-service.service';
import { addIcons } from 'ionicons';
import { chevronDown, chevronUp } from 'ionicons/icons';
import { AlertController } from '@ionic/angular';
import { Image } from '../models/images.model';
import { ImageServiceService } from '../services/image-service.service';

@Component({
  selector: 'app-journey-card',
  templateUrl: './journey-card.component.html',
  styleUrls: ['./journey-card.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonButton, IonButtons, IonIcon, IonInput, IonCard, IonCardContent, IonCheckbox, IonLabel, IonCardHeader, IonCardTitle, IonCardSubtitle, IonItemOption, IonItemOptions, IonThumbnail,
    FormsModule, CommonModule
  ]
})
export class JourneyCardComponent implements OnInit{
  @Input() journeyName!: string;
  @Input() journeyNumber!: number;
  @Input() locationsVisited!: number;
  @Input() trip!: any;

  dropdownVisible = false;
  imagesDropdownVisible = false;

  images: Image[] = [];

  constructor(
    private allTripsPage: AllTripsPage,
    private tripService: TripServiceService,
    private alertController: AlertController,
    private imageService: ImageServiceService
  ) {
    addIcons({ chevronDown, chevronUp });
  }

  ngOnInit(): void {
    this.loadImages();
  }

  async loadImages() {
    if (this.trip) {
      this.images = await this.imageService.getImagesForCurrentTrip(this.tripService.getThisTripId(this.trip));
    }
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  toggleImagesDropdown() {
    this.imagesDropdownVisible = !this.imagesDropdownVisible;
  }

  editTrip(trip: Trip){
    this.allTripsPage.editTrip(trip)
  }

  deleteTrip(trip: Trip){
    this.tripService.removeTrip(trip)
  }

  async shareTrip() {
    const alert = await this.alertController.create({
      header: 'Share',
      message: 'Shared Successfully!',
      buttons: ['OK']
    });

    await alert.present();
  }
}
