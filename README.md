CoinChest - Cryptocurrency Portfolio and Alerts Dashboard
Overview
CoinChest is a full-stack cryptocurrency dashboard application that allows users to:

Track their cryptocurrency portfolio with real-time updates.
Set price alerts for their favorite cryptocurrencies.
View historical price data and analyze market trends.
Explore top exchanges by volume and key market metrics.
Features
Dashboard
Visualize historical price trends for cryptocurrencies using interactive charts.
Analyze the top 15 cryptocurrency exchanges by trade volume.
Select time ranges (1 Day, 1 Week, 1 Month, 1 Year) for historical data.
Portfolio Management
Add or sell cryptocurrencies and calculate profit/loss dynamically.
View a summary of total assets and profits.
Interactive pie and bar charts for portfolio distribution and performance.
Alerts
Create price alerts for specific cryptocurrencies.
Get notified when the target price condition (above or below) is met.
Manage alerts (edit/delete) with a modern user interface.
Profile Management
Update user details, including profile photo, email, and password.
Option to delete the account.
Technologies Used
Frontend
React: For building the user interface.
Recharts: For rendering interactive charts.
CSS Modules: For custom styling with support for light/dark mode.
Backend
Node.js + Express: For building RESTful APIs.
MongoDB: For storing user portfolios and alerts.
Axios: For API requests.
API Integration
CoinGecko API: Fetch cryptocurrency data (prices, history, and exchange details).
Setup Instructions
Backend
Clone the backend repository and install dependencies:
bash
Copy code
git clone <backend-repo-url>
cd backend
npm install
Create a .env file and add:
env
Copy code
Root_URL_API=<backend-base-url>
COINGECKO_API_KEY=<your-coingecko-api-key>
JWT_SECRET=<your-jwt-secret>
Start the backend:
bash
Copy code
npm start
Frontend
Clone the frontend repository and install dependencies:
bash
Copy code
git clone <frontend-repo-url>
cd frontend
npm install
Create a .env file and add:
env
Copy code
REACT_APP_SERVER_BaseURL=<backend-base-url>
Start the frontend:
bash
Copy code
npm start
API Routes
Portfolio
GET /api/portfolio: Fetch all portfolio items for the authenticated user.
POST /api/portfolio/buy: Add cryptocurrency to the portfolio.
POST /api/portfolio/sell: Remove cryptocurrency from the portfolio.
Alerts
GET /api/alert: Fetch all alerts for the authenticated user.
POST /api/alert: Create a new alert.
PUT /api/alert/:id: Edit an existing alert.
DELETE /api/alert/:id: Delete an alert.
Cryptocurrencies
GET /api/crypto/top: Fetch top 30 cryptocurrencies.
GET /api/crypto/:id/history: Fetch historical data for a cryptocurrency.
GET /api/crypto/exchanges: Fetch the top cryptocurrency exchanges.
Key Frontend Pages
Dashboard
Path: /dashboard
Displays historical price charts and exchange data.
Portfolio
Path: /portfolio
Manages the user's cryptocurrency portfolio.
Alerts
Path: /alerts
Manages user alerts for cryptocurrency prices.
Profile Management
Path: /profile/edit
Allows users to update profile details or delete their account.
Preview
Dashboard

Portfolio

Alerts

License
This project is licensed under the MIT License. See the LICENSE file for details.


