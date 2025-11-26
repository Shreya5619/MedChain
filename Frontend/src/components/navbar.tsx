
import React, { useState } from "react";
import { Menu } from "lucide-react";  // Importing the Menu icon from Lucide React
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="absolute w-full flex justify-center mt-4 z-10">
      <nav className="bg-gray-800 p-4 shadow-lg w-[70%] h-15 rounded-full text-white font-bold">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-semibold text-white">
            <a href="/">MedChain</a>
          </div>

          {/* Menu Items (Desktop) */}
          <ul className="hidden md:flex space-x-8 text-white">
            <li>
              <a href="/" className="hover:text-blue-400">
                Home
              </a>
            </li>
            <li>
              <a href="/aboutus" className="hover:text-blue-400">
                About
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-blue-400">
                Contact
              </a>
            </li>
            <li>
              <Link to="/signup" className="hover:text-blue-400">
                Signup
              </Link>
            </li>
            <li>
              <a href="/signin" className="hover:text-blue-400">
                SignIn
              </a>
            </li>
          </ul>

          {/* Hamburger Icon (Mobile) */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-white">
              <Menu size={24} /> {/* Lucide icon for hamburger menu */}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${isMenuOpen ? "block" : "hidden"
            } md:hidden mt-4 bg-gray-700 p-4 space-y-4 rounded-lg`}
        >
          <ul>
            <li>
              <a href="#home" className="block py-2 px-4 hover:bg-gray-600 text-white">
                Home
              </a>
            </li>
            <li>
              <a href="#about" className="block py-2 px-4 hover:bg-gray-600 text-white">
                About
              </a>
            </li>
            <li>
              <a href="#solutions" className="block py-2 px-4 hover:bg-gray-600 text-white">
                Contact
              </a>
            </li>
            <li>
              <a href="#platform" className="block py-2 px-4 hover:bg-gray-600 text-white">
                Signup
              </a>
            </li>
            <li>
              <a href="#partners" className="block py-2 px-4 hover:bg-gray-600 text-white">
                Signin
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
