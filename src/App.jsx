import { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ManufacturerDashboard from './Manufacturer.jsx';
import IntermediaryDashboard from './Intermediary.jsx';
{/*import homepageDashboard from './homepage.jsx';*/ }
import HospitalDashboard from './homepage.jsx';

function App() {
  return (
    <div className="h-full">
      <BrowserRouter>
        <Routes>
          <Route path='/manufacturer' element={<ManufacturerDashboard />} />
          <Route path='/intermediary' element={<IntermediaryDashboard />} />
          {/*<Route path='/homepage' element={<homepageDashboard />} />*/}
          <Route path='/hospital' element={<HospitalDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
