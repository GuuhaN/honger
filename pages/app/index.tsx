import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Confetti from "react-confetti";
import dynamic from "next/dynamic";
import { getRestaurant, getRestaurantRatings } from "../api/restaurant";
import { Restaurant } from "../../domains/restaurant";
const SuggestionModal = dynamic(
  () => import("../../components/modals/suggestionModal"),
  { ssr: false }
);
import { createRating } from "../api/rating";
import { RestaurantRating } from "../../domains/restaurantRating";
import Snowfall from "react-snowfall";
import DirectionModal from "../../components/modals/directionModal";
import { useAuth0 } from "@auth0/auth0-react";

export default function App() {
  const { isLoading, isAuthenticated, error, user, loginWithRedirect, logout } =
    useAuth0();
  const router = useRouter();

  const [openSuggestionModal, setOpenSuggestionModal] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>();
  const [randomNumber, setRandomNumber] = useState<number>(
    Math.max() * Math.random()
  );
  const [restaurantRating, setRestaurantRating] = useState<RestaurantRating>();
  const [rating, setRating] = useState(false);
  const [showDirections, setShowDirections] = useState(false);

  useEffect(() => {
    if (router.isReady && restaurants == null) {
      getRestaurant().then((response) => {
        setRestaurants(response);
      });

      setRandomNumber(Math.max() * Math.random());
    }
  }, [router.isReady, setRestaurants]);

  const rateRestaurant = (score: number) => {
    if (score <= 0 || score > 5) return;

    if (!restaurants) return;

    if (!restaurants[randomNumber]) return;

    createRating({
      id: "",
      restaurantId: restaurants[randomNumber].id,
      score: score,
    }).then((response) => {
      if (!response) return;
      alert(
        `Jij hebt ${restaurants[randomNumber].name} een ${score} hongurating gegeven.`
      );
      getRestaurantRatings(restaurants[randomNumber].id).then((response) => {
        setRestaurantRating(response);
      });
    });
  };

  return (
    <div className="flex bg-green-100 h-screen flex-col">
      <Snowfall />
      {restaurants &&
        restaurants[randomNumber]?.name
          .replace(/\s/g, "")
          .toLowerCase()
          .match("kfc") && (
          <>
            <Confetti
              className="h-screen w-screen"
              numberOfPieces={200}
              wind={0.025}
              gravity={0.05}
              style={{ zIndex: 0 }}
            />
            <audio src="audio/SIU.mp3" autoPlay></audio>
          </>
        )}
      {openSuggestionModal && (
        <SuggestionModal
          isOpen={openSuggestionModal}
          closeModal={() => setOpenSuggestionModal(false)}
          setRestaurants={setRestaurants}
        />
      )}
      {showDirections && restaurants && restaurants[randomNumber] && (
        <DirectionModal
          isOpen={showDirections}
          closeModal={() => setShowDirections(false)}
          placeId={restaurants[randomNumber].placeId}
        />
      )}
      <div className="flex flex-col justify-center m-auto gap-4">
        <div>
          <div className="text-5xl font-bold">{`Honger <°>`}</div>
          <div className="text-2xl font-light tracking-widest">Eten</div>
          <div className="text-xl font-light tracking-wide">Schuiven</div>
        </div>
        {isAuthenticated && (
          <div className="flex flex-col self-center gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex">
                <button
                  className="border rounded border-black bg-green-400 p-2 w-full"
                  type="submit"
                  onClick={() => {
                    let randNum = randomNumber;

                    if (restaurants && restaurants.length > 0) {
                      while (randNum === randomNumber) {
                        randNum = Math.floor(
                          Math.random() * restaurants.length
                        );
                        break;
                      }
                    }

                    if (restaurants) {
                      getRestaurantRatings(restaurants[randNum].id).then(
                        (response) => {
                          setRestaurantRating(response);
                        }
                      );
                    }
                    setRating(false);
                    setRandomNumber(randNum);
                  }}
                >
                  Waar gaan we eten
                </button>
              </div>
            </div>
            <button
              className="border rounded border-black bg-green-200 p-2 self-center w-full"
              onClick={() => setOpenSuggestionModal(true)}
            >
              Suggestie toevoegen
            </button>
          </div>
        )}
        {isAuthenticated && (
          <div className="self-center text-center gap-2 flex flex-col">
            <div className="text-3xl font-bold">Vandaag gaan we eten</div>
            <div className="text-2xl tracking-widest">
              {restaurants && restaurants[randomNumber]
                ? `${restaurants[randomNumber].name} (${
                    restaurantRating?.ratings &&
                    restaurantRating?.ratings.length > 0
                      ? `★${restaurantRating?.averageRating}`
                      : "No"
                  } hongurating 🧍)`
                : "Nog geen idee"}
            </div>
            {restaurants && restaurants[randomNumber] && (
              <div className="flex flex-col gap-2">
                <div className="text-xl tracking-widest">
                  {restaurants[randomNumber].address}
                </div>
                <div className="flex flex-row justify-center gap-x-2">
                  {rating ? (
                    <div className="flex flex-row justify-center gap-x-4">
                      {Array(5)
                        .fill(0)
                        .map((item, index) => (
                          <div
                            key={index}
                            className="text-xl font-extralight cursor-pointer hover:font-bold"
                            onClick={() => rateRestaurant(index + 1)}
                          >
                            {index + 1}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <>
                      <button
                        className="border rounded border-black bg-green-400 self-center w-32"
                        onClick={() => setRating(true)}
                      >
                        Hongurate geven
                      </button>
                      <button
                        className="border rounded border-black bg-green-400 self-center w-32"
                        onClick={() => setShowDirections(true)}
                      >
                        Route laten zien
                      </button>
                      {/* <button className="border rounded border-black bg-green-400 self-center w-32">
                      Make reservation
                    </button> */}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {!isAuthenticated && (
          <>
            <button
              className="border rounded border-black bg-green-400 p-2 w-full"
              type="submit"
              onClick={() => loginWithRedirect()}
            >
              Login
            </button>
            <button
              className="border rounded border-black bg-green-200 p-2 w-full"
              type="submit"
            >
              Register
            </button>
          </>
        )}
      </div>
    </div>
  );
}
