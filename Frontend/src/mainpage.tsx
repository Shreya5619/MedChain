import React from 'react'
import HeroSection from './components/hero'
import Navbar from './components/navbar';
import Features from './components/features';

const MainPage = () => {
  return (
    <div className="min-h-screen bg-med-cream text-med-teal font-sans selection:bg-med-teal selection:text-white">
      <Navbar />
      <main>
        <HeroSection />
        <Features />
      </main>
      <footer className="bg-med-teal text-white py-12 text-center">
        <p className="opacity-80">© 2024 MedChain. Secure Supply Chain.</p>
      </footer>
    </div>
  )
}
export default MainPage;

