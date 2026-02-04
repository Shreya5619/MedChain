import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Activity, List, LogOut } from "lucide-react";

const HospNav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navLinks = [
        { name: "Dashboard", path: "/hospital", icon: <Home size={18} /> },
        { name: "Track", path: "/hospital/track", icon: <Activity size={18} /> },
    ];

    return (
        <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 w-full z-50 px-4 py-4"
        >
            <nav className="mx-auto max-w-5xl bg-med-teal/95 backdrop-blur-md rounded-full shadow-lg px-6 py-3 flex justify-between items-center text-white">
                {/* Logo */}
                <Link to="/" className="text-xl font-serif font-bold tracking-tight hover:text-med-teal-light transition-colors">
                    MedChain <span className="text-med-teal-light font-sans text-xs font-normal ml-1">HOSPITAL</span>
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden md:flex items-center space-x-1">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <li key={link.name}>
                                <Link
                                    to={link.path}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${isActive
                                        ? "bg-white text-med-teal font-semibold shadow-md"
                                        : "hover:bg-white/10 text-white/90"
                                        }`}
                                >
                                    {link.icon}
                                    <span>{link.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Logout */}
                <div className="hidden md:block pl-4 border-l border-white/20 ml-4">
                    <Link
                        to="/signin"
                        onClick={() => localStorage.clear()}
                        className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button onClick={toggleMenu} className="md:hidden text-white p-1">
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="absolute top-20 left-4 right-4 bg-white rounded-2xl shadow-xl overflow-hidden md:hidden"
                    >
                        <ul className="flex flex-col p-4 space-y-2">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${location.pathname === link.path
                                            ? "bg-med-teal text-white"
                                            : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        {link.icon}
                                        <span className="font-medium">{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                            <hr className="border-gray-100 my-2" />
                            <li>
                                <Link
                                    to="/signin"
                                    onClick={() => { setIsMenuOpen(false); localStorage.clear(); }}
                                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50"
                                >
                                    <LogOut size={18} />
                                    <span className="font-medium">Logout</span>
                                </Link>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default HospNav;
