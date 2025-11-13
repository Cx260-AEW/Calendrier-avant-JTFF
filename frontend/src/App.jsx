import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import QuizPage from './pages/QuizPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminPage from './pages/AdminPage';
import { API_URL } from './config';

function App() {
  const [user, setUser] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      loadUser(savedUsername);
    }
  }, []);

  const loadUser = async (username) => {
    try {
      const response = await fetch(`${API_URL}/api/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      const data = await response.json();
      setUser(data.user);
      setScore(data.score);
      localStorage.setItem('username', username);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const logout = () => {
    setUser(null);
    setScore(0);
    localStorage.removeItem('username');
  };

  return (
    <Router>
      <div className="app">
        <div className="christmas-header">
          <h1>🎄 Calendrier de l'Avent 2025 🎄</h1>
          <p style={{ fontSize: '20px', marginTop: '8px' }}>QCM Aéronautique - JTFF</p>
        </div>

        {user && (
          <div className="container">
            <div className="card" style={{ padding: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '18px', fontWeight: '600' }}>👤 {user.username}</span>
                  <span className="score-badge" style={{ marginLeft: '16px' }}>⭐ {score} points</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Link to="/">
                    <button className="btn btn-secondary">📝 Quiz</button>
                  </Link>
                  <Link to="/leaderboard">
                    <button className="btn btn-secondary">🏆 Classement</button>
                  </Link>
                  <button className="btn btn-secondary" onClick={logout}>🚪 Déconnexion</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Routes>
          <Route 
            path="/" 
            element={user ? <QuizPage user={user} score={score} setScore={setScore} /> : <LoginPage onLogin={loadUser} />} 
          />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
