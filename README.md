# AI-Powered Smart Parking Guidance System

A next-generation, full-stack smart city parking application that utilizes AI probability predictions and A* pathfinding to guide users to the most optimal parking slots.

## 🌟 Features
- **Futuristic UI/UX**: Dark mode with neon accents, glassmorphism, and smooth Framer Motion animations.
- **Interactive Parking Map**: Real-time grid visualization of available, occupied, and reserved slots.
- **A* Pathfinding Algorithm**: Visually traces the shortest route from the entry gate to the selected parking slot, avoiding occupied slots.
- **Bayesian Probability AI**: Simulates predictions for parking availability based on mock historical data and live conditions.
- **Live Dashboard**: Real-time stats on occupancy rates, available slots, and system health.
- **Admin Analytics**: Recharts-powered analytics for revenue simulation, peak usage, and slot distribution.

## 🛠️ Technologies Used
**Frontend**:
- React.js
- Tailwind CSS v4
- Framer Motion (Animations)
- React Router (Routing)
- Axios (API Calls)
- Recharts (Data Visualization)
- Lucide React (Icons)

**Backend**:
- Node.js
- Express.js
- MongoDB Atlas & Mongoose (Database)
- CORS & Dotenv

## 📂 MERN Folder Structure
```
/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── algorithms/     # A* Pathfinding Logic
│   │   ├── components/     # Reusable UI Components
│   │   ├── pages/          # React Router Views
│   │   ├── index.css       # Tailwind & Global Styles
│   │   └── App.jsx         # App Routing & Layout
├── server/                 # Express Backend
│   ├── controllers/        # Route Handlers
│   ├── models/             # Mongoose Schemas
│   ├── routes/             # API Endpoints
│   └── index.js            # Server Entry Point
└── README.md
```

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local instance or Atlas URI)

### 1. Clone the repository
```bash
git clone <repository_url>
cd <repository_folder>
```

### 2. Backend Setup
```bash
cd server
npm install

# Optional: Create a .env file to set your custom MONGODB_URI and PORT
# MONGODB_URI=mongodb://localhost:27017/smart-parking
# PORT=5000

npm start
```
The server will start on `http://localhost:5000`.

### 3. Frontend Setup
```bash
# Open a new terminal
cd client
npm install
npm run dev
```
The frontend will start on `http://localhost:5173` (or another port specified by Vite).

## 🌐 Deployment Guide

### Deploying the Backend to Render
1. Create a new Web Service on [Render](https://render.com/).
2. Connect your GitHub repository.
3. Set the Root Directory to `server`.
4. Build Command: `npm install`
5. Start Command: `node index.js`
6. Add Environment Variable: `MONGODB_URI` (your production MongoDB Atlas string).

### Deploying the Frontend to Vercel
1. Import your project on [Vercel](https://vercel.com/).
2. Set the Framework Preset to `Vite`.
3. Set the Root Directory to `client`.
4. Ensure Build Command is `npm run build` and Output Directory is `dist`.
5. Before deploying, update your Axios base URL in the frontend to point to your deployed Render backend URL.

## 🤖 AI Logic Explanation
- **A* Search Algorithm**: Calculates the shortest path on a 2D grid from the entry point (0,0) to the chosen parking slot by evaluating the `G` (distance from start) and `H` (Manhattan distance to target) values, dynamically avoiding obstacles (occupied slots).
- **Probability Simulator**: Uses a seeded randomizer offset by historical weighting to provide an "AI Confidence" score representing the likelihood a slot will remain available by the time the user reaches it.
