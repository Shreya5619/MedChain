import { useState, useEffect } from "react";
import ManuNav from "./components/manunav";
import QRCode from "react-qr-code";
import { createClient } from '@supabase/supabase-js';
import { sha256 } from 'js-sha256';
import { motion } from "framer-motion";
import { Plus, Calendar, Package, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { ethers } from "ethers";
import MedChainABI from "./MedChainABI.json";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const ManufacturerDashboard = () => {
  const [drugs, setDrugs] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const [formData, setFormData] = useState({
    manufacture_id: "",
    privkey: "",
    drugId: "",
    batchNumber: "",
    manufacturingDate: "",
    expiryDate: "",
  });

  useEffect(() => {
    const storedKey = localStorage.getItem("privateKey");
    const storedOrgId = localStorage.getItem("manufacture_id") || localStorage.getItem("orgId");

    if (storedKey || storedOrgId) {
      setFormData(prev => ({
        ...prev,
        manufacture_id: storedOrgId || "",
        privkey: storedKey || ""
      }));
    }

    checkStoredAuth();
    loadDrugsFromDB();
  }, []);

  const loadDrugsFromDB = async () => {
    try {
      const orgId = localStorage.getItem("manufacture_id") || localStorage.getItem("orgId");
      if (!orgId) return;

      const { data } = await supabase
        .from('Drug_batch')
        .select(`
          *,
          Drug (
            drug_name
          )
        `)
        .eq('manufactured_by', orgId)
        .order('created_on', { ascending: false });

      if (data) {
        console.log('Fetched drugs:', data);
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
      const isValid = await verifyManufacturer(storedOrgId, storedKey);
      if (isValid) setIsAuthenticated(true);
    }
  };

  const verifyManufacturer = async (manufacture_id, privateKey) => {
    try {
      const { data, error } = await supabase
        .from('Organization')
        .select('*')
        .eq('org_id', manufacture_id)
        .single();

      if (error || !data) return false;
      if (!data.verified || !data.org_type.includes('Manufacturer')) return false;

      const privateKeyHash = sha256(privateKey);
      return privateKeyHash === data.public_key ? { publicKey: data.public_key } : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleAuthenticate = async () => {
    if (!formData.manufacture_id || !formData.privkey) {
      alert('Please enter both ID and Private Key');
      return;
    }
    setAuthLoading(true);
    const result = await verifyManufacturer(formData.manufacture_id, formData.privkey);

    if (result) {
      localStorage.setItem("privateKey", formData.privkey);
      localStorage.setItem("manufacture_id", formData.manufacture_id);
      localStorage.setItem("publicKey", result.publicKey);
      setIsAuthenticated(true);
    } else {
      alert("Authentication failed. Invalid ID or Key.");
    }
    setAuthLoading(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const storeDrugInSupabase = async (blockchainDrugId, quantity = 1000) => {
    const { error } = await supabase.from('Drug_batch').insert({
      batch_id: blockchainDrugId,
      created_on: new Date().toISOString(),
      expiry_date: formData.expiryDate,
      quantity: quantity,
      status: "Manufactured",
      manufactured_by: localStorage.getItem("orgId") || localStorage.getItem("manufacture_id"),
      drug_id: formData.drugId
    });
    if (error) throw error;
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      const publickey = localStorage.getItem("publicKey");
      const orgId = localStorage.getItem("manufacture_id") || localStorage.getItem("orgId");

      if (!publickey) { alert("Please authenticate first"); return; }
      if (!window.ethereum) { alert("MetaMask is required!"); return; }

      // 0. Fetch Config
      const configRes = await fetch("http://localhost:5000/config");
      const config = await configRes.json();
      const CONTRACT_ADDRESS = config.contract_address;

      if (!CONTRACT_ADDRESS) throw new Error("Contract address not found");

      // 1. Generate ID (Using Backend Helper)
      const genResponse = await fetch("http://localhost:5000/genId", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drugId: formData.drugId,
          batch: formData.drugId, // Note: Backend uses 'batch' param for seed
          manuDate: formData.manufacturingDate,
          expDate: formData.expiryDate,
          manufacturer_pub_key: publickey,
        }),
      });

      const genResult = await genResponse.json();
      if (!genResponse.ok) throw new Error(genResult.error || "Failed to generate ID");

      const blockchainDrugId = genResult.drug_id;

      // 2. Blockchain Transaction via MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, MedChainABI, signer);

      const status = "Manufactured";
      const receiverPubKey = "manufactured"; // Placeholder or specific logic

      console.log("Sending Transaction...", {
        drugId: formData.drugId,
        batch: blockchainDrugId,
        sender: publickey,
        receiver: receiverPubKey,
        status: status
      });

      const tx = await contract.addTransaction(
        formData.drugId,
        blockchainDrugId,
        publickey,
        receiverPubKey,
        status
      );

      console.log("Transaction Sent:", tx.hash);
      await tx.wait(); // Wait for confirmation
      console.log("Transaction Confirmed");

      // 3. Store in Backend (DB)
      const addResponse = await fetch("http://localhost:5000/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drugId: formData.drugId,
          batchId: blockchainDrugId,
          senderPubKey: publickey,
          receiverPubKey: receiverPubKey,
          status: status,
          tx_hash: tx.hash
        }),
      });
      const addResult = await addResponse.json();
      if (!addResponse.ok) throw new Error(addResult.error || "Failed to add transaction to DB");

      // 4. Store in Supabase
      await storeDrugInSupabase(blockchainDrugId);

      // 5. Update UI
      await loadDrugsFromDB();
      setFormData({ ...formData, drugId: "", batchNumber: "", manufacturingDate: "", expiryDate: "" });
      alert(`✅ Batch Created Successfully!\nBatch ID: ${blockchainDrugId}\nTx Hash: ${tx.hash}`);

    } catch (error) {
      console.error("Upload Error:", error);
      alert(`Failed: ${error.message || error.reason || error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setDrugs([]);
  };

  return (
    <div className="min-h-screen bg-med-cream font-sans">
      <ManuNav />

      <div className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">

        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
            >
              <h2 className="text-3xl font-serif text-med-teal text-center mb-2">Manufacturer Portal</h2>
              <p className="text-center text-gray-500 mb-8">Authenticate with your secure credentials</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization ID</label>
                  <input
                    type="text"
                    name="manufacture_id"
                    value={formData.manufacture_id}
                    onChange={handleFormChange}
                    placeholder="Enter Org ID"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-med-teal focus:border-med-teal outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Private Key</label>
                  <input
                    type="password"
                    name="privkey"
                    value={formData.privkey}
                    onChange={handleFormChange}
                    placeholder="Enter Private Key"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-med-teal focus:border-med-teal outline-none transition-all"
                  />
                </div>
                <button
                  onClick={handleAuthenticate}
                  disabled={authLoading}
                  className="w-full py-3 bg-med-teal text-white font-semibold rounded-xl hover:bg-med-teal/90 transition-all shadow-md disabled:opacity-70"
                >
                  {authLoading ? 'Verifying Credentials...' : 'Access Dashboard'}
                </button>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column: Create Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-6"
            >
              <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-med-teal-light rounded-xl text-med-teal">
                    <Plus size={24} />
                  </div>
                  <h2 className="text-2xl font-serif text-med-teal">New Batch</h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">Drug ID</label>
                    <input
                      name="drugId"
                      value={formData.drugId}
                      onChange={handleFormChange}
                      placeholder="e.g. Paracetamol-500"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-med-teal outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">Batch Number</label>
                    <input
                      name="batchNumber"
                      value={formData.batchNumber}
                      onChange={handleFormChange}
                      placeholder="e.g. BATCH-2024-001"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-med-teal outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-600">Mfg Date</label>
                      <input
                        type="date"
                        name="manufacturingDate"
                        value={formData.manufacturingDate}
                        onChange={handleFormChange}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-med-teal outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-600">Exp Date</label>
                      <input
                        type="date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleFormChange}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-med-teal outline-none text-sm"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="w-full py-4 mt-2 bg-med-teal text-white font-bold rounded-xl hover:bg-med-teal/90 transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <span>Processing...</span>
                    ) : (
                      <>
                        <Package size={20} />
                        <span>Create Batch</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Auth Status Card */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-green-100 bg-green-50/50 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-green-600" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-green-800">Authenticated</p>
                    <p className="text-xs text-green-600 font-mono truncate w-32">
                      {localStorage.getItem("manufacture_id")?.substring(0, 12)}...
                    </p>
                  </div>
                </div>
                <button onClick={handleLogout} className="text-xs font-semibold text-green-700 hover:underline">
                  Logout
                </button>
              </div>
            </motion.div>

            {/* Right Column: List */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif text-med-teal">Recent Batches</h2>
                <span className="px-4 py-1 bg-med-teal-light text-med-teal rounded-full text-sm font-semibold">
                  {drugs.length} Total
                </span>
              </div>

              <div className="space-y-4">
                {drugs.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-300">
                    <Package className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500">No active batches found.</p>
                  </div>
                ) : (
                  drugs.slice(0, 4).map((drug) => (
                    <div key={drug.batch_id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">
                            {drug.status}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">
                            {new Date(drug.created_on).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          {drug.Drug?.drug_name || drug.drug_id || "Unknown Drug"}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono bg-gray-50 p-1.5 rounded inline-block">
                          ID: {drug.batch_id}
                        </p>
                        <div className="flex space-x-6 mt-3 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Package size={14} />
                            <span>Qty: {drug.quantity}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar size={14} />
                            <span>Exp: {drug.expiry_date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-2 bg-white border border-gray-200 rounded-xl">
                        <QRCode value={drug.batch_id} size={80} level="M" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
