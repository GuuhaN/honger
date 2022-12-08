import L from "leaflet";
import React from "react";
import ReactModal from "react-modal";
import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useForm } from "react-hook-form";
import { Restaurant } from "../../domains/restaurant";
import { create, get } from "../../pages/api/restaurant";

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
  } = useForm<Restaurant>();

  const onSubmit = async (data: Restaurant) => {
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
      data.postCode = "3542AB";
      data.houseNumber = 50;
      data.address = "Atoomweg 50";
      await create(data).then((response) => {
        get().then((response) => {
          setRestaurants(response);
        });

        if (response) {
          closeModal();
        }
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
              id="name"
              type="text"
              placeholder="Restaurant naam"
              {...register("name")}
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
          className="w-full"
          style={{ minWidth: "25vw", height: "50vh" }}
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
