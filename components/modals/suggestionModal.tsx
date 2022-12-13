import React, { useCallback } from "react";
import ReactModal from "react-modal";
import { useForm } from "react-hook-form";
import { Restaurant } from "../../domains/restaurant";
import { create, get } from "../../pages/api/restaurant";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import Head from "next/head";

interface Props {
  isOpen: boolean;
  closeModal: any;
  setRestaurants: any;
}

export default function SuggestionModal({
  isOpen,
  closeModal,
  setRestaurants,
}: Props) {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      backgroundColor: "rgba(255, 255, 255, 0.75)",
      padding: "12px",
    },
  };

  const containerStyle = {
    minWidth: "40vw",
    minHeight: "50vh",
  };

  const center = {
    lat: 52.107376648427135,
    lng: 5.065017598461061,
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Restaurant>();

  const onSubmit = async (data: Restaurant) => {
    if (!data) {
      return;
    }

    if (!data.name || !data.address) {
      return;
    }

    let foundRestaurants: Restaurant[] = [];

    await get().then((response) => {
      foundRestaurants = response;
    });

    if (
      foundRestaurants &&
      foundRestaurants.find(
        (restaurant: Restaurant) =>
          restaurant.name.replace(/\s/g, "").toLowerCase() ==
          data.name.replace(/\s/g, "").toLowerCase()
      ) != null
    ) {
      alert("This suggestion already exists!");
    } else {
      await create({
        id: "",
        name: data.name,
        address: data.address,
      }).then((response) => {
        get().then((response) => {
          setRestaurants(response);
        });
        if (response) {
          alert(`Added ${data.name} - ${data.address}`);
        }
      });
    }
  };

  const { placesService } = usePlacesService({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  });

  const onMapClick = async (details: google.maps.places.PlaceResult) => {
    if (!details) {
      return;
    }

    if (!details.types?.includes("restaurant")) {
      return;
    }

    if (!details.name && details.formatted_address) {
      return;
    }

    setValue("name", details.name ?? "");
    setValue("address", details.formatted_address ?? "");
  };

  return (
    <>
      <Head>
        <title>Search restaurants</title>
      </Head>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customStyles}
        ariaHideApp={false}
        shouldCloseOnEsc
      >
        <div className="p-2 space-y-2">
          <div className="text-2xl font-bold">Restarant Suggestie</div>
          <div className="flex flex-col">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={15}
                  options={{ streetViewControl: false }}
                  onClick={(event) => {
                    let clickEvent: google.maps.IconMouseEvent =
                      event as google.maps.IconMouseEvent;

                    if (!clickEvent.placeId) {
                      return;
                    }

                    placesService?.getDetails(
                      {
                        placeId: clickEvent.placeId,
                      },
                      (details) => {
                        if (!details) {
                          return;
                        }

                        onMapClick(details);
                      }
                    );
                  }}
                >
                  <></>
                </GoogleMap>
              ) : (
                <></>
              )}
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Restaurant naam"
                {...register("name")}
                disabled
              />
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Adres"
                {...register("address")}
                disabled
              />
              <button
                className="border rounded border-black bg-green-200 p-2 self-center w-full"
                type="submit"
              >
                Suggestie toevoegen
              </button>
            </form>
          </div>
        </div>
      </ReactModal>
    </>
  );
}
