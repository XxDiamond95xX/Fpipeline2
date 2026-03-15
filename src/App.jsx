import { useState, useRef, useEffect } from "react";

const AGENTS = [
  {
    id: "research",
    name: "Agent Recherche",
    icon: "🔍",
    description: "Valide la niche & analyse le marché",
    color: "#00ffd5",
    systemPrompt: `Tu es un expert en marketing digital et analyse de marché. Tu analyses une niche pour la vente d'ebooks/formations en ligne.
Réponds UNIQUEMENT en JSON valide avec cette structure exacte, sans markdown, sans backticks:
{
  "validation": "GO ou NO-GO",
  "score_marche": "note sur 10",
  "audience_cible": "description précise de la cible",
  "probleme_resolu": "problème principal résolu par cet ebook",
  "concurrence": "faible/moyenne/forte",
  "prix_recommande": "fourchette de prix en euros recommandée",
  "angle_unique": "proposition de valeur unique qui différencie cet ebook",
  "mots_cles": ["mot1", "mot2", "mot3", "mot4", "mot5"],
  "verdict": "2-3 phrases de conclusion sur la viabilité de la niche"
}`
  },
  {
    id: "plan",
    name: "Agent Structure",
    icon: "📋",
    description: "Crée le plan détaillé — 5 chapitres",
    color: "#a78bfa",
    systemPrompt: `Tu es un expert en création de formations et ebooks professionnels. Tu crées des plans ultra-détaillés, engageants et actionnables.
Réponds UNIQUEMENT en JSON valide avec cette structure, sans markdown, sans backticks:
{
  "titre_principal": "titre accrocheur et vendeur",
  "sous_titre": "sous-titre qui précise la promesse et la cible",
  "promesse": "la promesse principale de transformation",
  "nb_pages_estimees": "50",
  "chapitres": [
    {
      "numero": 1,
      "titre": "titre du chapitre",
      "objectif": "ce que le lecteur apprend et sait faire après ce chapitre",
      "sections": ["section1", "section2", "section3"],
      "exercice_pratique": "exercice concret et actionnable à la fin du chapitre"
    },
    {
      "numero": 2,
      "titre": "titre du chapitre 2",
      "objectif": "objectif chapitre 2",
      "sections": ["section1", "section2", "section3"],
      "exercice_pratique": "exercice chapitre 2"
    },
    {
      "numero": 3,
      "titre": "titre du chapitre 3",
      "objectif": "objectif chapitre 3",
      "sections": ["section1", "section2", "section3"],
      "exercice_pratique": "exercice chapitre 3"
    },
    {
      "numero": 4,
      "titre": "titre du chapitre 4",
      "objectif": "objectif chapitre 4",
      "sections": ["section1", "section2", "section3"],
      "exercice_pratique": "exercice chapitre 4"
    },
    {
      "numero": 5,
      "titre": "titre du chapitre 5",
      "objectif": "objectif chapitre 5",
      "sections": ["section1", "section2", "section3"],
      "exercice_pratique": "exercice chapitre 5"
    }
  ],
  "bonus_inclus": ["bonus1 description complète", "bonus2 description complète"],
  "resultats_attendus": ["résultat concret 1", "résultat concret 2", "résultat concret 3"]
}
IMPORTANT: Crée exactement 5 chapitres progressifs et cohérents avec la niche.`
  },
  {
    id: "content",
    name: "Agent Contenu",
    icon: "✍️",
    description: "Rédige l'ebook COMPLET — tous les chapitres",
    color: "#fb923c",
    systemPrompt: `Tu es un auteur expert en rédaction d'ebooks et formations en ligne. Tu rédiges un ebook COMPLET et professionnel avec TOUS les chapitres.
Utilise le plan fourni dans le contexte pour rédiger CHAQUE chapitre avec un vrai contenu détaillé, des exemples concrets et des conseils actionnables.
Réponds UNIQUEMENT en JSON valide sans markdown ni backticks:
{
  "introduction": {
    "hook": "phrase d'accroche ultra-puissante qui capte l'attention immédiatement",
    "histoire": "histoire ou anecdote d'introduction engageante de 120 mots minimum",
    "promesse": "description détaillée de ce que le lecteur va obtenir en lisant cet ebook",
    "mode_emploi": "comment utiliser cet ebook pour maximiser les résultats"
  },
  "chapitres": [
    {
      "numero": 1,
      "titre": "titre exact du chapitre issu du plan",
      "contenu": "contenu complet et détaillé du chapitre avec au moins 350 mots. Inclure: contexte, explications claires, exemples concrets tirés de la réalité, étapes pratiques, conseils d'experts, erreurs à éviter.",
      "points_cles": ["point clé 1 actionnable", "point clé 2 actionnable", "point clé 3 actionnable"],
      "exercice": "exercice pratique très détaillé que le lecteur peut faire immédiatement après avoir lu le chapitre",
      "citation": "citation inspirante pertinente avec l'auteur"
    }
  ],
  "conclusion": {
    "resume": "résumé complet des apprentissages clés de tout l'ebook en 100 mots",
    "prochaines_etapes": ["prochaine étape concrète 1", "prochaine étape concrète 2", "prochaine étape concrète 3"],
    "mot_de_fin": "message de clôture inspirant et motivant de 80 mots"
  }
}
IMPORTANT: Le tableau chapitres doit contenir UN objet pour CHACUN des 5 chapitres du plan. Rédige chaque chapitre avec un contenu riche, utile et actionnable de 350 mots minimum.`
  },
  {
    id: "marketing",
    name: "Agent Marketing",
    icon: "🎯",
    description: "Page de vente & séquence emails",
    color: "#f472b6",
    systemPrompt: `Tu es un expert copywriter spécialisé dans la vente de formations et ebooks en ligne. Tu crées des textes qui convertissent et qui vendent.
Réponds UNIQUEMENT en JSON valide sans markdown ni backticks:
{
  "page_de_vente": {
    "headline": "titre principal ultra-accrocheur qui donne envie d'acheter immédiatement",
    "sous_headline": "sous-titre qui précise la promesse et lève les objections principales",
    "probleme": "description vivante et empathique du problème que vit l'acheteur potentiel en 100 mots",
    "solution": "présentation convaincante de l'ebook comme LA solution en 100 mots",
    "benefices": [
      "bénéfice concret et mesurable 1",
      "bénéfice concret et mesurable 2",
      "bénéfice concret et mesurable 3",
      "bénéfice concret et mesurable 4",
      "bénéfice concret et mesurable 5"
    ],
    "preuve_sociale": "témoignage fictif mais crédible d'un client satisfait avec prénom et résultat concret",
    "offre": "description détaillée et complète de tout ce que contient l'offre (ebook + bonus)",
    "cta_principal": "texte du bouton d'achat percutant et urgent",
    "garantie": "texte de garantie satisfaction rassurante"
  },
  "email_sequence": [
    {
      "jour": 0,
      "sujet": "objet email accrocheur jour 0",
      "corps": "corps complet de l'email de bienvenue/découverte de 150 mots avec call to action"
    },
    {
      "jour": 3,
      "sujet": "objet email jour 3 avec preuve sociale",
      "corps": "corps complet de l'email de relance avec témoignage de 150 mots"
    },
    {
      "jour": 7,
      "sujet": "objet email urgence jour 7",
      "corps": "corps complet de l'email d'urgence et dernière chance de 150 mots"
    }
  ],
  "posts_reseaux": {
    "linkedin": "post LinkedIn complet de 200 mots avec storytelling et call to action",
    "instagram_caption": "caption Instagram engageante avec emojis et hashtags",
    "twitter_thread": [
      "tweet 1 accroche (280 chars max)",
      "tweet 2 développement (280 chars max)",
      "tweet 3 call to action (280 chars max)"
    ]
  }
}`
  },
  {
    id: "cover",
    name: "Agent Visuel",
    icon: "🖼️",
    description: "Prompt DALL-E & stratégie de prix",
    color: "#34d399",
    systemPrompt: `Tu es un expert en design de couvertures d'ebooks et en stratégie de pricing pour les produits digitaux.
Réponds UNIQUEMENT en JSON valide sans markdown ni backticks:
{
  "prompt_dalle": "Detailed prompt in English for DALL-E to generate a professional ebook cover: specify exact style (modern/minimalist/bold), color palette (exact colors), typography style, visual elements, mood, lighting, composition. Make it highly specific and professional.",
  "prompt_dalle_fr": "Même prompt détaillé en français pour comprendre ce qui sera généré",
  "palette_couleurs": ["#couleur1hexadecimal", "#couleur2hexadecimal", "#couleur3hexadecimal"],
  "style_visuel": "description détaillée du style visuel recommandé pour cet ebook et pourquoi",
  "strategie_prix": {
    "prix_lancement": "17",
    "prix_normal": "27",
    "prix_premium_bundle": "47",
    "justification": "explication détaillée de la stratégie de prix et pourquoi ces montants sont optimaux pour cette niche"
  },
  "plateformes_recommandees": [
    {
      "nom": "Gumroad",
      "commission": "10%",
      "avantage": "simple à utiliser, idéal pour débuter, paiement immédiat"
    },
    {
      "nom": "Systeme.io",
      "commission": "0%",
      "avantage": "gratuit, tunnel de vente intégré, email marketing inclus"
    },
    {
      "nom": "Payhip",
      "commission": "5%",
      "avantage": "faible commission, interface propre, marketing affilié intégré"
    }
  ],
  "checklist_lancement": [
    "étape 1 détaillée",
    "étape 2 détaillée",
    "étape 3 détaillée",
    "étape 4 détaillée",
    "étape 5 détaillée"
  ]
}`
  },
  {
    id: "publish",
    name: "Agent Publication",
    icon: "🚀",
    description: "Publie automatiquement sur Gumroad",
    color: "#ff6b6b",
    systemPrompt: `Tu es un expert en publication et vente d'ebooks sur Gumroad. Tu prépares les données finales optimisées pour maximiser les conversions.
Réponds UNIQUEMENT en JSON valide sans markdown ni backticks:
{
  "gumroad_name": "nom du produit optimisé pour le SEO Gumroad (max 100 caractères)",
  "gumroad_description": "<h2>Titre accrocheur</h2><p>Introduction percutante de l'ebook (2-3 phrases)</p><h2>Ce que tu vas apprendre</h2><ul><li>Point 1 concret</li><li>Point 2 concret</li><li>Point 3 concret</li><li>Point 4 concret</li><li>Point 5 concret</li></ul><h2>Pour qui est cet ebook ?</h2><p>Description précise de la cible idéale</p><h2>Ce qui est inclus</h2><ul><li>L'ebook complet (50+ pages)</li><li>Bonus 1</li><li>Bonus 2</li></ul><h2>Garantie</h2><p>Texte de garantie satisfait ou remboursé</p>",
  "gumroad_price_cents": "1700",
  "tags": ["tag-pertinent-1", "tag-pertinent-2", "tag-pertinent-3", "tag-pertinent-4"],
  "resume_produit": "résumé complet de tout ce qui a été créé par les 6 agents pour ce business"
}`
  }
];

// ─── Agent Card ───────────────────────────────────────────────────────────────
const AgentCard = ({ agent, status, onClick }) => (
  <div
    onClick={status === "done" ? onClick : undefined}
    style={{
      border: `1px solid ${status === "idle" ? "#1a1a2e" : status === "error" ? "#ef4444" : agent.color}`,
      background: "#0d0d1a",
      opacity: status === "idle" ? 0.5 : 1,
      borderRadius: 12,
      padding: "13px 16px",
      cursor: status === "done" ? "pointer" : "default",
      transition: "all 0.3s",
      position: "relative",
      overflow: "hidden",
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
        ✗ Erreur — vérifier la clé API
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
              <div style={{
                background: "#07070f", border: "1px solid #1a1a2e",
                borderRadius: 8, padding: 10, marginBottom: 6
              }}>
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
    return (
      <div style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
        {String(val)}
      </div>
    );
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "#000000dd", zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#0d0d1a", border: `1px solid ${agent.color}`,
          borderRadius: 16, padding: 24, maxWidth: 720, width: "100%",
          maxHeight: "85vh", overflow: "auto",
          boxShadow: `0 0 60px ${agent.color}30`
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 24 }}>{agent.icon}</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontFamily: "monospace", fontSize: 14 }}>
                {agent.name}
              </div>
              <div style={{ color: agent.color, fontSize: 11 }}>Résultats complets</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#1a1a2e", border: "none", color: "#888",
              borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 12
            }}
          >
            ✕ Fermer
          </button>
        </div>
        {Object.entries(data).map(([key, val]) => (
          <div key={key} style={{
            marginBottom: 14, padding: 16,
            background: "#070710", borderRadius: 10, border: "1px solid #1a1a2e"
          }}>
            <div style={{
              color: agent.color, fontSize: 11, fontFamily: "monospace",
              fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1
            }}>
              {key.replace(/_/g, " ")}
            </div>
            {renderValue(val)}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Gumroad Panel ────────────────────────────────────────────────────────────
const GumroadPanel = ({ results, gumroadToken, setGumroadToken }) => {
  const [status, setStatus] = useState("idle");
  const [productUrl, setProductUrl] = useState(null);
  const [error, setError] = useState(null);

  const publish = async () => {
    if (!gumroadToken.trim()) { setError("Token Gumroad requis !"); return; }
    setStatus("loading"); setError(null);
    const pub = results.publish;
    let priceCents = parseInt(pub?.gumroad_price_cents) || 1700;
    try {
      const body = new URLSearchParams();
      body.append("access_token", gumroadToken.trim());
      body.append("name", pub?.gumroad_name || results.plan?.titre_principal || "Mon Ebook");
      body.append("price", priceCents);
      body.append("description", pub?.gumroad_description || "");
      body.append("published", "false");
      if (pub?.tags) pub.tags.forEach(t => body.append("tags[]", t));

      const res = await fetch("https://api.gumroad.com/v2/products", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString()
      });
      const data = await res.json();

      if (data.success) {
        setProductUrl(data.product?.short_url || `https://app.gumroad.com/products/${data.product?.id}`);
        setStatus("success");
      } else {
        setError(data.message || "Erreur Gumroad");
        setStatus("error");
      }
    } catch (e) {
      setError("Erreur réseau : " + e.message);
      setStatus("error");
    }
  };

  return (
    <div style={{
      marginTop: 24, background: "#0d0d1a",
      border: "1px solid #ff6b6b", borderRadius: 16, padding: 22,
      boxShadow: "0 0 30px #ff6b6b18"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <span style={{ fontSize: 22 }}>🚀</span>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontFamily: "monospace", fontSize: 13 }}>
            AGENT PUBLICATION — GUMROAD
          </div>
          <div style={{ color: "#ff6b6b", fontSize: 11 }}>Publication automatique de ton ebook</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
        {[
          { label: "Titre produit", val: results.publish?.gumroad_name || results.plan?.titre_principal },
          { label: "Prix", val: results.publish?.gumroad_price_cents ? (parseInt(results.publish.gumroad_price_cents) / 100) + "€" : "17€" },
          { label: "Statut initial", val: "Brouillon (draft)" },
        ].map((item, i) => (
          <div key={i} style={{
            background: "#070710", borderRadius: 10, padding: 12, border: "1px solid #1a1a2e"
          }}>
            <div style={{ color: "#555", fontSize: 10, marginBottom: 4 }}>{item.label}</div>
            <div style={{ color: "#ff6b6b", fontSize: 12, fontWeight: 700, wordBreak: "break-all" }}>
              {item.val || "—"}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ color: "#555", fontSize: 11, marginBottom: 6, fontFamily: "monospace" }}>
          GUMROAD ACCESS TOKEN &nbsp;
          <a
            href="https://app.gumroad.com/settings/advanced"
            target="_blank" rel="noreferrer"
            style={{ color: "#ff6b6b", fontSize: 10, textDecoration: "underline" }}
          >
            → app.gumroad.com/settings/advanced
          </a>
        </div>
        <input
          type="password"
          value={gumroadToken}
          onChange={e => setGumroadToken(e.target.value)}
          placeholder="Colle ton token Gumroad ici..."
          style={{
            width: "100%", background: "#070710", border: "1px solid #1a1a2e",
            borderRadius: 10, padding: "11px 16px", color: "#fff",
            fontSize: 13, fontFamily: "monospace", boxSizing: "border-box", outline: "none"
          }}
        />
        <div style={{ color: "#333", fontSize: 10, marginTop: 5 }}>
          🔒 Envoyé directement à l'API Gumroad — jamais stocké ni partagé
        </div>
      </div>

      {error && (
        <div style={{
          background: "#1a0a0a", border: "1px solid #ef4444",
          borderRadius: 8, padding: "10px 14px", color: "#ef4444", fontSize: 12, marginBottom: 14
        }}>
          ⚠️ {error}
        </div>
      )}

      {status === "success" && productUrl && (
        <div style={{
          background: "#0a1a0a", border: "1px solid #34d399",
          borderRadius: 12, padding: 16, marginBottom: 14
        }}>
          <div style={{ color: "#34d399", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
            ✅ Produit créé en brouillon sur Gumroad !
          </div>
          <div style={{ color: "#555", fontSize: 11, marginBottom: 12 }}>
            Il est en mode draft. Va sur Gumroad, ajoute ton PDF et clique Publish.
          </div>
          <a
            href={productUrl} target="_blank" rel="noreferrer"
            style={{
              display: "inline-block", background: "#34d399", color: "#000",
              padding: "8px 18px", borderRadius: 8, fontSize: 12,
              fontWeight: 700, textDecoration: "none", fontFamily: "monospace"
            }}
          >
            → Voir le produit sur Gumroad
          </a>
        </div>
      )}

      <button
        onClick={publish}
        disabled={status === "loading" || status === "success"}
        style={{
          width: "100%",
          background: status === "success" ? "#1a1a2e" : status === "loading" ? "#1a1a2e" : "linear-gradient(135deg, #ff6b6b, #ff4757)",
          border: "none", borderRadius: 10, padding: "13px",
          color: status === "success" ? "#34d399" : status === "loading" ? "#ff6b6b" : "#fff",
          fontWeight: 700, fontSize: 13,
          cursor: status === "loading" || status === "success" ? "not-allowed" : "pointer",
          fontFamily: "monospace", letterSpacing: 0.5, transition: "all 0.2s"
        }}
      >
        {status === "loading" ? "⏳ Publication en cours..." : status === "success" ? "✅ Publié avec succès !" : "🚀 PUBLIER SUR GUMROAD"}
      </button>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
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

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (msg, color = "#555") =>
    setLogs(prev => [...prev, { msg, color, time: new Date().toLocaleTimeString() }]);

  // ✅ Google Gemini API — 100% GRATUIT
  const callGemini = async (agent, context) => {
    const prompt = `${agent.systemPrompt}

Niche/Sujet: "${niche}"
${context ? `\nContexte des agents précédents:\n${JSON.stringify(context, null, 2)}` : ""}

Réponds UNIQUEMENT avec du JSON valide, sans markdown, sans backticks, sans aucun texte avant ou après le JSON.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
            responseMimeType: "application/json"
          }
        })
      }
    );

    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  };

  const runPipeline = async () => {
    if (!niche.trim() || !apiKey.trim()) return;
    setRunning(true);
    setAgentStatus({});
    setAgentResults({});
    setLogs([]);
    setShowGumroad(false);

    addLog("🚀 Démarrage du pipeline (Google Gemini — gratuit)...", "#fff");
    addLog(`📌 Niche : "${niche}"`, "#a78bfa");
    addLog(`⏱ Temps estimé : 2 à 4 minutes`, "#3a3a5a");

    let context = {};

    for (let i = 0; i < AGENTS.length; i++) {
      const agent = AGENTS[i];
      setAgentStatus(prev => ({ ...prev, [agent.id]: "running" }));
      addLog(`\n⚡ ${agent.icon} ${agent.name}...`, agent.color);

      try {
        const result = await callGemini(agent, i > 0 ? context : null);
        context[agent.id] = result;
        setAgentResults(prev => ({ ...prev, [agent.id]: result }));
        setAgentStatus(prev => ({ ...prev, [agent.id]: "done" }));

        const nbChapitres = result.chapitres?.length;
        const firstKey = Object.keys(result)[0];
        const preview = typeof result[firstKey] === "string"
          ? result[firstKey].slice(0, 60) + "..."
          : "données générées ✓";
        addLog(`  ✓ Terminé${nbChapitres ? ` — ${nbChapitres} chapitres rédigés` : ""}`, agent.color);
        addLog(`  └─ ${preview}`, "#2a2a4a");

      } catch (e) {
        setAgentStatus(prev => ({ ...prev, [agent.id]: "error" }));
        addLog(`  ✗ Erreur: ${e.message}`, "#ef4444");
      }
    }

    setShowGumroad(true);
    addLog("\n🎉 Pipeline complet ! Ebook entier généré gratuitement.", "#00ffd5");
    addLog("👆 Clique sur chaque agent pour voir ses résultats.", "#555");
    setRunning(false);
  };

  const completedCount = Object.values(agentStatus).filter(s => s === "done").length;
  const progress = (completedCount / AGENTS.length) * 100;

  return (
    <div style={{
      minHeight: "100vh", background: "#070710",
      fontFamily: "'Space Mono', monospace", padding: "24px 18px", color: "#fff"
    }}>
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
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: "linear-gradient(135deg, #00ffd5, #ff6b6b)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22
          }}>⚡</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: 1 }}>
              EBOOK AGENT PIPELINE
            </h1>
            <div style={{ color: "#3a3a5a", fontSize: 11, marginTop: 2 }}>
              6 agents IA · Google Gemini{" "}
              <span style={{ color: "#34d399", fontWeight: 700 }}>GRATUIT</span>
              {" "}· Ebook complet tous chapitres · Publication Gumroad auto
            </div>
          </div>
        </div>

        {/* Banner gratuit */}
        <div style={{
          background: "#0a1a0a", border: "1px solid #34d399",
          borderRadius: 10, padding: "12px 16px", marginBottom: 16,
          display: "flex", alignItems: "center", gap: 12
        }}>
          <span style={{ fontSize: 20 }}>🆓</span>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#34d399", fontSize: 12, fontWeight: 700 }}>
              100% GRATUIT — Google Gemini 1.5 Flash
            </div>
            <div style={{ color: "#2a4a2a", fontSize: 10, marginTop: 2 }}>
              1500 requêtes/jour · Aucune carte bancaire · Clé en 30 secondes
            </div>
          </div>
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank" rel="noreferrer"
            style={{
              background: "#34d399", color: "#000", padding: "7px 14px",
              borderRadius: 8, fontSize: 11, fontWeight: 700,
              textDecoration: "none", whiteSpace: "nowrap"
            }}
          >
            → Obtenir ma clé gratuite
          </a>
        </div>

        {/* Config */}
        <div style={{
          background: "#0d0d1a", border: "1px solid #1a1a2e",
          borderRadius: 14, padding: 20, marginBottom: 16
        }}>
          <div style={{ color: "#3a3a5a", fontSize: 10, marginBottom: 14, letterSpacing: 1 }}>
            ⚙️ CONFIGURATION
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ color: "#555", fontSize: 10, marginBottom: 6 }}>
              GOOGLE GEMINI API KEY (GRATUIT) &nbsp;
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank" rel="noreferrer"
                style={{ color: "#34d399", fontSize: 10, textDecoration: "underline" }}
              >
                → aistudio.google.com/apikey
              </a>
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              disabled={running}
              style={{
                width: "100%", background: "#070710", border: "1px solid #1a1a2e",
                borderRadius: 10, padding: "11px 14px", color: "#fff",
                fontSize: 13, fontFamily: "monospace"
              }}
            />
          </div>

          <div>
            <div style={{ color: "#555", fontSize: 10, marginBottom: 6 }}>
              NICHE / SUJET DE TON EBOOK
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                value={niche}
                onChange={e => setNiche(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !running && niche.trim() && apiKey.trim() && runPipeline()}
                placeholder="ex: Gagner 1000€/mois avec l'IA pour débutants en 2026..."
                disabled={running}
                style={{
                  flex: 1, background: "#070710", border: "1px solid #1a1a2e",
                  borderRadius: 10, padding: "11px 14px", color: "#fff",
                  fontSize: 13, fontFamily: "monospace"
                }}
              />
              <button
                onClick={runPipeline}
                disabled={running || !niche.trim() || !apiKey.trim()}
                style={{
                  background: running || !niche.trim() || !apiKey.trim()
                    ? "#1a1a2e"
                    : "linear-gradient(135deg, #00ffd5, #00b4d8)",
                  border: "none", borderRadius: 10, padding: "11px 22px",
                  color: running || !niche.trim() || !apiKey.trim() ? "#3a3a5a" : "#000",
                  fontWeight: 700, fontSize: 13,
                  cursor: running || !niche.trim() || !apiKey.trim() ? "not-allowed" : "pointer",
                  fontFamily: "monospace", whiteSpace: "nowrap", transition: "all 0.2s"
                }}
              >
                {running ? "⏳ EN COURS..." : "▶ LANCER"}
              </button>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {completedCount > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "#3a3a5a", fontSize: 10 }}>PROGRESSION</span>
              <span style={{ color: "#00ffd5", fontSize: 10 }}>
                {completedCount}/{AGENTS.length} agents
              </span>
            </div>
            <div style={{ background: "#1a1a2e", borderRadius: 4, height: 3 }}>
              <div style={{
                height: "100%", width: `${progress}%`,
                background: "linear-gradient(90deg, #00ffd5, #ff6b6b)",
                borderRadius: 4, transition: "width 0.6s ease"
              }} />
            </div>
          </div>
        )}

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>

          {/* Agents list */}
          <div>
            <div style={{ color: "#3a3a5a", fontSize: 10, letterSpacing: 1, marginBottom: 10 }}>
              AGENTS IA
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {AGENTS.map((agent, i) => (
                <div key={agent.id}>
                  <AgentCard
                    agent={agent}
                    status={agentStatus[agent.id] || "idle"}
                    onClick={() => {
                      if (agentResults[agent.id]) setModalAgent(agent);
                    }}
                  />
                  {i < AGENTS.length - 1 && (
                    <div style={{ width: 1, height: 6, background: "#1a1a2e", margin: "0 20px" }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Logs */}
          <div>
            <div style={{ color: "#3a3a5a", fontSize: 10, letterSpacing: 1, marginBottom: 10 }}>
              LOGS EN TEMPS RÉEL
            </div>
            <div style={{
              background: "#030308", border: "1px solid #1a1a2e",
              borderRadius: 12, padding: 14, height: 410, overflow: "auto", fontSize: 11
            }}>
              {logs.length === 0 ? (
                <div style={{ color: "#1a1a2e", textAlign: "center", paddingTop: 170 }}>
                  En attente du démarrage...
                </div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} style={{ marginBottom: 3 }}>
                    <span style={{ color: "#2a2a4a" }}>[{log.time}] </span>
                    <span style={{ color: log.color }}>{log.msg}</span>
                  </div>
                ))
              )}
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
            <div style={{
              background: "#0d0d1a", border: "1px solid #00ffd544",
              borderRadius: 14, padding: 18, boxShadow: "0 0 30px #00ffd510"
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { label: "Titre ebook", val: agentResults.plan?.titre_principal, color: "#a78bfa" },
                  { label: "Score marché", val: (agentResults.research?.score_marche || "—") + "/10", color: "#00ffd5" },
                  { label: "Validation", val: agentResults.research?.validation, color: agentResults.research?.validation === "GO" ? "#34d399" : "#ef4444" },
                  { label: "Prix lancement", val: agentResults.cover?.strategie_prix?.prix_lancement ? agentResults.cover.strategie_prix.prix_lancement + "€" : "—", color: "#fb923c" },
                  { label: "Chapitres rédigés", val: (agentResults.content?.chapitres?.length || "—") + " chapitres complets", color: "#34d399" },
                  { label: "Prompt DALL-E", val: agentResults.cover?.prompt_dalle ? "✓ Prêt à copier" : "—", color: "#f472b6" },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: "#070710", borderRadius: 10, padding: 12, border: "1px solid #1a1a2e"
                  }}>
                    <div style={{ color: "#3a3a5a", fontSize: 10, marginBottom: 4 }}>{item.label}</div>
                    <div style={{ color: item.color, fontSize: 12, fontWeight: 700 }}>
                      {item.val || "—"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Gumroad panel */}
        {showGumroad && (
          <GumroadPanel
            results={agentResults}
            gumroadToken={gumroadToken}
            setGumroadToken={setGumroadToken}
          />
        )}

      </div>

      {/* Modal */}
      {modalAgent && agentResults[modalAgent.id] && (
        <ResultModal
          agent={modalAgent}
          data={agentResults[modalAgent.id]}
          onClose={() => setModalAgent(null)}
        />
      )}
    </div>
  );
}
