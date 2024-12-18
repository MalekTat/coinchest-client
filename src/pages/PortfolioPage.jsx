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
  const [formData, setFormData] = useState({ cryptoId: '', amount: '', price: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [isBuying, setIsBuying] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [profitLossData, setProfitLossData] = useState([]);

  useEffect(() => {
    fetchPortfolio();
    fetchCryptoList();
  }, [currency]);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get(`${SERVER_BaseURL}/api/portfolio`, {
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = response.data
        .filter((item) => item.amount > 0)  
        .map((item) => ({
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

  const fetchCryptoList = async () => {
    try {
      const response = await axios.get(`${SERVER_BaseURL}/api/crypto/top`);
      setCryptoList(response.data);
    } catch (err) {
      console.error('Error fetching crypto list:', err.message);
    }
  };

  const fetchCurrentPrice = async (cryptoId) => {
    try {
      console.log(cryptoId)
      const response = await axios.get(`${SERVER_BaseURL}/api/crypto/${cryptoId}`);
      const price = response.data.market_data.current_price.usd;
      setCurrentPrice(price);
      console.log(currentPrice)
    } catch (err) {
      console.error('Error fetching current price:', err.message);
    }
  };



  const prepareCharts = (data) => {
    const pieData = data.map((item) => ({
      name: item.cryptoId,
      value: currency === 'USD' ? item.totalValueUSD : item.totalValueEUR,
    }));
    const barData = data.map((item) => ({
      name: item.cryptoId,
      profit: currency === 'USD' ? item.profitLossUSD : item.profitLossEUR,
    }));
    setChartData(pieData);
    setProfitLossData(barData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'cryptoId') {
      const selected = cryptoList.find((crypto) => crypto.id === value);
      setSelectedCrypto(selected);
      fetchCurrentPrice(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isBuying ? `${SERVER_BaseURL}/api/portfolio/buy` : `${SERVER_BaseURL}/api/portfolio/sell`;
      console.log(formData)
      await axios.post(url, formData, {
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setModalOpen(false);
      setFormData({ cryptoId: '', amount: '', price: '' });
      setSelectedCrypto(null);
      fetchPortfolio();
    } catch (err) {
      console.error('Error saving portfolio item:', err.message);
    }
  };


  const totalAssets = portfolio.reduce((sum, item) => sum + item.totalValue, 0);
  const totalProfitLoss = portfolio.reduce((sum, item) => sum + item.profitLoss, 0);

    // Currency formatter
  const formatCurrency = (value) => {
      const symbol = currency === 'USD' ? '$' : '€';
      return `${symbol} ${value.toLocaleString()}`;
  };

  return (
    <div className="portfolio-page">
      <div className="portfolio-content">
        {/* Portfolio List */}
        <div className="portfolio-list-container">
          {/* Buy/Sell Buttons */}
          <div className="portfolio-actions">
            <button className="buy-button" onClick={() => { setIsBuying(true); setModalOpen(true); }}>Buy</button>
            <button className="sell-button" onClick={() => { setIsBuying(false); setModalOpen(true); }}>Sell</button>
          </div>
          <div className="portfolio-list">
            <div className="portfolio-headers">
              <span className="header-amount">Amount</span>
              <span className="header-value">Value</span>
              <span className="header-profit">Profit/Loss</span>
            </div>

            <ul>
              {portfolio.map((item) => (
                <li key={item.cryptoId} className="portfolio-item">
                  <img src={item.image} alt={item.name} className="crypto-image" />
                  <span className="crypto-name">{item.name}</span>
                  <span className="crypto-amount">{item.amount}</span>
                  <span className="crypto-value">
                     {formatCurrency(item.totalValue)}
                  </span>
                  <span
                    className={`crypto-profit ${
                      item.profitLoss >= 0 ? 'positive' : 'negative'
                    }`}
                  >
                     {formatCurrency(item.profitLoss)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="portfolio-summary">
              <div className="total-assets">
                <h3>Total Assets</h3>
                <p>{formatCurrency(totalAssets)}</p>
              </div>
              <div className="total-profit-loss">
                <h3>Total Profit/Loss</h3>
                <p className={totalProfitLoss >= 0 ? 'positive' : 'negative'}>
                  {formatCurrency(totalProfitLoss)}
                </p>
              </div>
            </div>
          </div>
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
                innerRadius={45}
                outerRadius={110}
                fill="#00bcd4"
                label={({ name, value }) => `${name}: ${currency === 'USD' ? '$' : '€'}${value.toLocaleString()}`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#FF6384', '#36A2EB', '#FFCE56'][index % 3]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={profitLossData} barCategoryGap="20px">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${currency === 'USD' ? '$' : '€'}${value}`} />
              <Tooltip formatter={(value) => `${currency === 'USD' ? '$' : '€'}${value}`} cursor={false}/>
              <Legend />
              <Bar dataKey="profit" barSize={70}>
                {profitLossData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#82ca9d' : '#f44336'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* Modal for Buy/Sell */}
      {modalOpen && (
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <div className='fisrt-line'>
              <label>
                Select Crypto:
                <select name="cryptoId" value={formData.cryptoId} onChange={handleInputChange} required>
                  <option value="">Choose a Crypto</option>
                  {cryptoList.map((crypto) => (
                    <option key={crypto.id} value={crypto.id}>
                      {crypto.name}
                    </option>
                  ))}
                </select>
              </label>
              {selectedCrypto && (
                <div className="crypto-preview">
                  <img src={selectedCrypto.image} alt={selectedCrypto.name} />
                  <span>{selectedCrypto.name}</span>
                </div>
              )}
            </div>
            <div className='second-line'>
            <label>
              Amount:
              <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} required />
            </label>
            <label>
              {isBuying ? 'Purchase Price' : 'Sell Price'}:
              <input type="number" name="price" value={formData.price || (currentPrice ? currentPrice.toFixed(2) : '')} onChange={handleInputChange} required />
            </label>
            </div>
            <button type="submit">{isBuying ? 'Buy' : 'Sell'}</button>
            <button type="button" onClick={() => setModalOpen(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;