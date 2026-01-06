import React from "react";
import Navbar from "./components/navbar";
import Card from "./components/signincard";
import AuthSideImage from "./assets/auth_side.png";
import { motion } from "framer-motion";

const MedChain = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <div className="flex-grow flex flex-col lg:flex-row pt-20">
        {/* Left Side - Image & Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-med-teal-light items-center justify-center p-12 overflow-hidden">
          <div className="absolute inset-0 bg-med-teal/5 mix-blend-multiply"></div>
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            src={AuthSideImage}
            alt="Secure Login"
            className="w-full max-w-md object-contain drop-shadow-2xl relative z-10"
          />
          <div className="absolute bottom-10 left-10 z-20">
            <h3 className="text-3xl font-serif text-med-teal">Secure. Transparent. Trusted.</h3>
            <p className="text-med-teal/70 mt-2">Access the next generation of healthcare logistics.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <Card />
            <div className="mt-8 text-center">
              <p className="text-gray-500">Don't have an account? <a href="/signup" className="text-med-teal font-semibold hover:underline">Sign up</a></p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MedChain;
