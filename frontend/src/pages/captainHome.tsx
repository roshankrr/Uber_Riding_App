import { Shield, Share2, Phone, Star, Watch } from "lucide-react";
import { useEffect, useState } from "react";
import NewRide from "../components/newRideAvailable";
import CaptainRideconfirm from "../components/captainRideconfirm";
import socket from "../socket/socket";

const CaptainHome = ({ userData }: any) => {
  const [fullscreen, setFullscreen] = useState(false);
  const [rideAccepted, setRideAccepted] = useState(false);
  const [newRideData, setNewRideData] = useState({});
  const [rideIgnored, setRideIgnored] = useState(false);

  useEffect(() => {
    socket.emit("updateProfile", userData.user);

    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("captainConnected", { latitude, longitude });
        socket.emit("updateLocation", { latitude, longitude });
      });
    };

    socket.on("rideRequested", (data: any) => {
      console.log("New ride requested:", data);
      setNewRideData(data);
    });

    const intervalId = setInterval(updateLocation, 2000);

    return () => {
      clearInterval(intervalId);
      socket.off("rideRequested");
    };
  }, []);

  return (
    <div className="md:w-60">
      <div className="h-screen w-full md:w-60">
        <div className="logo font-bold text-4xl p-8">
          <h1>UBER</h1>
        </div>
        <div className="img w-full h-screen absolute top-0 -z-10">
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
          <div className="flex justify-between items-center mb-14">
            <div className="flex items-center gap-2">
              <img
                className="h-16 w-16 object-cover rounded-full"
                src="https://www.psychologs.com/wp-content/uploads/2024/01/8-tips-to-be-a-jolly-person.jpg"
                alt=""
              />
              <h1 className="font-bold text-xl">Roshan Boi</h1>
            </div>
            <div>
              <h1 className="font-bold text-xl">250rs</h1>
              <span>Earned</span>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center bg-gray-700/20 p-4 rounded-xl">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <Watch size={40} />
                <h1>10.2</h1>
                <span>Hours Online</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {newRideData && Object.keys(newRideData).length > 0 && !rideIgnored && (
        <div className="absolute h-full p-4 top-50 w-full">
          <NewRide
            setRideIgnored={setRideIgnored}
            newRideData={newRideData}
            rideAccepted={rideAccepted}
            setRideAccepted={setRideAccepted}
          />
        </div>
      )}
      {rideAccepted && (
        <div className="flex justify-center">
          <CaptainRideconfirm newRideData={newRideData} />
        </div>
      )}
    </div>
  );
};

export default CaptainHome;
