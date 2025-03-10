import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const UserSignup = () => {
  const [userData, setUserData] = useState({
    fullName: { firstName: "", lastName: "" },
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userData.password !== userData.confirmPassword) {
      alert("Passwords do not match"); // Show error alert
      return;
    }
    try {
      const response = await fetch("http://localhost:4000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.status === 201) {
        alert("Registration successful!"); // Show success alert
        navigate("/userLogin");
      } else {
        alert(data.message || "Registration failed"); // Show error alert with message from response
      }
    } catch (error) {
      alert("An error occurred. Please try again."); // Show generic error alert
    }

    // Reset fields after submission
    setUserData({
      fullName: { firstName: "", lastName: "" },
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <>
      <div className="">
        <img
          className="absolute object-cover w-full opacity-30 h-full -z-10"
          src="https://images.unsplash.com/photo-1587307293162-2fb7a3ebfc75?q=80&w=3039&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
        />
        <div className="flex flex-col md:items-center h-screen justify-between">
          <h1 className="text-5xl font-bold p-10">Uber</h1>
          <form onSubmit={handleSubmit} className="p-10">
            <h1 className="text-xl font-bold my-4">First Name</h1>
            <input
              className="bg-gray-200 w-full px-10 py-3 rounded-lg"
              type="text"
              name="firstName"
              value={userData.fullName.firstName}
              onChange={(e) => {
                setUserData({
                  ...userData,
                  fullName: { ...userData.fullName, firstName: e.target.value },
                });
              }}
              placeholder="Enter first name"
            />
            <h1 className="text-xl font-bold my-4">Last Name</h1>
            <input
              className="bg-gray-200 w-full px-10 py-3 rounded-lg"
              type="text"
              name="lastName"
              value={userData.fullName.lastName}
              onChange={(e) => {
                setUserData({
                  ...userData,
                  fullName: { ...userData.fullName, lastName: e.target.value },
                });
              }}
              placeholder="Enter last name"
            />
            <h1 className="text-xl font-bold my-4">Email</h1>
            <input
              className="bg-gray-200 w-full px-10 py-3 rounded-lg"
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
            <h1 className="text-xl font-bold my-4">Password</h1>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              className="bg-gray-200 w-full px-10 py-3 mb-4 rounded-lg"
              placeholder="Enter password"
            />
            <h1 className="text-xl font-bold my-4">Confirm Password</h1>
            <input
              type="password"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              className="bg-gray-200 w-full px-10 py-3 mb-8 rounded-lg"
              placeholder="Confirm password"
            />

            <Link to={"/userLogin"} className="text-blue-500 py-4">
              Already have an account? Log in
            </Link>

            <button
              type="submit"
              className="bg-black text-white w-full p-3 rounded-lg"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
