import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SERVER_BaseURL } from '../config';
import '../styles/DashboardPage.css';

const DashboardPage = () => {
  const [cryptoList, setCryptoList] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch list of cryptos on component mount
  useEffect(() => {
    fetchCryptoList();
  }, []);

  // Fetch historical data when the selected crypto changes
  useEffect(() => {
    if (selectedCrypto) {
      fetchHistoricalData(selectedCrypto.id);
    }
  }, [selectedCrypto]);

  const fetchCryptoList = async () => {
    try {
      const response = await axios.get(`${SERVER_BaseURL}/api/crypto/top`);
      setCryptoList(response.data);
      if (response.data.length > 0) {
        setSelectedCrypto(response.data[0]); // Set the first crypto as default
      }
    } catch (error) {
      console.error('Error fetching crypto list:', error.message);
    }
  };

  const fetchHistoricalData = async (cryptoId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_BaseURL}/api/crypto/${cryptoId}/history?days=365`);
      const formattedData = response.data.prices.map(([timestamp, price]) => ({
        date: new Date(timestamp).toLocaleDateString(),
        price,
      }));
      setHistoricalData(formattedData);
    } catch (error) {
      console.error('Error fetching historical data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCryptoChange = (event) => {
    const selected = cryptoList.find((crypto) => crypto.id === event.target.value);
    setSelectedCrypto(selected);
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        {selectedCrypto && (
          <div className="crypto-info">
            <img src={selectedCrypto.image} alt={selectedCrypto.name} className="crypto-image" />
            <span className="crypto-name">{selectedCrypto.name}</span>
          </div>
        )}
        <select className="crypto-selector" onChange={handleCryptoChange} value={selectedCrypto?.id || ''}>
          {cryptoList.map((crypto) => (
            <option key={crypto.id} value={crypto.id}>
              {crypto.name}
            </option>
          ))}
        </select>
      </div>

      <div className="chart-container">
        {loading ? (
          <p>Loading data...</p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;