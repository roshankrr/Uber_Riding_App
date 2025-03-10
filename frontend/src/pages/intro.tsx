import React from "react";
import { Link } from "react-router-dom";

export const Intro = () => {
  return (
    <>
      <div>
        <img
          className="absolute object-cover w-full h-full -z-10"
          src="https://images.unsplash.com/photo-1587307293162-2fb7a3ebfc75?q=80&w=3039&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
        />
        <div className=" flex flex-col h-screen justify-between">
          <h1 className="text-5xl font-bold  p-10">Uber</h1>
          <div className="bg-white p-10 flex flex-col items-center gap-4 justify-center rounded-t-3xl">
            <h1 className="font-bold text-2xl">Get Started With Uber</h1>
            <Link
              to="/userLogin"
              className="p-4 max-w-52 bg-black cursor-pointer flex gap-4 justify-center hover:gap-8 duration-400  text-white px-28 rounded-xl"
            >
              Continue <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
