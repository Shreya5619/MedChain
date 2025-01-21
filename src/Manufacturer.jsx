import { useState, useEffect } from "react";
import ManuNav from "./components/manunav";
import QRCode from "react-qr-code";
import React from "react";
import { Form } from "antd";

const ManufacturerDashboard = () => {
  const [drugs, setDrugs] = useState([]);
  const [privatekey, setPrivateKey] = useState("");
  const [publickey, setPublicKey] = useState("");


  useEffect(() => {
    const storedKey = localStorage.getItem("privateKey");
    const storedKey2 = localStorage.getItem("publicKey");
    if (storedKey && storedKey2) {
      setPrivateKey(storedKey);
      setPublicKey(storedKey2);
    }
  }, [privatekey, publickey]);

  const [drugIds, setDrugIds] = useState({});
  const [formData, setFormData] = useState({
    publickey: "",
    privkey: "",
    drugId: "",
    drugName: "",
    batchNumber: "",
    manufacturingDate: "",
    expiryDate: "",
  });

  const handleSavePrivateKey = () => {
    localStorage.setItem("privateKey", formData.privkey);
    setPrivateKey(formData.privkey);
    localStorage.setItem("publicKey", formData.publickey);
    setPublicKey(formData.publickey);
    alert("Private Key and Public Key saved successfully!");
    window.location.reload();
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleUpload = async () => {
    try {
      const publickey=localStorage.getItem("publicKey");
      const response = await fetch("http://localhost:5000/genId", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          drug_name: formData.drugName,
          batch: formData.batchNumber,
          manu_date: formData.manufacturingDate,
          exp_date: formData.expiryDate,
          manufacturer:publickey,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        formData.drugId = result.drug_id[0];
        setDrugs([...drugs, formData]);
        setFormData({
          privkey: "",
          drugId: "",
          drugName: "",
          batchNumber: "",
          manufacturingDate: "",
          expiryDate: "",
        });
        alert(
          `Drug ID generated for batch ${formData.batchNumber}: ${result.drug_id}`
        );
      } else {
        alert("Failed to generate Drug ID");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const [form] = Form.useForm();
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col min-h-screen">
      <ManuNav />
      {(privatekey && publickey) ? (
        <div className="flex flex-col items-center">
          <div className="w-full mt-24 max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
              Manufacturer Dashboard
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700">
                  Drug Name
                </h3>
                <input
                  type="text"
                  placeholder="Enter Drug Name"
                  name="drugName"
                  value={formData.drugName}
                  onChange={handleFormChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700">
                  Batch Number
                </h3>
                <input
                  type="text"
                  placeholder="Enter Batch Number"
                  name="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleFormChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700">
                  Manufacturing Date
                </h3>
                <input
                  type="date"
                  name="manufacturingDate"
                  value={formData.manufacturingDate}
                  onChange={handleFormChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700">
                  Expiry Date
                </h3>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleFormChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <button
                onClick={handleUpload}
                className="w-full py-3 mt-4 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition"
              >
                Upload Drug
              </button>
            </div>
          </div>
          <div className="w-full mt-8 max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-center text-purple-600 mb-4">
              Uploaded Drugs
            </h3>
            {drugs.length === 0 ? (
              <p className="text-center text-gray-500">
                No drug uploaded yet.
              </p>
            ) : (
              drugs.map((drug, index) => (
                <div key={index} className="border-t pt-4 mt-4">
                  <p
                    className="text-gray-700"
                    style={{ wordBreak: "break-word" }}
                  >
                    <strong>Drug Id:</strong> {drug.drugId}
                  </p>
                  <p className="text-gray-700">
                    <strong>Drug Name:</strong> {drug.drugName}
                  </p>
                  <p className="text-gray-700">
                    <strong>Batch Number:</strong> {drug.batchNumber}
                  </p>
                  <p className="text-gray-700">
                    <strong>Manufacturing Date:</strong>{" "}
                    {drug.manufacturingDate}
                  </p>
                  <p className="text-gray-700">
                    <strong>Expiry Date:</strong> {drug.expiryDate}
                  </p>
                  <QRCode value={drug.drugId}></QRCode>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
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
                  onChange={handleFormChange}
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
                  onChange={handleFormChange}
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
      )}
    </div>
  );
};

export default ManufacturerDashboard;
