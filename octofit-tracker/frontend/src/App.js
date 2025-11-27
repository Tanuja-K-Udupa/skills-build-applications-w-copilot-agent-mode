import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Activities from './pages/Activities';
import Teams from './pages/Teams';
import Workouts from './pages/Workouts';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    // This would typically fetch from the backend
    setLoading(false);
  }, []);

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              🐙 OctoFit Tracker
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/activities">Activities</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/teams">Teams</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/workouts">Workouts</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/leaderboard">Leaderboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Profile</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <main className="container mt-4">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
            </Routes>
          )}
        </main>

        <footer className="footer mt-5 py-3 bg-dark text-white text-center">
          <p>&copy; 2025 OctoFit Tracker. Keep moving, keep improving! 🏃‍♂️</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
