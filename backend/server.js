// ========================================
// 🎄 CALENDRIER DE L'AVENT - AUTOMATISATION COMPLÈTE
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

// Fichiers de données
const DATA_FILE = "/data/data.json";
const CONFIG_FILE = path.join(__dirname, 'config.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/images', express.static(path.join(__dirname, 'images'))); // Compatibilité

// ========================================
// 📋 CONFIGURATION PAR DÉFAUT
// ========================================
const DEFAULT_CONFIG = {
  startDate: '2025-12-01',        // Date de début (1er décembre)
  endDate: '2025-12-25',          // Date de fin (25 décembre)
  morningHour: 8,                 // Heure du message du matin
  morningMinute: 0,               // Minute du message du matin
  eveningHour: 23,                // Heure du message du soir
  eveningMinute: 0,               // Minute du message du soir
  discordWebhook: 'https://discord.com/api/webhooks/1437838332930560112/3ys2Itxs5xq5eoLt1Rck8yXaONi7YFUoTRSpm5ARnQdmrRSY3m0l704Gci4w0AR2YRqO',
  adminPassword: 'ADMIN2025',
  openingHour: 8,                 // Heure d'ouverture quotidienne
  closingHour: 23,                // Heure de fermeture quotidienne
  closingMinute: 30               // Minute de fermeture (23h30)
};

// ========================================
// 💾 GESTION DES FICHIERS
// ========================================

async function initDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify({ users: [], answers: [] }, null, 2));
  }
}

async function initConfigFile() {
  try {
    await fs.access(CONFIG_FILE);
  } catch {
    await fs.writeFile(CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2));
  }
}

async function readData() {
  const data = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

async function readConfig() {
  try {
    const config = await fs.readFile(CONFIG_FILE, 'utf-8');
    return JSON.parse(config);
  } catch {
    return DEFAULT_CONFIG;
  }
}

async function writeConfig(config) {
  await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
}

// ========================================
// 📅 GESTION DU CALENDRIER
// ========================================

async function getCurrentDay() {
  const config = await readConfig();
  
  // Normaliser les dates à 00:00:00 pour éviter les bugs d'heures
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  const startDate = new Date(config.startDate);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(config.endDate);
  endDate.setHours(23, 59, 59, 999);
  
  // Vérifier si on est dans la période du calendrier
  if (now < startDate) {
    console.log('❌ Calendrier pas encore commencé');
    return 0; // Pas encore commencé
  }
  
  if (now > endDate) {
    console.log('❌ Calendrier terminé');
    return 0; // Terminé
  }
  
  // Calculer le nombre de jours écoulés depuis le début
  const diffTime = now.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Le jour actuel = nombre de jours écoulés + 1
  const currentDay = diffDays + 1;
  
  // S'assurer que le jour est entre 1 et 25
  const finalDay = Math.max(1, Math.min(currentDay, 25));
  
  console.log(`📅 Calcul du jour: Date=${now.toISOString().split('T')[0]}, Début=${startDate.toISOString().split('T')[0]}, Jours écoulés=${diffDays}, Jour=${finalDay}/25`);
  
  return finalDay;
}

async function isOpenHours() {
  const config = await readConfig();
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  
  // Vérifier si on est dans les horaires d'ouverture
  if (hour > config.openingHour || (hour === config.openingHour && minute >= 0)) {
    if (hour < config.closingHour || (hour === config.closingHour && minute < config.closingMinute)) {
      return true;
    }
  }
  return false;
}

// ========================================
// 🎯 CALCUL DU SCORE
// ========================================

function calculateUserScore(username, data) {
  const userAnswers = data.answers.filter(a => a.username.toLowerCase() === username.toLowerCase());
  let score = 0;
  
  userAnswers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    
    // Si un override existe, l'utiliser
    if (answer.overrideCorrect !== undefined) {
      if (answer.overrideCorrect === true) {
        score++;
      }
    } else {
      // Sinon, vérifier normalement
      if (question && answer.answer === question.correctAnswer) {
        score++;
      }
    }
  });
  
  // Ajouter les points bonus de l'utilisateur
  const user = data.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (user && user.bonusPoints) {
    score += user.bonusPoints;
  }
  
  return score;
}

// ========================================
// 📊 CLASSEMENT
// ========================================

function getLeaderboard(data) {
  const userScores = {};
  
  // Compter les scores de chaque utilisateur
  data.users.forEach(user => {
    const score = calculateUserScore(user.username, data);
    const answersCount = data.answers.filter(a => a.username.toLowerCase() === user.username.toLowerCase()).length;
    
    userScores[user.username] = {
      username: user.username,
      score: score,
      answersCount: answersCount
    };
  });
  
  // Convertir en tableau et trier
  return Object.values(userScores).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.answersCount - a.answersCount;
  });
}

function getTop3(data) {
  const leaderboard = getLeaderboard(data);
  return leaderboard.slice(0, 3);
}

// ========================================
// 📊 STATISTIQUES DU JOUR
// ========================================

function getDayStats(data, day) {
  const dayQuestions = questions.filter(q => q.day === day);
  const dayQuestionIds = dayQuestions.map(q => q.id);
  
  // Réponses du jour
  const dayAnswers = data.answers.filter(a => dayQuestionIds.includes(a.questionId));
  
  // Compter les réponses correctes par question
  const questionStats = dayQuestions.map(q => {
    const qAnswers = dayAnswers.filter(a => a.questionId === q.id);
    const correctAnswers = qAnswers.filter(a => a.answer === q.correctAnswer).length;
    const totalAnswers = qAnswers.length;
    
    return {
      questionId: q.id,
      question: q.question,
      correctAnswer: q.correctAnswer,
      correctAnswersCount: correctAnswers,
      totalAnswers: totalAnswers,
      successRate: totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0,
      explanation: q.explanation
    };
  });
  
  return {
    day: day,
    questions: questionStats,
    totalParticipants: new Set(dayAnswers.map(a => a.username)).size
  };
}

// ========================================
// 💬 DISCORD - MESSAGES AUTOMATIQUES
// ========================================

async function sendDiscordMessage(content, embeds = []) {
  try {
    const config = await readConfig();
    const webhook = config.discordWebhook;
    
    if (!webhook || webhook === '') {
      console.log('⚠️ Webhook Discord non configuré');
      return false;
    }
    
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, embeds })
    });
    
    if (!response.ok) {
      console.error('❌ Erreur Discord:', response.status);
      return false;
    }
    
    console.log('✅ Message Discord envoyé');
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi Discord:', error);
    return false;
  }
}

// ========================================
// 🌅 MESSAGE DU MATIN (8H) - ANNONCE
// ========================================

async function sendMorningAnnouncement() {
  console.log('🌅 Envoi du message du matin...');
  
  const currentDay = await getCurrentDay();
  
  if (currentDay === 0) {
    console.log('❌ Hors période du calendrier');
    return;
  }
  
  const dayQuestions = questions.filter(q => q.day === currentDay);
  
  // Créer la liste des thèmes
  const themes = dayQuestions.map((q, i) => `${i + 1}. ${q.group}`).join('\n');
  
  const content = `🎄 **CALENDRIER DE L'AVENT - JOUR ${currentDay}/25** 🎄\n\n` +
    `☀️ Bonjour à tous !\n\n` +
    `🎁 **4 nouvelles questions** sont maintenant disponibles !\n\n` +
    `⏰ Vous avez jusqu'à **23h00** pour répondre !\n\n` +
    `🏆 Les résultats seront annoncés ce soir à **23h** !\n\n` +
    `🔗 Rendez-vous sur le site : **https://calendrier-de-l-avant-jtff.netlify.app**`;
  
  await sendDiscordMessage(content);
}

// ========================================
// 🌙 MESSAGE DU SOIR (23H) - RÉSULTATS
// ========================================

async function sendEveningResults() {
  console.log('🌙 Envoi des résultats du soir...');
  
  const currentDay = await getCurrentDay();
  
  if (currentDay === 0) {
    console.log('❌ Hors période du calendrier');
    return;
  }
  
  const data = await readData();
  const top3 = getTop3(data);
  const dayStats = getDayStats(data, currentDay);
  
  // 🏆 TOP 3
  let top3Text = '🏆 **CLASSEMENT GÉNÉRAL** 🏆\n\n';
  const medals = ['🥇', '🥈', '🥉'];
  
  top3.forEach((user, index) => {
    const medal = medals[index] || `${index + 1}.`;
    top3Text += `${medal} **${user.username}** - ${user.score} points (${user.answersCount} questions)\n`;
  });
  
  if (top3.length === 0) {
    top3Text += '_(Aucun participant pour le moment)_\n';
  }
  
  // 📊 STATISTIQUES DU JOUR
  let statsText = `\n\n📊 **RÉSULTATS DU JOUR ${currentDay}** 📊\n\n`;
  statsText += `👥 **${dayStats.totalParticipants} participants** ont répondu aujourd'hui\n\n`;
  
  // 📝 RÉPONSES DES QUESTIONS (EN SPOILER)
  let answersText = `\n\n📝 **RÉPONSES AUX QUESTIONS DU JOUR ${currentDay}** 📝\n\n`;
  
  dayStats.questions.forEach((qStat, index) => {
    const question = questions.find(q => q.id === qStat.questionId);
    const letters = ['A', 'B', 'C', 'D'];
    const correctLetter = letters[question.correctAnswer];
    const correctOption = question.options[question.correctAnswer];
    
    answersText += `**Question ${index + 1}** - ${qStat.question}\n`;
    answersText += `📈 Taux de réussite : **${qStat.successRate}%** (${qStat.correctAnswersCount}/${qStat.totalAnswers})\n\n`;
  });
  
  // Message final
  const content = `🎄 **CALENDRIER DE L'AVENT - JOUR ${currentDay}/25** 🎄\n\n` +
    `🌙 **Bonsoir à tous !**\n\n` +
    `La journée est terminée ! Voici les résultats :\n\n` +
    top3Text +
    statsText +
    answersText +
    `\n🎁 Rendez-vous demain à **8h** pour 4 nouvelles questions !\n\n` +
    `🔗 Site : **https://calendrier-de-l-avant-jtff.netlify.app**`;
  
  await sendDiscordMessage(content);
}

// ========================================
// ⏰ CRONS AUTOMATIQUES
// ========================================

let morningCron = null;
let eveningCron = null;

async function setupCrons() {
  const config = await readConfig();
  
  // Arrêter les crons existants
  if (morningCron) morningCron.stop();
  if (eveningCron) eveningCron.stop();
  
  // Créer les expressions cron
  const morningCronExpression = `${config.morningMinute} ${config.morningHour} * * *`;
  const eveningCronExpression = `${config.eveningMinute} ${config.eveningHour} * * *`;
  
  console.log(`⏰ Cron matin : ${morningCronExpression} (${config.morningHour}h${String(config.morningMinute).padStart(2, '0')})`);
  console.log(`⏰ Cron soir : ${eveningCronExpression} (${config.eveningHour}h${String(config.eveningMinute).padStart(2, '0')})`);
  
  // Message du matin (annonce nouvelles questions)
  morningCron = cron.schedule(morningCronExpression, async () => {
    console.log('🌅 CRON MATIN : Envoi de l\'annonce...');
    await sendMorningAnnouncement();
  });
  
  // Message du soir (résultats + top 3)
  eveningCron = cron.schedule(eveningCronExpression, async () => {
    console.log('🌙 CRON SOIR : Envoi des résultats...');
    await sendEveningResults();
  });
  
  console.log('✅ Crons configurés et démarrés');
}

// ========================================
// 🌐 ROUTES API
// ========================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Obtenir les questions du jour
app.get('/api/questions/today', async (req, res) => {
  const currentDay = await getCurrentDay();
  
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
    isOpen: await isOpenHours(),
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
  
  const score = calculateUserScore(username, data);
  const answers = data.answers.filter(a => a.username.toLowerCase() === username.toLowerCase());
  
  res.json({
    user: user,
    score: score,
    answers: answers
  });
});

// Soumettre une réponse
app.post('/api/answer', async (req, res) => {
  const { username, questionId, answer } = req.body;
  
  if (!username || questionId === undefined || answer === undefined) {
    return res.status(400).json({ error: 'Données manquantes' });
  }
  
  const data = await readData();
  
  // Vérifier si l'utilisateur a déjà répondu
  const existingAnswer = data.answers.find(
    a => a.username.toLowerCase() === username.toLowerCase() && a.questionId === questionId
  );
  
  if (existingAnswer) {
    return res.json({ success: false, error: 'Vous avez déjà répondu à cette question' });
  }
  
  // Vérifier si la question existe
  const question = questions.find(q => q.id === questionId);
  if (!question) {
    return res.status(404).json({ error: 'Question non trouvée' });
  }
  
  // Vérifier si on est dans les horaires
  if (!(await isOpenHours())) {
    return res.json({ success: false, error: 'Les questions ne sont pas disponibles en ce moment (8h-23h30)' });
  }
  
  // Enregistrer la réponse
  data.answers.push({
    username: username,
    questionId: questionId,
    answer: answer,
    answeredAt: new Date().toISOString()
  });
  
  await writeData(data);
  
  // Calculer le nouveau score
  const score = calculateUserScore(username, data);
  const isCorrect = answer === question.correctAnswer;
  
  res.json({
    success: true,
    isCorrect: isCorrect,
    score: score
  });
});

// Classement
app.get('/api/leaderboard', async (req, res) => {
  const data = await readData();
  const leaderboard = getLeaderboard(data);
  res.json(leaderboard);
});

// ========================================
// 👨‍💼 ROUTES ADMIN
// ========================================

// Vérifier le mot de passe admin
app.post('/api/admin/login', async (req, res) => {
  const { password } = req.body;
  const config = await readConfig();
  
  if (password === config.adminPassword) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: 'Mot de passe incorrect' });
  }
});

// Obtenir la configuration
app.get('/api/admin/config', async (req, res) => {
  const config = await readConfig();
  res.json(config);
});

// Modifier la configuration
app.post('/api/admin/config', async (req, res) => {
  const { password, ...newConfig } = req.body;
  const config = await readConfig();
  
  // Vérifier le mot de passe
  if (password !== config.adminPassword) {
    return res.status(401).json({ error: 'Mot de passe incorrect' });
  }
  
  // Mettre à jour la configuration
  const updatedConfig = { ...config, ...newConfig };
  await writeConfig(updatedConfig);
  
  // Reconfigurer les crons avec les nouveaux horaires
  await setupCrons();
  
  res.json({ success: true, config: updatedConfig });
});

// Test webhook matin
app.post('/api/admin/test-morning', async (req, res) => {
  const { password } = req.body;
  const config = await readConfig();
  
  if (password !== config.adminPassword) {
    return res.status(401).json({ error: 'Mot de passe incorrect' });
  }
  
  await sendMorningAnnouncement();
  res.json({ success: true, message: 'Message du matin envoyé' });
});

// Test webhook soir
app.post('/api/admin/test-evening', async (req, res) => {
  const { password } = req.body;
  const config = await readConfig();
  
  if (password !== config.adminPassword) {
    return res.status(401).json({ error: 'Mot de passe incorrect' });
  }
  
  await sendEveningResults();
  res.json({ success: true, message: 'Message du soir envoyé' });
});

// Obtenir les statistiques
app.get('/api/admin/stats', async (req, res) => {
  const data = await readData();
  const currentDay = await getCurrentDay();
  
  const stats = {
    totalUsers: data.users.length,
    totalAnswers: data.answers.length,
    currentDay: currentDay,
    leaderboard: getLeaderboard(data),
    dayStats: currentDay > 0 ? getDayStats(data, currentDay) : null
  };
  
  res.json(stats);
});

// Reset toutes les données (utilisateurs + réponses)
app.post('/api/admin/reset-all', async (req, res) => {
  const { password } = req.body;
  const config = await readConfig();
  
  if (password !== config.adminPassword) {
    return res.status(401).json({ error: 'Mot de passe incorrect' });
  }
  
  // Reset complet
  await writeData({ users: [], answers: [] });
  
  res.json({ success: true, message: 'Toutes les données ont été supprimées' });
});

// Supprimer un utilisateur spécifique
app.post('/api/admin/delete-user', async (req, res) => {
  const { password, username } = req.body;
  const config = await readConfig();
  
  if (password !== config.adminPassword) {
    return res.status(401).json({ error: 'Mot de passe incorrect' });
  }
  
  if (!username) {
    return res.status(400).json({ error: 'Username requis' });
  }
  
  const data = await readData();
  
  // Supprimer l'utilisateur
  data.users = data.users.filter(u => u.username.toLowerCase() !== username.toLowerCase());
  
  // Supprimer ses réponses
  data.answers = data.answers.filter(a => a.username.toLowerCase() !== username.toLowerCase());
  
  await writeData(data);
  
  res.json({ success: true, message: `Utilisateur ${username} supprimé` });
});

// Reset seulement les réponses (garder les utilisateurs)
app.post('/api/admin/reset-answers', async (req, res) => {
  const { password } = req.body;
  const config = await readConfig();
  
  if (password !== config.adminPassword) {
    return res.status(401).json({ error: 'Mot de passe incorrect' });
  }
  
  const data = await readData();
  
  // Garder les utilisateurs, supprimer les réponses
  data.answers = [];
  
  await writeData(data);
  
  res.json({ success: true, message: 'Toutes les réponses ont été supprimées' });
});

// Obtenir la liste de tous les utilisateurs
app.get('/api/admin/users', async (req, res) => {
  const data = await readData();
  const usersWithStats = data.users.map(user => {
    const score = calculateUserScore(user.username, data);
    const answersCount = data.answers.filter(a => a.username.toLowerCase() === user.username.toLowerCase()).length;
    return {
      username: user.username,
      createdAt: user.createdAt,
      score: score,
      answersCount: answersCount
    };
  });
  
  res.json(usersWithStats);
});

// Obtenir les stats d'un jour spécifique
app.get('/api/admin/day-stats/:day', async (req, res) => {
  const day = parseInt(req.params.day);
  
  if (isNaN(day) || day < 1 || day > 25) {
    return res.status(400).json({ error: 'Jour invalide (1-25)' });
  }
  
  const data = await readData();
  const dayStats = getDayStats(data, day);
  
  res.json(dayStats);
});

// Obtenir les stats détaillées d'un joueur
app.get('/api/admin/player-stats/:username', async (req, res) => {
  const username = req.params.username;
  const data = await readData();
  
  // Vérifier si l'utilisateur existe
  const user = data.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'Utilisateur non trouvé' });
  }
  
  // Récupérer toutes les réponses du joueur
  const userAnswers = data.answers.filter(a => a.username.toLowerCase() === username.toLowerCase());
  
  // Calculer le score total
  const totalScore = calculateUserScore(username, data);
  
  // Stats par catégorie (groupe)
  const categoryStats = {};
  userAnswers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question) {
      const category = question.group;
      if (!categoryStats[category]) {
        categoryStats[category] = {
          total: 0,
          correct: 0
        };
      }
      categoryStats[category].total++;
      if (answer.answer === question.correctAnswer) {
        categoryStats[category].correct++;
      }
    }
  });
  
  // Calculer les pourcentages par catégorie
  const categoryPercentages = {};
  Object.keys(categoryStats).forEach(category => {
    const stats = categoryStats[category];
    categoryPercentages[category] = {
      correct: stats.correct,
      total: stats.total,
      percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
    };
  });
  
  // Réponses par jour
  const answersByDay = {};
  for (let day = 1; day <= 25; day++) {
    const dayQuestions = questions.filter(q => q.day === day);
    const dayAnswers = dayQuestions.map(q => {
      const userAnswer = userAnswers.find(a => a.questionId === q.id);
      return {
        questionId: q.id,
        question: q.question,
        group: q.group,
        options: q.options,
        correctAnswer: q.correctAnswer,
        userAnswer: userAnswer ? userAnswer.answer : null,
        isCorrect: userAnswer ? userAnswer.answer === q.correctAnswer : null,
        answeredAt: userAnswer ? userAnswer.answeredAt : null
      };
    });
    
    if (dayAnswers.some(a => a.userAnswer !== null)) {
      answersByDay[day] = dayAnswers;
    }
  }
  
  res.json({
    username: user.username,
    totalScore: totalScore,
    totalAnswers: userAnswers.length,
    categoryStats: categoryPercentages,
    answersByDay: answersByDay
  });
});

// Admin: Ajouter/retirer des points bonus à un joueur
app.post('/api/admin/adjust-bonus-points', async (req, res) => {
  const { password, username, points, reason } = req.body;
  const config = await readConfig();
  
  if (password !== config.adminPassword) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  
  try {
    const data = await readData();
    const user = data.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    // Initialiser bonusPoints s'il n'existe pas
    if (!user.bonusPoints) {
      user.bonusPoints = 0;
    }
    
    // Ajouter/retirer les points
    user.bonusPoints += points;
    
    // Ajouter l'historique des modifications
    if (!user.pointsHistory) {
      user.pointsHistory = [];
    }
    
    user.pointsHistory.push({
      date: new Date().toISOString(),
      points: points,
      reason: reason || 'Ajustement manuel',
      by: 'admin'
    });
    
    await writeData(data);
    
    res.json({ 
      success: true, 
      message: `${points > 0 ? 'Ajouté' : 'Retiré'} ${Math.abs(points)} point(s) à ${username}`,
      newBonusPoints: user.bonusPoints,
      newTotalScore: calculateUserScore(username, data)
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Admin: Forcer une réponse comme correcte/incorrecte
app.post('/api/admin/override-answer', async (req, res) => {
  const { password, username, questionId, forceCorrect, reason } = req.body;
  const config = await readConfig();
  
  if (password !== config.adminPassword) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  
  try {
    const data = await readData();
    const answer = data.answers.find(a => 
      a.username.toLowerCase() === username.toLowerCase() && 
      a.questionId === questionId
    );
    
    if (!answer) {
      return res.status(404).json({ error: 'Réponse non trouvée' });
    }
    
    // Ajouter l'override
    answer.overrideCorrect = forceCorrect;
    answer.overrideReason = reason || 'Ajustement admin';
    answer.overrideDate = new Date().toISOString();
    
    await writeData(data);
    
    res.json({ 
      success: true, 
      message: `Réponse ${forceCorrect ? 'validée' : 'invalidée'} pour ${username}`,
      newTotalScore: calculateUserScore(username, data)
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Admin: Annuler un override de réponse
app.post('/api/admin/remove-override', async (req, res) => {
  const { password, username, questionId } = req.body;
  const config = await readConfig();
  
  if (password !== config.adminPassword) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  
  try {
    const data = await readData();
    const answer = data.answers.find(a => 
      a.username.toLowerCase() === username.toLowerCase() && 
      a.questionId === questionId
    );
    
    if (!answer) {
      return res.status(404).json({ error: 'Réponse non trouvée' });
    }
    
    // Retirer l'override
    delete answer.overrideCorrect;
    delete answer.overrideReason;
    delete answer.overrideDate;
    
    await writeData(data);
    
    res.json({ 
      success: true, 
      message: `Override retiré pour ${username}`,
      newTotalScore: calculateUserScore(username, data)
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ========================================
// 🚀 DÉMARRAGE DU SERVEUR
// ========================================

async function startServer() {
  try {
    // Initialiser les fichiers
    await initDataFile();
    await initConfigFile();
    
    console.log('✅ Fichiers initialisés');
    
    // Configurer les crons
    await setupCrons();
    
    // Démarrer le serveur
    app.listen(PORT, async () => {
      const day = await getCurrentDay();
      console.log('');
      console.log('🎄 ========================================');
      console.log('   CALENDRIER DE L\'AVENT - SERVEUR ACTIF');
      console.log('   ========================================');
      console.log('');
      console.log(`   🌐 Port : ${PORT}`);
      console.log(`   📅 Jour actuel : ${day}/25`);
      console.log('');
      console.log('   ⏰ Automatisation activée :');
      console.log('      • Matin : Annonce nouvelles questions');
      console.log('      • Soir : Résultats + Top 3 + Réponses');
      console.log('');
      console.log('🎄 ========================================');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Erreur au démarrage:', error);
    process.exit(1);
  }
}

// Démarrer
startServer();
