export interface Point {
    type: string;
    coordinates: [number, number];
  }
  
  export interface Restaurant {
    id: string;
    name: string;
    description: string;
    cuisineType: string[];
    location: Point;
    createdAt: string;
  }