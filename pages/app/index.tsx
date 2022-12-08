import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Confetti from "react-confetti";
import dynamic from "next/dynamic";
import { get } from "../api/restaurant";
import { Restaurant } from "../../domains/restaurant";
const SuggestionModal = dynamic(
  () => import("../../components/modals/suggestionModal"),
  { ssr: false }
);

export default function App() {
  const router = useRouter();

  const [openSuggestionModal, setOpenSuggestionModal] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>();
  const [randomNumber, setRandomNumber] = useState<number>(
    Math.max() * Math.random()
  );

  useEffect(() => {
    if (router.isReady && restaurants == null) {
      get().then((response) => {
        setRestaurants(response);
      });

      setRandomNumber(Math.max() * Math.random());
    }
  }, [router.isReady, setRestaurants]);

  return (
    <div className="flex bg-green-100 h-screen">
      {restaurants &&
        restaurants[randomNumber]?.name.replace(/\s/g, "").toLowerCase() ===
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
          closeModal={() => setOpenSuggestionModal(false)}
          setRestaurants={setRestaurants}
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
                    if (restaurants && restaurants.length > 0) {
                      randNum = Math.floor(Math.random() * restaurants.length);
                      break;
                    }
                  }

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
        <div className="self-center text-center">
          <div className="text-3xl font-bold">Vandaag gaan we eten</div>
          <div className="text-2xl tracking-widest">
            {restaurants && restaurants[randomNumber]
              ? restaurants[randomNumber].name
              : "Nog geen idee"}
          </div>
        </div>
      </div>
    </div>
  );
}
