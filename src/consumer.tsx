import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // For routing
import QrReader from 'react-qr-scanner'; // Correct import for QR scanner

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
      <div className="flex-grow flex items-center justify-center">
        <div className="absolute inset-0 bg-opacity-60 bg-black"></div>

        <div className="relative z-10 w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-8 text-cyan-700">Scan Drug QR Code</h1>

          {/* QR Scanner */}
          <div>
            <QrReader
              delay={delay}
              style={previewStyle}
              onError={handleError}
              onScan={handleScan}
            />
            <p className="text-center mt-4">{scanResult ? `Scanned Result: ${scanResult}` : 'Scan a QR code to get drug details'}</p>
          </div>

          {/* Display Drug Details */}
          {/* {drug && (
            <div className="mt-6 text-center">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">{drug.name}</h2>
              <p className="text-lg mb-4 text-gray-700"><strong>Manufacturer:</strong> {drug.manufacturer}</p>
              <p className="text-lg mb-4 text-gray-700"><strong>Dosage:</strong> {drug.dosage}</p>
              <p className="text-lg mb-4 text-gray-700"><strong>Expiration Date:</strong> {drug.expirationDate}</p>
              <p className="text-md mb-6 text-gray-700">{drug.description}</p>

              <Link to="/buy" className="text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full">
                Buy Now
              </Link>
            </div>)} */}
        </div>
      </div>
    </div>
  );
};

export default ConsumerPage;
