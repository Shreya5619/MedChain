import { useState } from "react";

const ManufacturerDashboard = () => {
  const [drugs, setDrugs] = useState([]); // State to store uploaded drugs
  const [drugIds, setDrugIds] = useState({}); // State to store responses from `/genId`

  const [formData, setFormData] = useState({
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
      if (response.ok) {
        setDrugs([...drugs, formData]);
        setFormData({
            drugName: "",
            batchNumber: "",
            manufacturingDate: "",
            expiryDate: "",
        });
      } else {
        alert("Failed to generate Drug ID");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGenerateId = async (drug) => {
    try {
      const response = await fetch("http://localhost:5000/genId", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          drug_name: drug.drugName,
          batch: drug.batchNumber,
          manu_date: drug.manufacturingDate,
          exp_date: drug.expiryDate,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Update the state with the generated Drug ID
        setDrugIds({
          ...drugIds,
          [drug.batchNumber]: result.drug_id,
        });
        alert(`Drug ID generated for batch ${drug.batchNumber}: ${result.drug_id}`);
      } else {
        alert("Failed to generate Drug ID");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-violet-200 min-h-screen flex flex-col items-center p-6">
      <div className="grid grid-flow-col text-center p-2">
        <div className="shadow-sm flex-1 bg-violet-600 rounded-lg">
          <h2 className="text-white text-xl p-2">MedChain</h2>
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-2xl font-bold text-center text-purple-600 mb-4">Manufacturer Section</h2>
            <div className="space-y-4">
              <h3>Drug Name</h3>
              <input
                type="text"
                placeholder="Drug Name"
                name="drugName"
                value={formData.drugName}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
              <h3>Batch Number</h3>
              <input
                type="text"
                placeholder="Batch Number"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
              <h3>Manufacturing Date</h3>
              <input
                type="date"
                placeholder="Manufacturing Date"
                name="manufacturingDate"
                value={formData.manufacturingDate}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
              <h3>Expiry Date</h3>
              <input
                type="date"
                placeholder="Expiry Date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
              <button
                onClick={handleUpload}
                className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Upload Drug
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md mt-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Uploaded Drugs</h3>
        {drugs.length === 0 ? (
          <p className="text-gray-500 text-sm">No drug uploaded yet.</p>
        ) : (
          drugs.map((drug, index) => (
            <div
              key={index}
              className="border-t pt-2 mt-2 text-sm text-gray-700"
            >
              <p><strong>Drug Name:</strong> {drug.drugName}</p>
              <p><strong>Batch Number:</strong> {drug.batchNumber}</p>
              <p><strong>Manufacturing Date:</strong> {drug.manufacturingDate}</p>
              <p><strong>Expiry Date:</strong> {drug.expiryDate}</p>
              <button
                onClick={() => handleGenerateId(drug)}
                className="mt-2 text-purple-600 underline"
              >
                Generate Drug ID
              </button>
              {drugIds[drug.batchNumber] && (
                <div className="mt-2 text-sm text-green-600">
                  <strong>Drug ID:</strong> {drugIds[drug.batchNumber]}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManufacturerDashboard;