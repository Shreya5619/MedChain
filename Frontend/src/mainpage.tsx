import React from 'react'
import HeroSection from './components/hero'
import Navbar from './components/navbar';

const MainPage = () => {
  return (
    <div className="relative">
    <Navbar />  {/* This will be on top of HeroSection */}
    <HeroSection />  {/* HeroSection will be underneath the Navbar */}
  </div>
  )
}
export default MainPage;
