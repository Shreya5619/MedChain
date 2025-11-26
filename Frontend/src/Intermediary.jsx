import { useState,useEffect } from "react";
import IntermediaryAdd from "./components/intermediaryadd";
import IntNav from "./components/intnav";

const IntermediaryDashboard = () => {
  const [drugs, setDrugs] = useState([]);
    const [privatekey, setPrivateKey] = useState("");
    const [publickey, setPublicKey] = useState("");
  const [formData, setFormData] = useState({
    publickey: "",
    privkey: "",
    transactionDate: "",
    quantity: "",
    details: "",
  });

    useEffect(() => {
      const storedKey = localStorage.getItem("privateKeyInt");
      const storedKey2 = localStorage.getItem("publicKeyInt");
      if (storedKey && storedKey2) {
        setPrivateKey(storedKey);
        setPublicKey(storedKey2);
      }
    }, [privatekey, publickey]);
  

    const handleSavePrivateKey = () => {
      localStorage.setItem("privateKeyInt", formData.privkey);
      setPrivateKey(formData.privkey);
      localStorage.setItem("publicKeyInt", formData.publickey);
      setPublicKey(formData.publickey);
      alert("Private Key and Public Key saved successfully!");
      window.location.reload();
    };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpload = async () => {
    try {
      const response = await fetch("http://localhost:5000/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          drug_name: formData.drugName,
          batch: formData.batchNumber,
          sender: publickey,
          receiver: "Person B",
          status: "in-transit",
          location: "Unknown",
        }),
      });
      const result = await response.json();
      if (response.ok) {
        setDrugs([...drugs, formData]);
        setFormData({
          transactionDate: "",
          quantity: "",
          details: "",
        });
      } else {
        alert("Failed to add transaction");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex flex-col text-white">
<IntNav/>
{
  (privatekey && publickey) ? (
    <div className="flex-grow flex items-center justify-center">
    
    {/* Background Overlay */}
    {/* <div className="absolute inset-0 bg-opacity-60 bg-black"></div> */}

    {/* Card Container */}
    <br></br>
    <div className="w-full max-w-md p-6 bg-white border border-gray-200 mt-20 rounded-lg shadow-lg relative z-10">
      <IntermediaryAdd />
    </div>
  </div>
  ):
  (
    
    <div className="flex flex-col items-center">
    <div className="w-full mt-24 max-w-md p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
        Enter Private Key
      </h2>
      <div>
          <h2 className="font-bold text-gray-700">
            Enter your Private key
          </h2>
          <input
            type="text"
            placeholder="Enter Private Key"
            name="privkey"
            value={formData.privkey}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        <div>
          <h2 className="font-bold text-gray-700">
            Enter your Public key
          </h2>
          <input
            type="text"
            placeholder="Enter Public Key"
            name="publickey"
            value={formData.publickey}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      <button
        onClick={handleSavePrivateKey}
        className="w-full py-2 mt-4 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition"
      >
        Enter
      </button>
    </div>
  </div>
  )
}
  {/* Main Content */}
</div>
  );
};

export default IntermediaryDashboard;
