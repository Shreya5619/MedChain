import React from 'react';
import Navbar from './navbar';

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 h-screen flex items-center justify-center space-y-2">
      <div className='flex items-center justify-center space-y-5'>
        <div className="absolute inset-0 bg-opacity-60 bg-black"></div>
        <div className="relative z-10 text-center px-8 max-w-4xl">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <img
              className="w-20 h-20 rounded-md"
              src="/src/components/medchainlogo.png"
              alt="MedChain Logo"
            />
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white">
              MedChain
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-200 mb-8">
            Ensure transparency, traceability, and trust in drug distribution with our state-of-the-art blockchain solution.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/login">
              <button
                className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-md shadow-lg hover:bg-gray-100 transition ease-in-out duration-300"
              >
                Get Started
              </button>
            </a>
            <a href="/aboutus">
              <button
                className="px-6 py-3 bg-purple-700 text-white font-semibold rounded-md shadow-lg hover:bg-purple-800 transition ease-in-out duration-300"
              >
                Learn More
              </button>
            </a>
          </div>
        </div>
        <div className="absolute bottom-10 flex justify-center w-full">
          <svg
            className="w-6 h-6 text-white animate-bounce"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
