import { useState, useRef, useEffect } from "react";

const AGENTS = [
  {
    id: "research", name: "Agent Recherche", icon: "🔍",
    description: "Valide la niche & analyse le marché", color: "#00ffd5",
    systemPrompt: `Tu es un expert en marketing digital. Analyse cette niche pour un ebook.
Réponds UNIQUEMENT en JSON valide:
{
  "validation": "GO ou NO-GO",
  "score_marche": "note sur 10",
  "audience_cible": "description précise",
  "probleme_resolu": "problème principal résolu",
  "concurrence": "faible/moyenne/forte",
  "prix_recommande": "fourchette en euros",
  "angle_unique": "proposition de valeur unique",
  "mots_cles": ["mot1", "mot2", "mot3", "mot4", "mot5"],
  "verdict": "2-3 phrases de conclusion"
}`
  },
  {
    id: "plan", name: "Agent Structure", icon: "📋",
    description: "Crée le plan détaillé — 5 à 7 chapitres", color: "#a78bfa",
    systemPrompt: `Tu es un expert en création d'ebooks. Crée un plan complet avec 5 à 7 chapitres.
Réponds UNIQUEMENT en JSON valide:
{
  "titre_principal": "titre accrocheur",
  "sous_titre": "sous-titre qui vend",
  "promesse": "la promesse principale",
  "nb_pages_estimees": "nombre",
  "chapitres": [
    {
      "numero": 1,
      "titre": "titre du chapitre",
      "objectif": "ce que le lecteur apprend",
      "sections": ["section1", "section2", "section3"],
      "exercice_pratique": "exercice concret"
    }
  ],
  "bonus_inclus": ["bonus1", "bonus2"],
  "resultats_attendus": ["résultat1", "résultat2", "résultat3"]
}
IMPORTANT: Crée exactement 5 chapitres.`
  },
  {
    id: "content", name: "Agent Contenu", icon: "✍️",
    description: "Rédige l'ebook COMPLET — tous les chapitres", color: "#fb923c",
    systemPrompt: `Tu es un auteur expert. Tu rédiges un ebook COMPLET avec TOUS les chapitres du plan fourni.
Réponds UNIQUEMENT en JSON valide:
{
  "introduction": {
    "hook": "phrase d'accroche puissante",
    "histoire": "anecdote d'introduction (100 mots)",
    "promesse": "ce que le lecteur va obtenir",
    "mode_emploi": "comment utiliser cet ebook"
  },
  "chapitres": [
    {
      "numero": 1,
      "titre": "titre exact du chapitre",
      "contenu": "contenu complet du chapitre (300 mots minimum avec exemples concrets et conseils pratiques)",
      "points_cles": ["point1", "point2", "point3"],
      "exercice": "exercice pratique actionnable",
      "citation": "citation inspirante"
    }
  ],
  "conclusion": {
    "resume": "résumé des apprentissages (80 mots)",
    "prochaines_etapes": ["étape1", "étape2", "étape3"],
    "mot_de_fin": "message de clôture (60 mots)"
  }
}
IMPORTANT: Génère UN objet dans chapitres pour CHAQUE chapitre du plan. Tous les chapitres doivent être rédigés.`
  },
  {
    id: "marketing", name: "Agent Marketing", icon: "🎯",
    description: "Page de vente & séquence emails", color: "#f472b6",
    systemPrompt: `Tu es un expert copywriter. Crée les assets marketing complets.
Réponds UNIQUEMENT en JSON valide:
{
  "page_de_vente": {
    "headline": "titre ultra-accrocheur",
    "sous_headline": "sous-titre avec promesse",
    "probleme": "description du problème (80 mots)",
    "solution": "présentation solution (80 mots)",
    "benefices": ["bénéfice1", "bénéfice2", "bénéfice3", "bénéfice4", "bénéfice5"],
    "preuve_sociale": "témoignage fictif crédible",
    "offre": "description de l'offre complète",
    "cta_principal": "texte du bouton d'achat",
    "garantie": "texte de garantie"
  },
  "email_sequence": [
    { "jour": 0, "sujet": "objet email", "corps": "corps email (120 mots)" },
    { "jour": 3, "sujet": "objet email", "corps": "corps email (120 mots)" },
    { "jour": 7, "sujet": "objet email", "corps": "corps email (120 mots)" }
  ],
  "posts_reseaux": {
    "linkedin": "post LinkedIn (150 mots)",
    "instagram_caption": "caption Instagram avec emojis",
    "twitter_thread": ["tweet1", "tweet2", "tweet3"]
  }
}`
  },
  {
    id: "cover", name: "Agent Visuel", icon: "🖼️",
    description: "Prompt DALL-E & stratégie prix", color: "#34d399",
    systemPrompt: `Tu es un expert en design et pricing d'ebooks.
Réponds UNIQUEMENT en JSON valide:
{
  "prompt_dalle": "prompt détaillé en anglais pour DALL-E (style, couleurs, éléments, typography, mood)",
  "prompt_dalle_fr": "même prompt en français",
  "palette_couleurs": ["#couleur1", "#couleur2", "#couleur3"],
  "style_visuel": "description du style recommandé",
  "strategie_prix": {
    "prix_lancement": "chiffre uniquement ex: 17",
    "prix_normal": "chiffre uniquement ex: 27",
    "prix_premium_bundle": "chiffre uniquement ex: 47",
    "justification": "pourquoi ces prix"
  },
  "plateformes_recommandees": [
    {"nom": "plateforme", "commission": "pourcentage", "avantage": "avantage principal"}
  ],
  "checklist_lancement": ["étape1", "étape2", "étape3", "étape4", "étape5"]
}`
  },
  {
    id: "publish", name: "Agent Publication", icon: "🚀",
    description: "Publie automatiquement sur Gumroad", color: "#ff6b6b",
    systemPrompt: `Tu es un expert en publication sur Gumroad.
Réponds UNIQUEMENT en JSON valide:
{
  "gumroad_name": "nom produit optimisé (max 100 chars)",
  "gumroad_description": "description HTML avec <h2><p><ul><li><strong> (min 250 mots)",
  "gumroad_price_cents": "prix en centimes ex: 1700",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "resume_produit": "résumé de ce qui a été créé"
}`
  }
];

const AgentCard = ({ agent, status, onClick }) => (
  <div onClick={status === "done" ? onClick : undefined} style={{
    border: `1px solid ${status === "idle" ? "#1a1a2e" : status === "error" ? "#ef4444" : agent.color}`,
    background: "#0d0d1a", opacity: status === "idle" ? 0.5 : 1,
    borderRadius: 12, padding: "13px 16px", cursor: status === "done" ? "pointer" : "default",
    transition: "all 0.3s", position: "relative", overflow: "hidden",
    boxShadow: status !== "idle" ? `0 0 20px ${agent.color}18` : "none"
  }}>
    {status === "running" && (
      <div style={{ position: "absolute", top: 0, left: 0, height: 2, width: "60%", background: `linear-gradient(90deg, transparent, ${agent.color})`, animation: "shimmer 1.2s infinite" }} />
    )}
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 20 }}>{agent.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 12, fontFamily: "monospace" }}>{agent.name}</div>
        <div style={{ color: "#4a4a6a", fontSize: 11, marginTop: 1 }}>{agent.description}</div>
      </div>
      <div style={{
        width: 8, height: 8, borderRadius: "50%",
        background: status === "done" ? agent.color : status === "running" ? agent.color : status === "error" ? "#ef4444" : "#1e1e3a",
        boxShadow: status === "running" ? `0 0 10px ${agent.color}` : "none",
        animation: status === "running" ? "blink 0.8s infinite" : "none"
      }} />
    </div>
    {status === "done" && <div style={{ color: agent.color, fontSize: 10, marginTop: 5, fontFamily: "monospace" }}>✓ Terminé — cliquer pour voir</div>}
  </div>
);

const ResultModal = ({ agent, data, onClose }) => {
  const renderValue = (val, depth = 0) => {
    if (Array.isArray(val)) return (
      <div style={{ paddingLeft: depth > 0 ? 14 : 0 }}>
        {val.map((item, i) => (
          <div key={i} style={{ marginBottom: 5 }}>
            {typeof item === "object" ? (
              <div style={{ background: "#07070f", border: "1px solid #1a1a2e", borderRadius: 8, padding: 10, marginBottom: 5 }}>
                {Object.entries(item).map(([k, v]) => (
                  <div key={k} style={{ marginBottom: 4 }}>
                    <span style={{ color: agent.color, fontSize: 11, fontFamily: "monospace" }}>{k}: </span>
                    <span style={{ color: "#c4c4d4", fontSize: 12 }}>{typeof v === "string" ? v : JSON.stringify(v)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ color: agent.color }}>▸</span>
                <span style={{ color: "#c4c4d4", fontSize: 13 }}>{item}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
    if (typeof val === "object" && val !== null) return (
      <div style={{ paddingLeft: 12, borderLeft: `2px solid ${agent.color}33`, marginTop: 4 }}>
        {Object.entries(val).map(([k, v]) => (
          <div key={k} style={{ marginBottom: 8 }}>
            <div style={{ color: agent.color, fontSize: 11, fontFamily: "monospace", marginBottom: 3 }}>{k}</div>
            {renderValue(v, depth + 1)}
          </div>
        ))}
      </div>
    );
    return <div style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{String(val)}</div>;
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000dd", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#0d0d1a", border: `1px solid ${agent.color}`, borderRadius: 16, padding: 24,
        maxWidth: 700, width: "100%", maxHeight: "85vh", overflow: "auto", boxShadow: `0 0 50px ${agent.color}25`
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 22 }}>{agent.icon}</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontFamily: "monospace" }}>{agent.name}</div>
              <div style={{ color: agent.color, fontSize: 11 }}>Résultats complets</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "#1a1a2e", border: "none", color: "#888", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12 }}>✕ Fermer</button>
        </div>
        {Object.entries(data).map(([key, val]) => (
          <div key={key} style={{ marginBottom: 14, padding: 14, background: "#070710", borderRadius: 10, border: "1px solid #1a1a2e" }}>
            <div style={{ color: agent.color, fontSize: 11, fontFamily: "monospace", fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{key.replace(/_/g, " ")}</div>
            {renderValue(val)}
          </div>
        ))}
      </div>
    </div>
  );
};

const GumroadPanel = ({ results, gumroadToken, setGumroadToken }) => {
  const [status, setStatus] = useState("idle");
  const [productUrl, setProductUrl] = useState(null);
  const [error, setError] = useState(null);

  const publish = async () => {
    if (!gumroadToken.trim()) { setError("Token Gumroad requis !"); return; }
    setStatus("loading"); setError(null);
    const pub = results.publish;
    let priceCents = parseInt(pub?.gumroad_price_cents) || 0;
    if (!priceCents && results.cover?.strategie_prix?.prix_lancement) priceCents = parseInt(results.cover.strategie_prix.prix_lancement) * 100;
    if (!priceCents) priceCents = 1700;
    try {
      const body = new URLSearchParams();
      body.append("access_token", gumroadToken.trim());
      body.append("name", pub?.gumroad_name || results.plan?.titre_principal || "Mon Ebook");
      body.append("price", priceCents);
      body.append("description", pub?.gumroad_description || "");
      body.append("published", "false");
      if (pub?.tags) pub.tags.forEach(t => body.append("tags[]", t));
      const res = await fetch("https://api.gumroad.com/v2/products", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() });
      const data = await res.json();
      if (data.success) { setProductUrl(data.product?.short_url || `https://app.gumroad.com/products/${data.product?.id}`); setStatus("success"); }
      else { setError(data.message || "Erreur Gumroad"); setStatus("error"); }
    } catch (e) { setError("Erreur : " + e.message); setStatus("error"); }
  };

  return (
    <div style={{ marginTop: 24, background: "#0d0d1a", border: "1px solid #ff6b6b", borderRadius: 16, padding: 22, boxShadow: "0 0 30px #ff6b6b18" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <span style={{ fontSize: 22 }}>🚀</span>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontFamily: "monospace", fontSize: 13 }}>AGENT PUBLICATION — GUMROAD</div>
          <div style={{ color: "#ff6b6b", fontSize: 11 }}>Publication automatique de ton ebook</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
        {[
          { label: "Titre produit", val: results.publish?.gumroad_name || results.plan?.titre_principal },
          { label: "Prix (centimes)", val: results.publish?.gumroad_price_cents || "—" },
          { label: "Statut initial", val: "Brouillon (draft)" },
        ].map((item, i) => (
          <div key={i} style={{ background: "#070710", borderRadius: 10, padding: 12, border: "1px solid #1a1a2e" }}>
            <div style={{ color: "#555", fontSize: 10, marginBottom: 4 }}>{item.label}</div>
            <div style={{ color: "#ff6b6b", fontSize: 12, fontWeight: 700, wordBreak: "break-all" }}>{item.val || "—"}</div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ color: "#555", fontSize: 11, marginBottom: 6, fontFamily: "monospace" }}>
          GUMROAD ACCESS TOKEN &nbsp;
          <a href="https://app.gumroad.com/settings/advanced" target="_blank" rel="noreferrer" style={{ color: "#ff6b6b", fontSize: 10, textDecoration: "underline" }}>→ Obtenir mon token</a>
        </div>
        <input type="password" value={gumroadToken} onChange={e => setGumroadToken(e.target.value)} placeholder="Colle ton token Gumroad ici..."
          style={{ width: "100%", background: "#070710", border: "1px solid #1a1a2e", borderRadius: 10, padding: "11px 16px", color: "#fff", fontSize: 13, fontFamily: "monospace", boxSizing: "border-box", outline: "none" }} />
        <div style={{ color: "#333", fontSize: 10, marginTop: 5 }}>🔒 Envoyé directement à Gumroad — jamais stocké</div>
      </div>
      {error && <div style={{ background: "#1a0a0a", border: "1px solid #ef4444", borderRadius: 8, padding: "10px 14px", color: "#ef4444", fontSize: 12, marginBottom: 14 }}>⚠️ {error}</div>}
      {status === "success" && productUrl && (
        <div style={{ background: "#0a1a0a", border: "1px solid #34d399", borderRadius: 12, padding: 16, marginBottom: 14 }}>
          <div style={{ color: "#34d399", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>✅ Produit créé en brouillon sur Gumroad !</div>
          <div style={{ color: "#666", fontSize: 11, marginBottom: 10 }}>Ajoute ton PDF sur Gumroad puis clique Publish.</div>
          <a href={productUrl} target="_blank" rel="noreferrer" style={{ display: "inline-block", background: "#34d399", color: "#000", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>→ Voir sur Gumroad</a>
        </div>
      )}
      <button onClick={publish} disabled={status === "loading" || status === "success"} style={{
        width: "100%", background: status === "success" ? "#1a1a2e" : status === "loading" ? "#1a1a2e" : "linear-gradient(135deg, #ff6b6b, #ff4757)",
        border: "none", borderRadius: 10, padding: "13px",
        color: status === "success" ? "#34d399" : status === "loading" ? "#ff6b6b" : "#fff",
        fontWeight: 700, fontSize: 13, cursor: status === "loading" || status === "success" ? "not-allowed" : "pointer", fontFamily: "monospace"
      }}>
        {status === "loading" ? "⏳ Publication..." : status === "success" ? "✅ Publié !" : "🚀 PUBLIER SUR GUMROAD"}
      </button>
    </div>
  );
};

export default function App() {
  const [niche, setNiche] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [gumroadToken, setGumroadToken] = useState("");
  const [running, setRunning] = useState(false);
  const [agentStatus, setAgentStatus] = useState({});
  const [agentResults, setAgentResults] = useState({});
  const [logs, setLogs] = useState([]);
  const [modalAgent, setModalAgent] = useState(null);
  const [showGumroad, setShowGumroad] = useState(false);
  const logsEndRef = useRef(null);

  useEffect(() => { logsEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);
  const addLog = (msg, color = "#555") => setLogs(prev => [...prev, { msg, color, time: new Date().toLocaleTimeString() }]);

  const callOpenAI = async (agent, context) => {
    const userPrompt = `Niche/Sujet: "${niche}"
${context ? `\nContexte des agents précédents:\n${JSON.stringify(context, null, 2)}` : ""}
Génère les résultats. Réponds UNIQUEMENT avec du JSON valide, sans markdown, sans backticks.`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 4000,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: agent.systemPrompt },
          { role: "user", content: userPrompt }
        ]
      })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    const text = data.choices?.[0]?.message?.content || "";
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  };

  const runPipeline = async () => {
    if (!niche.trim() || !apiKey.trim()) return;
    setRunning(true); setAgentStatus({}); setAgentResults({}); setLogs([]); setShowGumroad(false);
    addLog("🚀 Démarrage du pipeline...", "#fff");
    addLog(`📌 Niche : "${niche}"`, "#a78bfa");
    let context = {};
    for (let i = 0; i < AGENTS.length; i++) {
      const agent = AGENTS[i];
      setAgentStatus(prev => ({ ...prev, [agent.id]: "running" }));
      addLog(`\n⚡ ${agent.icon} ${agent.name}...`, agent.color);
      try {
        const result = await callOpenAI(agent, i > 0 ? context : null);
        context[agent.id] = result;
        setAgentResults(prev => ({ ...prev, [agent.id]: result }));
        setAgentStatus(prev => ({ ...prev, [agent.id]: "done" }));
        const nbChapitres = result.chapitres?.length;
        const extra = nbChapitres ? ` — ${nbChapitres} chapitres générés` : "";
        addLog(`  ✓ Terminé${extra}`, agent.color);
      } catch (e) {
        setAgentStatus(prev => ({ ...prev, [agent.id]: "error" }));
        addLog(`  ✗ Erreur: ${e.message}`, "#ef4444");
      }
    }
    setShowGumroad(true);
    addLog("\n🎉 Pipeline complet ! Ebook entier généré.", "#00ffd5");
    setRunning(false);
  };

  const completedCount = Object.values(agentStatus).filter(s => s === "done").length;
  const progress = (completedCount / AGENTS.length) * 100;

  return (
    <div style={{ minHeight: "100vh", background: "#070710", fontFamily: "'Space Mono', monospace", padding: "24px 18px", color: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        @keyframes shimmer { 0%{transform:translateX(-200%)} 100%{transform:translateX(400%)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        input { outline: none !important; }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#070710} ::-webkit-scrollbar-thumb{background:#1a1a2e}
      `}</style>

      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: "linear-gradient(135deg, #00ffd5, #ff6b6b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⚡</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: 1 }}>EBOOK AGENT PIPELINE</h1>
            <div style={{ color: "#3a3a5a", fontSize: 11, marginTop: 2 }}>6 agents IA · GPT-4o · Ebook complet tous chapitres · Gumroad auto</div>
          </div>
        </div>

        {/* Config */}
        <div style={{ background: "#0d0d1a", border: "1px solid #1a1a2e", borderRadius: 14, padding: 20, marginBottom: 16 }}>
          <div style={{ color: "#3a3a5a", fontSize: 10, marginBottom: 12, letterSpacing: 1 }}>⚙️ CONFIGURATION — CHATGPT API</div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: "#555", fontSize: 10, marginBottom: 5 }}>
              OPENAI API KEY &nbsp;
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" style={{ color: "#00ffd5", fontSize: 10, textDecoration: "underline" }}>→ platform.openai.com/api-keys</a>
            </div>
            <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-proj-..." disabled={running}
              style={{ width: "100%", background: "#070710", border: "1px solid #1a1a2e", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 13, fontFamily: "monospace" }} />
          </div>
          <div>
            <div style={{ color: "#555", fontSize: 10, marginBottom: 5 }}>NICHE / SUJET DE TON EBOOK</div>
            <div style={{ display: "flex", gap: 10 }}>
              <input value={niche} onChange={e => setNiche(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !running && niche.trim() && apiKey.trim() && runPipeline()}
                placeholder="ex: Gagner 1000€/mois avec l'IA pour débutants..." disabled={running}
                style={{ flex: 1, background: "#070710", border: "1px solid #1a1a2e", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 13, fontFamily: "monospace" }} />
              <button onClick={runPipeline} disabled={running || !niche.trim() || !apiKey.trim()} style={{
                background: running || !niche.trim() || !apiKey.trim() ? "#1a1a2e" : "linear-gradient(135deg, #00ffd5, #00b4d8)",
                border: "none", borderRadius: 10, padding: "10px 20px",
                color: running || !niche.trim() || !apiKey.trim() ? "#3a3a5a" : "#000",
                fontWeight: 700, fontSize: 13, cursor: running || !niche.trim() || !apiKey.trim() ? "not-allowed" : "pointer",
                fontFamily: "monospace", whiteSpace: "nowrap"
              }}>
                {running ? "⏳ EN COURS..." : "▶ LANCER"}
              </button>
            </div>
          </div>
        </div>

        {/* Progress */}
        {completedCount > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ color: "#3a3a5a", fontSize: 10 }}>PROGRESSION</span>
              <span style={{ color: "#00ffd5", fontSize: 10 }}>{completedCount}/{AGENTS.length}</span>
            </div>
            <div style={{ background: "#1a1a2e", borderRadius: 4, height: 3 }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #00ffd5, #ff6b6b)", borderRadius: 4, transition: "width 0.6s ease" }} />
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          {/* Agents */}
          <div>
            <div style={{ color: "#3a3a5a", fontSize: 10, letterSpacing: 1, marginBottom: 10 }}>AGENTS IA</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {AGENTS.map((agent, i) => (
                <div key={agent.id}>
                  <AgentCard agent={agent} status={agentStatus[agent.id] || "idle"} onClick={() => { if (agentResults[agent.id]) setModalAgent(agent); }} />
                  {i < AGENTS.length - 1 && <div style={{ width: 1, height: 6, background: "#1a1a2e", margin: "0 19px" }} />}
                </div>
              ))}
            </div>
          </div>

          {/* Logs */}
          <div>
            <div style={{ color: "#3a3a5a", fontSize: 10, letterSpacing: 1, marginBottom: 10 }}>LOGS</div>
            <div style={{ background: "#030308", border: "1px solid #1a1a2e", borderRadius: 12, padding: 14, height: 400, overflow: "auto", fontSize: 11 }}>
              {logs.length === 0
                ? <div style={{ color: "#1a1a2e", textAlign: "center", paddingTop: 160 }}>En attente...</div>
                : logs.map((log, i) => (
                  <div key={i} style={{ marginBottom: 3 }}>
                    <span style={{ color: "#2a2a4a" }}>[{log.time}] </span>
                    <span style={{ color: log.color }}>{log.msg}</span>
                  </div>
                ))}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>

        {/* Summary */}
        {completedCount === AGENTS.length && (
          <div style={{ marginTop: 20 }}>
            <div style={{ color: "#3a3a5a", fontSize: 10, letterSpacing: 1, marginBottom: 10 }}>RÉSUMÉ</div>
            <div style={{ background: "#0d0d1a", border: "1px solid #00ffd544", borderRadius: 14, padding: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { label: "Titre ebook", val: agentResults.plan?.titre_principal, color: "#a78bfa" },
                  { label: "Score marché", val: (agentResults.research?.score_marche || "—") + "/10", color: "#00ffd5" },
                  { label: "Validation", val: agentResults.research?.validation, color: agentResults.research?.validation === "GO" ? "#34d399" : "#ef4444" },
                  { label: "Prix lancement", val: agentResults.cover?.strategie_prix?.prix_lancement ? agentResults.cover.strategie_prix.prix_lancement + "€" : "—", color: "#fb923c" },
                  { label: "Chapitres rédigés", val: (agentResults.content?.chapitres?.length || "—") + " chapitres complets", color: "#34d399" },
                  { label: "Prompt DALL-E", val: agentResults.cover?.prompt_dalle ? "✓ Prêt" : "—", color: "#f472b6" },
                ].map((item, i) => (
                  <div key={i} style={{ background: "#070710", borderRadius: 10, padding: 10, border: "1px solid #1a1a2e" }}>
                    <div style={{ color: "#3a3a5a", fontSize: 10, marginBottom: 3 }}>{item.label}</div>
                    <div style={{ color: item.color, fontSize: 12, fontWeight: 700 }}>{item.val || "—"}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showGumroad && <GumroadPanel results={agentResults} gumroadToken={gumroadToken} setGumroadToken={setGumroadToken} />}
      </div>

      {modalAgent && agentResults[modalAgent.id] && (
        <ResultModal agent={modalAgent} data={agentResults[modalAgent.id]} onClose={() => setModalAgent(null)} />
      )}
    </div>
  );
    }
