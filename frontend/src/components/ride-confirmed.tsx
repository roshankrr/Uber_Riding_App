import { Shield, Share2, Phone, Star } from "lucide-react";
import { useEffect, useState } from "react";

const RideConf = ({ rideData }: { rideData: any }) => {
  const [fullscreen] = useState(false);
  const [captainData, setCaptainData] = useState({
    fullName: { firstName: "", lastName: "" },
    vehicle: { model: "", plate: "", vehicle_type: "", color: "" },
    email: "",
  });

  useEffect(() => {
    if (!rideData || !rideData.rides || rideData.rides.length === 0) return;

    const checkCaptain = async () => {
      try {
        const response = await fetch(
          `https://uber-riding-app.onrender.com/captain/getCaptainProfileById/${rideData.rides[0].captain_id}`,
          {
            method: "GET", // Changed to GET
            headers: {
              Authorization: `bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        const data = await response.json();
        console.log("Captain Data ", data);
        setCaptainData(data.captain);
      } catch (error) {
        console.error("Error while checking ride status", error);
      }
    };

    checkCaptain();
  }, [rideData]); // Added rideData to dependency array

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
          <div className="max-w-md mx-auto  rounded-xl shadow-lg p-4 ">
            {/* Uber Logo */}

            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold">
                Meet at the pickup point
              </h2>
              <div className="bg-black text-white px-3 py-1 rounded-lg">
                <p className="text-sm font-bold">2</p>
                <p className="text-xs">min</p>
              </div>
            </div>
            <h1 className="font-bold text-xl">
              OTP : {rideData.rides[0].Otp} <td></td>{" "}
              <span>{captainData.fullName.firstName || "Unknown Model"}</span>
            </h1>

            {/* Driver Info */}
            <div className="flex items-center gap-4 py-4">
              <img
                src="data:image/jpeg;base64,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"
                alt="Driver"
                className="w-12 h-12 rounded-full object-cover"
              />
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOqZ9ouO370unbeiSF8sG47STnCq2Z94NONg&s"
                alt="Car"
                className="w-16 h-12 object-cover rounded-md"
              />
              <div>
                <p className="text-xl font-bold">
                  {captainData.vehicle.plate || "Unknown Plate"}
                </p>
                <p className="text-gray-600 text-sm">
                  {captainData.vehicle.model || "Unknown Model"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="text-gray-500 w-4 h-4" />
                <p className="text-sm font-semibold">4.9</p>
              </div>
            </div>

            {/* Message Button */}
            <input
              type="text"
              placeholder="Send a message..."
              className="bg-gray-100 text-gray-500 rounded-lg p-3 text-center w-full"
            />

            {/* Actions */}
            <div className="flex justify-around mt-4">
              <div className="flex flex-col items-center">
                <Shield className="text-blue-500 w-6 h-6" />
                <p className="text-sm mt-1">Safety</p>
              </div>
              <div className="flex flex-col items-center">
                <Share2 className="text-blue-500 w-6 h-6" />
                <p className="text-sm mt-1">Share my trip</p>
              </div>
              <div className="flex flex-col items-center">
                <Phone className="text-blue-500 w-6 h-6" />
                <p className="text-sm mt-1">Call driver</p>
              </div>
            </div>

            {/* Pickup Location */}
            <div className="border-t mt-4 pt-4">
              <p className="font-semibold">
                {rideData.rides[0].source || "Unknown Source location"}
              </p>
              <p className="text-gray-600 text-sm">
                {rideData.rides[0].source || "Unknown Source location"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideConf;
