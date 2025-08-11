// set template for trips
export class Trip {
    constructor(
      public journeyName: string, 
      public currentTrip: boolean,
      public locations: string[], 
      public locationDates: string[],
      public locationLatLngs: string[],
      public dateStarted: string, 
      public complete: boolean,
      public dateEnded?: string,
    ) {}
  }
  