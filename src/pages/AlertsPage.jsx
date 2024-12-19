import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { SERVER_BaseURL } from '../config';
import '../styles/AlertsPage.css';
import bellImage from '../assets/bell.png';

const AlertsPage = () => {
  const { currency } = useContext(AuthContext);
  const [cryptoList, setCryptoList] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [formData, setFormData] = useState({
    cryptoId: '',
    condition: 'above',
    targetPrice: '',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAlertId, setEditingAlertId] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState(null);

  useEffect(() => {
    fetchCryptoList();
    fetchAlerts();
  }, []);

  const fetchCryptoList = async () => {
    try {
      const response = await axios.get(`${SERVER_BaseURL}/api/crypto/top`);
      setCryptoList(response.data);
    } catch (err) {
      console.error('Error fetching crypto list:', err.message);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await axios.get(`${SERVER_BaseURL}/api/alert`, {
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setAlerts(response.data);
    } catch (err) {
      console.error('Error fetching alerts:', err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'cryptoId') {
      const selected = cryptoList.find((crypto) => crypto.id === value);
      setSelectedCrypto(selected);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing
        ? `${SERVER_BaseURL}/api/alert/${editingAlertId}`
        : `${SERVER_BaseURL}/api/alert`;
      const method = isEditing ? 'put' : 'post';

      await axios[method](url, formData, {
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      fetchAlerts();
      setModalOpen(false);
      setIsEditing(false);
      setEditingAlertId(null);
      setSelectedCrypto(null);
      setFormData({ cryptoId: '', condition: 'above', targetPrice: '' });
    } catch (err) {
      console.error('Error saving alert:', err.message);
    }
  };

  const handleEdit = (alert) => {
    setIsEditing(true);
    setEditingAlertId(alert._id);
    setFormData({
      cryptoId: alert.cryptoId,
      condition: alert.condition,
      targetPrice: alert.targetPrice,
    });
    const selected = cryptoList.find((crypto) => crypto.id === alert.cryptoId);
    setSelectedCrypto(selected);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${SERVER_BaseURL}/api/alert/${id}`, {
        headers: { authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchAlerts();
    } catch (err) {
      console.error('Error deleting alert:', err.message);
    }
  };

  const formatCurrency = (value) => {
    const symbol = currency === 'USD' ? '$' : '€';
    return `${symbol}${value}`;
  };

  return (
    <div className="alerts-page">
      <div className="alerts-content">
        <div className="alerts-list-container">
          <div className="alerts-header">
            <h1>My Alerts</h1>
            <button
              className="add-alert-btn"
              onClick={() => {
                setModalOpen(true);
                setIsEditing(false);
                setFormData({ cryptoId: '', condition: 'above', targetPrice: '' });
                setSelectedCrypto(null);
              }}
            >
              Add
            </button>
          </div>
          <div className="alerts-list-titles">
            <span>Name</span>
            <span>Target Price</span>
            <span>Condition</span>
            <span>Is Triggered</span>
            <span>Actions</span>
          </div>
          <ul className="alerts-list">
            {alerts.map((alert) => (
              <li key={alert._id} className="alert-item">
                <div className="crypto-info">
                  <img
                    src={cryptoList.find((crypto) => crypto.id === alert.cryptoId)?.image || ''}
                    alt={alert.cryptoId}
                    className="crypto-image"
                  />
                  <span className="crypto-name">{alert.cryptoId}</span>
                </div>
                <span className="alert-target-price">{formatCurrency(alert.targetPrice)}</span>
                <span className={`alert-condition ${alert.condition === 'above' ? 'up' : 'down'}`}>
                  {alert.condition === 'above' ? '▲' : '▼'}
                </span>
                <span
                  className={`alert-triggered ${alert.isTriggered ? 'triggered' : 'not-triggered'}`}
                >
                  {alert.isTriggered ? 'Yes' : 'Not Yet'}
                </span>
                <div className="alert-actions">
                  <button onClick={() => handleEdit(alert)}>Edit</button>
                  <button className={'delete'} onClick={() => handleDelete(alert._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="alerts-right">
          <img src={bellImage} alt="Alerts" className="alerts-bell-image" />
        </div>
      </div>

      {modalOpen && (
        <div className="alert-modal">
          <form onSubmit={handleSubmit}>
            <div className="fisrt">
              <label>
                Select Crypto:
                <select
                  name="cryptoId"
                  value={formData.cryptoId}
                  onChange={handleInputChange}
                  required
                >
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
            <div className="second">
              <label className='alert-condition'>
                Condition:
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                >
                  <option value="above">Above</option>
                  <option value="below">Below</option>
                </select>
              </label>
              <label>
                Target Price:
                <input
                  type="number"
                  name="targetPrice"
                  value={formData.targetPrice}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>
            <div className='third'>
              <button type="submit">{isEditing ? 'Save' : 'Add'}</button>
              <button type="button" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
