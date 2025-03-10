import { useState } from "react";
import { MapPin, CreditCard } from "lucide-react";

const RideBookingCard = ({
  selectedVehicle,
  fares,
  pickupPoint,
  destinationPoint,
}: any) => {
  const [status] = useState("Looking for nearby drivers");

  const vehicleImages = {
    car: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_538,w_956/v1645186360/assets/c8/6d4555-bd78-4dbc-a3d4-53d527f52f94/original/16x9-transportation-2.png",
    bike: "https://img.freepik.com/premium-vector/super-bike-vector-illustration-heavy-bike-vector-bike-logo-design_921448-826.jpg",
    auto: "https://img.freepik.com/premium-vector/realistic-rikshaw-vector-illustration-concept_1253202-37011.jpg?semt=ais_hybrid",
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-4">
      <h2 className="text-lg font-semibold text-center">{status}</h2>
      <div className="flex justify-center my-4">
        <div className="p-4 animate-pulse rounded-full">
          <img
            src={vehicleImages[selectedVehicle as keyof typeof vehicleImages]} // Show image based on selected vehicle
            alt={
              selectedVehicle.charAt(0).toUpperCase() + selectedVehicle.slice(1)
            } // Capitalize the vehicle type for alt text
            className="h-48"
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-start gap-3">
          <MapPin className="text-gray-500" />
          <div>
            <p className="font-semibold">{pickupPoint}</p>
            <p className="text-gray-600 text-sm">{pickupPoint}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 mt-4">
          <div className="w-4 h-4 bg-black rounded-sm mt-1"></div>
          <div>
            <p className="font-semibold">{destinationPoint}</p>
            <p className="text-gray-600 text-sm">{destinationPoint}</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-4 mt-4 flex items-center justify-between">
        <div>
          <p className="text-xl font-bold">
            ₹{fares[selectedVehicle]?.toFixed(2) || "0.00"}
          </p>
          <p className="text-gray-600 text-sm">Cash Only</p>
        </div>
        <CreditCard className="text-gray-500" />
      </div>
    </div>
  );
};

export default RideBookingCard;
