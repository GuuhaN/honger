import axios from "axios";
import { Restaurant } from "../../domains/restaurant";

export async function get() {
  return await axios
    .get<Restaurant[]>(`${process.env.NEXT_PUBLIC_BASE_URL}/Restaurants`)
    .then((response) => {
      return response.data as Restaurant[];
    });
}

export async function create(restaurant: Restaurant) {
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
