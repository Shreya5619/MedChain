import React, { useState } from 'react';

const HospitalAdd = () => {
  const [formData, setFormData] = useState({
    drugId: "",
    batch: "",
    sender: "",
    receiver: "",
    quantity: "",
    details: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          drug_id: formData.drugId,
          batch: formData.batch,
          sender: formData.sender,
          receiver: formData.receiver
        }),
      });

      if (response.ok) {
        alert("Transaction added successfully");
        setFormData({
          drugId: "",
          batch: "",
          sender: "",
          receiver: "",
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
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md border space-y-4">
      <h2 className="text-2xl font-bold text-center text-purple-600 mb-4">
        Hospital
      </h2>

      <div>
        <label className="font-bold text-black">Drug ID</label>
        <input
          type="text"
          placeholder="drugId"
          name="drugId"
          value={formData.drugId}
          onChange={handleChange}
          className="w-full p-2 border rounded-md text-black"
        />
      </div>

      <div>
        <label className="font-bold text-black">Batch</label>
        <input
          type="text"
          placeholder="batch"
          name="batch"
          value={formData.batch}
          onChange={handleChange}
          className="w-full p-2 border rounded-md text-black"
        />
      </div>

      <div>
        <label className="font-bold text-black">Sender</label>
        <input
          type="text"
          placeholder="sender"
          name="sender"
          value={formData.sender}
          onChange={handleChange}
          className="w-full p-2 border rounded-md text-black"
        />
      </div>

      <div>
        <label className="font-bold text-black">Receiver</label>
        <input
          type="text"
          placeholder="receiver"
          name="receiver"
          value={formData.receiver}
          onChange={handleChange}
          className="w-full p-2 border rounded-md text-black"
        />
      </div>

      <div>
        <label className="font-bold text-black">Quantity Sold</label>
        <input
          type="number"
          placeholder="Quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full p-2 border rounded-md text-black"
        />
      </div>

      <div>
        <label className="font-bold text-black">Details</label>
        <input
          type="text"
          placeholder="Other details"
          name="details"
          value={formData.details}
          onChange={handleChange}
          className="w-full p-2 border rounded-md text-black"
        />
      </div>

      <button
        className="w-full py-2 bg-purple-600 text-white rounded-md"
        onClick={handleUpload}
      >
        Add to Ledger
      </button>
    </div>
  );
};

export default HospitalAdd;
