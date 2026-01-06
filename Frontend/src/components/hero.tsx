import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeroImage from '../assets/hero_3d.png';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-med-cream overflow-hidden pt-20">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-med-teal-light rounded-l-full opacity-50 -z-10 translate-x-1/4" />

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Text Content */}
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-medium text-med-teal leading-tight mb-6">
              The Future of <br />
              <span className="italic text-med-blue">Drug Safety</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              MedChain ensures every pill is authentic. Real-time tracking from manufacturer to patient, secured by blockchain.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-med-teal text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started
                </motion.button>
              </Link>
              <Link to="/aboutus">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-med-teal border border-med-teal text-lg font-semibold rounded-full hover:bg-med-teal-light transition-all"
                >
                  Learn More
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <motion.img
            src={HeroImage}
            alt="Medical Supply Chain"
            className="w-full h-auto drop-shadow-2xl rounded-2xl"
            animate={{
              y: [0, -20, 0],
              rotateY: [0, 5, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut"
            }}
            style={{ perspective: 1000 }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
