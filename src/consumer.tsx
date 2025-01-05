import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // For routing
import QrReader from 'react-qr-scanner'; // Correct import for QR scanner
import Consnav from './components/consnav';
import DrugTransactionCard from './components/drugTransactionCard';

// Sample drug details (this could come from an API or database)
const drugDetails = {
  name: "Aspirin",
  manufacturer: "Pharma Inc.",
  dosage: "500 mg",
  expirationDate: "12/2026",
  description: "Aspirin is used to reduce fever, pain, and inflammation.",
  qrCode: "path_to_qr_code_image", // Path to a generated QR code for this drug
};

const ConsumerPage = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [drug, setDrug] = useState(null);
  const [delay, setDelay] = useState(300); // Adjust scanner delay if needed
  const previewStyle = {
    width: '100%',
    height: 'auto',
  };

  // Handle QR code scanning result
  const handleScan = (data: any) => {
    if (data) {
      setScanResult(data.text); // The text from the scanned QR code
      // Assuming the QR code contains an identifier that we can use to fetch drug details
      if (data.text === "12345") { // Mocking the data ID for example
        
      } else {
        alert("Invalid QR Code.");
        setDrug(null);
      }
    }
  };

  const handleError = (err: any) => {
    console.error(err);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col text-white">
      {/* Main Content */}
      <Consnav/>
      <div className="flex-grow flex items-center justify-center">

      
      <div className="flex-grow flex items-center justify-center">
    
    {/* Background Overlay */}
    {/* <div className="absolute inset-0 bg-opacity-60 bg-black"></div> */}

    {/* Card Container */}
    <br></br>
    <div className="w-full max-w-md p-6 bg-white border border-gray-200 mt-20 rounded-lg shadow-lg relative z-10">
      <DrugTransactionCard/>
    </div>
  </div>
  </div>
  </div>
  );
};

export default ConsumerPage;
