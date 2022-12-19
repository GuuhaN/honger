import { Rating } from "./rating";

export interface RestaurantRating {
  restaurant: string;
  averageRating: number;
  ratings: Rating[];
}
