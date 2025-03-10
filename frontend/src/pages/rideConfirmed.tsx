import RideConf from "../components/ride-confirmed";
import { useLocation } from "react-router-dom";

export const RideConfirmed = () => {
  const location = useLocation();
  const { rideData } = location.state || { halwa: "halwa" };
  return (
    <>
      <RideConf rideData={rideData} />
    </>
  );
};
