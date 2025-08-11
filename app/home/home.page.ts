import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonCard, IonCardHeader, IonCardContent, IonCardSubtitle, IonCardTitle, IonItem, IonList, IonSelectOption, IonThumbnail, IonSelect,
  IonLabel, IonInput,
} from '@ionic/angular/standalone';
import { TripServiceService } from '../services/trip-service.service';
import { ModalController } from '@ionic/angular';
import { MapSelectorModalPage } from '../modals/map-selector-modal/map-selector-modal.component';
import { MarkerServiceService } from '../services/marker-service.service';
import { ImageServiceService } from '../services/image-service.service';
import { Image } from '../models/images.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonCard, IonCardHeader, IonCardContent, IonCardSubtitle, IonCardTitle, IonItem, IonList, IonSelectOption, IonThumbnail, IonSelect,
    IonLabel, IonInput,
    FormsModule, CommonModule
  ],
  providers: [ModalController]
})
export class HomePage implements OnInit {

  newLocation: string = "";
  newLocationDate: string = "";

  imageName: string = "";
  selectedLocationIndex: number | null = null;  // Default to null or a valid index if known
  preparedImageFile?: File;

  currentTripImages: Image[] = [];
  imageGroups: { [key: number]: Image[]} = {};

  constructor(
    public tripService: TripServiceService,
    private modalController: ModalController,
    private markerService: MarkerServiceService,
    private imageService: ImageServiceService
  ) {}
  
  ngOnInit() {
    this.tripService.initialiseStorage();
    this.newLocation = '';
    this.newLocationDate = '';
  }

  ionViewWillEnter() {
    this.refreshData();
    
  }

  async refreshData() {
    await this.tripService.initialiseStorage(); // Refresh the data from storage
    await this.loadCurrentTripImages(); // Refresh Displayed Images
  }

  createTrip(){
    this.tripService.createTrip();
  }

  addNewTrip() {
    this.tripService.addNewTrip();
  }

  // Retrieve Current Trip's Location dates
  getCurrentTripLocationDates(index: number): string | undefined {
    const currentTrip = this.tripService.getCurrentTrip();
    if (currentTrip && currentTrip.locationDates) {
       return currentTrip.locationDates[index];
    }
    return undefined;
   }

   // Retrieve Current Trip's Location Latitude and Longitudes for use with map selector modal
   getCurrentTripLocationLatLngs(index: number): string | undefined {
    const currentTrip = this.tripService.getCurrentTrip();
    if (currentTrip && currentTrip.locationLatLngs) {
       return currentTrip.locationLatLngs[index];
    }
    return undefined;
   }

  // get inputed data and push to location fields 
  addLocation() {
    if (this.newLocation.trim()) {
      const markerLatLng = this.markerService.markerLatLng; // Get marker's LatLng from TripServiceService
      this.tripService.addLocation(this.newLocation.trim(), this.newLocationDate, markerLatLng);
      this.newLocation = '';
      this.newLocationDate = '';
    }
  }

  removeLocation(index: number) {
    this.tripService.removeLocation(index);
  }

  // Open map selector modal in view mode
  async viewLocation(index: number) {
    const currentTrip = this.tripService.getCurrentTrip();
    if (currentTrip) {
      const latLng = currentTrip.locationLatLngs[index];
      //console.log(latLng)
      const locationName = currentTrip.locations[index];

      const modal = await this.modalController.create({
        component: MapSelectorModalPage,
        cssClass: 'map-selector-modal',
        componentProps: {
          defaultLatLng: latLng,
          locationName: locationName,
        }
      });
      return await modal.present();
    }
  }

  // Open mapSelector modal in select mode
  async mapSelector() {
    const modal = await this.modalController.create({
      component: MapSelectorModalPage,
      cssClass: 'map-selector-modal',
    });
    return await modal.present();
  }

  // Gather Data from uploaded image
  prepareImage(event: Event) {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (files && files.length > 0) {
        this.preparedImageFile = files[0];
    } else {
        this.preparedImageFile = undefined;
        //console.error('No file selected or file access was blocked.');
    }
  }

  // Used for debugging when image location has been changed
  onLocationSelectChange() {
    //console.log("Selected Location Index Changed:", this.selectedLocationIndex);
  }

  async uploadImage() {
    // console.log('File Prepared:', this.preparedImageFile);
    // console.log('Image Name:', this.imageName);
    // console.log('Selected Location Index:', this.selectedLocationIndex);

    // Check if all input fields are met  
    if (this.preparedImageFile && this.imageName && this.selectedLocationIndex !== undefined && this.selectedLocationIndex !== null) {
      const file = this.preparedImageFile;
      const imageName = this.imageName;
      const locationIndex = this.selectedLocationIndex;
  
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const imageURL = fileReader.result as string;
        const journeyId = this.tripService.getCurrentTripId();
        const locationIds = this.tripService.getCurrentTripLocationIds();
        const locationId = locationIds[locationIndex];
        const newImage = new Image(journeyId, locationId, imageURL, imageName);
        await this.imageService.addImage(newImage);// Add new image into storage
        this.loadCurrentTripImages();
      };
      fileReader.readAsDataURL(file);
  
      // Reset the file input and image name after upload
      this.preparedImageFile = undefined;
      this.imageName = '';
      const fileInputElement = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInputElement) {
        fileInputElement.value = ''; // Safely clear the file input after upload
      } else {
        console.error("Failed to clear the file input because it was not found.");
      }
    } else {
      console.error("No file prepared, image name missing, or location not selected.");
    }
  }
  
  // Load all images associated with Trip
  async loadCurrentTripImages() {
    const currentTripId = this.tripService.getCurrentTripId();
    this.currentTripImages = await this.imageService.getImagesForCurrentTrip(currentTripId);
    this.updateImageGroups();
  }

  //Group images based on location association
  updateImageGroups() {
    const groupedImages: { [key: number]: Image[] } = {};
    this.currentTripImages.forEach(image => {
      if (!groupedImages[image.locationId]) {
        groupedImages[image.locationId] = [];
      }
      groupedImages[image.locationId].push(image);
    });
    this.imageGroups = groupedImages;
  }

}
