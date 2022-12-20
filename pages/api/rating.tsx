import axios from "axios";
import { stringify } from "querystring";
import { Rating } from "../../domains/rating";

export async function getRatings() {
  return await axios
    .get<Rating[]>(`${process.env.NEXT_PUBLIC_BASE_URL}/Ratings`)
    .then((response) => {
      return response.data as Rating[];
    });
}

export async function createRating(rating: Rating) {
  if (rating.restaurantId == "") {
    alert("Restaurant Id cannot be empty");
    return;
  }

  return await axios
    .post(`${process.env.NEXT_PUBLIC_BASE_URL}/Ratings`, {
      score: rating.score,
      restaurantId: rating.restaurantId,
    })
    .then((data) => {
      return data;
    })
    .catch(() =>
      alert("You already voted on this restaurant today, come back tomorrow :)")
    );
}
