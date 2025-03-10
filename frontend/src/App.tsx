import React from "react";
import { Route, Routes } from "react-router-dom";
import { Intro } from "./pages/intro";
import { CaptainLogin } from "./pages/captainLogin";
import { UserLogin } from "./pages/userLogin";
import { UserSignup } from "./pages/userSignup";
import { CaptainSignup } from "./pages/captainSignup";
import { Wrapper } from "./pages/wrapper";
import { RideConfirmed } from "./pages/rideConfirmed";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Intro />} />
      <Route path="/captainLogin" element={<CaptainLogin />} />
      <Route path="/captainSignup" element={<CaptainSignup />} />
      <Route path="/userLogin" element={<UserLogin />} />
      <Route path="/userSignup" element={<UserSignup />} />
      <Route path="/rideConfirmed" element={<RideConfirmed />} />
      <Route path="/userHome" element={<Wrapper locat={"users"} />} />
      <Route path="/captainHome" element={<Wrapper locat={"captain"} />} />
    </Routes>
  );
};

export default App;
