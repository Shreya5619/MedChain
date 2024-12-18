import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import ManufacturerDashboard from './Manufacturer.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    <Routes>
    <Route path='/' element={<ManufacturerDashboard />}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
