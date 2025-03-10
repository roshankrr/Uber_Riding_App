import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // Import toast for notifications

export const CaptainLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrorMessage(""); // Clear error message on input change
  };

  const validateForm = () => {
    const { email, password } = formData;
    if (!email) {
      toast.error("Email is required");
      return false;
    }
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return; // Validate before proceeding

    try {
      const response = await fetch("http://localhost:4000/captain/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.status === 200) {
        localStorage.setItem("token", data.token);
        navigate("/captainhome");
      } else {
        setErrorMessage(data.message || "Login failed"); // Set error message from server
        toast.error(data.message || "Login failed"); // Show error message from server
      }
    } catch (error) {
      console.log(error, "error while Captain login");
      setErrorMessage("An error occurred during login"); // Set error message for catch block
      toast.error("An error occurred during login");
    }

    setFormData({ email: "", password: "" });
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
          <h1 className="text-5xl font-bold p-10">Captain Login</h1>
          <form onSubmit={handleSubmit} className="p-10">
            <h1 className="text-xl font-bold my-4">What's Your Email</h1>
            <input
              className="bg-gray-200 w-full px-10 py-3 rounded-lg"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
            <h1 className="text-xl font-bold my-4">Enter Password</h1>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="bg-gray-200 w-full px-10 py-3 mb-8 rounded-lg"
              placeholder="Enter password"
            />
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}{" "}
            {/* Display error message */}
            <Link to={"/captainSignup"} className="text-blue-500 py-4">
              Don't have an account? Sign up
            </Link>
            <button
              type="submit"
              className="bg-black text-white w-full p-3 rounded-lg"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
