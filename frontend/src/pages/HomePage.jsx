import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'https://calendrier-avant-jtff-production.up.railway.app';
const VERSION = 'v3.0.0-MEGA'; // VERSION MEGA VISIBLE

// LOG AU CHARGEMENT DU MODULE
console.log('%c████████████████████████████████████████', 'color: red; font-size: 20px;');
console.log('%c🚀 VERSION: v3.0.0-MEGA CHARGÉE !', 'color: green; font-size: 30px; font-weight: bold;');
console.log('%c████████████████████████████████████████', 'color: red; font-size: 20px;');

export default function HomePage() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentDay, setCurrentDay] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    console.log('%c🎯 HomePage useEffect déclenché - Version: ' + VERSION, 'color: blue; font-size: 20px;');
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
      handleLogin(null, savedUsername);
    }
  }, []);

  const handleLogin = async (e, savedUser = null) => {
    if (e) e.preventDefault();
    
    const usernameToUse = savedUser || username;
    if (!usernameToUse.trim()) {
      setMessage('❌ Veuillez entrer un pseudo');
      return;
    }

    setLoading(true);
    try {
      const userResponse = await fetch(`${API_URL}/api/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameToUse })
      });

      const userData = await userResponse.json();
      
      const questionsResponse = await fetch(`${API_URL}/api/questions/today`);
      const questionsData = await questionsResponse.json();

      console.log('📋 Questions reçues:', questionsData);
      console.log('📋 Première question:', questionsData.questions[0]);
      console.log('📋 Explication:', questionsData.questions[0]?.explanation);

      if (questionsData.available) {
        setIsLoggedIn(true);
        setQuestions(questionsData.questions);
        setCurrentDay(questionsData.currentDay);
        setScore(userData.score);
        
        const answersMap = {};
        userData.answers.forEach(answer => {
          answersMap[answer.questionId] = answer.answer;
        });
        setUserAnswers(answersMap);
        
        localStorage.setItem('username', usernameToUse);
      } else {
        setMessage(questionsData.message);
      }
    } catch (error) {
      setMessage('❌ Erreur de connexion au serveur');
      console.error('Erreur:', error);
    }
    setLoading(false);
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmitAnswer = async (questionId) => {
    const answerIndex = selectedAnswers[questionId];
    
    console.log('🎯 Soumission réponse questionId:', questionId, 'answer:', answerIndex);
    
    if (answerIndex === undefined) {
      setMessage('❌ Veuillez sélectionner une réponse');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          questionId,
          answer: answerIndex
        })
      });

      const result = await response.json();
      console.log('📨 Résultat serveur:', result);
      
      if (result.success) {
        const question = questions.find(q => q.id === questionId);
        console.log('❓ Question trouvée:', question);
        console.log('💬 Explication:', question?.explanation);
        
        setUserAnswers(prev => ({
          ...prev,
          [questionId]: answerIndex
        }));
        setScore(result.score);
        
        const resultObj = {
          isCorrect: result.isCorrect,
          explanation: question?.explanation || "Pas d'explication disponible."
        };
        
        console.log('✅ Objet résultat:', resultObj);
        
        setShowResults(prev => {
          const newResults = {
            ...prev,
            [questionId]: resultObj
          };
          console.log('🎨 Nouveau showResults:', newResults);
          return newResults;
        });
        
        console.log('⏰ Timer 25s démarré');
        
        setTimeout(() => {
          console.log('⏰ Timer terminé');
          setShowResults(prev => ({
            ...prev,
            [questionId]: undefined
          }));
        }, 25000);
      } else {
        setMessage('❌ ' + result.error);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('❌ Erreur lors de l\'envoi');
      setTimeout(() => setMessage(''), 3000);
      console.error('Erreur:', error);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    setQuestions([]);
    setUserAnswers({});
    setSelectedAnswers({});
    setScore(0);
  };

  const goToLeaderboard = () => {
    navigate('/leaderboard');
  };

  const goToAdmin = () => {
    navigate('/admin');
  };

  console.log('🔍 Render - showResults:', showResults);

  // BADGE MEGA ÉNORME
  const MegaBadge = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(90deg, #ff0000, #ff7700, #ffff00, #00ff00, #0000ff, #ff00ff)',
      color: 'white',
      padding: '20px',
      fontSize: '2rem',
      fontWeight: 'bold',
      textAlign: 'center',
      zIndex: 99999,
      boxShadow: '0 5px 20px rgba(0,0,0,0.5)',
      animation: 'pulse 1s infinite'
    }}>
      🚀 VERSION: {VERSION} 🚀
      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}
      </style>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        paddingTop: '100px' // Pour le badge
      }}>
        <MegaBadge />
        
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          maxWidth: '500px',
          width: '100%'
        }}>
          <h1 style={{
            textAlign: 'center',
            marginBottom: '10px',
            fontSize: '2.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🎄 Calendrier de l'Avent
          </h1>
          <h2 style={{
            textAlign: 'center',
            marginBottom: '30px',
            fontSize: '1.3rem',
            color: '#666'
          }}>
            QCM Navigation Aérienne
          </h2>
          
          <form onSubmit={handleLogin}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Entrez votre pseudo"
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '1.1rem',
                border: '2px solid #ddd',
                borderRadius: '10px',
                marginBottom: '20px',
                boxSizing: 'border-box'
              }}
              disabled={loading}
            />
            
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '20px'
              }}
            >
              {loading ? '⏳ Connexion...' : '🚀 Commencer'}
            </button>
          </form>

          {message && (
            <p style={{
              textAlign: 'center',
              color: message.includes('❌') ? '#e74c3c' : '#27ae60',
              marginTop: '20px',
              fontSize: '1rem'
            }}>
              {message}
            </p>
          )}

          <div style={{
            marginTop: '30px',
            paddingTop: '20px',
            borderTop: '2px solid #eee',
            display: 'flex',
            justifyContent: 'center',
            gap: '15px'
          }}>
            <button
              onClick={goToLeaderboard}
              style={{
                padding: '10px 20px',
                background: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              🏆 Classement
            </button>
            <button
              onClick={goToAdmin}
              style={{
                padding: '10px 20px',
                background: '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              👨‍💼 Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      paddingTop: '100px' // Pour le badge
    }}>
      <MegaBadge />
      
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '20px',
          marginBottom: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <div>
              <h1 style={{
                fontSize: '2rem',
                margin: '0 0 10px 0',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                👋 Bienvenue {username} !
              </h1>
              <p style={{ margin: 0, fontSize: '1.2rem', color: '#666' }}>
                🎯 Score : <strong style={{ color: '#667eea' }}>{score} points</strong>
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/quiz')} style={{
                padding: '12px 24px',
                background: '#9b59b6',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}>
                📝 Quiz
              </button>
              <button onClick={goToLeaderboard} style={{
                padding: '12px 24px',
                background: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}>
                🏆 Classement
              </button>
              <button onClick={goToAdmin} style={{
                padding: '12px 24px',
                background: '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}>
                👨‍💼 Admin
              </button>
              <button onClick={handleLogout} style={{
                padding: '12px 24px',
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}>
                🚪 Déconnexion
              </button>
            </div>
          </div>
        </div>

        {message && (
          <div style={{
            padding: '20px',
            background: message.includes('❌') ? '#fee' : '#efe',
            border: `2px solid ${message.includes('❌') ? '#e74c3c' : '#27ae60'}`,
            borderRadius: '15px',
            marginBottom: '20px',
            fontSize: '1.1rem',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            marginBottom: '25px',
            paddingBottom: '15px',
            borderBottom: '3px solid #667eea'
          }}>
            🎁 Jour {currentDay} (Aujourd'hui)
          </h2>

          {questions.map((question) => {
            const hasAnswered = userAnswers.hasOwnProperty(question.id);
            const selectedAnswer = selectedAnswers[question.id];
            const showResult = showResults[question.id];

            return (
              <div key={question.id} style={{
                padding: '25px',
                background: hasAnswered ? '#f0f8ff' : '#fff',
                border: hasAnswered ? '2px solid #27ae60' : '2px solid #eee',
                borderRadius: '15px',
                marginBottom: '25px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: hasAnswered ? '#27ae60' : '#667eea',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    marginRight: '15px'
                  }}>
                    {hasAnswered ? '✓' : question.id}
                  </div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#667eea' }}>
                    Q{question.id} - {question.group}
                  </span>
                </div>

                <p style={{
                  fontSize: '1.15rem',
                  marginBottom: '20px',
                  lineHeight: '1.7',
                  color: '#333',
                  fontWeight: '500'
                }}>
                  {question.question}
                </p>

                {question.image && (
                  <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <img
                      src={`${API_URL}/images/${question.image}`}
                      alt="Question"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '400px',
                        borderRadius: '10px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                      }}
                    />
                  </div>
                )}

                {!hasAnswered ? (
                  <div style={{ marginBottom: '20px' }}>
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        onClick={() => handleAnswerSelect(question.id, optIndex)}
                        style={{
                          padding: '15px 20px',
                          margin: '10px 0',
                          background: selectedAnswer === optIndex ? '#667eea' : '#f8f9fa',
                          color: selectedAnswer === optIndex ? 'white' : '#333',
                          border: selectedAnswer === optIndex ? '2px solid #667eea' : '2px solid #dee2e6',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          fontSize: '1rem',
                          fontWeight: selectedAnswer === optIndex ? 'bold' : 'normal'
                        }}
                      >
                        <strong>{String.fromCharCode(65 + optIndex)}.</strong> {option}
                      </div>
                    ))}

                    <button
                      onClick={() => handleSubmitAnswer(question.id)}
                      disabled={selectedAnswer === undefined || loading}
                      style={{
                        marginTop: '15px',
                        padding: '12px 30px',
                        background: selectedAnswer !== undefined && !loading ? '#27ae60' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: selectedAnswer !== undefined && !loading ? 'pointer' : 'not-allowed',
                        fontSize: '1.1rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {loading ? '⏳ Envoi...' : '✓ Valider ma réponse'}
                    </button>
                  </div>
                ) : (
                  <div style={{
                    padding: '20px',
                    background: '#d4edda',
                    border: '2px solid #27ae60',
                    borderRadius: '10px',
                    textAlign: 'center'
                  }}>
                    <p style={{
                      margin: 0,
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      color: '#155724'
                    }}>
                      ✓ Vous avez déjà répondu à cette question
                    </p>
                  </div>
                )}

                {showResult && (
                  <div style={{
                    marginTop: '20px',
                    padding: '25px',
                    background: showResult.isCorrect ? '#d4edda' : '#f8d7da',
                    border: `3px solid ${showResult.isCorrect ? '#27ae60' : '#e74c3c'}`,
                    borderRadius: '15px',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '20px',
                      paddingBottom: '15px',
                      borderBottom: `2px solid ${showResult.isCorrect ? '#27ae60' : '#e74c3c'}`
                    }}>
                      <span style={{ fontSize: '2rem', marginRight: '15px' }}>
                        {showResult.isCorrect ? '✓' : '✗'}
                      </span>
                      <span style={{
                        fontSize: '1.4rem',
                        fontWeight: 'bold',
                        color: showResult.isCorrect ? '#155724' : '#721c24'
                      }}>
                        {showResult.isCorrect ? 'Bonne réponse !' : 'Mauvaise réponse'}
                      </span>
                    </div>

                    <div style={{
                      background: 'white',
                      padding: '20px',
                      borderRadius: '10px',
                      border: '2px solid #eee'
                    }}>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: '#667eea',
                        marginBottom: '10px'
                      }}>
                        💬 Explication
                      </div>
                      <p style={{
                        margin: 0,
                        fontSize: '1.05rem',
                        lineHeight: '1.8',
                        color: '#333'
                      }}>
                        {showResult.explanation}
                      </p>
                    </div>

                    <div style={{
                      marginTop: '15px',
                      fontSize: '0.9rem',
                      color: '#666',
                      textAlign: 'center',
                      fontStyle: 'italic'
                    }}>
                      Ce message disparaîtra dans 25 secondes
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {questions.length === 0 && (
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>
              🎄 Aucune question disponible
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>
              Revenez plus tard pour découvrir de nouvelles questions !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
