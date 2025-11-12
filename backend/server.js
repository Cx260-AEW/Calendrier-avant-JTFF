// ========================================
// 🧪 MODE TEST - CONFIGURATION.
// ========================================
const TEST_MODE = true;           // ← Mettre à false pour la production
const TEST_DAY = 25;              // ← Jour à simuler (1-25)
const TEST_ALWAYS_OPEN = true;    // ← Toujours ouvert (ignorer horaires)
// ========================================
// Les crons 8h et 23h30 fonctionnent TOUJOURS (même en mode test)
// pour vérifier que l'automatisation marche !
// ========================================

import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { questions } from './questions.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Configuration (via ENV avec fallback)
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK || 'https://discord.com/api/webhooks/CHANGE_ME';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const TZ              = process.env.TZ || 'Europe/Paris';

const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

// ---------- Utils Date/TZ ----------
function nowParis() {
  // crée un Date basé sur l'heure Europe/Paris
  const s = new Date().toLocaleString('en-CA', { timeZone: TZ });
  return new Date(s);
}
function todayKey() {
  // YYYY-MM-DD en TZ
  const n = nowParis();
  return n.toISOString().slice(0, 10);
}

// ---------- Fichier data ----------
async function initDataFile() {
  try {
    await fs.access(DATA_FILE);
    // upgrade schema si ancien fichier
    const data = await readData();
    if (!data.selections) data.selections = {};
    if (!data.flags) data.flags = {};
    await writeDataSafe(data);
  } catch {
    await writeDataSafe({ users: [], answers: [], selections: {}, flags: {} });
  }
}

async function readData() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);
    data.selections = data.selections || {};
    data.flags = data.flags || {};
    return data;
  } catch {
    return { users: [], answers: [], selections: {}, flags: {} };
  }
}

async function writeDataSafe(data) {
  const tmp = DATA_FILE + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
  await fs.rename(tmp, DATA_FILE);
}

// ---------- Calendrier / fenêtre ----------
function getCurrentDay() {
  // 🧪 MODE TEST
  if (TEST_MODE) {
    console.log(`🧪 MODE TEST ACTIVÉ : Jour ${TEST_DAY}`);
    return TEST_DAY;
  }
  // 📅 MODE PRODUCTION (Europe/Paris)
  const now = nowParis();
  const month = now.getMonth() + 1; // 1..12
  const dayOfMonth = now.getDate();
  if (month === 12 && dayOfMonth >= 1 && dayOfMonth <= 25) {
    return dayOfMonth;
  }
  return 0;
}

function isOpenHours() {
  // 🧪 MODE TEST
  if (TEST_MODE && TEST_ALWAYS_OPEN) return true;

  // ⏰ MODE PRODUCTION (Europe/Paris)
  const now = nowParis();
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
async function sendDiscord(content) {
  if (!DISCORD_WEBHOOK || DISCORD_WEBHOOK.includes('CHANGE_ME')) {
    throw new Error('DISCORD_WEBHOOK manquant ou non configuré');
  }
  const resp = await fetch(DISCORD_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`Discord HTTP ${resp.status} ${resp.statusText} ${text}`);
  }
}

// 1. MESSAGE DU MATIN (8h) : Nouvelles questions disponibles
async function sendMorningDiscordMessage() {
  const currentDay = getCurrentDay();
  if (currentDay === 0) {
    console.log('❌ Pas en décembre, message du matin annulé');
    return;
  }

  const todayQuestions = questions.filter(q => q.day === currentDay);
  const testPrefix = TEST_MODE ? '🧪 [MODE TEST] ' : '';
  const message = `${testPrefix}# 🎄 Jour ${currentDay} - Nouvelles Questions ! 🎄

**4 nouvelles questions sont disponibles :**

🧭 **Navigation aérienne** - Question ${todayQuestions[0]?.id}
🎧 **Contrôle aérien** - Question ${todayQuestions[1]?.id}
📜 **Réglementation** - Question ${todayQuestions[2]?.id}
🗺️ **Cartes aéronautiques** - Question ${todayQuestions[3]?.id}

⏰ Vous avez jusqu'à **23h30** pour répondre !
🎯 Bonne chance à tous ! ✈️`;

  try {
    console.log('[CRON] Envoi message du matin…', nowParis().toISOString());
    await sendDiscord(message);
    console.log(`✅ ${new Date().toLocaleTimeString()} Message du matin envoyé (Jour ${currentDay})`);
    const data = await readData();
    const key = todayKey();
    data.flags[key] = data.flags[key] || {};
    data.flags[key].morning = true;
    await writeDataSafe(data);
  } catch (error) {
    console.error('❌ Erreur Discord matin:', error.message);
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
    return { username: user.username, score, answersCount };
  }).sort((a, b) => b.score - a.score);

  const testPrefix = TEST_MODE ? '🧪 [MODE TEST] ' : '';
  let message = `${testPrefix}# 📊 Résultats du Jour ${currentDay} 📊\n\n`;

  // Top 3
  message += `## 🏆 Top 3 Général\n`;
  if (leaderboard.length >= 3) {
    message += `🥇 **${leaderboard[0].username}** - ${leaderboard[0].score} points\n`;
    message += `🥈 **${leaderboard[1].username}** - ${leaderboard[1].score} points\n`;
    message += `🥉 **${leaderboard[2].username}** - ${leaderboard[2].score} points\n`;
  } else if (leaderboard.length > 0) {
    const medals = ['🥇', '🥈', '🥉'];
    leaderboard.forEach((user, i) => (message += `${medals[i] || '•'} **${user.username}** - ${user.score} points\n`));
  } else {
    message += `Aucun participant pour le moment 🎅\n`;
  }

  // Classement complet (top 10)
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
    console.log('[CRON] Envoi message du soir…', nowParis().toISOString());
    await sendDiscord(message);
    console.log(`✅ ${new Date().toLocaleTimeString()} Résultats du soir envoyés (Jour ${currentDay})`);
    const key = todayKey();
    data.flags[key] = data.flags[key] || {};
    data.flags[key].evening = true;
    await writeDataSafe(data);
  } catch (error) {
    console.error('❌ Erreur Discord soir:', error.message);
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
🎯 Messages automatiques programmés :
  • 🌅 Tous les jours à 8h00 : Nouvelles questions
  • 🌙 Tous les jours à 23h30 : Résultats

${TEST_MODE ? '⚠️ En mode test, les messages seront préfixés "🧪 [MODE TEST]"' : ''}

Ce message est envoyé depuis le panneau admin. 🎄`;

  try {
    await sendDiscord(message);
    console.log('✅ Message de test Discord envoyé');
    return true;
  } catch (error) {
    console.error('❌ Erreur réseau Discord:', error.message);
    return false;
  }
}

// ====== ROUTES API ======

// Endpoint d’affichage public (sans exposer les IDs aux utilisateurs)
app.get('/api/questions/today/view', async (req, res) => {
  const currentDay = getCurrentDay();
  if (currentDay === 0) {
    return res.json({ day: 0, questions: [] });
  }
  // On prend exactement les 4 questions du jour courant
  const items = questions
    .filter(q => q.day === currentDay)
    .map(q => ({
      _questionId: q.id, // utile côté front pour /api/answer (ne pas afficher)
      group: q.group,
      question: q.question,
      image: q.image || null,
      options: q.options || []
    }));
  res.json({ day: currentDay, questions: items.slice(0, 4) });
});

// Obtenir les questions disponibles (API existante)
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
    user = { username: username.trim(), createdAt: new Date().toISOString() };
    data.users.push(user);
    await writeDataSafe(data);
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
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

  const question = questions.find(q => q.id === questionId);
  if (!question) return res.status(404).json({ error: 'Question non trouvée' });

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
  await writeDataSafe(data);

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
    return { username: user.username, score, answersCount };
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
  if (password === ADMIN_PASSWORD) res.json({ success: true });
  else res.status(401).json({ error: 'Mot de passe incorrect' });
});

// Admin: Obtenir toutes les données
app.get('/api/admin/data', async (req, res) => {
  const { password } = req.query;
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Non autorisé' });

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

// Admin: Obtenir les détails d'un joueur
app.get('/api/admin/user/:username', async (req, res) => {
  const { password } = req.query;
  const { username } = req.params;
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Non autorisé' });

  try {
    const data = await readData();
    const user = data.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    const userAnswers = data.answers.filter(a => a.username.toLowerCase() === username.toLowerCase());
    const answersDetails = userAnswers.map(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      const isCorrect = answer.answer === question.correctAnswer;
      return {
        questionId: question.id,
        day: question.day,
        group: question.group,
        question: question.question,
        userAnswer: answer.answer,
        correctAnswer: question.correctAnswer,
        userAnswerText: question.options[answer.answer],
        correctAnswerText: question.options[question.correctAnswer],
        isCorrect,
        answeredAt: answer.answeredAt
      };
    });

    const statsByCategory = {};
    ['Navigation aérienne', 'Contrôle aérien', 'Réglementation', 'Cartes aéronautiques'].forEach(category => {
      const categoryAnswers = answersDetails.filter(a => a.group === category);
      const correctCount = categoryAnswers.filter(a => a.isCorrect).length;
      const total = categoryAnswers.length;
      statsByCategory[category] = {
        correct: correctCount,
        total,
        percentage: total > 0 ? Math.round((correctCount / total) * 100) : 0
      };
    });

    const statsByDay = {};
    for (let day = 1; day <= 25; day++) {
      const dayAnswers = answersDetails.filter(a => a.day === day);
      if (dayAnswers.length > 0) {
        const correctCount = dayAnswers.filter(a => a.isCorrect).length;
        statsByDay[day] = {
          correct: correctCount,
          total: dayAnswers.length,
          percentage: Math.round((correctCount / dayAnswers.length) * 100)
        };
      }
    }

    const totalScore = answersDetails.filter(a => a.isCorrect).length;

    res.json({
      user,
      totalScore,
      totalAnswers: answersDetails.length,
      answersDetails,
      statsByCategory,
      statsByDay
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Admin: Supprimer un utilisateur
app.delete('/api/admin/user/:username', async (req, res) => {
  const { password } = req.query;
  const { username } = req.params;
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Non autorisé' });

  try {
    const data = await readData();
    data.users = data.users.filter(u => u.username.toLowerCase() !== username.toLowerCase());
    data.answers = data.answers.filter(a => a.username.toLowerCase() !== username.toLowerCase());
    await writeDataSafe(data);
    res.json({ success: true, message: `Utilisateur ${username} supprimé` });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Admin: Reset complet
app.post('/api/admin/reset-all', async (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Non autorisé' });

  try {
    await writeDataSafe({ users: [], answers: [], selections: {}, flags: {} });
    res.json({ success: true, message: 'Tous les participants ont été supprimés' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Admin: Test Discord (manuel)
app.post('/api/admin/test-discord', async (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Non autorisé' });

  console.log('🧪 Test Discord demandé depuis l\'admin...');
  const success = await sendTestDiscordMessage();
  if (success) res.json({ success: true, message: 'Message de test envoyé sur Discord !' });
  else res.status(500).json({ success: false, error: 'Erreur lors de l\'envoi sur Discord' });
});

// Admin: Forcer message du matin (test)
app.post('/api/admin/test-morning', async (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Non autorisé' });

  await sendMorningDiscordMessage();
  res.json({ success: true, message: 'Message du matin envoyé' });
});

// Admin: Forcer message du soir (test)
app.post('/api/admin/test-evening', async (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Non autorisé' });

  await sendEveningDiscordMessage();
  res.json({ success: true, message: 'Message du soir envoyé' });
});

// Admin: Statut cron (nouveau)
app.get('/api/admin/cron-status', async (req, res) => {
  const data = await readData();
  const key = todayKey();
  const flags = data.flags[key] || {};
  res.json({
    nowParis: nowParis().toISOString(),
    todayKey: key,
    sentMorning: !!flags.morning,
    sentEvening: !!flags.evening,
    timezone: TZ,
    testMode: TEST_MODE
  });
});

// ====== CRON JOBS ======
// Planification quotidienne (toute l'année) avec timezone Europe/Paris.
// Les fonctions elles-mêmes vérifient si on est en période de l'avent.
cron.schedule('0 8 * * *',  () => sendMorningDiscordMessage(), { timezone: TZ });
cron.schedule('30 23 * * *', () => sendEveningDiscordMessage(), { timezone: TZ });
console.log('[CRON] Tâches planifiées (TZ=%s): 08:00 et 23:30', TZ);

// Rattrapage si le serveur démarre pendant la fenêtre (08:00–08:05 et 23:30–23:35)
(async () => {
  try {
    const now = nowParis();
    const key = todayKey();
    const h = now.getHours(), m = now.getMinutes();
    const data = await readData();
    data.flags[key] = data.flags[key] || {};

    if (!data.flags[key].morning && (h === 8 && m <= 5)) {
      console.log('[CRON] Rattrapage: fenêtre matin détectée, envoi…');
      await sendMorningDiscordMessage();
    }
    if (!data.flags[key].evening && (h === 23 && m >= 30 && m <= 35)) {
      console.log('[CRON] Rattrapage: fenêtre soir détectée, envoi…');
      await sendEveningDiscordMessage();
    }
  } catch (e) {
    console.error('[CRON] Rattrapage ERREUR:', e.message);
  }
})();

// Démarrer le serveur
async function startServer() {
  await initDataFile();
  app.listen(PORT, () => {
    const now = nowParis();
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`${TEST_MODE ? '🧪 MODE TEST ACTIVÉ' : '📅 MODE PRODUCTION'}`);
    console.log(`📅 Jour simulé/actuel: ${getCurrentDay()}`);
    console.log(`⏰ Horaires quiz: ${isOpenHours() ? 'Ouvert 24h/24 (TEST)' : '8h-23h30'}`);
    console.log(`🔔 Crons automatiques ACTIFS (TZ=${TZ}):`);
    console.log(`   • 🌅 Message du matin à 8h00`);
    console.log(`   • 🌙 Message du soir à 23h30`);
    console.log(`⏱️  Heure actuelle (Paris): ${now.toLocaleTimeString('fr-FR')}`);
  });
}
startServer();
