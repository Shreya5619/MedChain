import React, { useState } from "react";
import { LogOut, Menu } from "lucide-react";
import { Link } from "react-router-dom";

const ManuNav = () => {
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
            <Link to="/">MedChain</Link>
          </div>

          {/* Menu Items (Desktop) */}
          <ul className="hidden md:flex space-x-8 text-white">
            <li>
              <Link to="/" className="hover:text-blue-400">Home</Link>
            </li>
            <li>
              <Link to="/manufacturer" className="hover:text-blue-400">Add</Link>
            </li>
            <li>
              <Link to="/manufacturer/track" className="hover:text-blue-400">Track</Link>
            </li>
            <li>
              <Link to="/manufacturer/view" className="hover:text-blue-400">View</Link>
            </li>
            <li>
              <Link to="/signin" className="hover:text-blue-400">
                <LogOut />
              </Link>
            </li>
          </ul>

          {/* Hamburger Icon (Mobile) */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-white">
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden mt-4 bg-gray-700 p-4 space-y-4 rounded-lg`}>
          <ul>
            <li>
              <Link to="/" className="block py-2 px-4 hover:bg-gray-600 text-white">Home</Link>
            </li>
            <li>
              <Link to="/manufacturer" className="block py-2 px-4 hover:bg-gray-600 text-white">Add</Link>
            </li>
            <li>
              <Link to="/manufacturer/track" className="block py-2 px-4 hover:bg-gray-600 text-white">Track</Link>
            </li>
            <li>
              <Link to="/manufacturer/view" className="block py-2 px-4 hover:bg-gray-600 text-white">View</Link>
            </li>
            <li>
              <Link to="/signin" className="block py-2 px-4 hover:bg-gray-600 text-white">Logout</Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default ManuNav;
