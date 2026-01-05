import React from 'react';

const Card = () => {
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      {/* Logo and Title */}
      <div className="flex items-center justify-center mb-1">
        <img className="w-24 h-15 rounded-md" src="/onlylogo.png" alt="MedChain Logo" />
        <span className="ml-4 text-3xl font-bold text-cyan-700 font-encode tracking-wide">
          MED CHAIN
        </span>
      </div>

      {/* Sign-In Options */}
      <ul className="space-y-2">
        <li>
          <a
            href="manufacturer"
            className="flex items-center p-3 text-base font-bold text-white rounded-lg bg-gradient-to-r from-blue-600 to-teal-600 hover:from-teal-600 hover:to-blue-600 hover:shadow-lg transition-all transform group"
          >
            <img
              className="w-10 h-10 rounded-md"
              src="/manufacturericon.png"
              alt="Manufacturer Icon"
            />
            <span className="ml-4 flex-1 font-encode">Sign in as Manufacturer</span>
          </a>
        </li>
        <li>
          <a
            href="intermediary"
            className="flex items-center p-3 text-base font-bold text-white rounded-lg bg-gradient-to-r from-green-600 to-blue-500 hover:from-blue-500 hover:to-green-600 hover:shadow-lg transition-all transform group"
          >
            <img
              className="w-10 h-10 rounded-md"
              src="/intericon.png"
              alt="Intermediary Icon"
            />
            <span className="ml-4 flex-1 font-encode">Sign in as Intermediary</span>
          </a>
        </li>
        <li>
          <a
            href="signin/consumer"
            className="flex items-center p-3 text-base font-bold text-white rounded-lg bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-teal-400 hover:to-cyan-500 hover:shadow-lg transition-all transform group"
          >
            <img
              className="w-10 h-10 rounded-md"
              src="/personicon.png"
              alt="Consumer Icon"
            />
            <span className="ml-4 flex-1 font-encode">Sign in as Consumer</span>
          </a>
        </li>
        <li>
          <a
            href="hospital"
            className="flex items-center p-3 text-base font-bold text-white rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 hover:shadow-lg transition-all transform group"
          >
            <img
              className="w-10 h-10 rounded-md"
              src="/hospitalicon.png"
              alt="Hospital Icon"
            />
            <span className="ml-4 flex-1 font-encode">Sign in as Hospital</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Card;
