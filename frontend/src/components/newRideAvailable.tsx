import { MapPin, Wallet } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import socket from "../socket/socket";

const NewRide = ({
  setRideAccepted,
  newRideData,
  setRideIgnored,
}: {
  setRideIgnored: (value: boolean) => void;
  newRideData: any;
  setRideAccepted: (value: boolean) => void;
}) => {
  const rideRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true); // State to control visibility

  useEffect(() => {
    if (rideRef.current) {
      gsap.fromTo(
        rideRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  }, []);

  const handleAcceptRide = () => {
    setRideAccepted(true);
    setRideIgnored(false);
    console.log("Ride accepted:", newRideData);
    setIsVisible(false); // Hide the ride notification

    // Emit socket event for ride acceptance
    socket.emit("rideAccepted", newRideData);
  };

  if (!isVisible) return null; // Return null if not visible

  return (
    <div
      ref={rideRef}
      className="w-full max-w-sm mx-auto absolute p-4 left-0 bg-white rounded-2xl shadow-xl"
    >
      <h2 className="text-lg font-semibold mb-4">New Ride Available!</h2>

      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <MapPin className="text-gray-500" size={20} />
          <div>
            <p className="font-semibold">
              {newRideData?.rideDetails?.ride?.source}
            </p>
            <p className="text-gray-500 text-sm">
              {newRideData?.rideDetails?.ride?.source}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <MapPin className="text-gray-500" size={20} />
          <div>
            <p className="font-semibold">
              {newRideData?.rideDetails?.ride?.destination}
            </p>
            <p className="text-gray-500 text-sm">
              {newRideData?.rideDetails?.ride?.destination}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Wallet className="text-gray-500" size={20} />
          <div>
            <p className="font-semibold">
              ₹{Math.round(newRideData?.rideDetails?.ride?.fare || 0)}
            </p>
            <p className="text-gray-500 text-sm">Cash</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleAcceptRide}
        className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg text-lg font-medium hover:bg-green-700"
      >
        Accept
      </button>
      <button
        onClick={() => setRideIgnored(true)}
        className="w-full mt-4 bg-gray-500/40 text-white py-2 rounded-lg text-lg font-medium hover:bg-gray-500/60"
      >
        Ignore
      </button>
    </div>
  );
};

export default NewRide;
