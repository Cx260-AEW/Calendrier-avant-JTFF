import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [config, setConfig] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Form states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [morningHour, setMorningHour] = useState(8);
  const [morningMinute, setMorningMinute] = useState(0);
  const [eveningHour, setEveningHour] = useState(23);
  const [eveningMinute, setEveningMinute] = useState(0);
  const [discordWebhook, setDiscordWebhook] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showResetAnswersConfirm, setShowResetAnswersConfirm] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadConfig();
      loadStats();
      loadUsers();
      const interval = setInterval(() => {
        loadStats();
        loadUsers();
      }, 10000);
      return () => clearInterval(interval);
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
        await loadStats();
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

  const loadUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleResetAll = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/admin/reset-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('✅ Toutes les données ont été supprimées !');
        setShowResetConfirm(false);
        await loadStats();
        await loadUsers();
      } else {
        setMessage('❌ Erreur lors de la suppression');
      }
    } catch (error) {
      setMessage('❌ Erreur de connexion');
    }
    
    setLoading(false);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/admin/delete-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, username: selectedUser })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage(`✅ Utilisateur ${selectedUser} supprimé !`);
        setShowDeleteConfirm(false);
        setSelectedUser('');
        await loadStats();
        await loadUsers();
      } else {
        setMessage('❌ Erreur lors de la suppression');
      }
    } catch (error) {
      setMessage('❌ Erreur de connexion');
    }
    
    setLoading(false);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleResetAnswers = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/admin/reset-answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('✅ Toutes les réponses ont été supprimées !');
        setShowResetAnswersConfirm(false);
        await loadStats();
        await loadUsers();
      } else {
        setMessage('❌ Erreur lors de la suppression');
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

      {/* Header avec titre et onglets */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '24px', textAlign: 'center' }}>
          👨‍💼 Panneau d'administration
        </h1>
        
        <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #e5e7eb', justifyContent: 'center' }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              padding: '16px 32px',
              border: 'none',
              background: activeTab === 'dashboard' ? '#667eea' : 'transparent',
              color: activeTab === 'dashboard' ? 'white' : '#667eea',
              borderBottom: activeTab === 'dashboard' ? '3px solid #667eea' : 'none',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: '600',
              borderRadius: '8px 8px 0 0',
              transition: 'all 0.3s'
            }}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '16px 32px',
              border: 'none',
              background: activeTab === 'settings' ? '#667eea' : 'transparent',
              color: activeTab === 'settings' ? 'white' : '#667eea',
              borderBottom: activeTab === 'settings' ? '3px solid #667eea' : 'none',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: '600',
              borderRadius: '8px 8px 0 0',
              transition: 'all 0.3s'
            }}
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* ONGLET DASHBOARD */}
      {activeTab === 'dashboard' && stats && (
        <div>
          {/* Banner jour actuel */}
          <div style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: 'white',
            padding: '40px',
            borderRadius: '16px',
            marginBottom: '32px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
          }}>
            <h2 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '16px' }}>
              🎄 Jour {stats.currentDay}/25
            </h2>
            <p style={{ fontSize: '20px', opacity: 0.9 }}>
              {stats.currentDay === 0 ? 'Le calendrier n\'a pas encore commencé' : 
               stats.currentDay === 25 ? '🎅 Dernier jour ! Joyeux Noël !' :
               `Plus que ${25 - stats.currentDay} jours avant Noël !`}
            </p>
            
            {/* Barre de progression */}
            {stats.currentDay > 0 && (
              <div style={{ marginTop: '24px' }}>
                <div style={{ 
                  width: '100%', 
                  height: '16px', 
                  background: 'rgba(255, 255, 255, 0.2)', 
                  borderRadius: '8px', 
                  overflow: 'hidden' 
                }}>
                  <div style={{ 
                    width: `${(stats.currentDay / 25) * 100}%`, 
                    height: '100%', 
                    background: 'white',
                    transition: 'width 0.5s ease',
                    borderRadius: '8px'
                  }}></div>
                </div>
                <p style={{ marginTop: '12px', fontSize: '16px', fontWeight: '600' }}>
                  {Math.round((stats.currentDay / 25) * 100)}% du calendrier complété
                </p>
              </div>
            )}
          </div>

          {/* Cartes statistiques principales */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '24px',
            marginBottom: '32px'
          }}>
            <div style={{ 
              padding: '32px', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              borderRadius: '16px', 
              color: 'white',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
              <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '8px' }}>Participants</p>
              <p style={{ fontSize: '48px', fontWeight: '700', margin: 0 }}>{stats.totalUsers}</p>
              <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '8px' }}>utilisateurs inscrits</p>
            </div>
            
            <div style={{ 
              padding: '32px', 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
              borderRadius: '16px', 
              color: 'white',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
              <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '8px' }}>Réponses totales</p>
              <p style={{ fontSize: '48px', fontWeight: '700', margin: 0 }}>{stats.totalAnswers}</p>
              <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '8px' }}>réponses soumises</p>
            </div>
            
            <div style={{ 
              padding: '32px', 
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
              borderRadius: '16px', 
              color: 'white',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>❓</div>
              <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '8px' }}>Questions disponibles</p>
              <p style={{ fontSize: '48px', fontWeight: '700', margin: 0 }}>{stats.currentDay * 4}</p>
              <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '8px' }}>/ 100 questions totales</p>
            </div>

            <div style={{ 
              padding: '32px', 
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
              borderRadius: '16px', 
              color: 'white',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
              <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '8px' }}>Taux de réponse</p>
              <p style={{ fontSize: '48px', fontWeight: '700', margin: 0 }}>
                {stats.currentDay > 0 && stats.totalUsers > 0 
                  ? Math.round((stats.totalAnswers / (stats.currentDay * 4 * stats.totalUsers)) * 100) 
                  : 0}%
              </p>
              <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '8px' }}>de participation</p>
            </div>
          </div>

          {/* Top 10 Classement */}
          {stats.leaderboard && stats.leaderboard.length > 0 && (
            <div className="card" style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '32px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                🏆 Top 10 Classement
              </h2>
              
              <div style={{ display: 'grid', gap: '12px' }}>
                {stats.leaderboard.slice(0, 10).map((user, index) => {
                  const medals = ['🥇', '🥈', '🥉'];
                  const medal = medals[index] || null;
                  const rank = index + 1;
                  
                  return (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '20px',
                      background: index < 3 
                        ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' 
                        : '#f9fafb',
                      borderRadius: '12px',
                      border: index < 3 ? '2px solid #f59e0b' : '2px solid #e5e7eb',
                      transition: 'transform 0.2s',
                      cursor: 'default'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                        <div style={{ 
                          minWidth: '60px', 
                          textAlign: 'center',
                          fontSize: medal ? '40px' : '24px',
                          fontWeight: '700',
                          color: !medal ? '#667eea' : 'inherit'
                        }}>
                          {medal || `#${rank}`}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ 
                            fontWeight: '700', 
                            fontSize: '20px', 
                            margin: 0,
                            color: '#1f2937'
                          }}>
                            {user.username}
                          </p>
                          <p style={{ 
                            fontSize: '14px', 
                            color: '#6b7280', 
                            margin: '4px 0 0 0' 
                          }}>
                            {user.answersCount} questions répondues
                          </p>
                        </div>
                      </div>
                      <div style={{
                        padding: '12px 24px',
                        background: index < 3 
                          ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        borderRadius: '24px',
                        fontWeight: '700',
                        fontSize: '24px',
                        minWidth: '100px',
                        textAlign: 'center',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                      }}>
                        {user.score} pts
                      </div>
                    </div>
                  );
                })}
              </div>

              {stats.leaderboard.length > 10 && (
                <p style={{ 
                  textAlign: 'center', 
                  marginTop: '20px', 
                  color: '#6b7280',
                  fontSize: '14px',
                  fontStyle: 'italic'
                }}>
                  ... et {stats.leaderboard.length - 10} autres participants
                </p>
              )}
            </div>
          )}

          {/* Statistiques du jour */}
          {stats.dayStats && stats.dayStats.questions && stats.dayStats.questions.length > 0 && (
            <div className="card">
              <h2 style={{ fontSize: '32px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                📊 Statistiques du jour {stats.dayStats.day}
              </h2>
              <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '24px' }}>
                👥 {stats.dayStats.totalParticipants} participants ont répondu aux questions d'aujourd'hui
              </p>
              
              <div style={{ display: 'grid', gap: '20px' }}>
                {stats.dayStats.questions.map((qStat, index) => {
                  const successRate = qStat.successRate;
                  const getColor = () => {
                    if (successRate >= 75) return { bg: '#d1fae5', border: '#10b981', text: '#065f46', bar: '#10b981' };
                    if (successRate >= 50) return { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', bar: '#f59e0b' };
                    return { bg: '#fee2e2', border: '#ef4444', text: '#991b1b', bar: '#ef4444' };
                  };
                  const colors = getColor();
                  
                  return (
                    <div key={index} style={{ 
                      padding: '24px', 
                      background: colors.bg,
                      borderRadius: '12px', 
                      border: `2px solid ${colors.border}`
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'start', 
                        marginBottom: '16px',
                        gap: '16px'
                      }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ 
                            fontSize: '14px', 
                            fontWeight: '600', 
                            color: colors.text,
                            marginBottom: '4px',
                            opacity: 0.8
                          }}>
                            Question #{qStat.questionId}
                          </p>
                          <h4 style={{ 
                            fontSize: '18px', 
                            fontWeight: '600', 
                            margin: 0,
                            color: colors.text
                          }}>
                            {qStat.question}
                          </h4>
                        </div>
                        <div style={{
                          padding: '8px 20px',
                          background: colors.bar,
                          color: 'white',
                          borderRadius: '20px',
                          fontSize: '18px',
                          fontWeight: '700',
                          minWidth: '80px',
                          textAlign: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                          {successRate}%
                        </div>
                      </div>
                      
                      {/* Barre de progression */}
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ 
                          width: '100%', 
                          height: '12px', 
                          background: 'rgba(0,0,0,0.1)', 
                          borderRadius: '6px', 
                          overflow: 'hidden' 
                        }}>
                          <div style={{ 
                            width: `${successRate}%`, 
                            height: '100%', 
                            background: colors.bar,
                            transition: 'width 0.5s ease',
                            borderRadius: '6px'
                          }}></div>
                        </div>
                      </div>
                      
                      <p style={{ 
                        fontSize: '14px', 
                        color: colors.text,
                        margin: 0,
                        fontWeight: '600'
                      }}>
                        ✅ {qStat.correctAnswersCount} bonnes réponses sur {qStat.totalAnswers} participants
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Aucune statistique */}
          {(!stats.dayStats || !stats.dayStats.questions || stats.dayStats.questions.length === 0) && (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📊</div>
              <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>Aucune statistique disponible</h3>
              <p style={{ color: '#6b7280' }}>
                Les statistiques apparaîtront une fois que les participants auront commencé à répondre
              </p>
            </div>
          )}
        </div>
      )}

      {/* ONGLET SETTINGS */}
      {activeTab === 'settings' && (
        <div className="card">
          <h2 style={{ fontSize: '32px', marginBottom: '32px', color: '#667eea' }}>⚙️ Configuration</h2>
          
          <form onSubmit={handleSaveConfig}>
            {/* Dates */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ 
                fontSize: '24px', 
                marginBottom: '20px', 
                color: '#667eea',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                📅 Période du calendrier
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '12px', 
                    fontWeight: '600',
                    fontSize: '16px'
                  }}>
                    📍 Date de début
                  </label>
                  <input
                    type="date"
                    className="input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    style={{ fontSize: '16px', padding: '14px' }}
                  />
                </div>
                
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '12px', 
                    fontWeight: '600',
                    fontSize: '16px'
                  }}>
                    🏁 Date de fin
                  </label>
                  <input
                    type="date"
                    className="input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    style={{ fontSize: '16px', padding: '14px' }}
                  />
                </div>
              </div>
            </div>

            {/* Horaires */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ 
                fontSize: '24px', 
                marginBottom: '20px', 
                color: '#667eea',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                ⏰ Horaires des messages Discord
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Message du matin */}
                <div style={{ 
                  padding: '24px', 
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', 
                  borderRadius: '16px', 
                  border: '3px solid #f59e0b' 
                }}>
                  <p style={{ 
                    fontWeight: '700', 
                    marginBottom: '16px', 
                    fontSize: '18px', 
                    color: '#92400e',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    🌅 Message du matin (Annonce)
                  </p>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                      type="number"
                      className="input"
                      value={morningHour}
                      onChange={(e) => setMorningHour(e.target.value)}
                      min="0"
                      max="23"
                      style={{ width: '100px', fontSize: '20px', padding: '14px', textAlign: 'center' }}
                    />
                    <span style={{ fontSize: '24px', fontWeight: '700' }}>h</span>
                    <input
                      type="number"
                      className="input"
                      value={morningMinute}
                      onChange={(e) => setMorningMinute(e.target.value)}
                      min="0"
                      max="59"
                      style={{ width: '100px', fontSize: '20px', padding: '14px', textAlign: 'center' }}
                    />
                  </div>
                </div>

                {/* Message du soir */}
                <div style={{ 
                  padding: '24px', 
                  background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', 
                  borderRadius: '16px', 
                  border: '3px solid #3b82f6' 
                }}>
                  <p style={{ 
                    fontWeight: '700', 
                    marginBottom: '16px', 
                    fontSize: '18px', 
                    color: '#1e40af',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    🌙 Message du soir (Résultats)
                  </p>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                      type="number"
                      className="input"
                      value={eveningHour}
                      onChange={(e) => setEveningHour(e.target.value)}
                      min="0"
                      max="23"
                      style={{ width: '100px', fontSize: '20px', padding: '14px', textAlign: 'center' }}
                    />
                    <span style={{ fontSize: '24px', fontWeight: '700' }}>h</span>
                    <input
                      type="number"
                      className="input"
                      value={eveningMinute}
                      onChange={(e) => setEveningMinute(e.target.value)}
                      min="0"
                      max="59"
                      style={{ width: '100px', fontSize: '20px', padding: '14px', textAlign: 'center' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Discord Webhook */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ 
                fontSize: '24px', 
                marginBottom: '20px', 
                color: '#667eea',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                💬 Discord Webhook
              </h3>
              <input
                type="url"
                className="input"
                placeholder="https://discord.com/api/webhooks/..."
                value={discordWebhook}
                onChange={(e) => setDiscordWebhook(e.target.value)}
                required
                style={{ fontSize: '16px', padding: '14px' }}
              />
              <p style={{ 
                marginTop: '12px', 
                fontSize: '14px', 
                color: '#6b7280', 
                fontStyle: 'italic',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                ⚠️ Le webhook doit avoir les permissions d'envoyer des messages et utiliser des emojis
              </p>
            </div>

            {/* Bouton sauvegarder */}
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{ 
                width: '100%', 
                marginBottom: '40px', 
                fontSize: '20px', 
                padding: '20px',
                fontWeight: '700'
              }}
            >
              {loading ? '⏳ Sauvegarde en cours...' : '💾 Sauvegarder la configuration'}
            </button>
          </form>

          {/* Boutons test webhook */}
          <div style={{ paddingTop: '40px', borderTop: '3px solid #e5e7eb' }}>
            <h3 style={{ 
              fontSize: '24px', 
              marginBottom: '20px', 
              color: '#667eea',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              🧪 Test des webhooks Discord
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <button 
                className="btn"
                onClick={handleTestMorning}
                disabled={loading}
                style={{ 
                  padding: '24px',
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '700',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px rgba(251, 191, 36, 0.3)'
                }}
              >
                🌅 Tester message du matin
              </button>
              
              <button 
                className="btn"
                onClick={handleTestEvening}
                disabled={loading}
                style={{ 
                  padding: '24px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '700',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                }}
              >
                🌙 Tester message du soir
              </button>
            </div>
            
            <p style={{ 
              marginTop: '20px', 
              fontSize: '14px', 
              color: '#6b7280', 
              fontStyle: 'italic', 
              textAlign: 'center'
            }}>
              💡 Ces boutons envoient immédiatement les messages sur Discord pour tester la configuration
            </p>
          </div>

          {/* Gestion des données */}
          <div style={{ marginTop: '48px', paddingTop: '40px', borderTop: '3px solid #ef4444' }}>
            <h3 style={{ 
              fontSize: '24px', 
              marginBottom: '8px', 
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              🗑️ Gestion des données
            </h3>
            <p style={{ 
              fontSize: '14px', 
              color: '#991b1b', 
              marginBottom: '24px',
              fontWeight: '600'
            }}>
              ⚠️ ZONE DANGEREUSE - Ces actions sont irréversibles !
            </p>

            {/* Liste des utilisateurs */}
            {users && users.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: '600' }}>
                  👥 Utilisateurs inscrits ({users.length})
                </h4>
                <div style={{ 
                  maxHeight: '300px', 
                  overflowY: 'auto', 
                  background: '#f9fafb', 
                  borderRadius: '8px',
                  padding: '12px',
                  border: '2px solid #e5e7eb'
                }}>
                  {users.map((user, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      background: 'white',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div>
                        <p style={{ fontWeight: '600', margin: 0 }}>{user.username}</p>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
                          {user.answersCount} réponses • {user.score} points
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedUser(user.username);
                          setShowDeleteConfirm(true);
                        }}
                        style={{
                          padding: '8px 16px',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Boutons de suppression/reset */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <button 
                  onClick={() => setShowResetAnswersConfirm(true)}
                  disabled={loading}
                  style={{ 
                    width: '100%',
                    padding: '20px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '700',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
                  }}
                >
                  🔄 Reset les réponses
                </button>
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px', textAlign: 'center' }}>
                  Garde les utilisateurs, supprime toutes les réponses
                </p>
              </div>

              <div>
                <button 
                  onClick={() => setShowResetConfirm(true)}
                  disabled={loading}
                  style={{ 
                    width: '100%',
                    padding: '20px',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '700',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
                  }}
                >
                  ❌ Reset TOUT
                </button>
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px', textAlign: 'center' }}>
                  Supprime utilisateurs ET réponses
                </p>
              </div>
            </div>
          </div>

          {/* Modales de confirmation */}
          {showDeleteConfirm && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: 'white',
                padding: '32px',
                borderRadius: '16px',
                maxWidth: '500px',
                width: '90%',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)'
              }}>
                <h3 style={{ fontSize: '24px', marginBottom: '16px', color: '#ef4444' }}>
                  ⚠️ Confirmer la suppression
                </h3>
                <p style={{ marginBottom: '24px', color: '#6b7280' }}>
                  Voulez-vous vraiment supprimer l'utilisateur <strong>{selectedUser}</strong> et toutes ses réponses ?
                </p>
                <p style={{ marginBottom: '24px', color: '#991b1b', fontWeight: '600', fontSize: '14px' }}>
                  ⚠️ Cette action est irréversible !
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setSelectedUser('');
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#e5e7eb',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleDeleteUser}
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    {loading ? 'Suppression...' : 'Supprimer'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showResetAnswersConfirm && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: 'white',
                padding: '32px',
                borderRadius: '16px',
                maxWidth: '500px',
                width: '90%',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)'
              }}>
                <h3 style={{ fontSize: '24px', marginBottom: '16px', color: '#f59e0b' }}>
                  ⚠️ Confirmer le reset des réponses
                </h3>
                <p style={{ marginBottom: '24px', color: '#6b7280' }}>
                  Voulez-vous vraiment supprimer <strong>TOUTES les réponses</strong> ?
                </p>
                <p style={{ marginBottom: '24px', color: '#92400e', fontWeight: '600', fontSize: '14px' }}>
                  Les utilisateurs resteront inscrits mais leurs réponses seront supprimées.
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setShowResetAnswersConfirm(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#e5e7eb',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleResetAnswers}
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    {loading ? 'Reset...' : 'Reset les réponses'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showResetConfirm && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: 'white',
                padding: '32px',
                borderRadius: '16px',
                maxWidth: '500px',
                width: '90%',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)'
              }}>
                <h3 style={{ fontSize: '24px', marginBottom: '16px', color: '#ef4444' }}>
                  ⚠️ DANGER - Confirmer le reset complet
                </h3>
                <p style={{ marginBottom: '24px', color: '#6b7280' }}>
                  Voulez-vous vraiment supprimer <strong>TOUS les utilisateurs ET TOUTES les réponses</strong> ?
                </p>
                <p style={{ marginBottom: '24px', color: '#991b1b', fontWeight: '700', fontSize: '16px', textAlign: 'center' }}>
                  ⚠️ CETTE ACTION EST IRRÉVERSIBLE !<br/>
                  Toutes les données seront perdues !
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#e5e7eb',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleResetAll}
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    {loading ? 'Reset...' : 'Reset TOUT'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminPage;
