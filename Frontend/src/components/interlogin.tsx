import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { sha256 } from 'js-sha256';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'
);

interface LicenseFormData {
  name: string;
  email: string;
  wholesaleLicense: string;
  distributionAuth: string;
  pharmaDealerLicense: string;
  importExportLicense: string;
  complianceDoc: string;
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

  const [success, setSuccess] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const id = uuidv4();
      const { privateKey, publicKey } = generateKeyPair();

      const { error: orgError } = await supabase
        .from('Organization')
        .insert({
          org_id: id,
          org_type: ['Intermediary'],
          name: formData.name,
          email: formData.email,
          public_key: publicKey,
        });

      if (orgError) throw orgError;

      const { error: interror } = await supabase
        .from('Intermediary').insert({
          id,
          "Wholesale Distributor License": formData.wholesaleLicense,
          "Drug Distribution Authorization": formData.distributionAuth,
          "Pharmaceutical Dealer License": formData.pharmaDealerLicense,
          "Drug Import/Export License": formData.importExportLicense,
          "Compliance with Storage/Handling Regulations": formData.complianceDoc,
        });

      if (interror) throw interror;
      setSuccess(true);
      localStorage.setItem('intermediaryId', id);
      localStorage.setItem('intermediaryPrivateKey', privateKey);
      localStorage.setItem('intermediaryPublicKey', publicKey);

      alert(
        `✅ Account created successfully!\n\n` +
        `Org ID: ${id}\n` +
        `Private Key: ${privateKey}\n` +
        `Public Key: ${publicKey}\n\n` +
        `⚠️  SAVE THESE KEYS SAFELY - THEY WON'T BE SHOWN AGAIN!\n\n` +
        `📧 Verification email will be sent to ${formData.email} shortly.`
      );

    } catch (err) {
      console.error(err);
      alert('Failed to create account. Try again.');
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
        <h2 className="text-3xl font-serif text-med-teal mb-2">Intermediary Registration</h2>
        <p className="text-gray-500">Join the distribution network.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Company Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. FastTrack Logistics"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-med-teal focus:border-med-teal outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Wholesale License</label>
            <input
              type="text"
              name="wholesaleLicense"
              required
              value={formData.wholesaleLicense}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-med-teal focus:border-med-teal outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Distribution Auth</label>
            <input
              type="text"
              name="distributionAuth"
              required
              value={formData.distributionAuth}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-med-teal focus:border-med-teal outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Pharma Dealer License</label>
          <input
            type="text"
            name="pharmaDealerLicense"
            required
            value={formData.pharmaDealerLicense}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-med-teal focus:border-med-teal outline-none transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Import/Export License</label>
          <input
            type="text"
            name="importExportLicense"
            value={formData.importExportLicense}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-med-teal focus:border-med-teal outline-none transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Compliance Document</label>
          <input
            type="text"
            name="complianceDoc"
            required
            value={formData.complianceDoc}
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

export default InterCard;
