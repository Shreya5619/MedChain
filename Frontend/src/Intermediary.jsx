import { useState, useEffect } from "react";
import IntermediaryAdd from "./components/intermediaryadd";
import IntNav from "./components/intnav";
import { createClient } from '@supabase/supabase-js';
import { sha256 } from 'js-sha256';

// Supabase client initialization
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
    const storedOrgId = localStorage.getItem("intermediaryId")
    const storedPrivKey = localStorage.getItem("intermediaryPrivateKey");
    const storedPubKey = localStorage.getItem("intermediaryPublicKey");

    if (storedOrgId) {
      setAuthData(prev => ({
        ...prev,
        intermediaryId: storedOrgId,
        privateKey: storedPrivKey || ""
      }));
    }
    checkStoredAuth();
  }, []);

  const checkStoredAuth = async () => {
    const storedId = localStorage.getItem("intermediaryId");
    const storedKey = localStorage.getItem("intermediaryPrivateKey");

    if (storedId && storedKey) {
      const isValid = await verifyIntermediary(storedId, storedKey, true); // true = automated check
      if (isValid) {
        setIsAuthenticated(true);
      } else {
        console.warn("Stored credentials verification failed");
        setIsAuthenticated(false);
      }
    }
  };

  const verifyIntermediary = async (intermediaryId, privateKey, isAutoCheck = false) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Organization')
        .select('*')
        .eq('org_id', intermediaryId)
        .single();

      if (error || !data) {
        if (!isAutoCheck) alert('Intermediary ID not found in database');
        return false;
      }

      if (!data.verified) {
        if (!isAutoCheck) alert('Your account is not verified yet.');
        return false;
      }

      // Check if org_type includes 'Intermediary'
      if (!data.org_type || !data.org_type.includes('Intermediary')) {
        if (!isAutoCheck) alert('Organization is not registered as an Intermediary');
        return false;
      }

      const privateKeyHash = sha256(privateKey);

      if (privateKeyHash === data.public_key) {
        return true;
      } else {
        if (!isAutoCheck) alert('Private key does not match stored public key hash');
        return false;
      }
    } catch (error) {
      console.error('Verification error:', error);
      if (!isAutoCheck) alert('Verification failed: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!authData.intermediaryId || !authData.privateKey) {
      alert("Please enter both Intermediary ID and Private Key");
      return;
    }

    const isValid = await verifyIntermediary(authData.intermediaryId, authData.privateKey);
    if (isValid) {
      localStorage.setItem("intermediaryId", authData.intermediaryId);
      localStorage.setItem("intermediaryPrivateKey", authData.privateKey);
      setIsAuthenticated(true);
      alert("Authenticated successfully!");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthData({ ...authData, [name]: value });
  };

  const handleLogout = () => {
    localStorage.removeItem("intermediaryId");
    localStorage.removeItem("intermediaryPrivateKey");
    setIsAuthenticated(false);
    setAuthData({ intermediaryId: "", privateKey: "" });
  };

  if (loading && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="text-white text-xl">Verifying intermediary...</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex flex-col text-white">
      <IntNav />
      {isAuthenticated ? (
        <div className="flex-grow flex flex-col items-center justify-start pt-10">
          {/* Auth Info */}
          <div className="w-full max-w-md bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex justify-between items-center z-10">
            <span className="truncate mr-2">✅ Authenticated: {localStorage.getItem("intermediaryId")}</span>
            <button onClick={handleLogout} className="text-sm underline hover:text-green-900 whitespace-nowrap">
              Logout
            </button>
          </div>

          {/* Card Container */}
          <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-lg relative z-10 text-gray-900">
            <IntermediaryAdd />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-gray-900">
            <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
              Intermediary Login
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Intermediary ID
                </label>
                <input
                  type="text"
                  placeholder="Enter your Organization ID"
                  name="intermediaryId"
                  value={authData.intermediaryId}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Private Key
                </label>
                <input
                  type="password"
                  placeholder="Enter your Private Key"
                  name="privateKey"
                  value={authData.privateKey}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-3 mt-4 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Authenticate'}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              If you don't have an account, please register first.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntermediaryDashboard;
