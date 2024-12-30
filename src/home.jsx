import React from "react";


const MedChain = () => {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-[9999] bg-black bg-opacity-90 px-4 py-2 shadow backdrop-blur-lg backdrop-saturate-150 lg:px-8 lg:py-3">
        <div className="container mx-auto flex items-center justify-between text-white">
          {/* Logo at the Left */}
          <div className="flex items-center">
            <img className="w-12 h-12" src="/onlylogo.png" alt="industryicon" />
          </div>

          {/* MED CHAIN at the Center */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <a href="#" className="text-4xl font-semibold text-secondary font-encode">
              MED CHAIN
            </a>
          </div>

          {/* HOME and ABOUT US at the Right */}
          <div className="hidden lg:flex gap-6">
            <a href="#" className="text-xl text-secondary hover:text-white">
              HOME
            </a>
            <a href="#" className="text-xl text-secondary hover:text-white">
              ABOUT US
            </a>
          </div>

          {/* Hamburger Menu (Visible on Small Screens) */}
          <button
            className="relative ml-auto h-6 w-6 rounded-lg text-center text-inherit hover:bg-gray-700 lg:hidden"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center">
            <img className="w-30 h-28 rounded-sm" src="/onlylogo.png" alt="industryicon" />
            <span className="ml-4 text-3xl font-montserrat font-bold text-primary">MED CHAIN</span>
          </div>

          <ul className="my-4 space-y-3">
            <li>
              <a
                href="manufacturer"
                className="flex items-center p-2.5 text-base font-bold text-secondary rounded-lg bg-primary hover:bg-primaryHover group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
              >
                <img
                  className="w-8 h-8 rounded-sm"
                  src="/manufacturericon.png"
                  alt="industryicon"
                />
                <span className="flex-1 ms-3 whitespace-nowrap font-encode">
                  Sign in as Manufacturer
                </span>
              </a>
            </li>
            <li>
              <a
                href="intermediary"
                className="flex items-center p-2.5 text-base font-bold text-secondary rounded-lg bg-primary hover:bg-primaryHover group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
              >
                <img className="w-8 h-8 rounded-sm" src="/intericon.png" alt="industryicon" />
                <span className="flex-1 ms-3 whitespace-nowrap font-encode">
                  Sign in as Intermediary
                </span>
              </a>
            </li>
            <li>
              <a
                href=""
                className="flex items-center p-2.5 text-base font-bold text-secondary rounded-lg bg-primary hover:bg-primaryHover group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
              >
                <img className="w-8 h-8 rounded-sm" src="/personicon.png" alt="industryicon" />
                <span className="flex-1 ms-3 whitespace-nowrap font-encode">Sign in as Consumer</span>
              </a>
            </li>
            <li>
              <a
                href="hospital"
                className="flex items-center p-2.5 text-base font-bold text-secondary rounded-lg bg-primary hover:bg-primaryHover group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
              >
                <img
                  className="w-8 h-8 rounded-sm object-cover"
                  src="/hospitalicon.png"
                  alt="industryicon"
                />
                <span className="flex-1 ms-3 whitespace-nowrap font-encode">Sign in as Hospitals</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MedChain;
