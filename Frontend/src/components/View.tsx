import React, { useState } from "react";
import { Search, Package, Clock, Hash, MapPin, AlertCircle, CheckCircle, X } from "lucide-react";
import { motion } from "framer-motion";

const DrugsByUser = () => {
  const [user, setUser] = useState("");
  const [drugDetails, setDrugDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchTransactions = async () => {
    const storedUser = localStorage.getItem("publicKey");
    if (!storedUser) {
      // alert("Please authenticate first.");
      console.log("No public key found in local storage.");
      return;
    }
    setUser(storedUser);
    setLoading(true);
    setHasSearched(true);
    try {
      const response = await fetch(`http://localhost:5000/drugsByUser?user=${storedUser}`);
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

  React.useEffect(() => {
    fetchTransactions();
  }, []);

  const handleVerify = async (txHash: string, isLegit: boolean) => {
    if (!txHash || txHash === "Not Recorded") return;

    try {
      const response = await fetch('http://localhost:5000/verifyTransaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tx_hash: txHash, is_legit: isLegit })
      });

      if (response.ok) {
        if (isLegit) {
          alert("Transaction verified successfully!");
        } else {
          alert("Transaction marked as not legit.");
        }
        fetchTransactions();
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      alert("Error verifying transaction.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-med-teal mb-2">Blockchain Records</h2>
        <p className="text-gray-500">View all transactions associated with you.</p>
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
                    <h3 className="font-bold text-gray-900">Transaction #{index + 1}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(drug.timestamp * 1000).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${drug.status === 'manufactured' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                    {drug.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1 flex items-center gap-1"><Hash size={14} /> Batch ID</p>
                  <p className="font-mono bg-white p-2 rounded border border-gray-200 truncate" title={drug.batch}>
                    {drug.batch}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1 flex items-center gap-1"><Hash size={14} /> Drug ID</p>
                  <p className="font-mono bg-white p-2 rounded border border-gray-200 truncate" title={drug.drugId}>
                    {drug.drugId}
                  </p>
                </div>
                <div className="md:col-span-1">
                  <p className="text-gray-500 mb-1 flex items-center gap-1"><MapPin size={14} /> Sender</p>
                  <p className="font-mono bg-white p-2 rounded border border-gray-200 truncate" title={drug.senderPubKey}>
                    {drug.senderPubKey}
                  </p>
                </div>
                <div className="md:col-span-1">
                  <p className="text-gray-500 mb-1 flex items-center gap-1"><MapPin size={14} /> Receiver</p>
                  <p className="font-mono bg-white p-2 rounded border border-gray-200 truncate" title={drug.receiverPubKey}>
                    {drug.receiverPubKey}
                  </p>
                </div>
                <div className="md:col-span-1">
                  <p className="text-gray-500 mb-1 flex items-center gap-1"><Clock size={14} /> Timestamp</p>
                  <p className="font-mono bg-white p-2 rounded border border-gray-200 truncate">
                    {new Date(drug.timestamp * 1000).toLocaleString()}
                  </p>
                </div>
                <div className="md:col-span-1">
                  <p className="text-gray-500 mb-1 flex items-center gap-1"><AlertCircle size={14} /> Status</p>
                  <p className="font-mono bg-white p-2 rounded border border-gray-200 truncate">
                    {drug.status}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-500 mb-1 flex items-center gap-1"><Hash size={14} /> Transaction Hash</p>
                  {drug.tx_hash && drug.tx_hash !== "Not Recorded" ? (
                    <a
                      href={`https://sepolia.etherscan.io/tx/0x${drug.tx_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono bg-white p-2 rounded border border-gray-200 truncate text-xs text-blue-600 hover:text-blue-800 underline block"
                      title={drug.tx_hash}
                    >
                      {"0x" + drug.tx_hash}
                    </a>
                  ) : (
                    <p className="font-mono bg-white p-2 rounded border border-gray-200 truncate text-xs text-gray-600">
                      Not Recorded
                    </p>
                  )}
                </div>

                {/* Verification Section */}
                <div className="md:col-span-2 mt-2 bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Verification:</span>
                    {drug.verified ? (
                      <span className="text-green-600 flex items-center gap-1 font-semibold bg-green-50 px-2 py-1 rounded-md border border-green-100">
                        <CheckCircle size={16} /> Verified
                      </span>
                    ) : (
                      <span className="text-amber-600 flex items-center gap-1 font-semibold bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                        <AlertCircle size={16} /> Pending
                      </span>
                    )}
                  </div>

                  {!drug.verified && drug.tx_hash && drug.tx_hash !== "Not Recorded" && user === drug.receiverPubKey && (
                    <div className="flex items-center gap-3">
                      <p className="text-sm text-gray-500">Is this transaction legit?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVerify(drug.tx_hash, true)}
                          className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                          title="Verify (Legit)"
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button
                          onClick={() => handleVerify(drug.tx_hash, false)}
                          className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          title="Reject (Not Legit)"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  )}
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

export default DrugsByUser;
