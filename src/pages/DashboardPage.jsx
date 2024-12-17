import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { SERVER_BaseURL } from '../config';
import axios from 'axios';
import '../styles/DashboardPage.css';

const DashboardPage = () => {
  const [cryptoList, setCryptoList] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [timeRange, setTimeRange] = useState('30'); // Default to 30 days
  const [historicalData, setHistoricalData] = useState([]);
  const [exchangeData, setExchangeData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch list of cryptos and exchanges
  useEffect(() => {
    fetchCryptoList();
    fetchExchanges();
  }, []);

  // Fetch historical data when crypto or timeRange changes
  useEffect(() => {
    if (selectedCrypto) {
      fetchHistoricalData(selectedCrypto.id, timeRange);
    }
  }, [selectedCrypto, timeRange]);

  const fetchCryptoList = async () => {
    try {
      const response = await axios.get(`${SERVER_BaseURL}/api/crypto/top`);
      setCryptoList(response.data);
      if (response.data.length > 0) {
        setSelectedCrypto(response.data[0]); // Default to first crypto
      }
    } catch (error) {
      console.error('Error fetching crypto list:', error.message);
    }
  };

  const fetchExchanges = async () => {
    try {
      const response = await axios.get(`${SERVER_BaseURL}/api/crypto/exchanges`);
      const formattedExchanges = response.data
        .slice(0, 7)
        .sort((a, b) => b.trade_volume_24h_btc - a.trade_volume_24h_btc)
        .map((exchange) => ({
          name: exchange.name,
          volume: Math.round(exchange.trade_volume_24h_btc),
        }));
      setExchangeData(formattedExchanges);
    } catch (error) {
      console.error('Error fetching exchanges:', error.message);
    }
  };

  const fetchHistoricalData = async (cryptoId, days) => {
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_BaseURL}/api/crypto/${cryptoId}/history`, {
        params: { days },
      });
      const rawData= response.data.prices.map(([timestamp, price]) => ({
        date: new Date(timestamp).toLocaleDateString(),
        price,
      }));

      const step = Math.ceil(rawData.length / 30); 
      const sampledData = rawData.filter((_, index) => index % step === 0);

      setHistoricalData(sampledData);
    } catch (error) {
      console.error('Error fetching historical data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCryptoChange = (e) => {
    const selected = cryptoList.find((crypto) => crypto.id === e.target.value);
    setSelectedCrypto(selected);
  };

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  return (
    <div className="dashboard-page">
      {/* Left Section */}
      <div className="dashboard-left">
        <div className="dashboard-header">
          {selectedCrypto && (
            <div className="crypto-info">
              <img src={selectedCrypto.image} alt={selectedCrypto.name} className="crypto-image" />
              <span className="crypto-name">{selectedCrypto.name}</span>
            </div>
          )}
          <div className="selectors">
            <select className="crypto-selector" onChange={handleCryptoChange} value={selectedCrypto?.id || ''}>
              {cryptoList.map((crypto) => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.name}
                </option>
              ))}
            </select>
            <select className="time-range-selector" onChange={handleTimeRangeChange} value={timeRange}>
              <option value="1">1 Day</option>
              <option value="7">1 Week</option>
              <option value="30">1 Month</option>
              <option value="365">1 Year</option>
            </select>
          </div>
        </div>

        <div className="chart-container">
          {loading ? (
            <p>Loading data...</p>
          ) : (
            <>
              <h3>Price History</h3>
              <ResponsiveContainer width="100%" height={500}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>

              <h3 id="top-exchanges-title">Top 15 Exchanges by Volume</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={exchangeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="volume" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="dashboard-right">
        <h3>Market Cap and Change</h3>
        {cryptoList.slice(0, 12).map((crypto) => (
          <div className="market-cap-item" key={crypto.id}>
            <img src={crypto.image} alt={crypto.name} className="crypto-image" />
            <div className="market-cap-info">
              <span className="crypto-name">{crypto.name}</span>
              <div className="market-cap-row">
                <span className="market-cap">
                  Market Cap: ${crypto.market_cap.toLocaleString()}
                </span>
                <span
                  className={`market-change ${
                    crypto.market_cap_change_percentage_24h > 0 ? 'positive' : 'negative'
                  }`}
                >
                  {crypto.market_cap_change_percentage_24h > 0 ? '▲' : '▼'}{' '}
                  {crypto.market_cap_change_percentage_24h.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
