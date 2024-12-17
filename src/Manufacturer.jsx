import { useState } from "react";

const ManufacturerDashboard = () => {
    const [drugs, setDrugs] = useState([]);
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

    const handleUpload = () => {
        setDrugs([...drugs, formData]);
        setFormData({
            drugName: "",
            batchNumber: "",
            manufacturingDate: "",
            expiryDate: "",
        });
    };


    return (

        <div className="bg-violet-200 min-h-screen flex flex-col items-center p-6">

            <div class="grid grid-flow-col text-center p-2">
                <div class="shadow-sm flex-1 bg-violet-600 
                    rounded-lg"><h2>MedChain</h2>
                    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md border">
                        <h2 className="text-2xl font-bold text-center text-purple-600 mb-4">
                            Manufacturer
                        </h2>
                        <div className="space-y-4">
                            <h3 align="left">Drug Name</h3>
                            <input
                                type="text"
                                placeholder="Drug Name"
                                name="drugName"
                                value={formData.drugName}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            />
                            <h3 align="left">Batch Number</h3>
                            <input
                                type="text"
                                placeholder="Batch Number"
                                name="batchNumber"
                                value={formData.batchNumber}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            />
                            <h3 align="left">Manufacturing Date</h3>
                            <input
                                type="date"
                                placeholder="Manufacturing Date"
                                name="manufacturingDate"
                                value={formData.manufacturingDate}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            />
                            <h3 align="left">Expiry Date</h3>
                            <input
                                type="date"
                                placeholder="Expiry Date"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            />
                            <label className="inline-flex items-center">
                                <input type="checkbox" className="mr-2" />
                                Temperature Sensitivity
                            </label>
                            <button
                                onClick={handleUpload}
                                className="w-full py-2 bg-purple-600 text-white rounded-md"
                            >
                                Upload Drug
                            </button>
                        </div></div></div></div>


            <div className="w-full max-w-md mt-6 bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Uploaded Drugs</h3>
                {drugs.map((drug, index) => (
                    <div
                        key={index}
                        className="border-t pt-2 mt-2 text-sm text-gray-700"
                    >
                        <p>Drug Name: {drug.drugName}</p>
                        <p>Batch Number: {drug.batchNumber}</p>
                        <p>Manufacturing Date: {drug.manufacturingDate}</p>
                        <p>Expiry Date: {drug.expiryDate}</p>
                        <button className="mt-2 text-purple-600 underline" >
                            Generate QR Code
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManufacturerDashboard;
