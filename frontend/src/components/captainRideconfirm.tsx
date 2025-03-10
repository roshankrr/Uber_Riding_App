import { MapPin, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

const CaptainRideconfirm = ({ newRideData, length = 6 }: any) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const [rideConfirmed, setRideConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (index: number, value: string) => {
    if (!/\d/.test(value) && value !== "") return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setErrorMessage(""); // Clear error message on input change

    // Move focus to the next input if the current input is filled
    if (value && index < length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleOtpSubmit = () => {
    const enteredOtp = otp.join("");
    console.log(
      "Entered OTP:",
      enteredOtp,
      "Expected OTP:",
      newRideData.rideDetails?.ride.Otp
    );

    if (enteredOtp.length < length) {
      setErrorMessage("Please enter all OTP digits.");
      return;
    }

    if (enteredOtp === newRideData.rideDetails?.ride.Otp) {
      console.log("OTP Matched");
      setRideConfirmed(true);
    } else {
      console.log("OTP did not match");
      setErrorMessage("OTP did not match. Please try again.");
    }
  };

  useEffect(() => {
    console.log("Current OTP:", otp.join(""));
    console.log(newRideData.rideDetails?.ride, "ride data");
  }, [otp, newRideData]);

  return (
    <div className="w-full max-w-sm mx-auto absolute p-4 bg-white rounded-2xl shadow-xl">
      <h2 className="text-lg font-semibold mb-4">
        Ride {rideConfirmed ? "Confirmed" : "Accepted"}
      </h2>

      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <MapPin className="text-gray-500" size={20} />
          <div>
            <p className="font-semibold">
              {newRideData.rideDetails?.ride.source || "source"}
            </p>
            <p className="text-gray-500 text-sm">
              {newRideData.rideDetails?.ride.source || "source"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <MapPin className="text-gray-500" size={20} />
          <div>
            <p className="font-semibold">
              {newRideData.rideDetails?.ride.destination || "destination"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Wallet className="text-gray-500" size={20} />
          <div>
            <p className="font-semibold">
              ₹{Math.round(newRideData.rideDetails?.ride.fare) || "0.00"}
            </p>
            <p className="text-gray-500 text-sm">Cash Cash</p>
          </div>
        </div>
      </div>
      {!rideConfirmed && (
        <div>
          <h1>Enter OTP</h1>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <div className="flex space-x-2 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-10 h-12 text-center text-lg border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={1} // Limit input to one character
              />
            ))}
          </div>

          <button
            onClick={handleOtpSubmit}
            className="w-full mt-4 bg-green-600/60 text-white py-2 rounded-lg text-lg font-medium hover:bg-green-600/80"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default CaptainRideconfirm;
