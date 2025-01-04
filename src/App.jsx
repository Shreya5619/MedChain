import { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ManufacturerDashboard from './Manufacturer.jsx';
import IntermediaryDashboard from './Intermediary.jsx';
import HospitalDashboard from './Hospitals.jsx';
import MedChain from './home.jsx';
import MainPage from './mainpage';
import ConsumerPage from './consumer';
{/*import homepageDashboard from './homepage.jsx';*/ }

function App() {
  return (
    <div className="h-full">
      <BrowserRouter>
        <Routes>
        <Route path='/' element={<MainPage/>} />
        <Route path='/signin' element={<MedChain />} />
          <Route path='/manufacturer' element={<ManufacturerDashboard />} />
          <Route path='/intermediary' element={<IntermediaryDashboard />} /> 
          <Route path='/hospital' element={<HospitalDashboard />} /> 
          <Route path='/consumer' element={<ConsumerPage />} /> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
