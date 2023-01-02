import {
  GoogleMap,
  useJsApiLoader,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import ReactModal from "react-modal";
import { useEffect, useState } from "react";
import { LatLng } from "../../domains/restaurant";
import { useRouter } from "next/router";
import Head from "next/head";
interface Props {
  isOpen: boolean;
  closeModal: any;
  placeId: string;
}

export default function DirectionModal({ isOpen, closeModal, placeId }: Props) {
  const [route, setRoute] = useState(null);
  const [routeLatLng, setRouteLatLng] = useState<LatLng>();
  const [currentLocation, setCurrentLocation] = useState<LatLng>();
  const [travelMode, setTravelMode] = useState<google.maps.TravelMode>(
    google.maps.TravelMode.DRIVING
  );
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? "",
  });

  const router = useRouter();

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

  const geocoder = new google.maps.Geocoder();

  useEffect(() => {
    if (!router.isReady) return;

    if (routeLatLng) return;

    if (currentLocation) return;

    navigator.geolocation.getCurrentPosition((location) => {
      setCurrentLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    });

    if (!placeId) return;

    geocoder.geocode({ placeId: placeId }).then((response) =>
      setRouteLatLng({
        lat: response.results[0].geometry.location.lat(),
        lng: response.results[0].geometry.location.lng(),
      })
    );
  }, [routeLatLng, placeId, router.isReady]);

  const callback = (routeResult: any) => {
    if (!routeLatLng) return;
    if (routeResult.status != google.maps.DirectionsStatus.OK) return;
    if (route) return;

    setRoute(routeResult);
  };

  console.log(
    navigator.geolocation.getCurrentPosition((lol) => {
      console.log(lol.coords.latitude);
    })
  );
  return (
    <>
      <Head>
        <title>Route restaurant</title>
      </Head>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customStyles}
        ariaHideApp={false}
        shouldCloseOnEsc
      >
        <div className="text-2xl font-bold">Route</div>
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{ minWidth: "40vw", minHeight: "50vh" }}
            center={{ lat: 52.107376648427135, lng: 5.065017598461061 }}
            zoom={15}
            options={{ streetViewControl: false }}
          >
            {routeLatLng && (
              <DirectionsService
                callback={callback}
                options={{
                  origin: {
                    lat: currentLocation?.lat ?? 0,
                    lng: currentLocation?.lng ?? 0,
                  },
                  destination: {
                    lat: routeLatLng?.lat ?? 0,
                    lng: routeLatLng?.lng ?? 0,
                  },
                  travelMode: travelMode,
                }}
              />
            )}
            {route && (
              <DirectionsRenderer
                options={{
                  directions: route,
                  polylineOptions: {
                    strokeColor:
                      travelMode === google.maps.TravelMode.DRIVING
                        ? "#0000F2"
                        : "#FF0000",
                  },
                }}
              />
            )}
          </GoogleMap>
        )}
        <div className="flex flex-row justify-evenly">
          <button
            className="border rounded border-black bg-green-400 self-center w-32"
            onClick={() => setTravelMode(google.maps.TravelMode.BICYCLING)}
          >
            Op de fiets
          </button>
          <button
            className="border rounded border-black bg-green-400 self-center w-32"
            onClick={() => setTravelMode(google.maps.TravelMode.DRIVING)}
          >
            Met je auto
          </button>
          <button
            className="border rounded border-black bg-green-400 self-center w-32"
            onClick={() => setTravelMode(google.maps.TravelMode.WALKING)}
          >
            Lekker lopen
          </button>
        </div>
      </ReactModal>
    </>
  );
}
