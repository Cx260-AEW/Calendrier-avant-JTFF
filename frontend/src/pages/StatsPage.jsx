import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

function StatsPage({ user }) {
  const [playerStats, setPlayerStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPlayerStats();
    }
  }, [user]);

  const loadPlayerStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/player-stats/${user.username}`);
      const data = await response.json();
      setPlayerStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>⏳ Chargement de vos statistiques...</h2>
        </div>
      </div>
    );
  }

  if (!playerStats) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>❌ Impossible de charger vos statistiques</h2>
        </div>
      </div>
    );
  }

  const categoryColors = {
    '🧭Navigation aérienne': '#3b82f6',
    '🎧Contrôle aérien': '#8b5cf6',
    '📜Réglementation': '#f59e0b',
    '🗺️ Cartes aéronautiques': '#10b981',
    '☁️Météorologie': '#06b6d4'
  };

  return (
    <div className="container">
      {/* En-tête avec score total */}
      <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>📊 Mes Statistiques</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: '16px', opacity: 0.9 }}>Score Total</p>
            <p style={{ fontSize: '48px', fontWeight: '700' }}>⭐ {playerStats.totalScore}</p>
          </div>
          <div>
            <p style={{ fontSize: '16px', opacity: 0.9 }}>Questions Répondues</p>
            <p style={{ fontSize: '48px', fontWeight: '700' }}>{playerStats.totalAnswers}</p>
          </div>
          <div>
            <p style={{ fontSize: '16px', opacity: 0.9 }}>Taux de Réussite Global</p>
            <p style={{ fontSize: '48px', fontWeight: '700' }}>
              {playerStats.totalAnswers > 0 ? Math.round((playerStats.totalScore / playerStats.totalAnswers) * 100) : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Stats par catégorie */}
      <div className="card">
        <h3 style={{ fontSize: '24px', marginBottom: '24px' }}>📈 Performance par Catégorie</h3>
        
        {Object.keys(playerStats.categoryStats).length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '18px' }}>
            Vous n'avez pas encore répondu à des questions. Commencez le quiz !
          </p>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {Object.entries(playerStats.categoryStats).map(([category, stats]) => {
              const color = categoryColors[category] || '#667eea';
              const percentage = stats.percentage;
              
              return (
                <div 
                  key={category}
                  style={{
                    padding: '20px',
                    background: '#f9fafb',
                    borderRadius: '12px',
                    border: `2px solid ${color}15`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: '600', color: color }}>
                      {category}
                    </h4>
                    <span style={{ 
                      fontSize: '24px', 
                      fontWeight: '700', 
                      color: color
                    }}>
                      {percentage}%
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
                    <span>Bonnes réponses: {stats.correct}/{stats.total}</span>
                    <span>Répondues: {stats.total} questions</span>
                  </div>
                  
                  {/* Barre de progression */}
                  <div style={{
                    width: '100%',
                    height: '12px',
                    background: '#e5e7eb',
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      background: color,
                      transition: 'width 0.5s ease',
                      borderRadius: '6px'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Progression par jour */}
      <div className="card">
        <h3 style={{ fontSize: '24px', marginBottom: '24px' }}>📅 Progression par Jour</h3>
        
        {Object.keys(playerStats.answersByDay).length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '18px' }}>
            Aucune réponse enregistrée pour le moment.
          </p>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {Object.entries(playerStats.answersByDay)
              .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
              .map(([day, dayAnswers]) => {
                const correctCount = dayAnswers.filter(a => a.isCorrect).length;
                const totalCount = dayAnswers.length;
                const dayPercentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
                
                return (
                  <div 
                    key={day}
                    style={{
                      padding: '16px',
                      background: '#f9fafb',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '18px', fontWeight: '600' }}>🎄 Jour {day}</span>
                      <span style={{ marginLeft: '12px', color: '#6b7280' }}>
                        {correctCount}/{totalCount} correctes
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '100px',
                        height: '8px',
                        background: '#e5e7eb',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${dayPercentage}%`,
                          height: '100%',
                          background: dayPercentage >= 75 ? '#10b981' : dayPercentage >= 50 ? '#f59e0b' : '#ef4444',
                          borderRadius: '4px'
                        }}></div>
                      </div>
                      <span style={{ 
                        fontSize: '16px', 
                        fontWeight: '600',
                        color: dayPercentage >= 75 ? '#10b981' : dayPercentage >= 50 ? '#f59e0b' : '#ef4444'
                      }}>
                        {dayPercentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Conseils basés sur les performances */}
      <div className="card" style={{ background: '#eff6ff', border: '2px solid #3b82f6' }}>
        <h3 style={{ fontSize: '20px', marginBottom: '16px', color: '#1e40af' }}>💡 Analyse de vos Performances</h3>
        
        {playerStats.totalAnswers === 0 ? (
          <p style={{ color: '#1e40af' }}>Commencez à répondre aux questions pour voir votre analyse !</p>
        ) : (
          <div style={{ color: '#1e40af' }}>
            {/* Meilleure catégorie */}
            {Object.keys(playerStats.categoryStats).length > 0 && (
              <>
                {(() => {
                  const bestCategory = Object.entries(playerStats.categoryStats)
                    .reduce((best, current) => current[1].percentage > best[1].percentage ? current : best);
                  const worstCategory = Object.entries(playerStats.categoryStats)
                    .reduce((worst, current) => current[1].percentage < worst[1].percentage ? current : worst);
                  
                  return (
                    <>
                      <p style={{ marginBottom: '12px' }}>
                        ✅ <strong>Point fort :</strong> {bestCategory[0]} ({bestCategory[1].percentage}% de réussite)
                      </p>
                      {bestCategory[0] !== worstCategory[0] && (
                        <p style={{ marginBottom: '12px' }}>
                          📚 <strong>À améliorer :</strong> {worstCategory[0]} ({worstCategory[1].percentage}% de réussite)
                        </p>
                      )}
                    </>
                  );
                })()}
              </>
            )}
            
            {/* Taux de réussite global */}
            {(() => {
              const globalRate = Math.round((playerStats.totalScore / playerStats.totalAnswers) * 100);
              if (globalRate >= 80) {
                return <p>🌟 Excellent travail ! Vous maîtrisez très bien le sujet !</p>;
              } else if (globalRate >= 60) {
                return <p>👍 Bon niveau ! Continuez à vous entraîner pour atteindre l'excellence !</p>;
              } else {
                return <p>💪 Vous progressez ! Prenez le temps de lire les explications pour mieux comprendre.</p>;
              }
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

export default StatsPage;
