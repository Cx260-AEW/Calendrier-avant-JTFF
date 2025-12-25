import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
    const interval = setInterval(loadLeaderboard, 10000); // Rafraîchir toutes les 10 secondes
    return () => clearInterval(interval);
  }, []);

  const loadLeaderboard = async () => {
    try {
      const response = await fetch(`${API_URL}/api/leaderboard`);
      const data = await response.json();
      setLeaderboard(data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  const getMedal = (index) => {
    const medals = ['🥇', '🥈', '🥉'];
    return medals[index] || `${index + 1}.`;
  };

  const handleExport = () => {
    window.open(`${API_URL}/api/export/leaderboard`, '_blank');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>⏳ Chargement du classement...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ fontSize: '32px', marginBottom: '24px', textAlign: 'center' }}>
          🏆 Classement Général
        </h2>

        {leaderboard.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '18px' }}>
            Aucun participant pour le moment. Soyez le premier ! 🎅
          </p>
        ) : (
          <div>
            {leaderboard.map((user, index) => (
              <div 
                key={user.username} 
                className="leaderboard-item"
                style={{
                  background: index < 3 ? '#f3f4f6' : 'transparent',
                  borderRadius: index < 3 ? '8px' : '0',
                  marginBottom: index < 3 ? '8px' : '0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="medal" style={{ fontSize: index < 3 ? '32px' : '20px' }}>
                    {getMedal(index)}
                  </span>
                  <div>
                    <p style={{ fontSize: '18px', fontWeight: '600' }}>{user.username}</p>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>
                      {user.answersCount} questions répondues
                    </p>
                  </div>
                </div>
                <div className="score-badge">
                  {user.score} points
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '32px', textAlign: 'center', display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button 
            className="btn btn-secondary" 
            onClick={loadLeaderboard}
          >
            🔄 Actualiser
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleExport}
          >
            📥 Exporter en Excel
          </button>
        </div>
      </div>
    </div>
  );
}

export default LeaderboardPage;
