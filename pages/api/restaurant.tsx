import axios from "axios";
import { Restaurant } from "../../domains/restaurant";
import { RestaurantRating } from "../../domains/restaurantRating";

export async function getRestaurant() {
  return await axios
    .get<Restaurant[]>(`${process.env.NEXT_PUBLIC_BASE_URL}/Restaurants`)
    .then((response) => {
      return response.data as Restaurant[];
    });
}

export async function createRestaurant(restaurant: Restaurant) {
  if (restaurant.name.length <= 0) {
    alert("Restaurant name cannot be empty");
    return;
  }

  return await axios
    .post(`${process.env.NEXT_PUBLIC_BASE_URL}/Restaurants`, {
      name: restaurant.name,
      address: restaurant.address,
    })
    .then((data) => {
      return data;
    });
}

export async function getRestaurantRatings(restaurantId: string) {
  return await axios
    .get<RestaurantRating>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/Restaurants/${restaurantId}/ratings`
    )
    .then((response) => {
      return response.data as RestaurantRating;
    });
}
