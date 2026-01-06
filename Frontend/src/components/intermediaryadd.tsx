import React, { useState } from 'react';
import { Package, Truck, User, FileText, Send } from 'lucide-react';

const IntermediaryAdd = () => {
  const [formData, setFormData] = useState({
    drugId: "",
    batchId: "",
    senderPubKey: "",
    receiverPubKey: "",
    status: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpload = async () => {
    setLoading(true);
    try {
      const sender = localStorage.getItem('intermediaryPublicKey') || localStorage.getItem('publicKey'); // Fallback check

      const response = await fetch("http://localhost:5000/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          drugId: formData.drugId,
          batchId: formData.batchId,
          senderPubKey: sender,
          receiverPubKey: formData.receiverPubKey,
          status: "in-transit"
        }),
      });

      if (response.ok) {
        alert("✅ Transaction successfully added to the ledger.");
        setFormData({
          drugId: "",
          batchId: "",
          senderPubKey: "",
          receiverPubKey: "",
          status: "",
          quantity: "",
        });
      } else {
        alert("Failed to add transaction. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-med-teal-light rounded-xl text-med-teal">
          <Truck size={24} />
        </div>
        <h2 className="text-2xl font-serif text-med-teal">Log Transaction</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600 flex items-center gap-1"><Package size={14} /> Drug ID</label>
          <input
            type="text"
            name="drugId"
            value={formData.drugId}
            onChange={handleChange}
            placeholder="e.g. DRUG-XYZ"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-med-teal outline-none transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600 flex items-center gap-1"><FileText size={14} /> Batch ID</label>
          <input
            type="text"
            name="batchId"
            value={formData.batchId}
            onChange={handleChange}
            placeholder="e.g. BATCH-001"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-med-teal outline-none transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600 flex items-center gap-1"><User size={14} /> Receiver Public Key</label>
          <input
            type="text"
            name="receiverPubKey"
            value={formData.receiverPubKey}
            onChange={handleChange}
            placeholder="Receiver Public Key or Org ID"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-med-teal outline-none transition-all"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="e.g. 500"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-med-teal outline-none transition-all"
          />
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
              <Send size={18} />
              <span>Record Transaction</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default IntermediaryAdd;
