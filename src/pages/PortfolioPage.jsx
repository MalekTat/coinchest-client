import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { SERVER_BaseURL } from '../config';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import '../styles/PortfolioPage.css';

const PortfolioPage = () => {
  const { currency } = useContext(AuthContext);
  const [portfolio, setPortfolio] = useState([]);
  const [cryptoList, setCryptoList] = useState([]);
  const [formData, setFormData] = useState({ coinId: '', amount: '', purchasePrice: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [profitLossData, setProfitLossData] = useState([]);

  useEffect(() => {
    fetchPortfolio();
    fetchCryptoList();
  }, [currency]);

  // Fetch portfolio data
  const fetchPortfolio = async () => {
    try {
      const response = await axios.get(`${SERVER_BaseURL}/api/portfolio`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = response.data.map((item) => ({
        ...item,
        totalValue: currency === 'USD' ? item.totalValueUSD : item.totalValueEUR,
        profitLoss: currency === 'USD' ? item.profitLossUSD : item.profitLossEUR,
      }));
      setPortfolio(data);
      prepareCharts(data);
    } catch (err) {
      console.error('Error fetching portfolio:', err.message);
    }
  };

  // Fetch top cryptocurrencies for dropdown
  const fetchCryptoList = async () => {
    try {
      const response = await axios.get('/api/crypto/top');
      setCryptoList(response.data);
    } catch (err) {
      console.error('Error fetching crypto list:', err.message);
    }
  };

  // Prepare data for charts
  const prepareCharts = (data) => {
    const pieData = data.map((item) => ({
      name: item.cryptoId,
      value: item.totalValue,
    }));
    const barData = data.map((item) => ({
      name: item.cryptoId,
      profit: item.profitLoss,
    }));
    setChartData(pieData);
    setProfitLossData(barData);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.put(`${SERVER_BaseURL}/api/portfolio/${editingItem._id}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      } else {
        await axios.post(`${SERVER_BaseURL}/api/portfolio`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      }
      setModalOpen(false);
      setFormData({ coinId: '', amount: '', purchasePrice: '' });
      fetchPortfolio();
    } catch (err) {
      console.error('Error saving portfolio item:', err.message);
    }
  };

  // Handle delete portfolio item
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${SERVER_BaseURL}/api/portfolio/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchPortfolio();
    } catch (err) {
      console.error('Error deleting portfolio item:', err.message);
    }
  };

  return (
    <div className="portfolio-page">
      <div className="portfolio-header">
        <h2>Portfolio</h2>
        <button onClick={() => { setEditingItem(null); setModalOpen(true); }}>Add Portfolio</button>
      </div>

      <div className="portfolio-content">
        {/* Portfolio List */}
        <div className="portfolio-list">
          <table>
            <thead>
              <tr>
                <th>Coin</th>
                <th>Amount</th>
                <th>Current Price ({currency})</th>
                <th>Total Value</th>
                <th>Profit/Loss</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((item) => (
                <tr key={item.cryptoId}>
                  <td>
                    <img src={item.image} alt={item.cryptoId} className="crypto-image" />
                    {item.cryptoId}
                  </td>
                  <td>{item.amount}</td>
                  <td>{currency === 'USD' ? `$${item.currentPriceUSD}` : `€${item.currentPriceEUR}`}</td>
                  <td>{currency === 'USD' ? `$${item.totalValueUSD}` : `€${item.totalValueEUR}`}</td>
                  <td>{currency === 'USD' ? `$${item.profitLossUSD}` : `€${item.profitLossEUR}`}</td>
                  <td>
                    <button onClick={() => { setEditingItem(item); setModalOpen(true); }}>Edit</button>
                    <button onClick={() => handleDelete(item._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Charts Section */}
        <div className="portfolio-charts">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'][index % 5]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={profitLossData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="profit" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <label>
              Coin:
              <select name="coinId" value={formData.coinId} onChange={handleInputChange} required>
                <option value="">Select a Coin</option>
                {cryptoList.map((crypto) => (
                  <option key={crypto.id} value={crypto.id}>
                    {crypto.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Amount:
              <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} required />
            </label>
            <label>
              Purchase Price:
              <input type="number" name="purchasePrice" value={formData.purchasePrice} onChange={handleInputChange} required />
            </label>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setModalOpen(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
