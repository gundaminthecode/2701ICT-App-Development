import { Injectable } from '@angular/core';
import { Trip } from '../models/trip.model';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular/standalone';
import { ImageServiceService } from './image-service.service';


@Injectable({
  providedIn: 'root'
})

export class TripServiceService {

  onTrip = false;
  STORAGE_KEY = 'allTrips'

  constructor(private storage: Storage, private alertController: AlertController, private imageService: ImageServiceService) { }

  async initialiseStorage() {
    const trips = await this.storage.get(this.STORAGE_KEY);
    if (trips) {
      this.allTrips = trips;
    }
  }

  // generate temporary filler trips
  allTrips: Trip[] = [
    new Trip(
      'Europe', 
      false,
      ['Copenhagen 1', 'Oslo 2', 'Stockholm 3'], 
      ['2024-01-01', '2024-01-02', '2024-01-03'], 
      ['55.676098, 12.568337', '59.911491, 10.757933', '59.3293, 18.0686'],
      '2024-01-01', 
      true, 
      '2024-01-03'
    ),
    new Trip(
      'America', 
      false,
      ['New York 1', 'Los Angeles 2', 'Washington DC 3'], 
      ['2024-02-01', '2024-02-02', '2024-02-03'],
      ['40.7128, 74.0060', '34.0549, 118.2426', '38.9072, 77.0369'], 
      '2024-02-01', 
      true, 
      '2024-02-03'
    ),
  ];

  // create new trip and set tell app that user is on a trip
  createTrip(){
    this.onTrip = true;
  }

  // New Trip alert box, replaces prompt
  async addNewTrip(){
    const alert = await this.alertController.create({
      header: 'New Trip',
      inputs: [
        {
          name: 'journeyName',
          type: 'text',
          placeholder: 'Enter journey name'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Ok',
          handler: (data) => {
            if (data.journeyName) {
              const currentDate = new Date();
              const dateStarted = currentDate.toISOString().split('T')[0];// remove time from date
              const newTrip = new Trip(data.journeyName, true, [], [], [], dateStarted, false); // preliminary values
              this.addTrip(newTrip); // push new trip to allTrips
              this.createTrip();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  // check if onTrip exists
  tripExists(): boolean {
    return this.onTrip;
  }

  // when creating new trip, add to list of allTrips
  addTrip(newTrip: Trip) {
    this.allTrips.push(newTrip);
  }

  getCurrentTrip(){
    return this.allTrips.find(trip => trip.complete === false);
  }

  getCurrentTripId(): number {
    const currentTrip = this.getCurrentTrip();
    if (currentTrip) {
      // Assuming `allTrips` contains the trips and `currentTrip` can be identified by its index
      const index = this.allTrips.findIndex(trip => trip === currentTrip);
      return index;  // This assumes index will always be valid
    }
    throw new Error("No current trip available");
  }

  getThisTripId(thisTrip: Trip): number {
    const trip = thisTrip;
    if (trip){
      const tripIndex = this.allTrips.findIndex(trip => trip === thisTrip);
      return tripIndex;
    }
    throw new Error("Trip Index not Available");
  }

  getCurrentTripLocationIds(): number[] {
    const currentTrip = this.getCurrentTrip();
    if (currentTrip) {
      // Return an array of indices based on the length of the locations array
      return currentTrip.locations.map((_, index) => index);
    }
    return []; // Return an empty array if there is no current trip
  }
  

  addLocation(location: string, date: string, markerLatLng: string) {
    const currentTrip = this.getCurrentTrip();
    if (currentTrip) {
      currentTrip.locations.push(location);
      currentTrip.locationDates.push(date);
      currentTrip.locationLatLngs.push(markerLatLng);
      this.saveTrips();
    }
  }

  removeLocation(index: number) {
    const currentTrip = this.getCurrentTrip();
    if (currentTrip) {
      currentTrip.locations.splice(index, 1);
      currentTrip.locationDates.splice(index, 1);
      currentTrip.locationLatLngs.splice(index, 1);
      this.saveTrips();
    }
  }

  // update trip with new info
  updateTrip(updatedTrip: Trip) {
    const index = this.allTrips.findIndex(trip => trip.journeyName === updatedTrip.journeyName && trip.dateStarted === updatedTrip.dateStarted); // check if trip being passed is the same as existing trip
    if (index !== -1) { //checks if index is valid
      this.allTrips[index] = updatedTrip;
      this.saveTrips(); // Save the updated trips to storage
    }
  }

  async removeTrip(trip: Trip) {
    const index = this.allTrips.findIndex(t => t.journeyName === trip.journeyName && t.dateStarted === trip.dateStarted);
    if (index !== -1) {
      this.allTrips.splice(index, 1);
      this.saveTrips();

      await this.imageService.removeImagesByJourneyId(index);
    }
  }

  // All dates when a location was visited
  allDates(): string[] {
    return this.allTrips
      .map(trip => trip.locationDates)
      .reduce((acc, dates) => acc.concat(dates), []);
  }

  // Generates list of months that have any locations visited
  getMonthlyVisits() {
    const allDates = this.allDates();
    const monthCounts: { [key: string]: number } = {};

    allDates.forEach(date => {
      const month = new Date(date).toLocaleString('default', { month: 'long' });
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });

    const labels = Object.keys(monthCounts);
    const data = Object.values(monthCounts);

    return { labels, data };
  }

  private async saveTrips() {
    await this.storage.set(this.STORAGE_KEY, this.allTrips);
  }
  
}
