export interface Point {
    type: string;
    coordinates: [number, number];
  }
  
  export interface Restaurant {
    name: string;
    description: string;
    cuisineType: string[];
    location: Point;
    createdAt: string;
  }