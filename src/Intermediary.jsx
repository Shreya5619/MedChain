import { useState } from "react";

const IntermediaryDashboard = () => {
    const [drugs, setDrugs] = useState([]);
    const [formData, setFormData] = useState({
        dateoftransaction: "",
        quantitysold: "",
        otherdetails: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpload = () => {
        setDrugs([...drugs, formData]);
        setFormData({
            dateoftransaction: "",
            quantitysold: "",
            otherdetails: "",
        });
    };

    return (
        <div className="bg-violet-200 min-h-screen flex flex-col items-center p-6">
            <div class="grid grid-flow-col text-center p-2">
                <div class="shadow-sm flex-1 bg-violet-600 rounded-lg"><h2>MedChain</h2>
                    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md border">
                        <h2 className="text-2xl font-bold text-center text-purple-600 mb-4">
                            Intermediary
                        </h2>
                        <h3 align="center" >Add Transaction</h3>
                        <h3 align="left">Date of Transaction</h3>
                        <input
                            type="date"
                            placeholder="DD/MM/YYYY"
                            name="transactionDate"
                            value={formData.transactionDate}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        />
                        <h3 align="left">Quantity Sold</h3>
                        <input
                            type="number"
                            placeholder="Quantity"
                            name="quantity"
                            value={formData.quantity}
                            onCHange={handleChange}
                            className="w-full p-2 border rounded-md"
                        />
                        <h3 align="left">Detailsd</h3>
                        <input
                            type="text"
                            placeholder="Other details"
                            name="details"
                            value={formData.quantity}
                            onCHange={handleChange}
                            className="w-full p-2 border rounded-md"
                        />
                        <button className="w-full py-2 bg-purple-600 text-white rounded-md"
                            onClick={handleUpload}
                        >
                            Add to Ledger
                        </button>
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default IntermediaryDashboard;
