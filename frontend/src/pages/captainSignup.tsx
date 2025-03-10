import { FormEvent, useEffect, use, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const CaptainSignup = () => {
  const [userData, setUserData] = useState({
    fullName: { firstName: "", lastName: "" },
    email: "",
    password: "",
    vehicle: { vehicletype: "", model: "", plate: "", color: "" },
    currentLocation: "",
  });

  const navigate = useNavigate();
  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log("main ab chala hu", userData.fullName.firstName);

    try {
      const response = await fetch("http://localhost:4000/captain/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (response.status === 201) {
        console.log(data.token);
        navigate("/captainLogin");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error, "error while Captain login");
    }
    // Reset fields after submission

    setUserData({
      fullName: { firstName: "", lastName: "" },
      email: "",
      password: "",
      vehicle: { vehicletype: "", model: "", plate: "", color: "" },
      currentLocation: "",
    });
  };

  return (
    <div className=" flex flex-col md:items-center h-screen gap-5">
      <img
        className="absolute object-cover w-full opacity-30 h-full -z-10"
        src="https://images.unsplash.com/photo-1587307293162-2fb7a3ebfc75?q=80&w=3039&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt=""
      />
      <h1 className="text-5xl font-bold px-8 py-4">Captain Signup</h1>
      <form onSubmit={handleSubmit} className="px-10 ">
        <div className="flex gap-2">
          <div>
            <h1 className="text-xl font-bold my-4">First Name</h1>
            <input
              required
              className="bg-gray-200 w-full px-4 py-3 rounded-lg"
              type="text"
              value={userData.fullName.firstName}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  fullName: { ...userData.fullName, firstName: e.target.value },
                })
              }
              placeholder="Enter first name"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold my-4">Last Name</h1>
            <input
              className="bg-gray-200 w-full px-4 py-3 rounded-lg"
              type="text"
              required
              value={userData.fullName.lastName}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  fullName: { ...userData.fullName, lastName: e.target.value },
                })
              }
              placeholder="Enter last name"
            />
          </div>
        </div>

        <h1 className="text-xl font-bold my-4">Email</h1>
        <input
          className="bg-gray-200 w-full px-10 py-3 rounded-lg"
          type="email"
          required
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          placeholder="Enter email"
        />
        <h1 className="text-xl font-bold my-4">Password</h1>
        <input
          className="bg-gray-200 w-full px-10 py-3 rounded-lg"
          type="password"
          required
          value={userData.password}
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
          placeholder="Enter password"
        />
        <h1 className="text-xl font-bold my-4">Vehicle Type</h1>
        <select
          className="bg-gray-200 w-full px-10 py-3 rounded-lg"
          value={userData.vehicle.vehicletype}
          required
          onChange={(e) =>
            setUserData({
              ...userData,
              vehicle: { ...userData.vehicle, vehicletype: e.target.value },
            })
          }
        >
          <option value="" disabled>
            Select vehicle type
          </option>
          <option value="bike">Bike</option>
          <option value="car">Car</option>
          <option value="auto">Auto</option>
        </select>
        <div className="flex gap-2">
          <div>
            <h1 className="text-xl font-bold my-4">Model</h1>
            <input
              className="bg-gray-200 w-full px-10 py-3 rounded-lg"
              type="text"
              value={userData.vehicle.model}
              required
              onChange={(e) =>
                setUserData({
                  ...userData,
                  vehicle: { ...userData.vehicle, model: e.target.value },
                })
              }
              placeholder="Enter vehicle model"
            />
          </div>

          <div>
            <h1 className="text-xl font-bold my-4">Plate</h1>
            <input
              className="bg-gray-200 w-full px-10 py-3 rounded-lg"
              type="text"
              required
              value={userData.vehicle.plate}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  vehicle: { ...userData.vehicle, plate: e.target.value },
                })
              }
              placeholder="Enter vehicle plate"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div>
            <h1 className="text-xl font-bold my-4">Color</h1>
            <input
              className="bg-gray-200 w-full px-10 py-3 rounded-lg"
              type="text"
              required
              value={userData.vehicle.color}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  vehicle: { ...userData.vehicle, color: e.target.value },
                })
              }
              placeholder="Enter vehicle color"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold my-4">Current Location</h1>
            <input
              className="bg-gray-200 w-full px-10 py-3 rounded-lg"
              type="text"
              value={userData.currentLocation}
              onChange={(e) =>
                setUserData({ ...userData, currentLocation: e.target.value })
              }
              placeholder="Enter current location"
            />
          </div>
        </div>

        <div className="mt-8">
          <Link to={"/captainLogin"} className="text-blue-500 py-4">
            Already have an account? Log in
          </Link>
          <button
            type="submit"
            className="bg-black text-white w-full p-3 rounded-lg"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};
