import { useEffect, useState } from "react";
import { Vehicle } from "../components/vehicle";
import RideBookingCard from "../components/ride-booking-card";
import { gsap } from "gsap";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
const socket = io(import.meta.env.VITE_SERVER_URL); //this will connect the socket to our backen and we are connected to the server

export const Home = ({}: any) => {
  const [fullscreen, setFullscreen] = useState(false);
  const [pickupPoint, setPickupPoint] = useState("Jaipur");
  const [destinationPoint, setDestinationPoint] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [vehicle_type, setVehicle_type] = useState("");
  const [inputSelected, setInputSelected] = useState(false);
  const [travellingData, setTravellingData] = useState({
    distance: "",
    fairPrices: { bike: 0, car: 0, auto: 0 },
  });
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("userConnected", "userConnected");
  }, []);

  const newRide = async () => {
    if (!pickupPoint || !destinationPoint || !vehicle_type) {
      console.error("Missing required fields for a new ride.");
      return;
    }
    try {
      const response = await fetch(
        "https://uber-riding-app.onrender.com/users/createride",
        {
          method: "POST",
          headers: {
            Authorization: `bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: pickupPoint,
            destination: destinationPoint,
            vehicle_type,
          }),
        }
      );
      const data = await response.json();
      console.log("New ride created", data);
      socket.emit("rideRequested", data);
      checkRideStatus(data);
    } catch (error) {
      console.error("Error creating a new ride", error);
    }
  };

  const checkRideStatus = async (data: any) => {
    const startTime = Date.now();
    const timeLimit = 10 * 60 * 1000; // 10 minutes in milliseconds

    while (true) {
      const response = await fetch(
        "https://uber-riding-app.onrender.com/users/getridedata",
        {
          method: "POST",
          headers: {
            Authorization: `bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data }),
          cache: "no-store",
        }
      );
      const rideData = await response.json();
      console.log("Ride Data ", rideData.rides[0].ride_status);

      if (
        rideData.rides[0].ride_status === "accepted" ||
        Date.now() - startTime > timeLimit
      ) {
        navigate("/rideConfirmed", { state: { rideData } });
        break; // Exit the loop if ride is accepted or time limit exceeded
      }

      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before checking again
    }
  };

  const handleDestinationClick = () => {
    gsap.fromTo(
      ".ridebookingcard",
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }
    );
  };

  const handleRideBookingCardClick = () => {
    gsap.to(".ridebookingcard", { y: 100, duration: 1, opacity: 0 });
    setFullscreen(!fullscreen);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        "https://uber-riding-app.onrender.com/maps/getdistance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: pickupPoint,
            destination: destinationPoint,
          }),
        }
      );
      const data = await response.json();
      setTravellingData(data);
    } catch (error) {
      console.log("error while submitting", error);
    }
  };

  const getSuggestion = async () => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${
          inputSelected ? destinationPoint : pickupPoint
        }.json?access_token=pk.eyJ1Ijoicm9zaGFua3JyIiwiYSI6ImNtN3Z6enc4NDAwY3QyanB4aXAxdDRnMncifQ.4N3xt-EP4IY-0DsI4vC0TQ`
      );
      const data = await response.json();
      setSuggestions(data.features.map((feature: any) => feature.place_name));
    } catch (error) {
      console.log("error getting suggestion", error);
    }
  };

  useEffect(() => {
    console.log("travellingData", travellingData);
  }, [travellingData]);

  useEffect(() => {
    getSuggestion();
  }, [pickupPoint, destinationPoint]);

  useEffect(() => {
    if (vehicle_type) {
      handleDestinationClick();
      newRide();
      setFullscreen(false);
    }
  }, [vehicle_type]);

  return (
    <div className="md:w-60">
      <div className="h-screen w-full md:w-60">
        <div className="logo font-bold text-4xl p-8">
          <h1>UBER</h1>
        </div>
        <div className="img  w-full  h-screen absolute top-0 -z-10">
          <img
            className="object-cover w-full h-full"
            src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
            alt=""
          />
        </div>
        <div
          className={`${
            fullscreen ? "h-screen" : "h-80"
          } w-full bg-white absolute bottom-0 p-4 duration-400 rounded-t-3xl`}
        >
          <div className="flex flex-col items-center gap-4 justify-center">
            <hr
              onClick={() => {
                setFullscreen(!fullscreen);
              }}
              className="w-50 opacity-40 border-t-2 rounded-2xl"
            />
            <div className="flex flex-col w-screen  p-4 gap-4  ">
              <h1 className="font-bold text-2xl ">Find a Trip</h1>
              <input
                type="text"
                placeholder="Enter Pickup Point"
                value={pickupPoint}
                onChange={(e) => setPickupPoint(e.target.value)}
                onClick={() => setInputSelected(false)}
                className="bg-gray-500/30 p-4 rounded-xl px-10"
              />
              <input
                type="text"
                placeholder="Enter Destination"
                value={destinationPoint}
                onChange={(e) => setDestinationPoint(e.target.value)}
                onClick={() => setInputSelected(true)}
                className="bg-gray-500/30 p-4 rounded-xl px-10"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="w-full p-2 bg-black text-white rounded-lg"
            >
              Submit
            </button>
          </div>
          <div className="locations flex flex-col gap-2">
            {suggestions.map((location?, index?) => (
              <div
                key={index}
                className="flex items-center p-2 rounded-lg"
                onClick={() => {
                  if (inputSelected && location) {
                    setDestinationPoint(location);
                  } else if (location) {
                    setPickupPoint(location);
                  }
                }}
              >
                📍
                <span>{location}</span>
              </div>
            ))}
          </div>
          <div className="ridebookingcard opacity-0 absolute bottom-0 left-0  pointer-events-none ridebookingcard">
            <hr
              onClick={handleRideBookingCardClick}
              className="w-50 opacity-40 border-t-2 absolute z-10 top-4 pointer-events-auto translate-x-1/2 rounded-2xl"
            />
            {
              <RideBookingCard
                pickupPoint={pickupPoint}
                destinationPoint={destinationPoint}
                selectedVehicle={vehicle_type}
                fares={travellingData.fairPrices}
              />
            }
          </div>
          {travellingData.fairPrices.bike > 0 ||
          travellingData.fairPrices.car > 0 ||
          travellingData.fairPrices.auto > 0 ? (
            <Vehicle
              vehicle_type={vehicle_type}
              setVehicle_type={setVehicle_type}
              fares={travellingData.fairPrices}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};
