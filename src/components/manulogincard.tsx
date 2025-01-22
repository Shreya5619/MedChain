import React, { useState } from 'react';

interface LicenseFormData {
  manufacturerLicense: string;
  facilityLicense: string;
  gmpCertification: string;
  importExportLicense: string;
  batchRegistration: string;
  email: string;
}

const ManuCard: React.FC = () => {
  const [formData, setFormData] = useState<LicenseFormData>({
    email: '',
    manufacturerLicense: '',
    facilityLicense: '',
    gmpCertification: '',
    importExportLicense: '',
    batchRegistration: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/createAccount", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        alert(`Your account has been created successfully\n Private Key : ${data.privateKey}\n Public Key : ${data.publicAddress}`);
      } else {
        alert("Failed to add transaction");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    // Handle form submission (e.g., send data to the server)
  };

  return (
    <div className="flex-grow flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-center mb-6">
          <span className="ml-4 text-3xl font-montserrat font-bold text-purple-600">MED CHAIN</span>
        </div>

        <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white mb-4">Manufacturer License Form</h2>

        <form onSubmit={handleSubmit}>
        <div className="mb-4 text-black">
            <label htmlFor="EmailId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email ID</label>
            <input 
              type="text" 
              placeholder="Enter your Email Id" 
              name="email"
              id="email"
              required 
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
            />
          </div>
          <div className="mb-4 text-black">
            <label htmlFor="manufacturerLicense" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Manufacturer License</label>
            <input 
              type="text" 
              id="manufacturerLicense" 
              name="manufacturerLicense" 
              placeholder="Enter Manufacturer License Number" 
              required 
              value={formData.manufacturerLicense}
              onChange={handleChange}
              className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
            />
          </div>

          <div className="mb-4 text-black">
            <label htmlFor="facilityLicense" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Drug Manufacturing Facility License</label>
            <input 
              type="text" 
              id="facilityLicense" 
              name="facilityLicense" 
              placeholder="Enter Facility License Number" 
              required 
              value={formData.facilityLicense}
              onChange={handleChange}
              className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
            />
          </div>

          <div className="mb-4 text-black">
            <label htmlFor="gmpCertification" className="block text-sm font-medium text-gray-700 dark:text-gray-300">GMP Certification</label>
            <input 
              type="text" 
              id="gmpCertification" 
              name="gmpCertification" 
              placeholder="Enter GMP Certification Number" 
              required 
              value={formData.gmpCertification}
              onChange={handleChange}
              className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
            />
          </div>

          <div className="mb-4 text-black">
            <label htmlFor="importExportLicense" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Drug Import/Export License (if applicable)</label>
            <input 
              type="text" 
              id="importExportLicense" 
              name="importExportLicense" 
              placeholder="Enter Import/Export License Number" 
              value={formData.importExportLicense}
              onChange={handleChange}
              className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
            />
          </div>

          <div className="mb-4 text-black">
            <label htmlFor="batchRegistration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Batch/Drug Registration Number</label>
            <input 
              type="text" 
              id="batchRegistration" 
              name="batchRegistration" 
              placeholder="Enter Batch/Drug Registration Number" 
              required 
              value={formData.batchRegistration}
              onChange={handleChange}
              className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
            />
          </div>

          <button 
            type="submit" 
            onClick={handleSubmit}
            className="w-full bg-purple-600 hover:bg-primaryHover text-white font-bold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          >
            Submit License Information
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManuCard;
