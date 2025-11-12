import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'https://calendrier-avant-jtff-production.up.railway.app';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuth');
    if (savedAuth) {
      setIsAuthenticated(true);
      setPassword(savedAuth);
      fetchData(savedAuth);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('adminAuth', password);
        fetchData(password);
      } else {
        setMessage('❌ Mot de passe incorrect');
      }
    } catch (error) {
      setMessage('❌ Erreur de connexion');
    }
  };

  const fetchData = async (pwd) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/data?password=${pwd}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      setMessage('❌ Erreur lors du chargement des données');
    }
    setLoading(false);
  };

  const fetchUserDetails = async (username) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/user/${username}?password=${password}`);
      const result = await response.json();
      setUserDetails(result);
      setSelectedUser(username);
    } catch (error) {
      setMessage('❌ Erreur lors du chargement des détails');
    }
    setLoading(false);
  };

  const handleDeleteUser = async (username) => {
    if (!confirm(`Supprimer ${username} et toutes ses réponses ?`)) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/user/${username}?password=${password}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMessage(`✅ ${username} supprimé`);
        fetchData(password);
        if (selectedUser === username) {
          setSelectedUser(null);
          setUserDetails(null);
        }
      } else {
        setMessage('❌ Erreur lors de la suppression');
      }
    } catch (error) {
      setMessage('❌ Erreur lors de la suppression');
    }
  };

  const handleResetAll = async () => {
    if (!confirm('⚠️ ATTENTION : Supprimer TOUS les participants et leurs réponses ?\n\nCette action est irréversible !')) return;
    if (!confirm('⚠️ DERNIÈRE CONFIRMATION : Êtes-vous ABSOLUMENT SÛR de vouloir tout supprimer ?')) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/reset-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        setMessage('✅ Tous les participants ont été supprimés');
        fetchData(password);
        setSelectedUser(null);
        setUserDetails(null);
      } else {
        setMessage('❌ Erreur lors de la réinitialisation');
      }
    } catch (error) {
      setMessage('❌ Erreur lors de la réinitialisation');
    }
  };

  const handleTestDiscord = async () => {
    setMessage('⏳ Envoi du message de test...');
    try {
      const response = await fetch(`${API_URL}/api/admin/test-discord`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('✅ ' + result.message);
      } else {
        setMessage('❌ ' + result.error);
      }
    } catch (error) {
      setMessage('❌ Erreur lors du test Discord');
    }
  };

  const handleTestMorning = async () => {
    setMessage('⏳ Envoi du message du matin...');
    try {
      const response = await fetch(`${API_URL}/api/admin/test-morning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('✅ ' + result.message);
      } else {
        setMessage('❌ Erreur');
      }
    } catch (error) {
      setMessage('❌ Erreur lors du test');
    }
  };

  const handleTestEvening = async () => {
    setMessage('⏳ Envoi du message du soir...');
    try {
      const response = await fetch(`${API_URL}/api/admin/test-evening`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('✅ ' + result.message);
      } else {
        setMessage('❌ Erreur');
      }
    } catch (error) {
      setMessage('❌ Erreur lors du test');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setPassword('');
    setData(null);
    setSelectedUser(null);
    setUserDetails(null);
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          maxWidth: '400px',
          width: '100%'
        }}>
          <h1 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2rem' }}>
            🔐 Admin
          </h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe admin"
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '1rem',
                border: '2px solid #ddd',
                borderRadius: '10px',
                marginBottom: '20px',
                boxSizing: 'border-box'
              }}
            />
            <button type="submit" style={{
              width: '100%',
              padding: '15px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              Se connecter
            </button>
          </form>
          {message && (
            <p style={{ marginTop: '20px', textAlign: 'center', color: message.includes('❌') ? '#e74c3c' : '#27ae60' }}>
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>📊 Dashboard Admin</h1>
          <button onClick={handleLogout} style={{
            padding: '10px 20px',
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}>
            Déconnexion
          </button>
        </div>

        {message && (
          <div style={{
            padding: '15px',
            background: message.includes('❌') ? '#fee' : '#efe',
            border: `2px solid ${message.includes('❌') ? '#e74c3c' : '#27ae60'}`,
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '1.1rem'
          }}>
            {message}
          </div>
        )}

        {loading ? (
          <p style={{ textAlign: 'center', fontSize: '1.5rem' }}>⏳ Chargement...</p>
        ) : data ? (
          <>
            {/* STATISTIQUES GÉNÉRALES */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '40px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '30px',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👥</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{data.users}</div>
                <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Participants</div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                padding: '30px',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📝</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{data.totalAnswers}</div>
                <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Réponses totales</div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                padding: '30px',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📊</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                  {data.totalAnswers > 0 ? Math.round((data.questionStats.reduce((sum, q) => sum + q.correctAnswers, 0) / data.totalAnswers) * 100) : 0}%
                </div>
                <div style={{ fontSize: '1.1rem', opacity: 0.9 }}>Taux de réussite</div>
              </div>
            </div>

            {/* SECTION TESTS DISCORD */}
            <div style={{
              background: 'linear-gradient(135deg, #5f72bd 0%, #9b23ea 100%)',
              padding: '30px',
              borderRadius: '15px',
              marginBottom: '40px',
              color: 'white'
            }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>🔔</span> Tests Discord
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '15px'
              }}>
                <button onClick={handleTestDiscord} style={{
                  padding: '20px',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.5)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                  backdropFilter: 'blur(10px)'
                }}>
                  🧪 Test Simple
                </button>

                <button onClick={handleTestMorning} style={{
                  padding: '20px',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.5)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                  backdropFilter: 'blur(10px)'
                }}>
                  🌅 Message Matin (8h)
                </button>

                <button onClick={handleTestEvening} style={{
                  padding: '20px',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.5)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                  backdropFilter: 'blur(10px)'
                }}>
                  🌙 Message Soir (23h30)
                </button>
              </div>
            </div>

            {/* VUE DÉTAILLÉE D'UN JOUEUR */}
            {selectedUser && userDetails && (
              <div style={{
                background: '#f8f9fa',
                padding: '30px',
                borderRadius: '15px',
                marginBottom: '40px',
                border: '2px solid #667eea'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.8rem', margin: 0 }}>
                    👤 Détails de {selectedUser}
                  </h2>
                  <button onClick={() => { setSelectedUser(null); setUserDetails(null); }} style={{
                    padding: '10px 20px',
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}>
                    Fermer
                  </button>
                </div>

                {/* Stats globales du joueur */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '15px',
                  marginBottom: '30px'
                }}>
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ fontSize: '2rem', color: '#667eea', fontWeight: 'bold' }}>
                      {userDetails.totalScore}
                    </div>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>Points totaux</div>
                  </div>
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ fontSize: '2rem', color: '#667eea', fontWeight: 'bold' }}>
                      {userDetails.totalAnswers}
                    </div>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>Réponses</div>
                  </div>
                  <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ fontSize: '2rem', color: '#667eea', fontWeight: 'bold' }}>
                      {userDetails.totalAnswers > 0 ? Math.round((userDetails.totalScore / userDetails.totalAnswers) * 100) : 0}%
                    </div>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>Taux de réussite</div>
                  </div>
                </div>

                {/* Stats par catégorie */}
                <h3 style={{ fontSize: '1.4rem', marginBottom: '15px' }}>📊 Statistiques par Catégorie</h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '15px',
                  marginBottom: '30px'
                }}>
                  {Object.entries(userDetails.statsByCategory).map(([category, stats]) => (
                    <div key={category} style={{
                      background: 'white',
                      padding: '20px',
                      borderRadius: '10px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '10px' }}>
                        {category === 'Navigation aérienne' && '🧭'} 
                        {category === 'Contrôle aérien' && '🎧'}
                        {category === 'Réglementation' && '📜'}
                        {category === 'Cartes aéronautiques' && '🗺️'}
                        {' '}{category}
                      </div>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: stats.percentage >= 70 ? '#27ae60' : stats.percentage >= 50 ? '#f39c12' : '#e74c3c' }}>
                        {stats.percentage}%
                      </div>
                      <div style={{ color: '#666', fontSize: '0.9rem' }}>
                        {stats.correct} / {stats.total} correctes
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stats par jour */}
                <h3 style={{ fontSize: '1.4rem', marginBottom: '15px' }}>📅 Statistiques par Jour</h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                  gap: '10px',
                  marginBottom: '30px'
                }}>
                  {Object.entries(userDetails.statsByDay).map(([day, stats]) => (
                    <div key={day} style={{
                      background: 'white',
                      padding: '15px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '5px' }}>Jour {day}</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: stats.percentage >= 75 ? '#27ae60' : stats.percentage >= 50 ? '#f39c12' : '#e74c3c' }}>
                        {stats.percentage}%
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#999' }}>{stats.correct}/{stats.total}</div>
                    </div>
                  ))}
                </div>

                {/* Historique des réponses */}
                <h3 style={{ fontSize: '1.4rem', marginBottom: '15px' }}>📝 Historique Complet des Réponses</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: '#667eea', color: 'white' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Jour</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Catégorie</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Question</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Réponse</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Résultat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userDetails.answersDetails
                        .sort((a, b) => a.day - b.day || a.questionId - b.questionId)
                        .map((answer, index) => (
                        <tr key={index} style={{ 
                          borderBottom: '1px solid #ddd',
                          background: answer.isCorrect ? '#d4edda' : '#f8d7da'
                        }}>
                          <td style={{ padding: '12px', fontWeight: 'bold' }}>Jour {answer.day}</td>
                          <td style={{ padding: '12px' }}>
                            {answer.group === 'Navigation aérienne' && '🧭'} 
                            {answer.group === 'Contrôle aérien' && '🎧'}
                            {answer.group === 'Réglementation' && '📜'}
                            {answer.group === 'Cartes aéronautiques' && '🗺️'}
                            {' '}{answer.group}
                          </td>
                          <td style={{ padding: '12px' }}>{answer.question.substring(0, 60)}...</td>
                          <td style={{ padding: '12px' }}>
                            <div style={{ marginBottom: '5px' }}>
                              <strong>Répondu:</strong> {answer.userAnswerText}
                            </div>
                            {!answer.isCorrect && (
                              <div style={{ color: '#27ae60' }}>
                                <strong>Correcte:</strong> {answer.correctAnswerText}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <span style={{
                              padding: '5px 15px',
                              borderRadius: '20px',
                              fontWeight: 'bold',
                              background: answer.isCorrect ? '#27ae60' : '#e74c3c',
                              color: 'white'
                            }}>
                              {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* LISTE DES PARTICIPANTS */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.8rem' }}>👥 Liste des Participants</h2>
                <button onClick={handleResetAll} style={{
                  padding: '12px 24px',
                  background: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}>
                  🗑️ Reset Complet
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                      <th style={{ padding: '15px', textAlign: 'left' }}>Pseudo</th>
                      <th style={{ padding: '15px', textAlign: 'center' }}>Score</th>
                      <th style={{ padding: '15px', textAlign: 'center' }}>Date d'inscription</th>
                      <th style={{ padding: '15px', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.allUsers
                      .sort((a, b) => b.score - a.score)
                      .map((user, index) => (
                        <tr key={index} style={{ 
                          borderBottom: '1px solid #dee2e6',
                          background: selectedUser === user.username ? '#e3f2fd' : 'white'
                        }}>
                          <td style={{ padding: '15px', fontWeight: 'bold' }}>{user.username}</td>
                          <td style={{ padding: '15px', textAlign: 'center', fontSize: '1.2rem', color: '#667eea' }}>
                            {user.score} pts
                          </td>
                          <td style={{ padding: '15px', textAlign: 'center', color: '#666' }}>
                            {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td style={{ padding: '15px', textAlign: 'center' }}>
                            <button
                              onClick={() => fetchUserDetails(user.username)}
                              style={{
                                padding: '8px 16px',
                                background: '#667eea',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                marginRight: '10px'
                              }}
                            >
                              📊 Détails
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.username)}
                              style={{
                                padding: '8px 16px',
                                background: '#e74c3c',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                              }}
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* STATISTIQUES PAR QUESTION */}
            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>📈 Statistiques par Question</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Jour</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Question</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Réponses</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Correctes</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Taux</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.questionStats.map((stat, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #dee2e6' }}>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>Jour {stat.day}</td>
                        <td style={{ padding: '12px' }}>{stat.question.substring(0, 60)}...</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>{stat.totalAnswers}</td>
                        <td style={{ padding: '12px', textAlign: 'center', color: '#27ae60' }}>
                          {stat.correctAnswers}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            background: stat.successRate >= 70 ? '#d4edda' : stat.successRate >= 50 ? '#fff3cd' : '#f8d7da',
                            color: stat.successRate >= 70 ? '#155724' : stat.successRate >= 50 ? '#856404' : '#721c24',
                            fontWeight: 'bold'
                          }}>
                            {stat.successRate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}