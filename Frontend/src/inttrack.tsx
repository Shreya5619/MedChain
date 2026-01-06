import React from "react";
import DrugsByIntermediary from "./components/inter";
import IntNav from "./components/intnav";

const InterTrack = () => {
  return (
    <div className="min-h-screen bg-med-cream font-sans">
      <IntNav />
      <div className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto flex justify-center">
        <div className="w-full max-w-4xl">
          <DrugsByIntermediary />
        </div>
      </div>
    </div>
  );
};

export default InterTrack;
