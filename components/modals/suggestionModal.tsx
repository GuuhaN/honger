import L from "leaflet";
import React from "react";
import ReactModal from "react-modal";
import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Restaurant, Prisma } from "@prisma/client";
import "leaflet/dist/leaflet.css";
import { useForm } from "react-hook-form";

interface Props {
  isOpen: boolean;
  restaurants: Restaurant[];
  closeModal: any;
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

export default function SuggestionModal({
  isOpen,
  restaurants,
  closeModal,
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

  const icon = new L.Icon({
    iconUrl: "./marker.png",
    iconSize: new L.Point(25, 25),
    iconAnchor: [13, 41],
  });

  const location: LatLngExpression = [52.1072317, 5.0650176];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    if (
      restaurants.find(
        (restaurant: Restaurant) =>
          restaurant.name.replace(/\s/g, "").toLowerCase() ==
          data.suggestionName.replace(/\s/g, "").toLowerCase()
      ) != null
    ) {
      alert("This suggestion already exists!");
    } else {
      saveRestaurant({
        name: data.suggestionName ?? "",
      });
    }
  };

  return (
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
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="suggestionName"
              type="text"
              placeholder="Restaurant naam"
              {...register("suggestionName")}
            />
            <button
              className="border rounded border-black bg-green-200 p-2 self-center w-full"
              type="submit"
            >
              Suggestie toevoegen
            </button>
          </form>
        </div>
        <MapContainer
          center={location}
          zoom={16}
          style={{ width: "25vw", height: "50vh" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={location} icon={icon}>
            <Popup autoClose>Chief-IT HEUJ</Popup>
          </Marker>
        </MapContainer>
      </div>
    </ReactModal>
  );
}
