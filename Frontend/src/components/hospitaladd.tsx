import React, { useState } from 'react';
import { Package, User, FileText, Send, Activity, Info } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const HospitalAdd = () => {
  const [formData, setFormData] = useState({
    drugId: "",
    batch: "",
    sender: "",
    receiver: "",
    quantity: "",
    details: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpload = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          drug_id: formData.drugId,
          batch: formData.batch,
          sender: formData.sender,
          receiver: formData.receiver
        }),
      });

      if (response.ok) {
        alert("✅ Transaction successfully added to the ledger.");
        setFormData({
          drugId: "",
          batch: "",
          sender: "",
          receiver: "",
          quantity: "",
          details: "",
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
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-med-teal-light rounded-xl text-med-teal">
          <Activity size={24} />
        </div>
        <h2 className="text-3xl font-serif text-med-teal">Hospital Portal</h2>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-1.5 ml-1">
              <Package size={14} className="text-med-teal" /> Drug ID
            </label>
            <input
              type="text"
              name="drugId"
              value={formData.drugId}
              onChange={handleChange}
              placeholder="e.g. DRUG-XYZ"
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-med-teal outline-none transition-all placeholder:text-gray-300"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-1.5 ml-1">
              <FileText size={14} className="text-med-teal" /> Batch ID
            </label>
            <input
              type="text"
              name="batch"
              value={formData.batch}
              onChange={handleChange}
              placeholder="e.g. BATCH-001"
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-med-teal outline-none transition-all placeholder:text-gray-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-1.5 ml-1">
              <User size={14} className="text-med-teal" /> Sender
            </label>
            <input
              type="text"
              name="sender"
              value={formData.sender}
              onChange={handleChange}
              placeholder="Sender Address/ID"
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-med-teal outline-none transition-all placeholder:text-gray-300"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-1.5 ml-1">
              <User size={14} className="text-med-teal" /> Receiver
            </label>
            <input
              type="text"
              name="receiver"
              value={formData.receiver}
              onChange={handleChange}
              placeholder="Receiver Address/ID"
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-med-teal outline-none transition-all placeholder:text-gray-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-1.5 ml-1">
              <Activity size={14} className="text-med-teal" /> Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="0"
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-med-teal outline-none transition-all placeholder:text-gray-300"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-1.5 ml-1">
              <Info size={14} className="text-med-teal" /> Details
            </label>
            <input
              type="text"
              name="details"
              value={formData.details}
              onChange={handleChange}
              placeholder="Notes or conditions"
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-med-teal outline-none transition-all placeholder:text-gray-300"
            />
          </div>
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full py-4 mt-4 bg-med-teal text-white font-bold rounded-2xl hover:bg-med-teal/90 transition-all shadow-lg hover:shadow-med-teal/20 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed group"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            <>
              <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              <span>Record to Blockchain</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default HospitalAdd;
