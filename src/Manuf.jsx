import { useState } from "react";
import IntermediaryAdd from "./components/intermediaryadd";
import IntNav from "./components/intnav";
import ManuNav from "./components/manunav";

const Manuf = () => {
  const [drugs, setDrugs] = useState([]);
  const [drugIds, setDrugIds] = useState({});
  const [formData, setFormData] = useState({
    drugId: "",
    drugName: "",
    batchNumber: "",
    manufacturingDate: "",
    expiryDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpload = async () => {
    try {
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
        }),
      });
      const result = await response.json();
      console.log(result.drug_id[0])
      if (response.ok) {
        formData.drugId = (result.drug_id[0])
        setDrugs([...drugs, formData]);
        setFormData({
          drugId: "",
          drugName: "",
          batchNumber: "",
          manufacturingDate: "",
          expiryDate: "",
        });
        setDrugIds({
          ...drugIds,
          [drugs[drugs.length].batchNumber]: result.drug_id,
        });
        alert(`Drug ID generated for batch ${drugs[drugs.length - 1].batchNumber}: ${result.drug_id}`);
      } else {
        alert("Failed to generate Drug ID");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGenerateId = (drug) => {
    setDrugIds({
      ...drugIds,
      [drug.batchNumber]: drug.drug_id,
    });
  }
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex flex-col text-white">
<ManuNav/>

  {/* Main Content */}
  <div className="flex-grow flex items-center justify-center">
        {/* Form Card */}
        <div className="w-full mt-24 max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
            Manufacturer Dashboard
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Drug Name</h3>
              <input
                type="text"
                placeholder="Enter Drug Name"
                name="drugName"
                value={formData.drugName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Batch Number</h3>
              <input
                type="text"
                placeholder="Enter Batch Number"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Manufacturing Date</h3>
              <input
                type="date"
                name="manufacturingDate"
                value={formData.manufacturingDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Expiry Date</h3>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
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

        {/* Uploaded Drugs Card */}
        <div className="w-full mt-8 max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-center text-purple-600 mb-4">
            Uploaded Drugs
          </h3>
          {drugs.length === 0 ? (
            <p className="text-center text-gray-500">No drug uploaded yet.</p>
          ) : (
            drugs.map((drug, index) => (
              <div key={index} className="border-t pt-4 mt-4">

                <p className="text-gray-700" style={{ wordBreak: "break-word" }}>
                  <strong>Drug Id:</strong> {drug.drugId}
                </p>
                <p className="text-gray-700"><strong>Drug Name:</strong> {drug.drugName}</p>
                <p className="text-gray-700"><strong>Batch Number:</strong> {drug.batchNumber}</p>
                <p className="text-gray-700"><strong>Manufacturing Date:</strong> {drug.manufacturingDate}</p>
                <p className="text-gray-700"><strong>Expiry Date:</strong> {drug.expiryDate}</p>
                <QRCode value={drug.drugId}></QRCode>
              </div>
            ))
          )}
        </div>
      </div>
</div>
  );
};

export default Manuf;
