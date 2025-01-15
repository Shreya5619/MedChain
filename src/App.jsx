import { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ManufacturerDashboard from './Manufacturer';
import IntermediaryDashboard from './Intermediary.jsx';
import HospitalDashboard from './Hospitals.jsx';
import MedChain from './home.jsx';
import MainPage from './mainpage';
import ConsumerPage from './consumer';
import ManuTrack from './manutrack';
import ManuView from './manuView';
import InterTrack from './inttrack';
import IntSearch from './intersearch';
import Login from './login.jsx';
import ManuLogin from './manulogin';
import InterLogin from './interlogin';
import ManuSearch from './manutrack';
import HospLog from './hosplogin';
import AboutUs from './aboutus';
{/*import homepageDashboard from './homepage.jsx';*/ }




function App() {
  return (
    <div className="h-full">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainPage />} />
          <Route path='/signin' element={<MedChain />} />
          <Route path='/aboutus' element={<AboutUs />} />
          <Route path='/login' element={<Login />} />
          <Route path='/login/manufacturer' element={<ManuLogin />} />

          <Route path='/login/intermediary' element={<InterLogin />} />

          <Route path='/login/hospital' element={<HospLog />} />
          <Route path='/manufacturer' element={<ManufacturerDashboard />} />
          <Route path='/manufacturer/track' element={<ManuTrack />} />
          <Route path='/manufacturer/view' element={<ManuSearch />} />
          <Route path='/intermediary' element={<IntermediaryDashboard />} />
          <Route path='/intermediary/track' element={<IntSearch />} />
          <Route path='/intermediary/view' element={<InterTrack />} />
          <Route path='/hospital' element={<HospitalDashboard />} />
          <Route path='/consumer' element={<ConsumerPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
