import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ⚠️ Assure-toi que Netlify a bien VITE_API_BASE_URL = https://<ton-backend>.railway.app
const API_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL || // fallback éventuel
  "https://calendrier-avant-jtff-production.up.railway.app";

export default function AdminPage() {
  const nav = useNavigate();

  const [password, setPassword] = useState("");
  const [isAuth, setIsAuth] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // DATA existantes
  const [data, setData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  // SETTINGS
  const [settings, setSettings] = useState(null);
  const [cronStatus, setCronStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  // --------- bootstrap : si mot de passe en localStorage, on tente un vrai login d’abord
  useEffect(() => {
    const saved = localStorage.getItem("adminAuth");
    if (saved) {
      setPassword(saved);
      doLogin(saved, true);
    }
  }, []);

  // --------- helpers API
  const doLogin = async (pwd, silent = false) => {
    try {
      if (!silent) setMessage("⏳ Connexion…");
      const r = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd }),
      });
      if (!r.ok) {
        setIsAuth(false);
        if (!silent) setMessage("❌ Mot de passe incorrect");
        return;
      }
      setIsAuth(true);
      localStorage.setItem("adminAuth", pwd);
      if (!silent) setMessage("✅ Connecté");
      // charge tout une fois loggé
      await Promise.all([fetchSettings(pwd), fetchData(pwd), fetchCronStatus()]);
    } catch (e) {
      setIsAuth(false);
      setMessage("❌ Erreur réseau pendant la connexion");
    }
  };

  const fetchSettings = async (pwd = password) => {
    try {
      const r = await fetch(`${API_URL}/api/admin/settings?password=${pwd}`);
      if (r.status === 401) {
        setMessage("❌ Non autorisé — merci de saisir à nouveau le mot de passe.");
        setIsAuth(false);
        return;
      }
      const j = await r.json();
      setSettings(j.settings);
    } catch {
      setMessage("❌ Erreur lors du chargement des paramètres");
    }
  };

  const fetchCronStatus = async () => {
    try {
      const r = await fetch(`${API_URL}/api/admin/cron-status`);
      const j = await r.json();
      setCronStatus(j);
    } catch {
      // silencieux
    }
  };

  const fetchData = async (pwd = password) => {
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/api/admin/data?password=${pwd}`);
      if (r.status === 401) {
        setMessage("❌ Non autorisé — merci de saisir à nouveau le mot de passe.");
        setIsAuth(false);
        setLoading(false);
        return;
      }
      const j = await r.json();
      setData(j);
    } catch {
      setMessage("❌ Erreur lors du chargement des données");
    }
    setLoading(false);
  };

  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    setMessage("⏳ Sauvegarde…");
    try {
      const r = await fetch(`${API_URL}/api/admin/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          timezone: settings.timezone,
          months: settings.months,
          morningTime: settings.morningTime,
          eveningTime: settings.eveningTime,
        }),
      });
      const j = await r.json();
      if (!r.ok) {
        if (r.status === 401) {
          setIsAuth(false);
          setMessage("❌ Non autorisé — mot de passe invalide.");
        } else {
          setMessage("❌ " + (j.error || "Erreur lors de la sauvegarde"));
        }
      } else {
        setSettings(j.settings);
        setMessage("✅ Paramètres sauvegardés et crons replanifiés");
        fetchCronStatus();
      }
    } catch {
      setMessage("❌ Erreur réseau lors de la sauvegarde");
    }
    setSaving(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    setIsAuth(false);
    setPassword("");
    setData(null);
    setSettings(null);
    setCronStatus(null);
    setSelectedUser(null);
    setUserDetails(null);
    setMessage("Déconnecté.");
    nav("/");
  };

  const fetchUserDetails = async (username) => {
    setLoading(true);
    try {
      const r = await fetch(
        `${API_URL}/api/admin/user/${username}?password=${password}`
      );
      if (r.status === 401) {
        setIsAuth(false);
        setMessage("❌ Non autorisé — merci de saisir à nouveau le mot de passe.");
        setLoading(false);
        return;
      }
      const j = await r.json();
      setUserDetails(j);
      setSelectedUser(username);
    } catch {
      setMessage("❌ Erreur lors du chargement du joueur");
    }
    setLoading(false);
  };

  const handleDeleteUser = async (username) => {
    if (!confirm(`Supprimer ${username} ?`)) return;
    try {
      const r = await fetch(
        `${API_URL}/api/admin/user/${username}?password=${password}`,
        { method: "DELETE" }
      );
      if (r.status === 401) {
        setIsAuth(false);
        setMessage("❌ Non autorisé — merci de vous reconnecter.");
        return;
      }
      if (r.ok) {
        setMessage(`✅ ${username} supprimé`);
        fetchData(password);
        if (selectedUser === username) {
          setSelectedUser(null);
          setUserDetails(null);
        }
      } else {
        setMessage("❌ Erreur lors de la suppression");
      }
    } catch {
      setMessage("❌ Erreur lors de la suppression");
    }
  };

  const handleResetAll = async () => {
    if (!confirm("⚠️ Supprimer TOUS les participants ?")) return;
    try {
      const r = await fetch(`${API_URL}/api/admin/reset-all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (r.status === 401) {
        setIsAuth(false);
        setMessage("❌ Non autorisé — reconnecte-toi.");
        return;
      }
      if (r.ok) {
        setMessage("✅ Tous les participants ont été supprimés");
        fetchData(password);
      } else {
        setMessage("❌ Erreur lors de la réinitialisation");
      }
    } catch {
      setMessage("❌ Erreur réseau lors de la réinitialisation");
    }
  };

  const testDiscord = async (type) => {
    setMessage("⏳ Test en cours…");
    try {
      const url =
        type === "simple"
          ? `${API_URL}/api/admin/test-discord`
          : type === "morning"
          ? `${API_URL}/api/admin/test-morning`
          : `${API_URL}/api/admin/test-evening`;
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const j = await r.json();
      if (!r.ok) {
        if (r.status === 401) {
          setIsAuth(false);
          setMessage("❌ Non autorisé — reconnecte-toi.");
        } else {
          setMessage("❌ " + (j.error || "Erreur"));
        }
      } else {
        setMessage("✅ " + (j.message || "OK"));
      }
    } catch {
      setMessage("❌ Erreur réseau pendant le test");
    }
  };

  // ---------- UI ----------
  if (!isAuth) {
    return (
      <Screen>
        <Card>
          <Header>
            <Title>🔐 Admin</Title>
          </Header>
          <p style={{ marginBottom: 10 }}>
            Entre le <b>mot de passe admin</b> pour accéder au panneau.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              type="password"
              placeholder="Mot de passe admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={input}
            />
            <button onClick={() => doLogin(password)} style={btnPrimary}>
              Se connecter
            </button>
          </div>
          {message && <Alert>{message}</Alert>}
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <Card>
        <Header>
          <Title>📊 Dashboard Admin</Title>
          <button onClick={handleLogout} style={btnDanger}>
            Déconnexion
          </button>
        </Header>

        {message && <Alert error={message.startsWith("❌")}>{message}</Alert>}

        {/* Paramètres d’automatisation */}
        <Block title="⚙️ Paramètres d’automatisation (cron)">
          {!settings ? (
            <p>Chargement des paramètres…</p>
          ) : (
            <>
              <div style={grid3}>
                <div>
                  <Label>Fuseau horaire</Label>
                  <input
                    value={settings.timezone}
                    onChange={(e) =>
                      setSettings({ ...settings, timezone: e.target.value })
                    }
                    placeholder="Europe/Paris"
                    style={input}
                    list="tz-hints"
                  />
                  <datalist id="tz-hints">
                    <option value="Europe/Paris" />
                    <option value="Pacific/Noumea" />
                    <option value="UTC" />
                    <option value="Europe/London" />
                    <option value="America/New_York" />
                  </datalist>
                </div>

                <div>
                  <Label>Heure publication (matin)</Label>
                  <input
                    type="time"
                    value={settings.morningTime}
                    onChange={(e) =>
                      setSettings({ ...settings, morningTime: e.target.value })
                    }
                    style={input}
                  />
                </div>

                <div>
                  <Label>Heure résultats (soir)</Label>
                  <input
                    type="time"
                    value={settings.eveningTime}
                    onChange={(e) =>
                      setSettings({ ...settings, eveningTime: e.target.value })
                    }
                    style={input}
                  />
                </div>
              </div>

              <div style={{ marginTop: 10 }}>
                <Label>Mois actifs</Label>
                <div style={monthsGrid}>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map((m) => (
                    <label key={m} style={{ display: "flex", gap: 6 }}>
                      <input
                        type="checkbox"
                        checked={settings.months.includes(m)}
                        onChange={() => {
                          const included = settings.months.includes(m);
                          const months = included
                            ? settings.months.filter((x) => x !== m)
                            : [...settings.months, m].sort((a, b) => a - b);
                          setSettings({ ...settings, months });
                        }}
                      />
                      {m.toString().padStart(2, "0")}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button onClick={saveSettings} disabled={saving} style={btnSuccess}>
                  💾 Sauvegarder & replanifier
                </button>
                <button onClick={() => fetchSettings()} style={btnGhost}>
                  🔄 Recharger
                </button>
                <button onClick={fetchCronStatus} style={btnGhost}>
                  ⏱️ Statut Cron
                </button>
              </div>

              {cronStatus && (
                <div style={{ marginTop: 12, fontSize: "0.95rem" }}>
                  <div>Now: {new Date(cronStatus.now).toLocaleString("fr-FR")}</div>
                  <div>TZ: {cronStatus.timezone}</div>
                  <div>Mois: {Array.isArray(cronStatus.months) ? cronStatus.months.join(", ") : "—"}</div>
                  <div>
                    Horaires: matin {cronStatus.morningTime} / soir {cronStatus.eveningTime}
                  </div>
                  <div>
                    Flags du jour: matin={String(cronStatus.sentMorning)} / soir={String(cronStatus.sentEvening)}
                  </div>
                  {cronStatus.testMode && <div>🧪 TEST_MODE actif</div>}
                </div>
              )}
            </>
          )}
        </Block>

        {/* Tests Discord */}
        <Block title="🔔 Tests Discord">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button style={btnGhost} onClick={() => testDiscord("simple")}>🧪 Test simple</button>
            <button style={btnGhost} onClick={() => testDiscord("morning")}>🌅 Message matin</button>
            <button style={btnGhost} onClick={() => testDiscord("evening")}>🌙 Message soir</button>
          </div>
        </Block>

        {/* Stats globales + joueurs si tu le veux (facultatif) */}
        {loading ? (
          <p>⏳ Chargement…</p>
        ) : data ? (
          <>
            <Block title="👥 Participants">
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8f9fa" }}>
                      <th style={th}>Pseudo</th>
                      <th style={th}>Score</th>
                      <th style={th}>Inscription</th>
                      <th style={th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.allUsers
                      .sort((a, b) => b.score - a.score)
                      .map((u, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                          <td style={td}>{u.username}</td>
                          <td style={{ ...td, textAlign: "center", color: "#667eea", fontWeight: "bold" }}>
                            {u.score}
                          </td>
                          <td style={{ ...td, textAlign: "center" }}>
                            {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                          </td>
                          <td style={{ ...td, textAlign: "center" }}>
                            <button
                              onClick={() => fetchUserDetails(u.username)}
                              style={btnSmall}
                            >
                              📊 Détails
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.username)}
                              style={{ ...btnSmall, background: "#e74c3c" }}
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Block>
          </>
        ) : null}
      </Card>
    </Screen>
  );
}

/* ---------- styles rapides ---------- */
const Screen = ({ children }) => (
  <div
    style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: 20,
    }}
  >
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        background: "white",
        borderRadius: 20,
        padding: 32,
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
      }}
    >
      {children}
    </div>
  </div>
);

const Card = ({ children }) => <div>{children}</div>;
const Header = ({ children }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
    {children}
  </div>
);
const Title = ({ children }) => <h1 style={{ margin: 0 }}>{children}</h1>;
const Block = ({ title, children }) => (
  <div style={{ marginTop: 20, padding: 16, borderRadius: 12, background: "linear-gradient(135deg,#1e3c72,#2a5298)", color: "white" }}>
    <h2 style={{ marginTop: 0 }}>{title}</h2>
    <div style={{ background: "white", color: "#222", borderRadius: 8, padding: 16 }}>{children}</div>
  </div>
);

const Label = ({ children }) => (
  <div style={{ fontWeight: "bold", marginBottom: 6 }}>{children}</div>
);

const input = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #ddd",
  boxSizing: "border-box",
};

const btnPrimary = {
  padding: "10px 14px",
  background: "#667eea",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: "bold",
};
const btnSuccess = { ...btnPrimary, background: "#22c55e" };
const btnDanger = { ...btnPrimary, background: "#e74c3c" };
const btnGhost = {
  padding: "10px 14px",
  background: "rgba(0,0,0,0.05)",
  border: "1px solid #ddd",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: "bold",
};
const btnSmall = { ...btnPrimary, padding: "6px 10px", fontSize: "0.9rem" };

const grid3 = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
};

const monthsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(6, 1fr)",
  gap: 8,
};

const th = { padding: 12, textAlign: "left" };
const td = { padding: 12 };

const Alert = ({ children, error }) => (
  <div
    style={{
      marginTop: 12,
      padding: 12,
      borderRadius: 8,
      background: error ? "#fee" : "#eef7ee",
      border: `1px solid ${error ? "#e74c3c" : "#2ecc71"}`,
      color: error ? "#e74c3c" : "#2e7d32",
    }}
  >
    {children}
  </div>
);
