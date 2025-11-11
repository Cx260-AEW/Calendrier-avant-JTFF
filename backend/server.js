// ========================================
// 🧪 MODE TEST - CONFIGURATION
// ========================================
const TEST_MODE = true;           // ← Mettre à false pour la production
const TEST_DAY = 6;               // ← Jour à simuler (1-25)
const TEST_ALWAYS_OPEN = true;    // ← Toujours ouvert (ignorer horaires)
// ========================================

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
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1437838332930560112/3ys2Itxs5xq5eoLt1Rck8yXaONi7YFUoTRSpm5ARnQdmrRSY3m0l704Gci4w0AR2YRqO';
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
  // 🧪 MODE TEST
  if (TEST_MODE) {
    console.log(`🧪 MODE TEST ACTIVÉ : Jour ${TEST_DAY}`);
    return TEST_DAY;
  }
  
  // 📅 MODE PRODUCTION
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
  // 🧪 MODE TEST
  if (TEST_MODE && TEST_ALWAYS_OPEN) {
    return true;
  }
  
  // ⏰ MODE PRODUCTION
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

// ====== FONCTIONS DISCORD ======

// 1. MESSAGE DU MATIN (8h) : Nouvelles questions disponibles
async function sendMorningDiscordMessage() {
  const currentDay = getCurrentDay();
  
  if (currentDay === 0) {
    console.log('❌ Pas en décembre, message du matin annulé');
    return;
  }

  const todayQuestions = questions.filter(q => q.day === currentDay);
  
  const message = `# 🎄 Jour ${currentDay} - Nouvelles Questions ! 🎄

**4 nouvelles questions sont disponibles :**

🧭 **Navigation aérienne** - Question ${todayQuestions[0]?.id}
🎧 **Contrôle aérien** - Question ${todayQuestions[1]?.id}
📜 **Réglementation** - Question ${todayQuestions[2]?.id}
🗺️ **Cartes aéronautiques** - Question ${todayQuestions[3]?.id}

⏰ Vous avez jusqu'à **23h30** pour répondre !
🎯 Bonne chance à tous ! ✈️`;

  try {
    const response = await fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message })
    });
    
    if (response.ok) {
      console.log(`✅ Message du matin envoyé pour le jour ${currentDay}`);
    } else {
      console.error(`❌ Erreur Discord (status ${response.status}):`, await response.text());
    }
  } catch (error) {
    console.error('❌ Erreur réseau Discord:', error.message);
  }
}

// 2. MESSAGE DU SOIR (23h30) : Résultats de la journée
async function sendEveningDiscordMessage() {
  const data = await readData();
  const currentDay = getCurrentDay();
  
  if (currentDay === 0) {
    console.log('❌ Pas en décembre, message du soir annulé');
    return;
  }

  const todayQuestions = questions.filter(q => q.day === currentDay);
  
  // Classement
  const leaderboard = data.users.map(user => {
    const score = calculateUserScore(user.username, data);
    const answersCount = data.answers.filter(a => a.username.toLowerCase() === user.username.toLowerCase()).length;
    
    return {
      username: user.username,
      score,
      answersCount
    };
  }).sort((a, b) => b.score - a.score);

  let message = `# 📊 Résultats du Jour ${currentDay} 📊\n\n`;
  
  // Top 3
  message += `## 🏆 Top 3 Général\n`;
  if (leaderboard.length >= 3) {
    message += `🥇 **${leaderboard[0].username}** - ${leaderboard[0].score} points\n`;
    message += `🥈 **${leaderboard[1].username}** - ${leaderboard[1].score} points\n`;
    message += `🥉 **${leaderboard[2].username}** - ${leaderboard[2].score} points\n`;
  } else if (leaderboard.length > 0) {
    leaderboard.forEach((user, i) => {
      const medals = ['🥇', '🥈', '🥉'];
      message += `${medals[i]} **${user.username}** - ${user.score} points\n`;
    });
  } else {
    message += `Aucun participant pour le moment 🎅\n`;
  }
  
  // Classement complet
  message += `\n## 📋 Classement Complet (${leaderboard.length} participants)\n`;
  if (leaderboard.length > 0) {
    leaderboard.slice(0, 10).forEach((user, index) => {
      message += `${index + 1}. ${user.username} - **${user.score}** points (${user.answersCount} réponses)\n`;
    });
    if (leaderboard.length > 10) {
      message += `... et ${leaderboard.length - 10} autres participants\n`;
    }
  }
  
  // Réponses (en spoiler)
  message += `\n## ✅ Réponses du Jour ${currentDay}\n`;
  todayQuestions.forEach(q => {
    message += `\n**Q${q.id} (${q.group}):** ${q.question.substring(0, 80)}${q.question.length > 80 ? '...' : ''}\n`;
    message += `||✓ Réponse: ${q.options[q.correctAnswer]}||\n`;
  });
  
  message += `\n🎄 Rendez-vous demain pour de nouvelles questions ! 🎄`;

  try {
    const response = await fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message })
    });
    
    if (response.ok) {
      console.log(`✅ Résultats du soir envoyés pour le jour ${currentDay}`);
    } else {
      console.error(`❌ Erreur Discord (status ${response.status}):`, await response.text());
    }
  } catch (error) {
    console.error('❌ Erreur réseau Discord:', error.message);
  }
}

// 3. MESSAGE DE TEST (manuel)
async function sendTestDiscordMessage() {
  const message = `# 🧪 TEST DISCORD - Calendrier de l'Avent

✅ Le webhook Discord fonctionne correctement !

Configuration actuelle :
${TEST_MODE ? '🧪 MODE TEST ACTIVÉ' : '📅 MODE PRODUCTION'}
📅 Jour : ${getCurrentDay() || 'Hors période'}
⏰ Horaire : ${isOpenHours() ? 'Ouvert' : 'Fermé'}
🎯 Messages automatiques :
  • Matin (8h00) : Nouvelles questions
  • Soir (23h30) : Résultats

Ce message est envoyé depuis le panneau admin. 🎄`;

  try {
    const response = await fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message })
    });
    
    if (response.ok) {
      console.log('✅ Message de test Discord envoyé');
      return true;
    } else {
      const errorText = await response.text();
      console.error(`❌ Erreur Discord (status ${response.status}):`, errorText);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur réseau Discord:', error.message);
    return false;
  }
}

// ====== ROUTES API ======

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
  
  const existingAnswerIndex = data.answers.findIndex(
    a => a.username.toLowerCase() === username.toLowerCase() && a.questionId === questionId
  );
  
  if (existingAnswerIndex !== -1) {
    return res.status(400).json({ error: 'Vous avez déjà répondu à cette question' });
  }
  
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
    data.users = data.users.filter(u => u.username.toLowerCase() !== username.toLowerCase());
    data.answers = data.answers.filter(a => a.username.toLowerCase() !== username.toLowerCase());
    await writeData(data);
    
    res.json({ success: true, message: `Utilisateur ${username} supprimé` });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Admin: Reset complet
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

// Admin: Test Discord (manuel)
app.post('/api/admin/test-discord', async (req, res) => {
  const { password } = req.body;
  
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  
  console.log('🧪 Test Discord demandé depuis l\'admin...');
  const success = await sendTestDiscordMessage();
  
  if (success) {
    res.json({ success: true, message: 'Message de test envoyé sur Discord !' });
  } else {
    res.status(500).json({ success: false, error: 'Erreur lors de l\'envoi sur Discord' });
  }
});

// Admin: Forcer message du matin (test)
app.post('/api/admin/test-morning', async (req, res) => {
  const { password } = req.body;
  
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  
  await sendMorningDiscordMessage();
  res.json({ success: true, message: 'Message du matin envoyé' });
});

// Admin: Forcer message du soir (test)
app.post('/api/admin/test-evening', async (req, res) => {
  const { password } = req.body;
  
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  
  await sendEveningDiscordMessage();
  res.json({ success: true, message: 'Message du soir envoyé' });
});

// ====== CRON JOBS ======

// Message du matin à 8h00 tous les jours de décembre
cron.schedule('0 8 * 12 *', () => {
  console.log('🌅 8h00 - Envoi du message du matin...');
  sendMorningDiscordMessage();
});

// Message du soir à 23h30 tous les jours de décembre
cron.schedule('30 23 * 12 *', () => {
  console.log('🌙 23h30 - Envoi des résultats du soir...');
  sendEveningDiscordMessage();
});

// Démarrer le serveur
async function startServer() {
  await initDataFile();
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`${TEST_MODE ? '🧪 MODE TEST' : '📅 MODE PRODUCTION'}`);
    console.log(`📅 Jour actuel: ${getCurrentDay()}`);
    console.log(`⏰ Horaires: ${isOpenHours() ? 'Ouvert' : 'Fermé'}`);
    console.log(`🔔 Discord webhook configuré: ${DISCORD_WEBHOOK ? 'Oui' : 'Non'}`);
  });
}

startServer();
