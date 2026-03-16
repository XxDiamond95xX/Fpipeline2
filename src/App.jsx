import { useState, useRef, useEffect } from "react";

// ─── AGENTS ───────────────────────────────────────────────────────────────────
const AGENTS = [
  {
    id: "research",
    name: "Agent Recherche",
    icon: "🔍",
    description: "Valide la niche & analyse le marché",
    color: "#00ffd5",
    systemPrompt: `Tu es un expert en marketing digital et analyse de marché pour la vente d'ebooks.
Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks, sans texte avant ou après:
{
  "validation": "GO ou NO-GO",
  "score_marche": "note sur 10",
  "audience_cible": "description précise de la cible",
  "probleme_resolu": "problème principal résolu par cet ebook",
  "concurrence": "faible ou moyenne ou forte",
  "prix_recommande": "fourchette de prix en euros",
  "angle_unique": "proposition de valeur unique qui différencie",
  "mots_cles": ["mot1", "mot2", "mot3", "mot4", "mot5"],
  "verdict": "2-3 phrases de conclusion sur la viabilité"
}`
  },
  {
    id: "plan",
    name: "Agent Structure",
    icon: "📋",
    description: "Crée le plan détaillé — 5 chapitres",
    color: "#a78bfa",
    systemPrompt: `Tu es un expert en création d'ebooks professionnels. Crée un plan complet avec exactement 5 chapitres progressifs.
Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks, sans texte avant ou après:
{
  "titre_principal": "titre accrocheur et vendeur",
  "sous_titre": "sous-titre qui précise la promesse",
  "promesse": "la promesse principale de transformation",
  "nb_pages_estimees": "50",
  "chapitres": [
    {
      "numero": 1,
      "titre": "titre du chapitre 1",
      "objectif": "ce que le lecteur sait faire après ce chapitre",
      "sections": ["section 1.1", "section 1.2", "section 1.3"],
      "exercice_pratique": "exercice concret et actionnable"
    },
    {
      "numero": 2,
      "titre": "titre du chapitre 2",
      "objectif": "objectif chapitre 2",
      "sections": ["section 2.1", "section 2.2", "section 2.3"],
      "exercice_pratique": "exercice chapitre 2"
    },
    {
      "numero": 3,
      "titre": "titre du chapitre 3",
      "objectif": "objectif chapitre 3",
      "sections": ["section 3.1", "section 3.2", "section 3.3"],
      "exercice_pratique": "exercice chapitre 3"
    },
    {
      "numero": 4,
      "titre": "titre du chapitre 4",
      "objectif": "objectif chapitre 4",
      "sections": ["section 4.1", "section 4.2", "section 4.3"],
      "exercice_pratique": "exercice chapitre 4"
    },
    {
      "numero": 5,
      "titre": "titre du chapitre 5",
      "objectif": "objectif chapitre 5",
      "sections": ["section 5.1", "section 5.2", "section 5.3"],
      "exercice_pratique": "exercice chapitre 5"
    }
  ],
  "bonus_inclus": ["description bonus 1", "description bonus 2"],
  "resultats_attendus": ["résultat concret 1", "résultat concret 2", "résultat concret 3"]
}`
  },
  {
    id: "content",
    name: "Agent Contenu",
    icon: "✍️",
    description: "Rédige l'ebook COMPLET — tous les chapitres",
    color: "#fb923c",
    systemPrompt: `Tu es un auteur expert en rédaction d'ebooks professionnels. Tu rédiges un ebook COMPLET avec les 5 chapitres du plan fourni dans le contexte.
Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks, sans texte avant ou après:
{
  "introduction": {
    "hook": "phrase d'accroche ultra-puissante",
    "histoire": "anecdote d'introduction engageante de 120 mots",
    "promesse": "description détaillée de ce que le lecteur va obtenir",
    "mode_emploi": "comment utiliser cet ebook pour maximiser les résultats"
  },
  "chapitres": [
    {
      "numero": 1,
      "titre": "titre exact du chapitre issu du plan",
      "contenu": "contenu complet du chapitre avec minimum 350 mots. Inclure contexte, explications claires, exemples concrets, étapes pratiques, conseils experts et erreurs à éviter.",
      "points_cles": ["point clé actionnable 1", "point clé actionnable 2", "point clé actionnable 3"],
      "exercice": "exercice pratique détaillé que le lecteur peut faire immédiatement",
      "citation": "citation inspirante avec auteur"
    },
    {
      "numero": 2,
      "titre": "titre chapitre 2",
      "contenu": "contenu complet chapitre 2 (350 mots minimum)",
      "points_cles": ["point 1", "point 2", "point 3"],
      "exercice": "exercice chapitre 2",
      "citation": "citation chapitre 2"
    },
    {
      "numero": 3,
      "titre": "titre chapitre 3",
      "contenu": "contenu complet chapitre 3 (350 mots minimum)",
      "points_cles": ["point 1", "point 2", "point 3"],
      "exercice": "exercice chapitre 3",
      "citation": "citation chapitre 3"
    },
    {
      "numero": 4,
      "titre": "titre chapitre 4",
      "contenu": "contenu complet chapitre 4 (350 mots minimum)",
      "points_cles": ["point 1", "point 2", "point 3"],
      "exercice": "exercice chapitre 4",
      "citation": "citation chapitre 4"
    },
    {
      "numero": 5,
      "titre": "titre chapitre 5",
      "contenu": "contenu complet chapitre 5 (350 mots minimum)",
      "points_cles": ["point 1", "point 2", "point 3"],
      "exercice": "exercice chapitre 5",
      "citation": "citation chapitre 5"
    }
  ],
  "conclusion": {
    "resume": "résumé complet des apprentissages en 100 mots",
    "prochaines_etapes": ["étape concrète 1", "étape concrète 2", "étape concrète 3"],
    "mot_de_fin": "message de clôture inspirant de 80 mots"
  }
}
IMPORTANT: Rédige les 5 chapitres avec un vrai contenu riche et actionnable.`
  },
  {
    id: "marketing",
    name: "Agent Marketing",
    icon: "🎯",
    description: "Page de vente & séquence emails",
    color: "#f472b6",
    systemPrompt: `Tu es un expert copywriter spécialisé dans la vente d'ebooks en ligne. Tu crées des textes qui convertissent.
Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks, sans texte avant ou après:
{
  "page_de_vente": {
    "headline": "titre principal ultra-accrocheur",
    "sous_headline": "sous-titre qui précise la promesse et lève les objections",
    "probleme": "description vivante du problème que vit l'acheteur en 100 mots",
    "solution": "présentation convaincante de l'ebook comme LA solution en 100 mots",
    "benefices": ["bénéfice concret 1", "bénéfice concret 2", "bénéfice concret 3", "bénéfice concret 4", "bénéfice concret 5"],
    "preuve_sociale": "témoignage fictif crédible avec prénom et résultat concret",
    "offre": "description détaillée de tout ce que contient l'offre",
    "cta_principal": "texte du bouton d'achat percutant",
    "garantie": "texte de garantie satisfait ou remboursé"
  },
  "email_sequence": [
    {
      "jour": 0,
      "sujet": "objet email accrocheur jour 0",
      "corps": "corps complet de l'email de bienvenue de 150 mots avec call to action"
    },
    {
      "jour": 3,
      "sujet": "objet email relance avec preuve sociale",
      "corps": "corps complet de l'email de relance de 150 mots"
    },
    {
      "jour": 7,
      "sujet": "objet email urgence dernière chance",
      "corps": "corps complet de l'email d'urgence de 150 mots"
    }
  ],
  "posts_reseaux": {
    "linkedin": "post LinkedIn complet de 200 mots avec storytelling et call to action",
    "instagram_caption": "caption Instagram engageante avec emojis et hashtags",
    "twitter_thread": ["tweet accroche 280 chars max", "tweet développement 280 chars max", "tweet call to action 280 chars max"]
  }
}`
  },
  {
    id: "cover",
    name: "Agent Visuel",
    icon: "🖼️",
    description: "Prompt DALL-E & stratégie de prix",
    color: "#34d399",
    systemPrompt: `Tu es un expert en design de couvertures d'ebooks et stratégie de pricing.
Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks, sans texte avant ou après:
{
  "prompt_dalle": "Detailed English prompt for DALL-E: professional ebook cover, specify exact style, color palette, typography, visual elements, mood, lighting, composition. Make it very specific.",
  "prompt_dalle_fr": "Même prompt détaillé en français",
  "palette_couleurs": ["#couleur1", "#couleur2", "#couleur3"],
  "style_visuel": "description détaillée du style visuel et pourquoi il correspond à la niche",
  "strategie_prix": {
    "prix_lancement": "17",
    "prix_normal": "27",
    "prix_premium_bundle": "47",
    "justification": "explication détaillée de pourquoi ces prix sont optimaux"
  },
  "plateformes_recommandees": [
    {"nom": "Gumroad", "commission": "10%", "avantage": "simple, rapide, idéal pour débuter"},
    {"nom": "Systeme.io", "commission": "0%", "avantage": "gratuit, tunnel de vente et emails inclus"},
    {"nom": "Payhip", "commission": "5%", "avantage": "faible commission, affiliés intégrés"}
  ],
  "checklist_lancement": ["étape 1", "étape 2", "étape 3", "étape 4", "étape 5"]
}`
  },
  {
    id: "publish",
    name: "Agent Publication",
    icon: "🚀",
    description: "Prépare tout pour Gumroad",
    color: "#ff6b6b",
    systemPrompt: `Tu es un expert en publication et vente d'ebooks sur Gumroad.
Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks, sans texte avant ou après:
{
  "gumroad_name": "nom du produit optimisé SEO (max 100 caractères)",
  "gumroad_description": "<h2>Titre accrocheur</h2><p>Introduction percutante 2-3 phrases.</p><h2>Ce que tu vas apprendre</h2><ul><li>Point concret 1</li><li>Point concret 2</li><li>Point concret 3</li><li>Point concret 4</li><li>Point concret 5</li></ul><h2>Pour qui ?</h2><p>Description précise de la cible idéale.</p><h2>Inclus dans cette offre</h2><ul><li>Ebook complet 50+ pages</li><li>Bonus 1</li><li>Bonus 2</li></ul><h2>Garantie</h2><p>Satisfait ou remboursé 30 jours.</p>",
  "prix_suggere": "17",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "resume_produit": "résumé complet de tout ce qui a été créé pour ce business"
}`
  }
];

// ─── Agent Card ───────────────────────────────────────────────────────────────
const AgentCard = ({ agent, status, onClick }) => (
  <div
    onClick={status === "done" ? onClick : undefined}
    style={{
      border: `1px solid ${status === "idle" ? "#1a1a2e" : status === "error" ? "#ef4444" : agent.color}`,
      background: "#0d0d1a", opacity: status === "idle" ? 0.5 : 1,
      borderRadius: 12, padding: "13px 16px",
      cursor: status === "done" ? "pointer" : "default",
      transition: "all 0.3s", position: "relative", overflow: "hidden",
      boxShadow: status !== "idle" ? `0 0 20px ${agent.color}18` : "none"
    }}
  >
    {status === "running" && (
      <div style={{
        position: "absolute", top: 0, left: 0, height: 2, width: "60%",
        background: `linear-gradient(90deg, transparent, ${agent.color})`,
        animation: "shimmer 1.2s infinite"
      }} />
    )}
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 20 }}>{agent.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 12, fontFamily: "monospace" }}>
          {agent.name}
        </div>
        <div style={{ color: "#4a4a6a", fontSize: 11, marginTop: 1 }}>{agent.description}</div>
      </div>
      <div style={{
        width: 8, height: 8, borderRadius: "50%",
        background: status === "done" ? agent.color : status === "running" ? agent.color : status === "error" ? "#ef4444" : "#1e1e3a",
        boxShadow: status === "running" ? `0 0 10px ${agent.color}` : "none",
        animation: status === "running" ? "blink 0.8s infinite" : "none"
      }} />
    </div>
    {status === "done" && (
      <div style={{ color: agent.color, fontSize: 10, marginTop: 5, fontFamily: "monospace" }}>
        ✓ Terminé — cliquer pour voir les résultats
      </div>
    )}
    {status === "error" && (
      <div style={{ color: "#ef4444", fontSize: 10, marginTop: 5, fontFamily: "monospace" }}>
        ✗ Erreur — vérifier la clé API et les crédits
      </div>
    )}
  </div>
);

// ─── Result Modal ─────────────────────────────────────────────────────────────
const ResultModal = ({ agent, data, onClose }) => {
  const renderValue = (val, depth = 0) => {
    if (Array.isArray(val)) return (
      <div style={{ paddingLeft: depth > 0 ? 14 : 0 }}>
        {val.map((item, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            {typeof item === "object" ? (
              <div style={{ background: "#07070f", border: "1px solid #1a1a2e", borderRadius: 8, padding: 10, marginBottom: 6 }}>
                {Object.entries(item).map(([k, v]) => (
                  <div key={k} style={{ marginBottom: 5 }}>
                    <div style={{ color: agent.color, fontSize: 10, fontFamily: "monospace", marginBottom: 2 }}>
                      {k.replace(/_/g, " ").toUpperCase()}
                    </div>
                    <div style={{ color: "#c4c4d4", fontSize: 12, lineHeight: 1.6 }}>
                      {typeof v === "string" ? v : Array.isArray(v) ? v.join(", ") : JSON.stringify(v)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: agent.color, fontSize: 12, marginTop: 2 }}>▸</span>
                <span style={{ color: "#c4c4d4", fontSize: 13, lineHeight: 1.6 }}>{item}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
    if (typeof val === "object" && val !== null) return (
      <div style={{ paddingLeft: 12, borderLeft: `2px solid ${agent.color}33`, marginTop: 4 }}>
        {Object.entries(val).map(([k, v]) => (
          <div key={k} style={{ marginBottom: 10 }}>
            <div style={{ color: agent.color, fontSize: 11, fontFamily: "monospace", marginBottom: 4 }}>
              {k.replace(/_/g, " ")}
            </div>
            {renderValue(v, depth + 1)}
          </div>
        ))}
      </div>
    );
    return <div style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{String(val)}</div>;
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "#000000dd", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#0d0d1a", border: `1px solid ${agent.color}`, borderRadius: 16, padding: 24,
          maxWidth: 720, width: "100%", maxHeight: "85vh", overflow: "auto",
          boxShadow: `0 0 60px ${agent.color}30`
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 24 }}>{agent.icon}</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontFamily: "monospace", fontSize: 14 }}>{agent.name}</div>
              <div style={{ color: agent.color, fontSize: 11 }}>Résultats complets</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "#1a1a2e", border: "none", color: "#888", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 12 }}>
            ✕ Fermer
          </button>
        </div>
        {Object.entries(data).map(([key, val]) => (
          <div key={key} style={{ marginBottom: 14, padding: 16, background: "#070710", borderRadius: 10, border: "1px solid #1a1a2e" }}>
            <div style={{ color: agent.color, fontSize: 11, fontFamily: "monospace", fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>
              {key.replace(/_/g, " ")}
            </div>
            {renderValue(val)}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Gumroad Panel (Copy-Paste — no CORS issues) ──────────────────────────────
const GumroadPanel = ({ results }) => {
  const [copied, setCopied] = useState({});

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(prev => ({ ...prev, [key]: true }));
      setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 2000);
    });
  };

  const pub = results.publish;
  const cover = results.cover;

  const fields = [
    {
      key: "nom",
      label: "1️⃣ Nom du produit",
      value: pub?.gumroad_name || results.plan?.titre_principal || "",
      hint: "Colle dans le champ 'Name' sur Gumroad"
    },
    {
      key: "prix",
      label: "2️⃣ Prix",
      value: cover?.strategie_prix?.prix_lancement ? cover.strategie_prix.prix_lancement : pub?.prix_suggere || "17",
      hint: "Colle dans le champ 'Price' sur Gumroad (en euros)"
    },
    {
      key: "description",
      label: "3️⃣ Description (HTML)",
      value: pub?.gumroad_description || "",
      hint: "Colle dans l'éditeur de description Gumroad (mode HTML)"
    },
    {
      key: "tags",
      label: "4️⃣ Tags",
      value: pub?.tags ? pub.tags.join(", ") : "",
      hint: "Colle dans le champ 'Tags' sur Gumroad"
    }
  ];

  return (
    <div style={{ marginTop: 24, background: "#0d0d1a", border: "1px solid #ff6b6b", borderRadius: 16, padding: 22, boxShadow: "0 0 30px #ff6b6b18" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 22 }}>🚀</span>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontFamily: "monospace", fontSize: 13 }}>PUBLICATION GUMROAD</div>
          <div style={{ color: "#ff6b6b", fontSize: 11 }}>Copie chaque champ et colle-le sur Gumroad</div>
        </div>
      </div>

      {/* Steps */}
      <div style={{ background: "#070710", border: "1px solid #1a1a2e", borderRadius: 10, padding: 14, marginBottom: 18 }}>
        <div style={{ color: "#555", fontSize: 10, marginBottom: 8, letterSpacing: 1 }}>ÉTAPES</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {[
            "Va sur gumroad.com → New Product → Digital Product",
            "Copie chaque champ ci-dessous et colle-le sur Gumroad",
            "Upload ton PDF dans la section 'Content'",
            "Clique 'Publish' → ton ebook est en vente ! 🎉"
          ].map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ color: "#ff6b6b", fontSize: 11, marginTop: 1 }}>→</span>
              <span style={{ color: "#888", fontSize: 11 }}>{step}</span>
            </div>
          ))}
        </div>
        <a
          href="https://app.gumroad.com/products/new"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-block", marginTop: 12,
            background: "linear-gradient(135deg, #ff6b6b, #ff4757)",
            color: "#fff", padding: "8px 18px", borderRadius: 8,
            fontSize: 12, fontWeight: 700, textDecoration: "none"
          }}
        >
          → Ouvrir Gumroad pour créer le produit
        </a>
      </div>

      {/* Copy fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {fields.map(field => (
          <div key={field.key} style={{ background: "#070710", border: "1px solid #1a1a2e", borderRadius: 10, padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div>
                <div style={{ color: "#ff6b6b", fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>{field.label}</div>
                <div style={{ color: "#333", fontSize: 10, marginTop: 2 }}>{field.hint}</div>
              </div>
              <button
                onClick={() => copyToClipboard(field.value, field.key)}
                style={{
                  background: copied[field.key] ? "#34d399" : "#1a1a2e",
                  border: `1px solid ${copied[field.key] ? "#34d399" : "#2a2a4a"}`,
                  borderRadius: 8, padding: "6px 14px",
                  color: copied[field.key] ? "#000" : "#888",
                  fontSize: 11, cursor: "pointer", fontFamily: "monospace",
                  fontWeight: 700, transition: "all 0.2s", whiteSpace: "nowrap"
                }}
              >
                {copied[field.key] ? "✓ Copié !" : "📋 Copier"}
              </button>
            </div>
            <div style={{
              color: "#555", fontSize: 11, fontFamily: "monospace",
              background: "#0a0a14", borderRadius: 6, padding: "8px 10px",
              maxHeight: 80, overflow: "hidden", textOverflow: "ellipsis",
              whiteSpace: field.key === "description" ? "nowrap" : "pre-wrap"
            }}>
              {field.value ? field.value.slice(0, 200) + (field.value.length > 200 ? "..." : "") : "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [niche, setNiche] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [running, setRunning] = useState(false);
  const [agentStatus, setAgentStatus] = useState({});
  const [agentResults, setAgentResults] = useState({});
  const [logs, setLogs] = useState([]);
  const [modalAgent, setModalAgent] = useState(null);
  const [showGumroad, setShowGumroad] = useState(false);
  const logsEndRef = useRef(null);

  useEffect(() => { logsEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);

  const addLog = (msg, color = "#555") =>
    setLogs(prev => [...prev, { msg, color, time: new Date().toLocaleTimeString() }]);

  // ✅ OpenAI GPT-4o
  const callOpenAI = async (agent, context) => {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 4000,
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: agent.systemPrompt },
          {
            role: "user",
            content: `Niche/Sujet: "${niche}"\n${context ? `\nContexte des agents précédents:\n${JSON.stringify(context, null, 2)}` : ""}\n\nRéponds UNIQUEMENT en JSON valide, sans markdown, sans backticks.`
          }
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
    setRunning(true);
    setAgentStatus({});
    setAgentResults({});
    setLogs([]);
    setShowGumroad(false);

    addLog("🚀 Démarrage du pipeline (GPT-4o)...", "#fff");
    addLog(`📌 Niche : "${niche}"`, "#a78bfa");
    addLog(`⏱ Temps estimé : 3 à 5 minutes`, "#3a3a5a");

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
        const nb = result.chapitres?.length;
        addLog(`  ✓ Terminé${nb ? ` — ${nb} chapitres rédigés` : ""}`, agent.color);
      } catch (e) {
        setAgentStatus(prev => ({ ...prev, [agent.id]: "error" }));
        addLog(`  ✗ Erreur: ${e.message}`, "#ef4444");
      }
    }

    setShowGumroad(true);
    addLog("\n🎉 Pipeline complet ! Clique sur chaque agent pour voir ses résultats.", "#00ffd5");
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
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        input { outline: none !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #070710; }
        ::-webkit-scrollbar-thumb { background: #1a1a2e; border-radius: 2px; }
      `}</style>

      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg, #00ffd5, #ff6b6b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>⚡</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: 1 }}>EBOOK AGENT PIPELINE</h1>
            <div style={{ color: "#3a3a5a", fontSize: 11, marginTop: 2 }}>
              6 agents IA · GPT-4o · Ebook complet · Publication Gumroad
            </div>
          </div>
        </div>

        {/* Config */}
        <div style={{ background: "#0d0d1a", border: "1px solid #1a1a2e", borderRadius: 14, padding: 20, marginBottom: 16 }}>
          <div style={{ color: "#3a3a5a", fontSize: 10, marginBottom: 14, letterSpacing: 1 }}>⚙️ CONFIGURATION — OPENAI GPT-4o</div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ color: "#555", fontSize: 10, marginBottom: 6 }}>
              OPENAI API KEY &nbsp;
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" style={{ color: "#00ffd5", fontSize: 10, textDecoration: "underline" }}>
                → platform.openai.com/api-keys
              </a>
              &nbsp;·&nbsp;
              <a href="https://platform.openai.com/settings/billing/overview" target="_blank" rel="noreferrer" style={{ color: "#fb923c", fontSize: 10, textDecoration: "underline" }}>
                → Ajouter 5$ de crédits
              </a>
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-proj-..."
              disabled={running}
              style={{ width: "100%", background: "#070710", border: "1px solid #1a1a2e", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 13, fontFamily: "monospace" }}
            />
          </div>

          <div>
            <div style={{ color: "#555", fontSize: 10, marginBottom: 6 }}>NICHE / SUJET DE TON EBOOK</div>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                value={niche}
                onChange={e => setNiche(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !running && niche.trim() && apiKey.trim() && runPipeline()}
                placeholder="ex: Gagner 1000€/mois avec l'IA pour débutants en 2026..."
                disabled={running}
                style={{ flex: 1, background: "#070710", border: "1px solid #1a1a2e", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 13, fontFamily: "monospace" }}
              />
              <button
                onClick={runPipeline}
                disabled={running || !niche.trim() || !apiKey.trim()}
                style={{
                  background: running || !niche.trim() || !apiKey.trim() ? "#1a1a2e" : "linear-gradient(135deg, #00ffd5, #00b4d8)",
                  border: "none", borderRadius: 10, padding: "11px 22px",
                  color: running || !niche.trim() || !apiKey.trim() ? "#3a3a5a" : "#000",
                  fontWeight: 700, fontSize: 13, cursor: running || !niche.trim() || !apiKey.trim() ? "not-allowed" : "pointer",
                  fontFamily: "monospace", whiteSpace: "nowrap", transition: "all 0.2s"
                }}
              >
                {running ? "⏳ EN COURS..." : "▶ LANCER"}
              </button>
            </div>
          </div>
        </div>

        {/* Progress */}
        {completedCount > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "#3a3a5a", fontSize: 10 }}>PROGRESSION</span>
              <span style={{ color: "#00ffd5", fontSize: 10 }}>{completedCount}/{AGENTS.length} agents</span>
            </div>
            <div style={{ background: "#1a1a2e", borderRadius: 4, height: 3 }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #00ffd5, #ff6b6b)", borderRadius: 4, transition: "width 0.6s ease" }} />
            </div>
          </div>
        )}

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div>
            <div style={{ color: "#3a3a5a", fontSize: 10, letterSpacing: 1, marginBottom: 10 }}>AGENTS IA</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {AGENTS.map((agent, i) => (
                <div key={agent.id}>
                  <AgentCard
                    agent={agent}
                    status={agentStatus[agent.id] || "idle"}
                    onClick={() => { if (agentResults[agent.id]) setModalAgent(agent); }}
                  />
                  {i < AGENTS.length - 1 && <div style={{ width: 1, height: 6, background: "#1a1a2e", margin: "0 20px" }} />}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ color: "#3a3a5a", fontSize: 10, letterSpacing: 1, marginBottom: 10 }}>LOGS EN TEMPS RÉEL</div>
            <div style={{ background: "#030308", border: "1px solid #1a1a2e", borderRadius: 12, padding: 14, height: 410, overflow: "auto", fontSize: 11 }}>
              {logs.length === 0 ? (
                <div style={{ color: "#1a1a2e", textAlign: "center", paddingTop: 170 }}>En attente du démarrage...</div>
              ) : logs.map((log, i) => (
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
          <div style={{ marginTop: 22, animation: "fadeIn 0.5s ease" }}>
            <div style={{ color: "#3a3a5a", fontSize: 10, letterSpacing: 1, marginBottom: 10 }}>
              RÉSUMÉ — CLIQUE SUR UN AGENT POUR VOIR SES RÉSULTATS COMPLETS
            </div>
            <div style={{ background: "#0d0d1a", border: "1px solid #00ffd544", borderRadius: 14, padding: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { label: "Titre ebook", val: agentResults.plan?.titre_principal, color: "#a78bfa" },
                  { label: "Score marché", val: (agentResults.research?.score_marche || "—") + "/10", color: "#00ffd5" },
                  { label: "Validation", val: agentResults.research?.validation, color: agentResults.research?.validation === "GO" ? "#34d399" : "#ef4444" },
                  { label: "Prix lancement", val: agentResults.cover?.strategie_prix?.prix_lancement ? agentResults.cover.strategie_prix.prix_lancement + "€" : "—", color: "#fb923c" },
                  { label: "Chapitres rédigés", val: (agentResults.content?.chapitres?.length || "—") + " chapitres", color: "#34d399" },
                  { label: "Prompt DALL-E", val: agentResults.cover?.prompt_dalle ? "✓ Prêt" : "—", color: "#f472b6" },
                ].map((item, i) => (
                  <div key={i} style={{ background: "#070710", borderRadius: 10, padding: 12, border: "1px solid #1a1a2e" }}>
                    <div style={{ color: "#3a3a5a", fontSize: 10, marginBottom: 4 }}>{item.label}</div>
                    <div style={{ color: item.color, fontSize: 12, fontWeight: 700 }}>{item.val || "—"}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showGumroad && <GumroadPanel results={agentResults} />}
      </div>

      {modalAgent && agentResults[modalAgent.id] && (
        <ResultModal agent={modalAgent} data={agentResults[modalAgent.id]} onClose={() => setModalAgent(null)} />
      )}
    </div>
  );
}
