import React, { useState } from 'react';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    await onLogin(username.trim());
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>🎅 Bienvenue !</h2>
        <p style={{ color: '#6b7280', marginBottom: '32px', fontSize: '18px' }}>
          Entrez votre pseudo pour commencer le calendrier de l'Avent
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="input"
            placeholder="Votre pseudo"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            style={{ marginBottom: '20px' }}
          />
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading || !username.trim()}
            style={{ width: '100%' }}
          >
            {loading ? '⏳ Chargement...' : '🚀 Commencer'}
          </button>
        </form>

        <div style={{ marginTop: '32px', padding: '16px', background: '#f3f4f6', borderRadius: '8px' }}>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            📅 4 nouvelles questions chaque jour du 1er au 25 décembre
            <br />
            ⏰ Disponible de 8h à 23h30
            <br />
            🔄 Possibilité de rattraper les jours précédents
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
