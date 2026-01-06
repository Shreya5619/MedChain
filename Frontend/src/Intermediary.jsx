import { useState, useEffect } from "react";
import IntermediaryAdd from "./components/intermediaryadd";
import IntNav from "./components/intnav";
import { createClient } from '@supabase/supabase-js';
import { sha256 } from 'js-sha256';
import { motion } from "framer-motion";
import { CheckCircle } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const IntermediaryDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authData, setAuthData] = useState({
    intermediaryId: "",
    privateKey: "",
  });

  useEffect(() => {
    checkStoredAuth();
  }, []);

  const checkStoredAuth = async () => {
    const storedId = localStorage.getItem("intermediaryId");
    const storedKey = localStorage.getItem("intermediaryPrivateKey");

    if (storedId && storedKey) {
      const isValid = await verifyIntermediary(storedId, storedKey, true);
      if (isValid) setIsAuthenticated(true);
    }
  };

  const verifyIntermediary = async (intermediaryId, privateKey, isAutoCheck = false) => {
    try {
      if (!isAutoCheck) setLoading(true);
      const { data, error } = await supabase
        .from('Organization')
        .select('*')
        .eq('org_id', intermediaryId)
        .single();

      if (error || !data) {
        if (!isAutoCheck) alert('ID not found');
        return false;
      }
      if (!data.verified || !data.org_type.includes('Intermediary')) {
        if (!isAutoCheck) alert('Account invalid or unverified.');
        return false;
      }

      const hash = sha256(privateKey);
      if (hash === data.public_key) return true;

      if (!isAutoCheck) alert('Invalid Private Key');
      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      if (!isAutoCheck) setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!authData.intermediaryId || !authData.privateKey) {
      alert("Please enter both ID and Key");
      return;
    }
    const isValid = await verifyIntermediary(authData.intermediaryId, authData.privateKey);
    if (isValid) {
      localStorage.setItem("intermediaryId", authData.intermediaryId);
      localStorage.setItem("intermediaryPrivateKey", authData.privateKey);
      setIsAuthenticated(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthData({ ...authData, [name]: value });
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setAuthData({ intermediaryId: "", privateKey: "" });
  };

  return (
    <div className="min-h-screen bg-med-cream font-sans">
      <IntNav />

      <div className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
            >
              <h2 className="text-3xl font-serif text-med-teal text-center mb-2">Intermediary Login</h2>
              <p className="text-center text-gray-500 mb-8">Access the secure distribution ledger</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Intermediary ID</label>
                  <input
                    type="text"
                    name="intermediaryId"
                    value={authData.intermediaryId}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-med-teal transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Private Key</label>
                  <input
                    type="password"
                    name="privateKey"
                    value={authData.privateKey}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-med-teal transition-all"
                  />
                </div>
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full py-3 bg-med-teal text-white font-semibold rounded-xl hover:bg-med-teal/90 transition-all shadow-md disabled:opacity-70"
                >
                  {loading ? 'Verifying...' : 'Access Dashboard'}
                </button>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Auth Status */}
            <div className="w-full max-w-md bg-white p-4 rounded-2xl shadow-sm border border-green-100 bg-green-50/50 flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-green-600" size={20} />
                <div>
                  <p className="text-sm font-semibold text-green-800">Authenticated</p>
                  <p className="text-xs text-green-600 font-mono truncate w-32">
                    {localStorage.getItem("intermediaryId")?.substring(0, 12)}...
                  </p>
                </div>
              </div>
              <button onClick={handleLogout} className="text-xs font-semibold text-green-700 hover:underline">
                Logout
              </button>
            </div>

            {/* Main Form */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md"
            >
              <IntermediaryAdd />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntermediaryDashboard;
