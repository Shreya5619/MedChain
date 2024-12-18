import { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ManufacturerDashboard from './Manufacturer.jsx';
import IntermediaryDashboard from './Intermediary.jsx';

function App() {
  return (
    <div className="h-full">
      <BrowserRouter>
        <Routes>
          <Route path='/manufacturer' element={<ManufacturerDashboard />} />
          <Route path='/intermediary' element={<IntermediaryDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
