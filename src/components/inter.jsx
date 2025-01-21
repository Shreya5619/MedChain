import React, { useState } from "react";
import { Card, Input, Button, message, Spin, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Meta } = Card;

const DrugsByIntermediary = () => {
  const [Intermediary, setIntermediary] = useState("");
  const [drugDetails, setDrugDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!Intermediary) {
      message.error("Please enter a Intermediary name.");
      return;
    }

    setLoading(true);
    try {
      console.log(Intermediary)
      const response = await fetch(`http://localhost:5000/drugsByManufacturer?manufacturer=${Intermediary}`);
      const data = await response.json();
      console.log(data)
      if (data && data.length > 0) {
        setDrugDetails(data);
      } else {
        message.info("No drugs found for this Intermediary.");
        setDrugDetails([]);
      }
    } catch (error) {
      message.error("Failed to fetch data. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2>Search Drugs by Intermediary</h2>
      <div className="flex justify-center" >
        <Input
          placeholder="Enter Intermediary Name"
          value={Intermediary}
          onChange={(e) => setIntermediary(e.target.value)}
          style={{ width: "100%" }}
          className="space-y-2"
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearch}
          loading={loading}
          style={{ height: "40px", marginLeft: "10px" }}
        >
          Search
        </Button>
      </div>

      {loading ? (
        <Spin size="large" style={{ display: "block", marginTop: "20px", textAlign: "center" }} />
      ) : (

        <div style={{ marginTop: "20px" }}>
          {drugDetails.length > 0 ? (
            <Row gutter={[16, 16]} justify="center">
              {drugDetails.map((drug, index) => (
                <Col key={index} span={24}>
                  <Card
                    title={`Block Height: ${drug.BlockHeight}`}
                    style={{ width: "100%" }}
                    hoverable
                  >
                    <Meta
                      description={`Block Hash: ${drug.BlockHash}`}
                    />
                    <div style={{ marginTop: "10px" }}>
                      <strong>Timestamp:</strong> {new Date(drug.Timestamp * 1000).toLocaleString()}
                    </div>
                     <Card style={{ marginTop: '20px', color: 'black', wordWrap: 'break-word' }}>
                                             Transaction ID: {drug.TransactionDetails.TransactionID}
                                           </Card>
                                           <Card style={{ marginTop: '20px', color: 'black', wordWrap: 'break-word' }}>
                                             Drug ID: {drug.TransactionDetails.DrugID}
                                           </Card>
                    <div>
                      <strong>Batch ID:</strong> {drug.TransactionDetails.BatchID}
                    </div>
                    <div>
                      <strong>Location:</strong> {drug.TransactionDetails.Location}
                    </div>
                    <div>
                      <strong>Status:</strong> {drug.TransactionDetails.Status}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <p style={{ textAlign: "center", fontSize: "16px", color: "#888" }}>
              No drug transactions found for this Intermediary.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DrugsByIntermediary;
