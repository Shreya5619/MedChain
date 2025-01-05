import { useState } from "react";
import IntermediaryAdd from "./components/intermediaryadd";
import IntNav from "./components/intnav";

const IntermediaryDashboard = () => {
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
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex flex-col text-white">
<IntNav/>

  {/* Main Content */}
  <div className="flex-grow flex items-center justify-center">
    
    {/* Background Overlay */}
    {/* <div className="absolute inset-0 bg-opacity-60 bg-black"></div> */}

    {/* Card Container */}
    <br></br>
    <div className="w-full max-w-md p-6 bg-white border border-gray-200 mt-20 rounded-lg shadow-lg relative z-10">
      <IntermediaryAdd />
    </div>
  </div>
</div>
  );
};

export default IntermediaryDashboard;
