import { Component, OnInit, Input } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonButton, IonButtons, IonIcon, IonInput, IonCard, IonCardContent, IonCheckbox, IonLabel
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Trip } from 'src/app/models/trip.model';
import { CommonModule } from '@angular/common';
import { MapSelectorModalPage } from '../map-selector-modal/map-selector-modal.component';


@Component({
  selector: 'app-edit-trip-modal',
  templateUrl: './edit-trip-modal.component.html',
  styleUrls: ['./edit-trip-modal.component.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonButton, IonButtons, IonIcon, IonInput, IonCard, IonCheckbox, IonCardContent, IonLabel,
    FormsModule, CommonModule
  ],
  providers: [ModalController],
})
export class EditTripModalComponent  implements OnInit {

  @Input() trip: Trip | null = null;

  // initialise values
  journeyName: string = "";
  currentTrip: boolean = false;
  locations: string[] = [];
  locationDates: string[] = [];
  dateStarted: string = "";
  complete: boolean = false;
  dateEnded: string = "";

  newLocation: string = "";
  newLocationDate: string = "";

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    if (this.trip) {
      // Open edit modal with passed trip data
      this.journeyName = this.trip.journeyName;
      this.currentTrip = this.trip.currentTrip;
      this.locations = this.trip.locations;
      this.locationDates = this.trip.locationDates;
      this.dateStarted = this.trip.dateStarted;
      this.complete = this.trip.complete;
      this.dateEnded = this.trip.dateEnded || ''; //account for no dateEnded date
    }
  }

  // add location based on input fields
  addLocation() {
    if (this.newLocation.trim()) {
      this.locations.push(this.newLocation.trim());
      this.locationDates.push(this.newLocationDate);
      this.newLocation = '';
    }
  }

  removeLocation(index: number) {
    this.locations.splice(index, 1);
    this.locationDates.splice(index, 1);
  }

  dismiss() {
    this.modalController.dismiss();
  }

  // Open map selector modal in select mode
  async mapSelector() {
    const modal = await this.modalController.create({
      component: MapSelectorModalPage,
      cssClass: 'map-selector-modal',
    });
    return await modal.present();
  }

  // update journey/trip with updated data
  updateJourney() {
    if (this.trip) {
      this.trip.journeyName = this.journeyName;
      this.trip.currentTrip = this.currentTrip;
      this.trip.locations = this.locations;
      this.trip.locationDates = this.locationDates;
      this.trip.dateStarted = this.dateStarted;
      
      if (this.complete) {
        this.trip.complete = true;
        this.trip.currentTrip = false; // set currentTrip to false if complete is true
      } else {
        this.trip.complete = false;
      }
      
      this.trip.dateEnded = this.dateEnded;

      this.modalController.dismiss(this.trip);
    }
  }

  
  
}
