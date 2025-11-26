import React, { useState } from 'react';
import { Card, Input, Button, List, Typography } from 'antd';
import QRScanner from 'react-qr-scanner';

const { Title, Text } = Typography;

interface TransactionDetails {
  drugId: string;
  batch: string;
  location: string;
  receiver: string;
  sender: string;
  status: string;
  timestamp: number;
}

const DrugTransactionCard: React.FC = () => {
  const [drugId, setDrugId] = useState<string>('');
  const [qrResult, setQrResult] = useState<string>('No result');
  const [transactions, setTransactions] = useState<TransactionDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDrugData = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/searchDrug', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ drug_id: query }),
      });
      const data = await response.json();
      if (data.drug_transactions) {
        setTransactions(data.drug_transactions);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching drug data:", error);
    }
    setLoading(false);
  };

  const handleScan = (data: any) => {
    if (data?.text) {
      console.log("QR Scanner Output:", data.text);
      setQrResult(data.text.trim());
      fetchDrugData(data.text.trim());
    }
  };

  const handleError = (err: any) => {
    console.error("QR Reader Error:", err);
  };

  const handleSearch = () => {
    console.log("Searching for drug ID:", drugId);
    fetchDrugData(drugId);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <Title level={2}>Drug Tracking</Title>

      <Title level={3}>Search by Drug ID</Title>
      <Input
        placeholder="Enter Drug ID"
        value={drugId}
        onChange={(e) => setDrugId(e.target.value)}
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
      />
      <Card style={{ marginTop: '20px', color: 'black', wordWrap: 'break-word' }}>
        <p>Scanned QR Code: {qrResult}</p>
      </Card>

      {transactions.length > 0 ? (
        <List
          itemLayout="vertical"
          dataSource={transactions}
          renderItem={(item) => (
            <Card title={`Timestamp: ${new Date(item.timestamp * 1000).toLocaleString()}`} style={{ marginTop: '20px' }}>
              <Text><strong>Drug ID:</strong> {item.drugId}</Text><br />
              <Text><strong>Batch:</strong> {item.batch}</Text><br />
              <Text><strong>Status:</strong> {item.status}</Text><br />
              <Text><strong>Location:</strong> {item.location}</Text><br />
              <Text><strong>Sender:</strong> {item.sender}</Text><br />
              <Text><strong>Receiver:</strong> {item.receiver}</Text><br />
            </Card>
          )}
        />
      ) : (
        <Text style={{ marginTop: '20px' }}>No transactions found.</Text>
      )}
    </div>
  );
};

export default DrugTransactionCard;
