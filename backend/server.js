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
import { questions } from './questions.js'; // ton fichier de questions

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// 🛡️ Secrets / Config via ENV (pas de dotenv requis sur Railway)
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;
const ADMIN_PASSWORD  = process.env.ADMIN_PASSWORD;
// Valeur par défaut si settings.timezone absent
const DEFAULT_TZ      = process.env.TZ || 'Europe/Paris';

const DATA_FILE       = path.join(__dirname, 'data.json');

// ✅ CORS : autorise ton front Netlify (configurable via CORS_ORIGINS)
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS ||
  'https://calendrier-de-l-avant-jtff.netlify.app'
).split(',').map(s => s.trim());

const corsOptions = {
  origin(origin, cb) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error('Origin not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

// ---------- Helpers stockage ----------
async function initDataFile() {
  try {
    await fs.access(DATA_FILE);
    const d = await readData();
    if (!d.selections) d.selections = {};
    if (!d.flags) d.flags = {};
    if (!d.settings) d.settings = defaultSettings();
    await writeDataSafe(d);
  } catch {
    await writeDataSafe({
      users: [],
      answers: [],
      selections: {},
      flags: {},
      settings: defaultSettings()
    });
  }
}
async function readData() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    const d = JSON.parse(raw);
    d.selections = d.selections || {};
    d.flags = d.flags || {};
    d.settings = normalizeSettings(d.settings);
    return d;
  } catch {
    return {
      users: [],
      answers: [],
      selections: {},
      flags: {},
      settings: defaultSettings()
    };
  }
}
async function writeDataSafe(obj) {
  const tmp = DATA_FILE + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(obj, null, 2), 'utf8');
  await fs.rename(tmp, DATA_FILE);
}

// ---------- Settings (admin) ----------
function defaultSettings() {
  return {
    timezone: DEFAULT_TZ,    // ex: 'Europe/Paris' ou 'Pacific/Noumea'
    months: [11],            // mois actifs (1..12) — par défaut NOVEMBRE
    morningTime: '08:00',    // HH:MM 24h
    eveningTime: '23:30'     // HH:MM 24h
  };
}
function normalizeSettings(s) {
  const base = defaultSettings();
  if (!s || typeof s !== 'object') return base;
  const tz = String(s.timezone || base.timezone);
  const months = Array.isArray(s.months) && s.months.length
    ? s.months.map(n => Number(n)).filter(n => n >= 1 && n <= 12)
    : base.months;
  const morning = isValidTime(s.morningTime) ? s.morningTime : base.morningTime;
  const evening = isValidTime(s.eveningTime) ? s.eveningTime : base.eveningTime;
  return { timezone: tz, months, morningTime: morning, eveningTime: evening };
}
function isValidTime(str) {
  return typeof str === 'string' && /^\d{2}:\d{2}$/.test(str) &&
         Number(str.slice(0,2)) <= 23 && Number(str.slice(3,5)) <= 59;
}
function splitTime(str) {
  const [hh, mm] = str.split(':').map(n => Number(n));
  return { hh, mm };
}

// ---------- Date/TZ util ----------
function nowInTZ(tz) {
  const s = new Date().toLocaleString('en-CA', { timeZone: tz });
  return new Date(s);
}
function todayKey(tz) {
  return nowInTZ(tz).toISOString().slice(0,10);
}

// Variables pour cron en mémoire
let morningTask = null;
let eveningTask = null;
let CURRENT_SETTINGS = defaultSettings();

// (Re)planifie les tâches cron selon CURRENT_SETTINGS
function scheduleCrons() {
  // Stopper anciennes tâches si présentes
  if (morningTask) { try { morningTask.stop(); } catch {} morningTask = null; }
  if (eveningTask) { try { eveningTask.stop(); } catch {} eveningTask = null; }

  const { timezone, months, morningTime, eveningTime } = CURRENT_SETTINGS;
  const monthsExpr = months.join(','); // ex: "11,12"
  const { hh: mh, mm: mmn } = splitTime(morningTime);
  const { hh: eh, mm: emn } = splitTime(eveningTime);

  // cron: min heure jour mois jourSemaine
  const morningCronExpr = `${mmn} ${mh} * ${monthsExpr} *`;
  const eveningCronExpr = `${emn} ${eh} * ${monthsExpr} *`;

  morningTask = cron.schedule(morningCronExpr, () => sendMorningDiscordMessage(), { timezone });
  eveningTask = cron.schedule(eveningCronExpr, () => sendEveningDiscordMessage(), { timezone });

  console.log(`[CRON] Replanifié (TZ=${timezone})`);
  console.log(`      • Matin  : ${morningTime}  (mois ${monthsExpr})`);
  console.log(`      • Soir   : ${eveningTime} (mois ${monthsExpr})`);
}

// ---------- Fenêtre & Jour courant ----------
function getCurrentDay() {
  if (TEST_MODE) return TEST_DAY;
  const { timezone, months } = CURRENT_SETTINGS;
  const now = nowInTZ(timezone);
  const month = now.getMonth() + 1;
  const dayOfMonth = now.getDate();
  if (months.includes(month) && dayOfMonth >= 1 && dayOfMonth <= 25) return dayOfMonth;
  return 0;
}
function isOpenHours() {
  if (TEST_MODE && TEST_ALWAYS_OPEN) return true;
  const { timezone, morningTime, eveningTime } = CURRENT_SETTINGS;
  const now = nowInTZ(timezone);
  const h = now.getHours(), m = now.getMinutes();
  const { hh: mh, mm: mmn } = splitTime(morningTime);
  const { hh: eh, mm: emn } = splitTime(eveningTime);

  // [morningTime, eveningTime)
  const afterMorning = (h > mh) || (h === mh && m >= mmn);
  const beforeEvening = (h < eh) || (h === eh && m < emn);
  return afterMorning && beforeEvening;
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

// Matin
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

⏰ Vous avez jusqu'à **${CURRENT_SETTINGS.eveningTime}** pour répondre !
🎯 Bonne chance à tous ! ✈️`;

  try {
    console.log('[CRON] Envoi matin…', nowInTZ(CURRENT_SETTINGS.timezone).toISOString());
    await sendDiscord(message);
    const data = await readData();
    const key = todayKey(CURRENT_SETTINGS.timezone);
    data.flags[key] = data.flags[key] || {};
    data.flags[key].morning = true;
    await writeDataSafe(data);
    console.log('✅ Matin OK (jour %d)', currentDay);
  } catch (e) {
    console.error('❌ Erreur Discord matin:', e.message);
  }
}

// Soir
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
    console.log('[CRON] Envoi soir…', nowInTZ(CURRENT_SETTINGS.timezone).toISOString());
    await sendDiscord(message);
    const key = todayKey(CURRENT_SETTINGS.timezone);
    data.flags[key] = data.flags[key] || {};
    data.flags[key].evening = true;
    await writeDataSafe(data);
    console.log('✅ Soir OK (jour %d)', currentDay);
  } catch (e) {
    console.error('❌ Erreur Discord soir:', e.message);
  }
}

// ====== ROUTE ADMIN : LOGIN (ajoutée) ======
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (ADMIN_PASSWORD && password === ADMIN_PASSWORD) {
    return res.json({ success: true });
  }
  return res.status(401).json({ error: 'Mot de passe incorrect' });
});

// ====== ROUTES ADMIN : SETTINGS ======
app.get('/api/admin/settings', async (req, res) => {
  const { password } = req.query;
  if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Non autorisé' });

  const data = await readData();
  res.json({
    settings: data.settings,
    runtime: {
      currentTZ: data.settings.timezone,
      now: nowInTZ(data.settings.timezone).toISOString(),
      monthsActive: data.settings.months,
      morningTime: data.settings.morningTime,
      eveningTime: data.settings.eveningTime
    }
  });
});

app.post('/api/admin/settings', async (req, res) => {
  const { password, timezone, months, morningTime, eveningTime } = req.body || {};
  if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Non autorisé' });

  const data = await readData();
  const s = { ...data.settings };

  if (timezone) s.timezone = String(timezone);
  if (months) {
    if (!Array.isArray(months) || months.length === 0) {
      return res.status(400).json({ error: 'months doit être un tableau non vide d’entiers 1..12' });
    }
    const clean = months.map(n => Number(n)).filter(n => n >= 1 && n <= 12);
    if (!clean.length) return res.status(400).json({ error: 'months invalide' });
    s.months = clean;
  }
  if (morningTime) {
    if (!isValidTime(morningTime)) return res.status(400).json({ error: 'morningTime invalide (HH:MM)' });
    s.morningTime = morningTime;
  }
  if (eveningTime) {
    if (!isValidTime(eveningTime)) return res.status(400).json({ error: 'eveningTime invalide (HH:MM)' });
    s.eveningTime = eveningTime;
  }

  data.settings = normalizeSettings(s);
  await writeDataSafe(data);

  // mettre à jour la config en mémoire et replanifier
  CURRENT_SETTINGS = data.settings;
  scheduleCrons();

  res.json({ success: true, settings: CURRENT_SETTINGS });
});

// ====== ROUTES ADMIN : TESTS ======
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
app.post('/api/admin/test-discord', async (req, res) => {
  const { password } = req.body || {};
  if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Non autorisé' });
  try {
    await sendDiscord('# 🧪 Test Discord — webhook OK');
    res.json({ success: true, message: 'Message de test envoyé' });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
app.get('/api/admin/cron-status', async (_req, res) => {
  const data = await readData();
  const key = todayKey(CURRENT_SETTINGS.timezone);
  const flags = data.flags[key] || {};
  res.json({
    now: nowInTZ(CURRENT_SETTINGS.timezone).toISOString(),
    todayKey: key,
    sentMorning: !!flags.morning,
    sentEvening: !!flags.evening,
    timezone: CURRENT_SETTINGS.timezone,
    months: CURRENT_SETTINGS.months,
    morningTime: CURRENT_SETTINGS.morningTime,
    eveningTime: CURRENT_SETTINGS.eveningTime,
    testMode: TEST_MODE
  });
});

// ====== API existantes ======
app.get('/api/questions/today', async (req, res) => {
  const currentDay = getCurrentDay();
  if (currentDay === 0) {
    return res.json({
      available: false,
      message: 'Le calendrier n’est pas en période active.'
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

app.post('/api/user', async (req, res) => {
  const { username } = req.body || {};
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

app.post('/api/answer', async (req, res) => {
  const { username, questionId, answer } = req.body || {};
  if (!username || questionId === undefined || answer === undefined) {
    return res.status(400).json({ error: 'Données manquantes' });
  }
  const data = await readData();
  const user = data.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

  const q = questions.find(q => q.id === questionId);
  if (!q) return res.status(404).json({ error: 'Question non trouvée' });

  const exists = data.answers.find(a => a.username.toLowerCase() === username.toLowerCase() && a.questionId === questionId);
  if (exists) return res.status(400).json({ error: 'Vous avez déjà répondu à cette question' });

  data.answers.push({
    username: username.toLowerCase(),
    questionId,
    answer,
    answeredAt: new Date().toISOString()
  });
  await writeDataSafe(data);

  const isCorrect = answer === q.correctAnswer;
  const score = calculateUserScore(username, data);
  res.json({ success: true, isCorrect, score });
});

app.get('/api/leaderboard', async (_req, res) => {
  const data = await readData();
  const leaderboard = data.users.map(u => {
    const score = calculateUserScore(u.username, data);
    const answersCount = data.answers.filter(a => a.username.toLowerCase() === u.username.toLowerCase()).length;
    return { username: u.username, score, answersCount };
  }).sort((a,b) => (b.score - a.score) || (a.answersCount - b.answersCount));
  res.json(leaderboard);
});

// ---------- Démarrage ----------
async function startServer() {
  await initDataFile();
  // Charger settings en mémoire, puis planifier
  const d = await readData();
  CURRENT_SETTINGS = d.settings;
  scheduleCrons();

  app.listen(PORT, () => {
    const now = nowInTZ(CURRENT_SETTINGS.timezone);
    console.log(`🚀 http://localhost:${PORT}`);
    console.log(`${TEST_MODE ? '🧪 MODE TEST' : '📅 PRODUCTION'}`);
    console.log(`🗺️  TZ: ${CURRENT_SETTINGS.timezone} | Mois actifs: ${CURRENT_SETTINGS.months.join(',')}`);
    console.log(`⏰ Matin: ${CURRENT_SETTINGS.morningTime} | Soir: ${CURRENT_SETTINGS.eveningTime}`);
    console.log(`📅 Jour simulé/actuel: ${getCurrentDay()}`);
    console.log(`🕑 Heure locale: ${now.toLocaleTimeString('fr-FR')}`);
  });
}
startServer();
