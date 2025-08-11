// set template for images
export class Image {
    constructor(
      public journeyId: number, 
      public locationId: number,
      public imageURL: string, 
      public imageName: string,
    ) {}
  }