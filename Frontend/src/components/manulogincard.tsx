import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { sha256 } from 'js-sha256';

// Initialize Supabase
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
  name: string;
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

  const generateKeyPair = (): { privateKey: string; publicKey: string } => {
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
      const orgId = uuidv4();
      const { privateKey, publicKey } = generateKeyPair();

      const { error: orgError } = await supabase
        .from('Organization')
        .insert({
          org_id: orgId,
          org_type: ['Manufacturer'],
          name: formData.name,
          email: formData.email,
          public_key: publicKey,
        });

      if (orgError) throw orgError;

      const { error: manuError } = await supabase
        .from('Manufacturer')
        .insert({
          org_id: orgId,
          manufacturer_license: formData.manufacturerLicense,
          gmp_certification: formData.gmpCertification,
          import_export_license: formData.importExportLicense,
          batch_registration: formData.batchRegistration,
        });

      if (manuError) throw manuError;

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
      <div className="text-center p-8 bg-green-50 border border-green-200 rounded-xl">
        <h2 className="text-2xl font-serif text-med-teal mb-4">Registration Successful!</h2>
        <p className="text-gray-700 mb-6 font-sans">
          Check your email for verification. Your keys are saved in localStorage.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-med-teal hover:bg-med-teal/90 text-white font-semibold py-3 px-8 rounded-full transition-all"
        >
          Register Another
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif text-med-teal mb-2">Manufacturer Registration</h2>
        <p className="text-gray-500">Enter your facility details and license information.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Manufacturer Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Apex Pharmaceuticals"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-med-teal focus:border-med-teal outline-none transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="contact@apexpharma.com"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-med-teal focus:border-med-teal outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Drug Mfg License</label>
            <input
              type="text"
              name="manufacturerLicense"
              placeholder="Lic. No 12345"
              value={formData.manufacturerLicense}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-med-teal focus:border-med-teal outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">GMP Certification</label>
            <input
              type="text"
              name="facilityLicense"
              placeholder="GMP-2024-XXX"
              value={formData.facilityLicense}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-med-teal focus:border-med-teal outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Import/Export Lic.</label>
            <input
              type="text"
              name="gmpCertification"
              placeholder="IE-999-XXX"
              value={formData.gmpCertification}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-med-teal focus:border-med-teal outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Batch Reg. Number</label>
            <input
              type="text"
              name="batchRegistration"
              placeholder="BRN-001"
              value={formData.batchRegistration}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-med-teal focus:border-med-teal outline-none transition-all"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Drug Reg. Number</label>
          <input
            type="text"
            name="importExportLicense"
            placeholder="DRN-555"
            value={formData.importExportLicense}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-med-teal focus:border-med-teal outline-none transition-all"
          />
        </div>


        <button
          type="submit"
          disabled={loading}
          className="w-full bg-med-teal hover:bg-med-teal/90 disabled:bg-gray-400 text-white font-bold py-4 rounded-full shadow-lg transition-all transform hover:scale-[1.01]"
        >
          {loading ? 'Processing...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default ManuCard;
