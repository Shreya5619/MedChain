import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/aboutus" },
    { name: "Contact", path: "/" }, // Placeholder
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${scrolled ? "bg-white shadow-md py-4" : "bg-med-cream/80 backdrop-blur-md py-6"
        }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-3xl font-serif font-bold text-med-teal tracking-tight">
          MedChain
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-med-teal font-medium hover:text-med-blue transition-colors text-lg"
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center space-x-4 ml-4">
            <Link
              to="/signin"
              className="px-5 py-2.5 rounded-full border border-med-teal text-med-teal font-semibold hover:bg-med-teal hover:text-white transition-all duration-300"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2.5 rounded-full bg-med-teal text-white font-semibold hover:bg-med-teal/90 hover:scale-105 transition-all duration-300 shadow-md"
            >
              Sign Up
            </Link>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button onClick={toggleMenu} className="md:hidden text-med-teal p-2">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white overflow-hidden shadow-lg border-t border-gray-100"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-xl font-serif text-med-teal hover:text-med-blue"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-gray-200 my-2" />
              <Link
                to="/signin"
                onClick={() => setIsMenuOpen(false)}
                className="text-center w-full py-3 rounded-full border border-med-teal text-med-teal font-semibold"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="text-center w-full py-3 rounded-full bg-med-teal text-white font-semibold"
              >
                Sign Up
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
