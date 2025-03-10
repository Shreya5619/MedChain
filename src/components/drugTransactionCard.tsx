import React, { useState } from 'react';
import { Card, Input, Button, List, Typography } from 'antd';
import QRScanner from 'react-qr-scanner';

const { Title, Text } = Typography;

interface TransactionDetails {
  BatchID: string;
  DrugID: string;
  Location: string;
  Receiver: string;
  Sender: string;
  Status: string;
  TransactionID: string;
}

interface BlockchainData {
  BlockHeight: number;
  BlockHash: string;
  Timestamp: number;
  TransactionDetails: TransactionDetails;
}

const DrugTransactionCard: React.FC = () => {
  const [drugName, setDrugName] = useState<string>('');
  const [qrResult, setQrResult] = useState<string>('No result');
  const [blockchainData, setBlockchainData] = useState<BlockchainData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDrugData = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/searchDrug?drug_id=${query}`);
      const data = await response.json();
      setBlockchainData(data);
    } catch (error) {
      console.error("Error fetching drug data:", error);
    }
    setLoading(false);
  };

  const handleScan = (data: any) => {
    if (data?.text) { // Check if `text` exists in the scanned data
      console.log("QR Scanner Output:", data.text);
      setQrResult(data.text.trim()); // Use the text for fetching data
      fetchDrugData(data.text.trim()); // Use the text for fetching data
    }
  };


  const handleError = (err: any) => {
    console.error("QR Reader Error:", err);
  };

  const handleSearch = () => {
    console.log("Searching for drug:", drugName); 
    fetchDrugData(drugName);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <Title level={2}>Drug Tracking</Title>

      <Title level={3}>Search by Name</Title>
      <Input
        placeholder="Enter Drug Name"
        value={drugName}
        onChange={(e) => setDrugName(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <Button type="primary" onClick={handleSearch} loading={loading}>
        Search
      </Button>

      <Title level={3} style={{ marginTop: '20px' }}>Scan QR Code</Title>
      <QRScanner
        delay={300}
        onError={handleError}
        onScan={(data) => handleScan(data || "")}
        style={{ width: "100%" }}
      />;
      <Card style={{ marginTop: '20px', color: 'black', wordWrap: 'break-word' }}>
        <p>Scanned QR Code: {qrResult}</p>
      </Card>

      {blockchainData.length > 0 && (
        <List
          itemLayout="vertical"
          dataSource={blockchainData}
          renderItem={(item) => (
            <Card
              title={`Block Height: ${item.BlockHeight}`}
              style={{ marginTop: '20px' }}
            >
              <Text><strong>Block Hash:</strong> {item.BlockHash}</Text>
              <br />
              <Text><strong>Timestamp:</strong> {new Date(item.Timestamp * 1000).toLocaleString()}</Text>
              <br />
              <Text><strong>Transaction Details:</strong></Text>
              <Card type="inner" style={{ marginTop: '10px' }}>
                <Text><strong>Batch ID:</strong> {item.TransactionDetails.BatchID}</Text>
                <br />
                <Text><strong>Drug ID:</strong> {item.TransactionDetails.DrugID}</Text>
                <br />
                <Text><strong>Location:</strong> {item.TransactionDetails.Location}</Text>
                <br />
                <Text><strong>Receiver:</strong> {item.TransactionDetails.Receiver}</Text>
                <br />
                <Text><strong>Sender:</strong> {item.TransactionDetails.Sender}</Text>
                <br />
                <Text><strong>Status:</strong> {item.TransactionDetails.Status}</Text>
                <br />
                <Text><strong>Transaction ID:</strong> {item.TransactionDetails.TransactionID}</Text>
              </Card>
            </Card>
          )}
        />
      )}
    </div>
  );
};

export default DrugTransactionCard;
