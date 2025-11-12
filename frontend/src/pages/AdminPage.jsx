import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [config, setConfig] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Form states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [morningHour, setMorningHour] = useState(8);
  const [morningMinute, setMorningMinute] = useState(0);
  const [eveningHour, setEveningHour] = useState(23);
  const [eveningMinute, setEveningMinute] = useState(0);
  const [discordWebhook, setDiscordWebhook] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadConfig();
      loadStats();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsAuthenticated(true);
        setMessage('✅ Connexion réussie');
      } else {
        setMessage('❌ Mot de passe incorrect');
      }
    } catch (error) {
      setMessage('❌ Erreur de connexion');
    }
    
    setLoading(false);
  };

  const loadConfig = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/config`);
      const data = await response.json();
      
      setConfig(data);
      setStartDate(data.startDate);
      setEndDate(data.endDate);
      setMorningHour(data.morningHour);
      setMorningMinute(data.morningMinute);
      setEveningHour(data.eveningHour);
      setEveningMinute(data.eveningMinute);
      setDiscordWebhook(data.discordWebhook);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/admin/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          startDate,
          endDate,
          morningHour: parseInt(morningHour),
          morningMinute: parseInt(morningMinute),
          eveningHour: parseInt(eveningHour),
          eveningMinute: parseInt(eveningMinute),
          discordWebhook
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('✅ Configuration enregistrée ! Les crons ont été reconfigurés.');
        setConfig(data.config);
      } else {
        setMessage('❌ Erreur lors de la sauvegarde');
      }
    } catch (error) {
      setMessage('❌ Erreur de connexion');
    }
    
    setLoading(false);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleTestMorning = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/admin/test-morning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('✅ Message du matin envoyé sur Discord !');
      } else {
        setMessage('❌ Erreur lors de l\'envoi');
      }
    } catch (error) {
      setMessage('❌ Erreur de connexion');
    }
    
    setLoading(false);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleTestEvening = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/admin/test-evening`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('✅ Message du soir envoyé sur Discord !');
      } else {
        setMessage('❌ Erreur lors de l\'envoi');
      }
    } catch (error) {
      setMessage('❌ Erreur de connexion');
    }
    
    setLoading(false);
    setTimeout(() => setMessage(''), 5000);
  };

  // Page de connexion
  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>👨‍💼 Admin</h2>
          <p style={{ color: '#6b7280', marginBottom: '32px' }}>
            Connexion requise pour accéder au panneau d'administration
          </p>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              className="input"
              placeholder="Mot de passe admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              style={{ marginBottom: '20px' }}
            />
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading || !password}
              style={{ width: '100%' }}
            >
              {loading ? '⏳ Connexion...' : '🔓 Se connecter'}
            </button>
          </form>

          {message && (
            <p style={{ 
              marginTop: '20px', 
              color: message.includes('✅') ? '#10b981' : '#ef4444',
              fontWeight: '600'
            }}>
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Panneau admin
  return (
    <div className="container">
      {/* Message de succès/erreur */}
      {message && (
        <div style={{
          padding: '16px',
          background: message.includes('✅') ? '#d1fae5' : '#fee2e2',
          border: `2px solid ${message.includes('✅') ? '#10b981' : '#ef4444'}`,
          borderRadius: '8px',
          marginBottom: '24px',
          fontWeight: '600',
          color: message.includes('✅') ? '#065f46' : '#991b1b'
        }}>
          {message}
        </div>
      )}

      {/* Statistiques */}
      {stats && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '24px' }}>📊 Statistiques</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '20px', background: '#f3f4f6', borderRadius: '8px' }}>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Jour actuel</p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#667eea' }}>
                {stats.currentDay}/25
              </p>
            </div>
            
            <div style={{ padding: '20px', background: '#f3f4f6', borderRadius: '8px' }}>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Utilisateurs</p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#10b981' }}>
                {stats.totalUsers}
              </p>
            </div>
            
            <div style={{ padding: '20px', background: '#f3f4f6', borderRadius: '8px' }}>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Réponses totales</p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#f59e0b' }}>
                {stats.totalAnswers}
              </p>
            </div>
          </div>

          {/* Top 3 */}
          {stats.leaderboard && stats.leaderboard.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>🏆 Top 3</h3>
              {stats.leaderboard.map((user, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  marginBottom: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>
                      {['🥇', '🥈', '🥉'][index]}
                    </span>
                    <span style={{ fontWeight: '600' }}>{user.username}</span>
                  </div>
                  <span className="score-badge">{user.score} pts</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Configuration */}
      <div className="card">
        <h2 style={{ fontSize: '28px', marginBottom: '24px' }}>⚙️ Configuration</h2>
        
        <form onSubmit={handleSaveConfig}>
          {/* Dates */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '16px', color: '#667eea' }}>📅 Période du calendrier</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Date de début
                </label>
                <input
                  type="date"
                  className="input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Date de fin
                </label>
                <input
                  type="date"
                  className="input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Horaires */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '16px', color: '#667eea' }}>⏰ Horaires des messages Discord</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Message du matin */}
              <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
                <p style={{ fontWeight: '600', marginBottom: '12px' }}>🌅 Message du matin (Annonce)</p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="number"
                    className="input"
                    value={morningHour}
                    onChange={(e) => setMorningHour(e.target.value)}
                    min="0"
                    max="23"
                    style={{ width: '80px' }}
                  />
                  <span>h</span>
                  <input
                    type="number"
                    className="input"
                    value={morningMinute}
                    onChange={(e) => setMorningMinute(e.target.value)}
                    min="0"
                    max="59"
                    style={{ width: '80px' }}
                  />
                </div>
              </div>

              {/* Message du soir */}
              <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
                <p style={{ fontWeight: '600', marginBottom: '12px' }}>🌙 Message du soir (Résultats)</p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="number"
                    className="input"
                    value={eveningHour}
                    onChange={(e) => setEveningHour(e.target.value)}
                    min="0"
                    max="23"
                    style={{ width: '80px' }}
                  />
                  <span>h</span>
                  <input
                    type="number"
                    className="input"
                    value={eveningMinute}
                    onChange={(e) => setEveningMinute(e.target.value)}
                    min="0"
                    max="59"
                    style={{ width: '80px' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Discord Webhook */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '16px', color: '#667eea' }}>💬 Discord Webhook</h3>
            <input
              type="url"
              className="input"
              placeholder="https://discord.com/api/webhooks/..."
              value={discordWebhook}
              onChange={(e) => setDiscordWebhook(e.target.value)}
              required
            />
          </div>

          {/* Bouton sauvegarder */}
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', marginBottom: '16px' }}
          >
            {loading ? '⏳ Sauvegarde...' : '💾 Sauvegarder la configuration'}
          </button>
        </form>

        {/* Boutons test webhook */}
        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '2px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '16px', color: '#667eea' }}>🧪 Test des webhooks Discord</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <button 
              className="btn btn-secondary" 
              onClick={handleTestMorning}
              disabled={loading}
              style={{ padding: '16px' }}
            >
              🌅 Tester message du matin
            </button>
            
            <button 
              className="btn btn-secondary" 
              onClick={handleTestEvening}
              disabled={loading}
              style={{ padding: '16px' }}
            >
              🌙 Tester message du soir
            </button>
          </div>
          
          <p style={{ marginTop: '12px', fontSize: '14px', color: '#6b7280', fontStyle: 'italic' }}>
            💡 Ces boutons envoient immédiatement les messages sur Discord pour tester la configuration
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
