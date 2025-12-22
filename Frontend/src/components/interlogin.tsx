import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { sha256 } from 'js-sha256';

// Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'
);

interface LicenseFormData {
  name: string;
  email: string;
  wholesaleLicense: string;          // Wholesale Distributor License
  distributionAuth: string;          // Drug Distribution Authorization
  pharmaDealerLicense: string;       // Pharmaceutical Dealer License
  importExportLicense: string;       // Drug Import/Export License
  complianceDoc: string;             // Compliance with Storage/Handling Regulations
}

const InterCard: React.FC = () => {
  const [formData, setFormData] = useState<LicenseFormData>({
    name: '',
    email: '',
    wholesaleLicense: '',
    distributionAuth: '',
    pharmaDealerLicense: '',
    importExportLicense: '',
    complianceDoc: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateKeyPair = () => {
    const privateKey = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    const publicKey = sha256(privateKey);
    return { privateKey, publicKey };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const id = uuidv4();
      const { privateKey, publicKey } = generateKeyPair();

      // Insert into your intermediary table
      // Adjust table name and column names to exactly match Supabase:
      // id (uuid, pk), email (text), public_key (text),
      // "Wholesale Di" (text), "Drug Distribu" (text),
      // "Pharmaceutic" (text), "Drug Import/" (text),
      // "Compliance v" (text), verified (bool)
      const { error } = await supabase.from('Intermediary').insert({
        id,
        Org_name: formData.name,
        email: formData.email,
        public_key: publicKey,
        "Wholesale Distributor License": formData.wholesaleLicense,
        "Drug Distribution Authorization": formData.distributionAuth,
        "Pharmaceutical Dealer License": formData.pharmaDealerLicense,
        "Drug Import/Export License": formData.importExportLicense,
        "Compliance with Storage/Handling Regulations": formData.complianceDoc,
      });

      if (error) throw error;

      localStorage.setItem('intermediaryId', id);
      localStorage.setItem('intermediaryPrivateKey', privateKey);
      localStorage.setItem('intermediaryPublicKey', publicKey);

      alert(
        `✅ Intermediary account created!\n\n` +
        `ID: ${id}\n` +
        `Private Key: ${privateKey}\n` +
        `Public Key: ${publicKey}\n\n` +
        `⚠️ Please store these keys safely. They will not be shown again.\n\n` +
        `📧 You will receive an email once your account is verified.`
      );
    } catch (err) {
      console.error(err);
      alert('Failed to create intermediary account. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-center mb-6">
          <span className="ml-4 text-3xl font-montserrat font-bold text-purple-600">MED CHAIN</span>
        </div>

        <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Intermediary License Form
        </h2>

        <form onSubmit={handleSubmit}>
           <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <input
              type="name"
              id="name"
              name="name"
              placeholder="Enter your Name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm
                         bg-white text-gray-900
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white
                         focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your Email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm
                         bg-white text-gray-900
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white
                         focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Wholesale Distributor License */}
          <div className="mb-4">
            <label
              htmlFor="wholesaleLicense"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Wholesale Distributor License
            </label>
            <input
              type="text"
              id="wholesaleLicense"
              name="wholesaleLicense"
              placeholder="Enter Wholesale Distributor License Number"
              required
              value={formData.wholesaleLicense}
              onChange={handleChange}
              className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm
                         bg-white text-gray-900
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white
                         focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Drug Distribution Authorization */}
          <div className="mb-4">
            <label
              htmlFor="distributionAuth"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Drug Distribution Authorization
            </label>
            <input
              type="text"
              id="distributionAuth"
              name="distributionAuth"
              placeholder="Enter Drug Distribution Authorization Number"
              required
              value={formData.distributionAuth}
              onChange={handleChange}
              className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm
                         bg-white text-gray-900
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white
                         focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Pharmaceutical Dealer License */}
          <div className="mb-4">
            <label
              htmlFor="pharmaDealerLicense"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Pharmaceutical Dealer License
            </label>
            <input
              type="text"
              id="pharmaDealerLicense"
              name="pharmaDealerLicense"
              placeholder="Enter Pharmaceutical Dealer License Number"
              required
              value={formData.pharmaDealerLicense}
              onChange={handleChange}
              className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm
                         bg-white text-gray-900
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white
                         focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Drug Import/Export License */}
          <div className="mb-4">
            <label
              htmlFor="importExportLicense"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Drug Import/Export License (if applicable)
            </label>
            <input
              type="text"
              id="importExportLicense"
              name="importExportLicense"
              placeholder="Enter Import/Export License Number"
              value={formData.importExportLicense}
              onChange={handleChange}
              className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm
                         bg-white text-gray-900
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white
                         focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Compliance with Storage/Handling Regulations */}
          <div className="mb-4">
            <label
              htmlFor="complianceDoc"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Compliance with Storage/Handling Regulations
            </label>
            <input
              type="text"
              id="complianceDoc"
              name="complianceDoc"
              placeholder="Enter Compliance Document Number"
              required
              value={formData.complianceDoc}
              onChange={handleChange}
              className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm
                         bg-white text-gray-900
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white
                         focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400
                       text-white font-bold py-2 px-4 rounded-lg shadow-md
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit License Information'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InterCard;
