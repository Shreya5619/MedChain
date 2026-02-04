import { useState } from "react";
import IntNav from "./components/intnav";
import HospitalAdd from "./components/hospitaladd";

const HospitalDashboard = () => {
  const [drugs, setDrugs] = useState([]);
  const [formData, setFormData] = useState({
    transactionDate: "",
    quantity: "",
    details: "",
  });

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
          sender: "Person A",
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
    <div className="min-h-screen bg-med-cream font-sans">
      <IntNav />

      <div className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center">
        <div className="w-full max-w-2xl mt-8">
          <HospitalAdd />
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
