import { useState } from "react";

export default function App() {
  const suggestions: string[] = [
    "Wagamama",
    "Loetje",
    "KFC",
    "Tai Soen",
    "Key West Beachhouse",
    "Vineyard",
    "The Streetfood Club",
    "Jumbo Foodmarkt",
  ];

  const [randomNumber, setRandomNumber] = useState<number>(
    suggestions.length + 1
  );

  return (
    <div className="flex bg-green-100 h-screen">
      <div className="flex flex-col justify-center m-auto gap-4">
        <div className="flex flex-col self-center gap-2">
          <div className="text-5xl font-bold">{`Honger <^>`}</div>
          <div className="text-2xl font-light tracking-widest">Eten</div>
          <div className="text-xl font-light tracking-wide">Schuiven</div>
          <div className="flex gap-4">
            <button
              className="border rounded border-black bg-green-400 p-2"
              type="submit"
              onClick={() =>
                setRandomNumber(Math.floor(Math.random() * suggestions.length))
              }
            >
              Waar gaan we eten
            </button>
            <button
              className="border rounded border-black bg-green-400 p-2"
              type="submit"
              disabled
            >
              Wat gaan we eten
            </button>
          </div>
          <button className="border rounded border-black bg-green-200 p-2 self-center">
            Suggestie toevoegen
          </button>
        </div>
        <div className="self-center text-center">
          <div className="text-2xl font-bold">Vandaag gaan we eten</div>
          <div className="text-xl tracking-wide">
            {suggestions[randomNumber]
              ? suggestions[randomNumber]
              : "Nog geen idee"}
          </div>
        </div>
      </div>
    </div>
  );
}
