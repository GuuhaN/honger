import { useEffect, useState } from "react";
import { Prisma, Restaurant } from "@prisma/client";
import { useRouter } from "next/router";
import prisma from "../../components/prisma";
import Confetti from "react-confetti";
import dynamic from "next/dynamic";
const SuggestionModal = dynamic(
  () => import("../../components/modals/suggestionModal"),
  { ssr: false }
);

export async function getServerSideProps() {
  const restaurants: Restaurant[] = await prisma.restaurant.findMany();
  // const restaurants: Restaurant[] = [];

  return {
    props: {
      restaurants: restaurants,
    },
  };
}

async function saveRestaurant(restaurant: Prisma.RestaurantCreateInput) {
  if (!restaurant.name) {
    alert("Suggestion cannot be empty");
    return;
  }

  const response = await fetch("api/restaurant", {
    method: "POST",
    body: JSON.stringify(restaurant),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  alert(`${restaurant.name} added!`);

  return await response.json();
}

export default function App({ restaurants }: any) {
  const router = useRouter();

  const [suggestionInput, setSuggestionInput] = useState<string>();
  const [randomNumber, setRandomNumber] = useState<number>(
    restaurants.length + 1
  );

  const [openSuggestionModal, setOpenSuggestionModal] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    setRandomNumber(restaurants.length + 1);
  }, [restaurants]);

  return (
    <div className="flex bg-green-100 h-screen">
      {restaurants[randomNumber]?.name.replace(/\s/g, "").toLowerCase() ===
        "kfc" && (
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
          restaurants={restaurants}
          closeModal={() => setOpenSuggestionModal(false)}
        />
      )}
      <div className="flex flex-col justify-center m-auto gap-4">
        <div className="flex flex-col self-center gap-4">
          <div className="flex flex-col gap-2">
            <div className="text-5xl font-bold">{`Honger <°>`}</div>
            <div className="text-2xl font-light tracking-widest">Eten</div>
            <div className="text-xl font-light tracking-wide">Schuiven</div>
            <div className="flex">
              <button
                className="border rounded border-black bg-green-400 p-2 w-full"
                type="submit"
                onClick={() => {
                  let randNum = randomNumber;

                  while (randNum === randomNumber) {
                    randNum = Math.floor(Math.random() * restaurants.length);
                  }

                  setRandomNumber(randNum);
                }}
              >
                Waar gaan we eten
              </button>
            </div>
          </div>

          {/* <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="suggestionName"
              type="text"
              placeholder="Restaurant naam"
              onChange={(event) => setSuggestionInput(event.target.value)}
            /> */}
          {/* <button
              className="border rounded border-black bg-green-200 p-2 self-center w-full"
              onClick={() => {
                if (
                  restaurants.find(
                    (restaurant: Restaurant) =>
                      restaurant.name.replace(/\s/g, "").toLowerCase() ==
                      suggestionInput?.replace(/\s/g, "").toLowerCase()
                  ) != null
                ) {
                  alert("This suggestion already exists!");
                } else {
                  saveRestaurant({
                    name: suggestionInput ?? "",
                  }).then(() => {
                    router.replace(router.asPath);
                  });
                }
              }}
            >
              Suggestie toevoegen
            </button> */}
          <button
            className="border rounded border-black bg-green-200 p-2 self-center w-full"
            onClick={() => setOpenSuggestionModal(true)}
          >
            Suggestie toevoegen
          </button>
        </div>
        <div className="self-center text-center">
          <div className="text-3xl font-bold">Vandaag gaan we eten</div>
          <div className="text-2xl tracking-widest">
            {restaurants[randomNumber]
              ? restaurants[randomNumber].name
              : "Nog geen idee"}
          </div>
        </div>
      </div>
    </div>
  );
}
