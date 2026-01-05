import { useState, useEffect } from "react";
import ManuNav from "./components/manunav";
import QRCode from "react-qr-code";
import { createClient } from '@supabase/supabase-js';
import { sha256 } from 'js-sha256';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid

// Supabase client
console.log(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
console.log("Supabase client initialized:", supabase);

const ManufacturerDashboard = () => {
  const [drugs, setDrugs] = useState([]);
  const [privatekey, setPrivateKey] = useState("");
  const [publickey, setPublicKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    publickey: "",
    privkey: "",
    manufacture_id: "",
    drugId: "",
    drugName: "",
    batchNumber: "",
    manufacturingDate: "",
    expiryDate: "",
  });

  useEffect(() => {
    // Pre-fill form data from local storage if available
    const storedOrgId = localStorage.getItem("manufacture_id") || localStorage.getItem("orgId");
    const storedPrivKey = localStorage.getItem("privateKey");
    const storedPubKey = localStorage.getItem("publicKey");

    if (storedOrgId) {
      setFormData(prev => ({
        ...prev,
        manufacture_id: storedOrgId,
        privkey: storedPrivKey || "",
        publickey: storedPubKey || ""
      }));
    }

    checkStoredAuth();
    loadDrugsFromDB(); // Load existing drugs from Supabase
  }, []);

  // Load drugs from Drug_batch table
  const loadDrugsFromDB = async () => {
    try {
      const { data, error } = await supabase
        .from('Drug_batch')
        .select('*')
        .select('*')
        .eq('manufactured_by', localStorage.getItem("manufacture_id") || localStorage.getItem("orgId"))
        .order('created_on', { ascending: false });

      if (data) {
        setDrugs(data);
      }
    } catch (error) {
      console.error('Failed to load drugs:', error);
    }
  };

  const checkStoredAuth = async () => {
    const storedKey = localStorage.getItem("privateKey");
    const storedOrgId = localStorage.getItem("manufacture_id") || localStorage.getItem("orgId");
    if (storedKey && storedOrgId) {
      const verificationResult = await verifyManufacturer(storedOrgId, storedKey);
      if (verificationResult) {
        setPrivateKey(storedKey);
        setPublicKey(verificationResult.publicKey);
        setIsAuthenticated(true);
      } else {
        // Validation failed, but do NOT clear localStorage automatically.
        // This allows the user to correct the issue or wait for verification without losing their keys.
        console.warn("Stored credentials verification failed");
        setIsAuthenticated(false);
      }
    }
  };

  const verifyManufacturer = async (manufacture_id, privateKey) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Organization')
        .select('*')
        .eq('org_id', manufacture_id)
        .single();

      if (error || !data) {
        alert('Manufacturer ID not found in database');
        return null;
      }
      console.log("Fetched organization data:", data);
      if (!data.verified) {
        setLoading(false);
        alert('Your account is not verified yet. Please wait for the verification email.');
        return;
      }
      if (!data.org_type.includes('Manufacturer')) {
        setLoading(false);
        alert('Organization is not registered as a manufacturer');
        return;
      }

      const privateKeyHash = sha256(privateKey);
      console.log("Computed private key hash:", privateKeyHash);

      if (privateKeyHash === data.public_key) {
        return { publicKey: data.public_key, orgId: manufacture_id };
      } else {
        alert('Private key does not match stored public key hash');
        return null;
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('Verification failed');
      return null;
    } finally {
      setLoading(false);
    }
  };



  const handleSavePrivateKey = async () => {
    if (!formData.manufacture_id || !formData.privkey) {
      alert('Please enter both Manufacture ID and Private Key');
      return;
    }

    const result = await verifyManufacturer(formData.manufacture_id, formData.privkey);
    if (result) {
      localStorage.setItem("privateKey", formData.privkey);
      localStorage.setItem("manufacture_id", formData.manufacture_id);
      localStorage.setItem("publicKey", result.publicKey);

      setPrivateKey(formData.privkey);
      setPublicKey(result.publicKey);
      setIsAuthenticated(true);

      setFormData({
        ...formData,
        privkey: "",
        manufacture_id: "",
      });

      alert("Manufacturer authenticated successfully!");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // 🚀 NEW: Store in Drug_batch table
  const storeDrugInSupabase = async (blockchainDrugId, quantity = 1000) => {
    try {// Generate UUID for batch_id

      const { error } = await supabase
        .from('Drug_batch')
        .insert({
          batch_id: blockchainDrugId,
          created_on: new Date().toISOString(),
          expiry_date: formData.expiryDate,
          quantity: quantity,
          status: "Manufactured",
          manufactured_by: localStorage.getItem("orgId"),
          drug_id: formData.drugId// Store blockchain drug ID
        });

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      console.log('✅ Drug stored in Drug_batch:', blockchainDrugId);
      return blockchainDrugId;
    } catch (error) {
      console.error('Failed to store in Supabase:', error);
      throw error;
    }
  };

  const handleUpload = async () => {
    try {
      const publickey = localStorage.getItem("publicKey");
      if (!publickey) {
        alert("Please authenticate first");
        return;
      }

      // 1. Generate blockchain drug ID
      const response = await fetch("http://localhost:5000/genId", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drug_name: formData.drugId,
          batch: formData.drugId,
          manu_date: formData.manufacturingDate,
          exp_date: formData.expiryDate,
          manufacturer: publickey,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        alert("Failed to generate Drug ID: " + (result.error || "Unknown error"));
        return;
      }

      const blockchainDrugId = result.drug_id;
      const resp = await fetch("http://localhost:5000/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          drug_id: blockchainDrugId,
          batch: formData.drugId,
          sender: localStorage.getItem("orgId"),
          receiver: "Supply Chain",
          status: "manufactured",
          location: "Unknown",
        }),
      });
      if (response.ok) {
        setFormData({
          drugId: "",
          drugName: "",
          batchNumber: "",
          manufacturingDate: "",
          expiryDate: "",
        });
      } else {
        alert("Failed to add transaction");
      }
      // 2. Store in Supabase Drug_batch table
      await storeDrugInSupabase(blockchainDrugId);

      // 3. Refresh drugs list
      await loadDrugsFromDB();

      // 4. Reset form
      setFormData({
        drugId: "",
        drugName: "",
        batchNumber: "",
        manufacturingDate: "",
        expiryDate: "",
      });

      alert(`✅ Drug batch created!\nBatch ID: ${blockchainDrugId}\nStatus: Manufactured`);

    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed: " + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setPrivateKey("");
    setPublicKey("");
    setIsAuthenticated(false);
    setDrugs([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="text-white text-xl">Verifying manufacturer...</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col min-h-screen">
      <ManuNav />

      {isAuthenticated ? (
        <div className="flex flex-col items-center p-20 flex-grow">
          {/* Auth Status */}
          <div className="w-full max-w-md bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <div className="flex justify-between items-center">
              <span>✅ Authenticated: {localStorage.getItem("manufacture_id") || localStorage.getItem("orgId")}</span>
              <button onClick={handleLogout} className="text-sm underline hover:text-green-900">
                Logout
              </button>
            </div>
          </div>

          {/* Upload Form */}
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
              Create New Drug Batch
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700">Drug ID</h3>
                <input
                  type="text"
                  placeholder="Enter Drug ID"
                  name="drugId"
                  value={formData.drugId}
                  onChange={handleFormChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700">Batch Number</h3>
                <input
                  type="text"
                  placeholder="Enter Batch Number"
                  name="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleFormChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">Manufacturing Date</h3>
                  <input
                    type="date"
                    name="manufacturingDate"
                    value={formData.manufacturingDate}
                    onChange={handleFormChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">Expiry Date</h3>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleFormChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>
              </div>
              <button
                onClick={handleUpload}
                className="w-full py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition"
              >
                🚀 Create & Store Batch
              </button>
            </div>
          </div>

          {/* Drug Batches List */}
          <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-center text-purple-600 mb-6">
              Drug Batches ({drugs.length})
            </h3>
            {drugs.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No batches created yet.</p>
            ) : (
              drugs.map((drug) => (
                <div key={drug.batch_id} className="border-b pb-6 mb-6 last:border-b-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                    <div>
                      <p className="text-gray-700 mb-1"><strong>Batch ID:</strong></p>
                      <p className="font-mono text-sm bg-blue-50 p-3 w-128 rounded-lg">{drug.batch_id}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p><strong>Quantity:</strong> {drug.quantity}</p>
                      <p><strong>Created:</strong> {new Date(drug.created_on).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p><strong>Status:</strong>
                        <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${drug.status === 'Manufactured'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                          }`}>
                          {drug.status}
                        </span>
                      </p>
                      <p><strong>Expiry:</strong> {drug.expiry_date}</p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <QRCode value={drug.batch_id} size={140} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        // Login form (unchanged)
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
          {/* ... your existing login form ... */}
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold text-center text-purple-600 mb-8">
              Manufacturer Login
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Organisation ID
                </label>
                <input
                  type="text"
                  placeholder="Enter your org_id from database"
                  name="manufacture_id"
                  value={formData.manufacture_id}
                  onChange={handleFormChange}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Private Key
                </label>
                <input
                  type="password"
                  name="privkey"
                  value={formData.privkey}
                  onChange={handleFormChange}
                  placeholder="Enter your private key (64 hex chars)"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent placeholder:text-gray-400"
                />
              </div>
              <button
                onClick={handleSavePrivateKey}
                disabled={loading}
                className="w-full py-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Authenticate'}
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              Your private key will be SHA256 hashed and compared with stored public_key
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManufacturerDashboard;
