import React from "react";
import Navbar from "./components/navbar";
import LoginCard from "./components/logincard";
import ManuCard from "./components/manulogincard";
import InterCard from "./components/interlogin";

const InterLogin = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex flex-col text-white">
  <Navbar />

  {/* Main Content */}
  <div className="flex-grow flex items-center justify-center">
    

    <div className="w-full max-w-md p-6 bg-white border border-gray-200 mt-20 rounded-lg shadow-lg relative z-10">
      <InterCard />
    </div>
  </div>
</div>

  );
};

export default InterLogin;
