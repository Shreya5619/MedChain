import React from "react";

import DrugsByIntermediary from "./components/inter";
import IntNav from "./components/intnav";



const InterTrack = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex flex-col text-white">
  <IntNav/>

  {/* Main Content */}
  <div className="flex-grow flex items-center justify-center">
    
    {/* Background Overlay */}
    {/* <div className="absolute inset-0 bg-opacity-60 bg-black"></div> */}

    {/* Card Container */}
    <br></br>
    <div className="w-full max-w-md p-6 bg-white border border-gray-200 mt-20 rounded-lg shadow-lg relative z-10">
      <DrugsByIntermediary/>
    </div>
  </div>
</div>

  );
};

export default InterTrack;
