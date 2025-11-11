import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { questions } from './questions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Configuration
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1437803242389242034/RLiWlxZETGxb1xHRm6UEvI_HMuCX0tq9PLgOS0kZMRYpnfnUgeDfH-m9hD2B8sv6oOVk';
const ADMIN_PASSWORD = 'ADMIN2025';
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

// Initialiser le fichier de données
async function initDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify({ users: [], answers: [] }, null, 2));
  }
}

// Lire les données
async function readData() {
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

// Écrire les données
async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Obtenir le jour actuel (1-25)
function getCurrentDay() {
  const now = new Date();
  const december1st = new Date(now.getFullYear(), 11, 1);
  const dayOfMonth = now.getDate();
  
  if (now.getMonth() === 11 && dayOfMonth >= 1 && dayOfMonth <= 25) {
    return dayOfMonth;
  }
  return 0;
}

// Vérifier si on est dans les heures d'ouverture (8h-23h30)
function isOpenHours() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  
  if (hour > 8 || (hour === 8 && minute >= 0)) {
    if (hour < 23 || (hour === 23 && minute < 30)) {
      return true;
    }
  }
  return false;
}

// Calculer le score d'un utilisateur
function calculateUserScore(username, data) {
  const userAnswers = data.answers.filter(a => a.username.toLowerCase() === username.toLowerCase());
  let score = 0;
  
  userAnswers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question && answer.answer === question.correctAnswer) {
      score++;
    }
  });
  
  return score;
}

// Routes API

// Obtenir les questions disponibles
app.get('/api/questions/today', async (req, res) => {
  const currentDay = getCurrentDay();
  
  if (currentDay === 0) {
    return res.json({ 
      available: false, 
      message: 'Le calendrier de l\'Avent n\'est pas encore commencé ou est terminé.' 
    });
  }
  
  const availableQuestions = questions.filter(q => q.day <= currentDay);
  
  res.json({
    available: true,
    currentDay,
    isOpen: isOpenHours(),
    questions: availableQuestions
  });
});

// Sauvegarder/Récupérer un utilisateur
app.post('/api/user', async (req, res) => {
  const { username } = req.body;
  
  if (!username || username.trim().length === 0) {
    return res.status(400).json({ error: 'Username requis' });
  }
  
  const data = await readData();
  let user = data.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  
  if (!user) {
    user = {
      username: username.trim(),
      createdAt: new Date().toISOString()
    };
    data.users.push(user);
    await writeData(data);
  }
  
  const userAnswers = data.answers.filter(a => a.username.toLowerCase() === username.toLowerCase());
  const score = calculateUserScore(username, data);
  
  res.json({ user, answers: userAnswers, score });
});

// Soumettre une réponse
app.post('/api/answer', async (req, res) => {
  const { username, questionId, answer } = req.body;
  
  if (!username || questionId === undefined || answer === undefined) {
    return res.status(400).json({ error: 'Données manquantes' });
  }
  
  const data = await readData();
  
  const user = data.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'Utilisateur non trouvé' });
  }
  
  const question = questions.find(q => q.id === questionId);
  if (!question) {
    return res.status(404).json({ error: 'Question non trouvée' });
  }
  
  // Vérifier si déjà répondu
  const existingAnswerIndex = data.answers.findIndex(
    a => a.username.toLowerCase() === username.toLowerCase() && a.questionId === questionId
  );
  
  if (existingAnswerIndex !== -1) {
    return res.status(400).json({ error: 'Vous avez déjà répondu à cette question' });
  }
  
  // Ajouter la réponse
  const newAnswer = {
    username: username.toLowerCase(),
    questionId,
    answer,
    answeredAt: new Date().toISOString()
  };
  
  data.answers.push(newAnswer);
  await writeData(data);
  
  const isCorrect = answer === question.correctAnswer;
  const score = calculateUserScore(username, data);
  
  res.json({ success: true, isCorrect, score });
});

// Obtenir le classement
app.get('/api/leaderboard', async (req, res) => {
  const data = await readData();
  
  const leaderboard = data.users.map(user => {
    const score = calculateUserScore(user.username, data);
    const answersCount = data.answers.filter(a => a.username.toLowerCase() === user.username.toLowerCase()).length;
    
    return {
      username: user.username,
      score,
      answersCount
    };
  });
  
  leaderboard.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.answersCount - b.answersCount;
  });
  
  res.json(leaderboard);
});

// Admin: Login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Mot de passe incorrect' });
  }
});

// Admin: Obtenir toutes les données
app.get('/api/admin/data', async (req, res) => {
  const { password } = req.query;
  
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  
  const data = await readData();
  
  // Statistiques par question
  const questionStats = questions.map(question => {
    const answers = data.answers.filter(a => a.questionId === question.id);
    const correctAnswers = answers.filter(a => a.answer === question.correctAnswer).length;
    
    return {
      questionId: question.id,
      day: question.day,
      question: question.question,
      totalAnswers: answers.length,
      correctAnswers,
      successRate: answers.length > 0 ? Math.round((correctAnswers / answers.length) * 100) : 0
    };
  });
  
  res.json({
    users: data.users.length,
    totalAnswers: data.answers.length,
    questionStats,
    allUsers: data.users.map(u => ({
      ...u,
      score: calculateUserScore(u.username, data)
    }))
  });
});

// Admin: Supprimer un utilisateur
app.delete('/api/admin/user/:username', async (req, res) => {
  const { password } = req.query;
  const { username } = req.params;
  
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  
  try {
    const data = await readData();
    
    // Supprimer l'utilisateur
    data.users = data.users.filter(u => u.username.toLowerCase() !== username.toLowerCase());
    
    // Supprimer toutes ses réponses
    data.answers = data.answers.filter(a => a.username.toLowerCase() !== username.toLowerCase());
    
    await writeData(data);
    
    res.json({ success: true, message: `Utilisateur ${username} supprimé` });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Admin: Reset complet (supprimer tous les utilisateurs)
app.post('/api/admin/reset-all', async (req, res) => {
  const { password } = req.body;
  
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  
  try {
    await writeData({ users: [], answers: [] });
    res.json({ success: true, message: 'Tous les participants ont été supprimés' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Envoyer les résultats sur Discord
async function sendToDiscord() {
  const data = await readData();
  const currentDay = getCurrentDay();
  
  if (currentDay === 0) return;
  
  // Questions du jour
  const todayQuestions = questions.filter(q => q.day === currentDay);
  const todayQuestionsIds = todayQuestions.map(q => q.id);
  
  // Classement du jour
  const todayLeaderboard = data.users.map(user => {
    const todayAnswers = data.answers.filter(
      a => a.username.toLowerCase() === user.username.toLowerCase() && todayQuestionsIds.includes(a.questionId)
    );
    
    let todayScore = 0;
    todayAnswers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (question && answer.answer === question.correctAnswer) {
        todayScore++;
      }
    });
    
    return {
      username: user.username,
      todayScore,
      totalScore: calculateUserScore(user.username, data)
    };
  }).filter(u => u.todayScore > 0 || u.totalScore > 0);
  
  todayLeaderboard.sort((a, b) => b.totalScore - a.totalScore);
  
  // Créer le message Discord
  let message = `# 🎄 Résultats du Jour ${currentDay} - Calendrier de l'Avent QCM Navigation Aérienne\n\n`;
  
  // Top 3
  message += `## 🏆 Top 3 Général\n`;
  todayLeaderboard.slice(0, 3).forEach((user, index) => {
    const medals = ['🥇', '🥈', '🥉'];
    message += `${medals[index]} **${user.username}** - ${user.totalScore} points\n`;
  });
  
  message += `\n## 📊 Classement Complet\n`;
  todayLeaderboard.forEach((user, index) => {
    message += `${index + 1}. ${user.username} - ${user.totalScore} points\n`;
  });
  
  // Réponses du jour (en spoiler)
  message += `\n## ✅ Réponses du Jour ${currentDay}\n`;
  todayQuestions.forEach(q => {
    message += `\n**Question ${q.id}:** ${q.question}\n`;
    message += `||Réponse: ${q.options[q.correctAnswer]}||\n`;
  });
  
  // Envoyer à Discord
  try {
    await fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message })
    });
    console.log(`✅ Résultats du jour ${currentDay} envoyés sur Discord`);
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi sur Discord:', error);
  }
}

// Tâche cron: Envoyer les résultats à 23h30 chaque jour
cron.schedule('30 23 * 12 *', () => {
  console.log('🕐 Envoi des résultats quotidiens...');
  sendToDiscord();
});

// Test manuel du webhook Discord
app.post('/api/admin/test-discord', async (req, res) => {
  const { password } = req.body;
  
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  
  await sendToDiscord();
  res.json({ success: true, message: 'Message envoyé sur Discord' });
});

// Démarrer le serveur
async function startServer() {
  await initDataFile();
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📅 Jour actuel: ${getCurrentDay()}`);
    console.log(`🕐 Heures d'ouverture: ${isOpenHours() ? 'Ouvert' : 'Fermé'}`);
  });
}

startServer();
