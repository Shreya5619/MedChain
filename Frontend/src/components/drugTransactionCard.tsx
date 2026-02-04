import React, { useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, Search, Scan, Package, MapPin, User, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TransactionDetails {
  drugId: string;
  batch: string;
  senderPubKey: string;
  receiverPubKey: string;
  status: string;
  timestamp: number;
}

const DrugTransactionCard: React.FC = () => {
  const [batchId, setBatchId] = useState<string>('');
  const [transactions, setTransactions] = useState<TransactionDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Initialize scanner when isScanning becomes true
  React.useEffect(() => {
    let scanner: any;
    if (isScanning) {
      // Small timeout to ensure DOM element exists
      setTimeout(() => {
        scanner = new Html5QrcodeScanner(
          "reader",
          { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );

        scanner.render(
          (decodedText: string) => {
            handleScan(decodedText);
            scanner.clear();
          },
          (error: any) => {
            // Ignore scanning errors as they happen frequently while searching
          }
        );
      }, 100);
    }

    return () => {
      if (scanner) {
        scanner.clear().catch((error: any) => console.error("Failed to clear scanner", error));
      }
    };
  }, [isScanning]);

  const fetchDrugData = async (query: string) => {
    setLoading(true);
    try {
      const BACKEND_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : process.env.BACKEND_URL;
      const response = await fetch(`${BACKEND_URL}/searchDrug`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchId: query }),
      });
      const data = await response.json();
      if (data.drug_transactions) {
        setTransactions(data.drug_transactions);
      } else {
        setTransactions([]);
        alert("No transactions found for this Batch ID.");
      }
    } catch (error) {
      console.error("Error fetching drug data:", error);
      alert("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const handleScan = (decodedText: string) => {
    setBatchId(decodedText);
    setIsScanning(false);
    fetchDrugData(decodedText);
  };

  const handleSearch = () => {
    if (!batchId) return;
    fetchDrugData(batchId);
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-med-teal mb-2">Track & Trace</h2>
        <p className="text-gray-500">Scan a QR code or enter Batch ID to view history.</p>
      </div>

      {/* Search Input */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            placeholder="Enter Batch ID (e.g. BATCH-001)"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-med-teal focus:border-med-teal outline-none transition-all"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-8 py-4 bg-med-teal text-white font-bold rounded-xl hover:bg-med-teal/90 transition-all shadow-md disabled:opacity-70"
        >
          {loading ? 'Searching...' : 'Track'}
        </button>
        <button
          onClick={() => setIsScanning(!isScanning)}
          className="px-6 py-4 bg-med-teal-light text-med-teal font-bold rounded-xl hover:bg-med-teal/20 transition-all flex items-center gap-2"
        >
          <Scan size={20} />
          {isScanning ? 'Close Scan' : 'Scan QR'}
        </button>
      </div>

      {/* QR Scanner */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-8 overflow-hidden rounded-2xl bg-black relative"
          >
            {/* The scanner will be rendered here */}
            <div id="reader" className="w-full"></div>

            <button
              onClick={() => setIsScanning(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md z-10"
            >
              <X size={20} />
            </button>
            <p className="absolute bottom-4 left-0 right-0 text-center text-white/80 text-sm pointer-events-none z-10">
              Align QR code within the frame
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Timeline */}
      <div className="space-y-6">
        {transactions.length > 0 && (
          <div className="relative border-l-2 border-med-teal/20 ml-6 space-y-8 pl-8 py-2">
            {transactions.map((t, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[41px] top-0 p-1 bg-white border-2 border-med-teal rounded-full">
                  <div className="w-4 h-4 bg-med-teal rounded-full"></div>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">
                          {t.status}
                        </span>
                        <span className="text-gray-400 text-xs flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(t.timestamp * 1000).toLocaleString()}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{t.batch.substring(0, 10)}...</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 font-mono bg-white border border-gray-200 px-2 py-1 rounded inline-block">
                        ID: {t.drugId.substring(0, 10)}...
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-med-teal" />
                      <span>Sender: {t.senderPubKey.substring(0, 12)}...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-med-teal" />
                      <span>Receiver: {t.receiverPubKey == "manufactured" ? "" : t.receiverPubKey.substring(0, 12)}...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DrugTransactionCard;
