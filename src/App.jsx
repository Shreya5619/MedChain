import { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ManufacturerDashboard from './Manufacturer.jsx';
import IntermediaryDashboard from './Intermediary.jsx';
import HospitalDashboard from './Hospitals.jsx';
import MedChain from './home.jsx';
{/*import homepageDashboard from './homepage.jsx';*/ }

function App() {
  return (
    <div className="h-full">
      <BrowserRouter>
        <Routes>
          
        <Route path='/' element={<MedChain />} />
          <Route path='/manufacturer' element={<ManufacturerDashboard />} />
          <Route path='/intermediary' element={<IntermediaryDashboard />} /> 
          <Route path='/hospital' element={<HospitalDashboard />} /> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
