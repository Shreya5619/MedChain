import React, { useState } from "react";
import { Search, Package, Clock, Hash, MapPin, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const DrugsByManufacturer = () => {
  const [manufacturer, setManufacturer] = useState("");
  const [drugDetails, setDrugDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!manufacturer) {
      alert("Please enter a manufacturer public key or name.");
      return;
    }
    setLoading(true);
    setHasSearched(true);
    try {
      const response = await fetch(`http://localhost:5000/drugsByManufacturer?manufacturer=${manufacturer}`);
      const data = await response.json();
      if (data && data.length > 0) {
        setDrugDetails(data);
      } else {
        setDrugDetails([]);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-med-teal mb-2">Blockchain Records</h2>
        <p className="text-gray-500">View all transactions associated with a manufacturer key.</p>
      </div>

      {/* Search Input */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            placeholder="Enter Manufacturer Public Key"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-med-teal focus:border-med-teal outline-none transition-all font-mono text-sm"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-8 py-4 bg-med-teal text-white font-bold rounded-xl hover:bg-med-teal/90 transition-all shadow-md disabled:opacity-70 whitespace-nowrap"
        >
          {loading ? 'Fetching...' : 'View Records'}
        </button>
      </div>

      {/* Results List */}
      <div className="space-y-6">
        {drugDetails.length > 0 ? (
          drugDetails.map((drug: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between mb-4 border-b border-gray-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-med-teal-light text-med-teal rounded-lg">
                    <Package size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Block #{drug.BlockHeight}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(drug.Timestamp * 1000).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${drug.TransactionDetails.Status === 'manufactured' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                    {drug.TransactionDetails.Status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1 flex items-center gap-1"><Hash size={14} /> Batch ID</p>
                  <p className="font-mono bg-white p-2 rounded border border-gray-200 truncate" title={drug.TransactionDetails.BatchID}>
                    {drug.TransactionDetails.BatchID}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1 flex items-center gap-1"><Hash size={14} /> Drug ID</p>
                  <p className="font-mono bg-white p-2 rounded border border-gray-200 truncate" title={drug.TransactionDetails.DrugID}>
                    {drug.TransactionDetails.DrugID}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-500 mb-1 flex items-center gap-1"><MapPin size={14} /> Location</p>
                  <p className="font-medium text-gray-800">{drug.TransactionDetails.Location}</p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          hasSearched && !loading && (
            <div className="text-center py-12">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-gray-300" size={32} />
              </div>
              <p className="text-gray-500">No blockchain records found for this key.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DrugsByManufacturer;
