import { useState } from "react";
import { PrismaClient, Restaurant, Prisma } from "@prisma/client";

export async function getServerSideProps() {
  const prisma = new PrismaClient();
  // const restaurants: Restaurant[] = await prisma.restaurant.findMany();
  const restaurants: Restaurant[] = [];

  return {
    props: {
      restaurants: restaurants,
    },
  };
}

async function saveRestaurant(restaurant: Prisma.RestaurantCreateInput) {
  if (!restaurant.name) {
    throw new Error("Suggestion cannot be empty");
  }

  const response = await fetch("api/restaurant", {
    method: "POST",
    body: JSON.stringify(restaurant),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  await getServerSideProps();

  return await response.json();
}

export default function App({ restaurants }: any) {
  const [restaurant] = useState<Restaurant[]>(restaurants);
  const [suggestionInput, setSuggestionInput] = useState<string>();

  const [randomNumber, setRandomNumber] = useState<number>(
    restaurant.length + 1
  );

  return (
    <div className="flex bg-green-100 h-screen">
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
                onClick={() =>
                  setRandomNumber(
                    Math.floor(Math.random() * restaurants.length)
                  )
                }
              >
                Waar gaan we eten
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="suggestionName"
              type="text"
              placeholder="Restaurant naam"
              onChange={(event) => setSuggestionInput(event.target.value)}
            />
            <button
              className="border rounded border-black bg-green-200 p-2 self-center w-full"
              onClick={() => saveRestaurant({ name: suggestionInput ?? "" })}
            >
              Suggestie toevoegen
            </button>
          </div>
        </div>
        <div className="self-center text-center">
          <div className="text-3xl font-bold">Vandaag gaan we eten</div>
          <div className="text-2xl tracking-widest">
            {restaurant[randomNumber]
              ? restaurant[randomNumber].name
              : "Nog geen idee"}
          </div>
        </div>
      </div>
    </div>
  );
}
