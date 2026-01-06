import React from "react";
import ManuNav from "./components/manunav";
import DrugsByManufacturer from "./components/manu";

const ManuView = () => {
  return (
    <div className="min-h-screen bg-med-cream font-sans">
      <ManuNav />
      <div className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto flex justify-center">
        <div className="w-full max-w-4xl">
          <DrugsByManufacturer />
        </div>
      </div>
    </div>
  );
};

export default ManuView;
