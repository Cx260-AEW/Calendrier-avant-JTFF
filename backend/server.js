// ========================================
// 🧪 MODE TEST - CONFIGURATION (facultatif)
// ========================================
const TEST_MODE = true;            // ← false en production
const TEST_DAY = 25;               // ← Jour simulé (1-25)
const TEST_ALWAYS_OPEN = true;     // ← Ignore la fenêtre horaire en test
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

// 🛡️ Secrets / Config via ENV
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;
const ADMIN_PASSWORD  = process.env.ADMIN_PASSWORD;
const TZ              = process.env.TZ || 'Europe/Paris';
const DATA_FILE       = path.join(__dirname, 'data.json');

// ✅ CORS FIX : autoriser le front Netlify
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS ||
  'https://calendrier-de-l-avant-jtff.netlify.app'
).split(',').map(s => s.trim());

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // gérer les pré-requêtes OPTIONS

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

// ---------- Utils Date/TZ ----------
function nowParis() {
  const s = new Date().toLocaleString('en-CA', { timeZone: TZ });
  return new Date(s);
}
function todayKey() {
  return nowParis().toISOString().slice(0, 10);
}

// ---------- data.json helpers ----------
async function initDataFile() {
  try {
    await fs.access(DATA_FILE);
    const d = await readData();
    if (!d.selections) d.selections = {};
    if (!d.flags) d.flags = {};
    await writeDataSafe(d);
  } catch {
    await writeDataSafe({ users: [], answers: [], selections: {}, flags: {} });
  }
}
async function readData() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    const d = JSON.parse(raw);
    d.selections = d.selections || {};
    d.flags = d.flags || {};
    return d;
  } catch {
    return { users: [], answers: [], selections: {}, flags: {} };
  }
}
async function writeDataSafe(obj) {
  const tmp = DATA_FILE + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(obj, null, 2), 'utf8');
  await fs.rename(tmp, DATA_FILE);
}

// ---------- Calendrier / fenêtre ----------
function getCurrentDay() {
  if (TEST_MODE) return TEST_DAY;
  const now = nowParis();
  const month = now.getMonth() + 1;
  const dayOfMonth = now.getDate();
  // 🗓️ Activation en novembre (1..25)
  if (month === 11 && dayOfMonth >= 1 && dayOfMonth <= 25) return dayOfMonth;
  return 0;
}
function isOpenHours() {
  if (TEST_MODE && TEST_ALWAYS_OPEN) return true;
  const now = nowParis();
  const h = now.getHours(), m = now.getMinutes();
  if (h > 8 || (h === 8 && m >= 0)) {
    if (h < 23 || (h === 23 && m < 30)) return true;
  }
  return false;
}

// ---------- Score ----------
function calculateUserScore(username, data) {
  const userAnswers = data.answers.filter(a => a.username.toLowerCase() === username.toLowerCase());
  let score = 0;
  for (const ans of userAnswers) {
    const q = questions.find(q => q.id === ans.questionId);
    if (q && ans.answer === q.correctAnswer) score++;
  }
  return score;
}

// ---------- Discord ----------
async function sendDiscord(content) {
  if (!DISCORD_WEBHOOK) throw new Error('DISCORD_WEBHOOK manquant (ENV)');
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

// Matin (08:00)
async function sendMorningDiscordMessage() {
  const currentDay = getCurrentDay();
  if (currentDay === 0) { console.log('❌ Pas en période active, matin annulé'); return; }

  const todayQuestions = questions.filter(q => q.day === currentDay);
  const prefix = TEST_MODE ? '🧪 [MODE TEST] ' : '';
  const message = `${prefix}# 🎄 Jour ${currentDay} - Nouvelles Questions ! 🎄

**4 nouvelles questions sont disponibles :**

🧭 **Navigation aérienne** - Question ${todayQuestions[0]?.id ?? '—'}
🎧 **Contrôle aérien** - Question ${todayQuestions[1]?.id ?? '—'}
📜 **Réglementation** - Question ${todayQuestions[2]?.id ?? '—'}
🗺️ **Cartes aéronautiques** - Question ${todayQuestions[3]?.id ?? '—'}

⏰ Vous avez jusqu'à **23h30** pour répondre !
🎯 Bonne chance à tous ! ✈️`;

  try {
    console.log('[CRON] Envoi matin…', nowParis().toISOString());
    await sendDiscord(message);
    const data = await readData();
    const key = todayKey();
    data.flags[key] = data.flags[key] || {};
    data.flags[key].morning = true;
    await writeDataSafe(data);
    console.log('✅ Matin OK (jour %d)', currentDay);
  } catch (e) {
    console.error('❌ Erreur Discord matin:', e.message);
  }
}

// Soir (23:30)
async function sendEveningDiscordMessage() {
  const data = await readData();
  const currentDay = getCurrentDay();
  if (currentDay === 0) { console.log('❌ Pas en période active, soir annulé'); return; }

  const todayQuestions = questions.filter(q => q.day === currentDay);
  const leaderboard = data.users.map(u => {
    const score = calculateUserScore(u.username, data);
    const answersCount = data.answers.filter(a => a.username.toLowerCase() === u.username.toLowerCase()).length;
    return { username: u.username, score, answersCount };
  }).sort((a,b) => b.score - a.score);

  const prefix = TEST_MODE ? '🧪 [MODE TEST] ' : '';
  let message = `${prefix}# 📊 Résultats du Jour ${currentDay} 📊\n\n`;

  message += `## 🏆 Top 3 Général\n`;
  if (leaderboard.length >= 3) {
    message += `🥇 **${leaderboard[0].username}** - ${leaderboard[0].score} points\n`;
    message += `🥈 **${leaderboard[1].username}** - ${leaderboard[1].score} points\n`;
    message += `🥉 **${leaderboard[2].username}** - ${leaderboard[2].score} points\n`;
  } else if (leaderboard.length > 0) {
    const medals = ['🥇','🥈','🥉'];
    leaderboard.forEach((u,i) => message += `${medals[i] || '•'} **${u.username}** - ${u.score} points\n`);
  } else {
    message += `Aucun participant pour le moment 🎅\n`;
  }

  message += `\n## ✅ Réponses du Jour ${currentDay}\n`;
  todayQuestions.forEach(q => {
    message += `\n**Q${q.id} (${q.group}):** ${q.question.substring(0, 80)}${q.question.length > 80 ? '...' : ''}\n`;
    message += `||✓ Réponse: ${q.options[q.correctAnswer]}||\n`;
  });
  message += `\n🎄 Rendez-vous demain pour de nouvelles questions ! 🎄`;

  try {
    console.log('[CRON] Envoi soir…', nowParis().toISOString());
    await sendDiscord(message);
    const key = todayKey();
    data.flags[key] = data.flags[key] || {};
    data.flags[key].evening = true;
    await writeDataSafe(data);
    console.log('✅ Soir OK (jour %d)', currentDay);
  } catch (e) {
    console.error('❌ Erreur Discord soir:', e.message);
  }
}

// ====== ROUTES ADMIN TEST ======
app.post('/api/admin/test-morning', async (req, res) => {
  const { password } = req.body || {};
  if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Non autorisé' });
  await sendMorningDiscordMessage();
  res.json({ success: true, message: 'Message du matin envoyé' });
});

app.post('/api/admin/test-evening', async (req, res) => {
  const { password } = req.body || {};
  if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Non autorisé' });
  await sendEveningDiscordMessage();
  res.json({ success: true, message: 'Message du soir envoyé' });
});

app.get('/api/admin/cron-status', async (_req, res) => {
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

// ====== CRON JOBS (novembre) ======
cron.schedule('0 8 * 11 *',  () => sendMorningDiscordMessage(), { timezone: TZ });
cron.schedule('30 23 * 11 *', () => sendEveningDiscordMessage(), { timezone: TZ });
console.log('[CRON] Planifié (TZ=%s): 08:00 & 23:30 en novembre', TZ);

// ---------- Start ----------
async function startServer() {
  await initDataFile();
  app.listen(PORT, () => {
    const now = nowParis();
    console.log(`🚀 http://localhost:${PORT}`);
    console.log(`${TEST_MODE ? '🧪 MODE TEST' : '📅 PRODUCTION'}`);
    console.log(`📅 Jour simulé/actuel: ${getCurrentDay()}`);
    console.log(`⏰ Fenêtre: ${TEST_MODE && TEST_ALWAYS_OPEN ? 'Ouvert (test)' : '08:00–23:30'}`);
    console.log(`🔔 Crons actifs (TZ=${TZ}): 08:00 & 23:30 (novembre)`);
    console.log(`🕑 Heure ${TZ}: ${now.toLocaleTimeString('fr-FR')}`);
  });
}
startServer();
