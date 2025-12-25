import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

function QuizPage({ user, score, setScore }) {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentDay, setCurrentDay] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [groupedQuestions, setGroupedQuestions] = useState({});

  useEffect(() => {
    loadQuestions();
    loadUserAnswers();
  }, []);

  const loadQuestions = async () => {
    try {
      const response = await fetch(`${API_URL}/api/questions/today`);
      const data = await response.json();

      if (data.available) {
        setQuestions(data.questions);
        setCurrentDay(data.currentDay);
        setIsOpen(data.isOpen);

        // Grouper par jour
        const grouped = {};
        data.questions.forEach(q => {
          if (!grouped[q.day]) grouped[q.day] = [];
          grouped[q.day].push(q);
        });
        setGroupedQuestions(grouped);
      }
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  const loadUserAnswers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username })
      });
      const data = await response.json();

      const answersMap = {};
      data.answers.forEach(a => {
        answersMap[a.questionId] = a.answer;
      });
      setUserAnswers(answersMap);
      setScore(data.score);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    if (userAnswers[questionId] !== undefined) return; // Déjà répondu
    setSelectedAnswers({ ...selectedAnswers, [questionId]: answerIndex });
  };

  const handleSubmit = async (questionId) => {
    if (selectedAnswers[questionId] === undefined) return;

    try {
      const response = await fetch(`${API_URL}/api/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          questionId,
          answer: selectedAnswers[questionId]
        })
      });

      const data = await response.json();

      if (data.success) {
        setUserAnswers({ ...userAnswers, [questionId]: selectedAnswers[questionId] });
        setScore(data.score);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'envoi de la réponse');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>⏳ Chargement...</h2>
        </div>
      </div>
    );
  }

  // Vérifier si le calendrier est terminé (après le 25 décembre)
  if (questions.length === 100) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Le Calendrier de l'Avent est terminé !</h2>
          <p style={{ fontSize: '20px', marginBottom: '24px', opacity: 0.95 }}>
            Merci à tous pour votre participation ! 🎄✨
          </p>
          <p style={{ fontSize: '18px', opacity: 0.9 }}>
            Vous avez répondu à <strong>{Object.keys(userAnswers).length}/100</strong> questions
          </p>
          <p style={{ fontSize: '18px', marginTop: '8px', opacity: 0.9 }}>
            Score final : <strong>{score} points</strong> 🏆
          </p>
          <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(255,255,255,0.15)', borderRadius: '12px' }}>
            <p style={{ fontSize: '16px', marginBottom: '12px' }}>📊 Consultez vos statistiques détaillées</p>
            <p style={{ fontSize: '16px' }}>🏆 Voir le classement final</p>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>🎄 Le calendrier n'a pas encore commencé !</h2>
          <p style={{ marginTop: '16px', color: '#6b7280' }}>
            Revenez le 1er décembre pour commencer le quiz !
          </p>
        </div>
      </div>
    );
  }

  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(userAnswers).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '28px' }}>📅 Jour {currentDay}/25</h2>
            <p style={{ color: '#6b7280', marginTop: '4px' }}>
              {isOpen ? '✅ Questions disponibles' : '🔒 Revenez entre 8h et 23h30'}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Progression</p>
            <p style={{ fontSize: '20px', fontWeight: '600' }}>
              {answeredQuestions}/{totalQuestions} questions
            </p>
          </div>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {Object.keys(groupedQuestions)
        .sort((a, b) => b - a)
        .map(day => (
          <div key={day} className="card">
            <h3 style={{ fontSize: '24px', marginBottom: '24px', color: '#667eea' }}>
              🎁 Jour {day} {parseInt(day) === currentDay && '(Aujourd\'hui)'}
            </h3>

            {groupedQuestions[day].map((question, index) => {
              const hasAnswered = userAnswers[question.id] !== undefined;
              const selectedAnswer = selectedAnswers[question.id];
              const userAnswer = userAnswers[question.id];
              const isCorrect = hasAnswered && userAnswer === question.correctAnswer;

              return (
                <div
                  key={question.id}
                  style={{
                    marginBottom: '32px',
                    padding: '24px',
                    background: '#f9fafb',
                    borderRadius: '12px',
                    border: hasAnswered
                      ? isCorrect
                        ? '2px solid #10b981'
                        : '2px solid #ef4444'
                      : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span
                      style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'white',
                        background: hasAnswered
                          ? isCorrect
                            ? '#10b981'
                            : '#ef4444'
                          : '#667eea',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {hasAnswered ? (isCorrect ? '✓' : '✗') : question.id}
                    </span>

                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          marginBottom: '8px',
                          fontSize: '20px',
                          fontWeight: '700',
                          color: '#374151',
                        }}
                      >
                        Thème : {question.group}
                      </h3>

                      {/* Intitulé de la question */}
                      <h4
                        style={{
                          fontSize: '18px',
                          marginBottom: '16px',
                          lineHeight: '1.6',
                        }}
                      >
                        {question.question}
                      </h4>

                      {question.image && (
                        <img
                          src={`${API_URL}/api/images/Q${question.id}.png`}
                          alt="Question illustration"
                          style={{
                            width: '100%',
                            maxWidth: '600px',
                            borderRadius: '8px',
                            marginBottom: '16px',
                            border: '2px solid #e5e7eb',
                          }}
                        />
                      )}

                      <div style={{ marginTop: '16px' }}>
                        {question.options.map((option, optionIndex) => {
                          const isSelected = selectedAnswer === optionIndex;
                          const isUserAnswer = hasAnswered && userAnswer === optionIndex;
                          const isCorrectOption =
                            hasAnswered && optionIndex === question.correctAnswer;

                          let className = 'question-option';
                          if (isSelected && !hasAnswered) className += ' selected';
                          if (isUserAnswer && !isCorrect) className += ' incorrect';
                          if (isCorrectOption) className += ' correct';

                          return (
                            <div
                              key={optionIndex}
                              className={className}
                              onClick={() =>
                                !hasAnswered &&
                                handleAnswerSelect(question.id, optionIndex)
                              }
                              style={{
                                cursor: hasAnswered ? 'default' : 'pointer',
                                opacity:
                                  hasAnswered && !isCorrectOption && !isUserAnswer
                                    ? 0.5
                                    : 1,
                              }}
                            >
                              <span style={{ fontWeight: '600', marginRight: '8px' }}>
                                {String.fromCharCode(65 + optionIndex)}.
                              </span>
                              {option}
                              {isCorrectOption && (
                                <span style={{ marginLeft: '8px' }}>✓</span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {!hasAnswered && (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleSubmit(question.id)}
                          disabled={selectedAnswer === undefined || !isOpen}
                          style={{ marginTop: '16px' }}
                        >
                          {!isOpen ? '🔒 Fermé' : 'Valider ma réponse'}
                        </button>
                      )}

                      {hasAnswered && (
                        <>
                          <div
                            style={{
                              marginTop: '16px',
                              padding: '12px',
                              background: isCorrect ? '#d1fae5' : '#fee2e2',
                              borderRadius: '8px',
                              color: isCorrect ? '#065f46' : '#991b1b',
                              fontWeight: '600',
                            }}
                          >
                            {isCorrect
                              ? '✅ Bonne réponse ! +1 point'
                              : '❌ Mauvaise réponse'}
                          </div>

                          <h4
                            style={{
                              marginTop: '10px',
                              backgroundColor: '#FFF9C4',
                              borderRadius: '8px',
                              padding: '10px',
                            }}
                          >
                            {question.explanation}
                          </h4>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div >
        ))}
    </div>
  );
}

export default QuizPage;
