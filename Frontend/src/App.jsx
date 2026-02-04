import { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ManufacturerDashboard from './Manufacturer.jsx';
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
import ConsumerSignup from './ConsumerSignup';
import ConsumerSignin from './ConsumerSignin';
{/*import homepageDashboard from './homepage.jsx';*/ }




import HospTrack from './hosptrack';

function App() {
  return (
    <div className="h-full">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainPage />} />
          <Route path='/signin' element={<MedChain />} />
          <Route path='/aboutus' element={<AboutUs />} />
          <Route path='/signup' element={<Login />} />
          <Route path='/signup/manufacturer' element={<ManuLogin />} />

          <Route path='/signup/intermediary' element={<InterLogin />} />

          <Route path='/signup/consumer' element={<ConsumerSignup />} />
          <Route path='/signin/consumer' element={<ConsumerSignin />} />

          <Route path='/signup/hospital' element={<HospLog />} />
          <Route path='/manufacturer' element={<ManufacturerDashboard />} />
          <Route path='/manufacturer/track' element={<ManuTrack />} />
          <Route path='/manufacturer/view' element={<ManuView />} />
          <Route path='/intermediary' element={<IntermediaryDashboard />} />
          <Route path='/intermediary/track' element={<IntSearch />} />
          <Route path='/intermediary/view' element={<InterTrack />} />
          <Route path='/hospital' element={<HospitalDashboard />} />
          <Route path='/hospital/track' element={<HospTrack />} />
          <Route path='/consumer' element={<ConsumerPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
