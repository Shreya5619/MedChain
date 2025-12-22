import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { sha256 } from 'js-sha256'; // npm install uuid js-sha256 @supabase/supabase-js

// Initialize Supabase - replace with your actual values
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'
);

interface LicenseFormData {
  manufacturerLicense: string;
  facilityLicense: string;
  gmpCertification: string;
  importExportLicense: string;
  batchRegistration: string;
  email: string;
  name: string; // Added for manufacturer name
}

const ManuCard: React.FC = () => {
  const [formData, setFormData] = useState<LicenseFormData>({
    email: '',
    manufacturerLicense: '',
    facilityLicense: '',
    gmpCertification: '',
    importExportLicense: '',
    batchRegistration: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Generate random private key (32 bytes hex) and derive public key (SHA256 hash)
  const generateKeyPair = (): { privateKey: string; publicKey: string } => {
    const privateKey = Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    const publicKey = sha256(privateKey); // SHA256 hash as public key
    return { privateKey, publicKey };
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    // 1. Generate UUID and keypair
    const orgId = uuidv4();
    const { privateKey, publicKey } = generateKeyPair();

    // 2. Insert into Organization first
    const { error: orgError } = await supabase
      .from('Organization')
      .insert({
        org_id: orgId,
        org_type: ['manufacturer'],
        name: formData.name,
        email: formData.email,
        public_key: publicKey,
        // created_at will be default now()
        // verified will be default null
      });

    if (orgError) throw orgError;

    // 3. Insert into Manufacturer table using the same org_id
    const { error: manuError } = await supabase
      .from('Manufacturer')
      .insert({
        org_id: orgId,
        // add any manufacturer-specific columns that still exist
      });

    if (manuError) throw manuError;

    // 4. Store in localStorage
    localStorage.setItem('orgId', orgId);
    localStorage.setItem('privateKey', privateKey);
    localStorage.setItem('publicKey', publicKey);

    setSuccess(true);

    alert(
      `✅ Account created successfully!\n\n` +
      `Org ID: ${orgId}\n` +
      `Private Key: ${privateKey}\n` +
      `Public Key: ${publicKey}\n\n` +
      `⚠️  SAVE THESE KEYS SAFELY - THEY WON'T BE SHOWN AGAIN!\n\n` +
      `📧 Verification email will be sent to ${formData.email} shortly.`
    );
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to create account. Please try again.');
  } finally {
    setLoading(false);
  }
};


  if (success) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center p-8  bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-green-600 mb-4">✅ Registration Successful!</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Check your email for verification. Your keys are saved in localStorage.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-purple-600 hover:bg-purple-700 text-black font-bold py-2 px-6 rounded-lg"
          >
            Register Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-center mb-6">
          <span className="ml-4 text-3xl font-montserrat font-bold text-purple-600">MED CHAIN</span>
        </div>

        <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Manufacturer License Form
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Name field added */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Manufacturer Name
            </label>
            <input 
              type="text" 
              name="name"
              id="name"
              placeholder="Enter Manufacturer Name" 
              required 
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm focus:ring-purple-500 focus:border-purple-500 "
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email ID
            </label>
            <input 
              type="email" 
              name="email"
              id="email"
              placeholder="Enter your Email" 
              required 
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm focus:ring-purple-500 focus:border-purple-500 "
            />
          </div>

          {/* Rest of your existing fields - unchanged */}
          <div className="mb-4">
            <label htmlFor="manufacturerLicense" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Drug Manufacturing Facility License
            </label>
            <input 
              type="text" 
              name="manufacturerLicense" 
              id="manufacturerLicense" 
              placeholder="Enter License Number" 
              value={formData.manufacturerLicense}
              onChange={handleChange}
              className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm focus:ring-purple-500 focus:border-purple-500 "
            />
          </div>

          <div className="mb-4">
            <label htmlFor="facilityLicense" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              GMP Certification
            </label>
            <input 
              type="text" 
              name="facilityLicense" 
              id="facilityLicense" 
              placeholder="Enter GMP Number"  
              value={formData.facilityLicense}
              onChange={handleChange}
              className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm focus:ring-purple-500 focus:border-purple-500 "
            />
          </div>

          <div className="mb-4">
            <label htmlFor="gmpCertification" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Import/Export License (optional)
            </label>
            <input 
              type="text" 
              name="gmpCertification" 
              id="gmpCertification" 
              placeholder="Enter License Number" 
              value={formData.gmpCertification}
              onChange={handleChange}
              className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm focus:ring-purple-500 focus:border-purple-500 "
            />
          </div>

          <div className="mb-4">
            <label htmlFor="importExportLicense" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Batch/Drug Registration Number
            </label>
            <input 
              type="text" 
              name="importExportLicense" 
              id="importExportLicense" 
              placeholder="Enter Registration Number"
              value={formData.importExportLicense}
              onChange={handleChange}
              className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm focus:ring-purple-500 focus:border-purple-500 "
            />
          </div>

          <div className="mb-4">
            <label htmlFor="batchRegistration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Batch Registration Number
            </label>
            <input 
              type="text" 
              name="batchRegistration" 
              id="batchRegistration" 
              placeholder="Enter Batch Number"  
              value={formData.batchRegistration}
              onChange={handleChange}
              className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm focus:ring-purple-500 focus:border-purple-500 "
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {loading ? 'Creating Account...' : 'Submit License Information'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManuCard;
