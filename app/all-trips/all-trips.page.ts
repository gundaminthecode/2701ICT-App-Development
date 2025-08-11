import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonItemOptions, IonItemOption, IonItem, IonList, IonItemSliding,
  IonGrid, IonRow, IonCol, 
} from '@ionic/angular/standalone';
import { TripServiceService } from '../services/trip-service.service';
import { Trip } from '../models/trip.model';
import { Chart } from 'chart.js/auto';
import { ElementRef } from '@angular/core';
import { JourneyCardComponent } from '../journey-card/journey-card.component';

import { EditTripModalComponent } from '../modals/edit-trip-modal/edit-trip-modal.component';

@Component({
  selector: 'app-all-trips',
  templateUrl: './all-trips.page.html',
  styleUrls: ['./all-trips.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonToolbar, IonItemOptions, IonItemOption, IonItem, IonList, IonItemSliding,
    IonGrid, IonRow, IonCol,
    CommonModule, FormsModule, JourneyCardComponent
  ],
  providers: [ModalController],
})
export class AllTripsPage implements OnInit {

  allTrips: Trip[] = [];

  constructor(public tripService: TripServiceService, private modalController: ModalController, private readonly elementRef: ElementRef) {
    this.canvas = elementRef;
  }

  @ViewChild('monthChart', {static:true}) canvas: ElementRef;
  chart: any;
  labels: string[] = [];
  data: number[] = [];


  ngOnInit() {
    this.loadTrips();
    this.loadMonthlyVisits();
    this.initialiseChart();
  }

  //Draw Chart from location dates
  initialiseChart(){
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Location Visits Per Month',
          data: this.data,
        }]
      },
    });
  }

  loadMonthlyVisits() {
    const { labels, data } = this.tripService.getMonthlyVisits(); //retrieve month labels and location visits per month
    this.labels = labels;
    this.data = data;
  }

  //Load all trips
  async loadTrips() {
    await this.tripService.initialiseStorage();
    this.allTrips = this.tripService.allTrips;
  }

  //Open Edit Trip Modal and pass selected trip's data
  async editTrip(trip: Trip) {
    const modal = await this.modalController.create({
      component: EditTripModalComponent,
      componentProps: {
        trip: trip // pass any necessary data to edit trip
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      // update trip with edited info with close of modal
      this.tripService.updateTrip(data);
      this.loadTrips(); // Reload trips after updating
    }
  }
}