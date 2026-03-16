import { useState, useRef, useEffect } from "react";

// ─── ÉCRITURE HUMAINE ────────────────────────────────────────────────────────
const STYLE = `RÈGLES D'ÉCRITURE — style 100% humain, jamais détectable comme IA:
- Écris comme un ami expert qui parle à quelqu'un qu'il connaît. Chaleureux, direct, parfois familier.
- JAMAIS: "Il est important de noter", "En conclusion", "Il convient de", "Plongeons dans", "N'hésitez pas".
- Phrases courtes. Alterne avec des phrases plus longues pour le rythme. Paragraphes de 3-5 lignes max.
- Commence parfois par "Et", "Mais", "Donc", "Car" — comme dans la vraie vie.
- Exemples concrets avec prénoms fictifs: "Sophie, une de mes lectrices, m'a dit que..."
- Questions rhétoriques: "Tu te demandes peut-être pourquoi ? Bonne question."
- Moments de vulnérabilité: "J'ai mis du temps à comprendre ça moi-même..."
- Humour léger, parenthèses conversationnelles.
- MINIMUM 600 MOTS PAR SECTION. Compte tes mots. Développe vraiment.`;

// ─── AGENTS ──────────────────────────────────────────────────────────────────
const AGENTS = [
  {
    id: "research", name: "Agent Recherche", icon: "🔍", color: "#00ffd5",
    maxTokens: 1500,
    prompt: (niche) => ({
      system: `Expert en marketing digital. Réponds UNIQUEMENT en JSON valide sans markdown:
{"validation":"GO ou NO-GO","score_marche":"X/10","audience_cible":"description détaillée","probleme_resolu":"description profonde","concurrence":"analyse détaillée","prix_recommande":"fourchette avec justification","angle_unique":"positionnement différenciant","mots_cles":["m1","m2","m3","m4","m5"],"tendances":"tendances 2025-2026","canaux":["canal 1","canal 2","canal 3"],"verdict":"analyse complète 5-6 phrases"}`,
      user: `Niche: "${niche}". Réponds uniquement en JSON valide.`
    })
  },
  {
    id: "plan", name: "Agent Structure", icon: "📋", color: "#a78bfa",
    maxTokens: 2000,
    prompt: (niche) => ({
      system: `Expert en ingénierie pédagogique. Plan pour débutants complets, 6 chapitres progressifs. Réponds UNIQUEMENT en JSON valide sans markdown:
{"titre_principal":"titre accrocheur","sous_titre":"sous-titre clair","promesse":"transformation mesurable","niveau":"Débutant complet","chapitres":[{"numero":1,"titre":"titre ch1","sous_titre":"sous-titre","objectif":"compétence acquise","sections":["1.1 — titre","1.2 — titre","1.3 — titre","1.4 — titre"],"exercice":"exercice concret"},{"numero":2,"titre":"titre ch2","sous_titre":"sous-titre","objectif":"objectif","sections":["2.1 — titre","2.2 — titre","2.3 — titre","2.4 — titre"],"exercice":"exercice"},{"numero":3,"titre":"titre ch3","sous_titre":"sous-titre","objectif":"objectif","sections":["3.1 — titre","3.2 — titre","3.3 — titre","3.4 — titre"],"exercice":"exercice"},{"numero":4,"titre":"titre ch4","sous_titre":"sous-titre","objectif":"objectif","sections":["4.1 — titre","4.2 — titre","4.3 — titre","4.4 — titre"],"exercice":"exercice"},{"numero":5,"titre":"titre ch5","sous_titre":"sous-titre","objectif":"objectif","sections":["5.1 — titre","5.2 — titre","5.3 — titre","5.4 — titre"],"exercice":"exercice"},{"numero":6,"titre":"titre ch6","sous_titre":"sous-titre","objectif":"objectif","sections":["6.1 — titre","6.2 — titre","6.3 — titre","6.4 — titre"],"exercice":"exercice"}],"bonus":[{"titre":"Bonus 1","desc":"valeur du bonus"},{"titre":"Bonus 2","desc":"valeur"}]}`,
      user: `Niche: "${niche}". Crée un plan pour débutants complets. JSON valide uniquement.`
    })
  },
  {
    id: "marketing", name: "Agent Marketing", icon: "🎯", color: "#f472b6",
    maxTokens: 3000,
    prompt: (niche, ctx) => ({
      system: `Expert copywriter. Réponds UNIQUEMENT en JSON valide sans markdown:
{"page_de_vente":{"headline":"titre accrocheur","sous_headline":"sous-titre","storytelling":"histoire 200 mots","probleme":"100 mots","solution":"100 mots","benefices":["b1","b2","b3","b4","b5","b6"],"pour_qui":"80 mots","temoignages":[{"prenom":"Prénom","age":"XX ans","resultat":"résultat chiffré","texte":"80 mots crédibles"},{"prenom":"Prénom2","age":"XX ans","resultat":"résultat","texte":"80 mots"}],"offre":"description complète","prix_barre":"XX€","prix_actuel":"XX€","cta":"texte bouton","garantie":"garantie 30 jours détaillée","faq":[{"q":"question","r":"réponse"},{"q":"question","r":"réponse"},{"q":"question","r":"réponse"}]},"emails":[{"jour":0,"sujet":"sujet","corps":"250 mots"},{"jour":2,"sujet":"sujet","corps":"220 mots"},{"jour":4,"sujet":"sujet","corps":"220 mots"},{"jour":6,"sujet":"sujet","corps":"250 mots"}],"social":{"linkedin":"300 mots","instagram":"caption + hashtags","tiktok":"script 60s","twitter":["tweet1","tweet2","tweet3","tweet4","tweet5"]}}`,
      user: `Niche: "${niche}". Titre: "${ctx?.plan?.titre_principal || ""}". Crée les assets marketing complets. JSON valide uniquement.`
    })
  },
  {
    id: "cover", name: "Agent Visuel", icon: "🖼️", color: "#34d399",
    maxTokens: 1500,
    prompt: (niche, ctx) => ({
      system: `Expert en design et stratégie de lancement. Réponds UNIQUEMENT en JSON valide sans markdown:
{"prompt_couverture":"prompt DALL-E 3 détaillé en anglais pour couverture ebook portrait","prompt_banniere":"prompt DALL-E 3 pour bannière 16:9 réseaux sociaux","prompt_mockup":"prompt DALL-E 3 pour mockup 3D ebook sur bureau","description_fr":"description française des 3 visuels","palette":["#hex1 — nom","#hex2 — nom","#hex3 — nom"],"prix_lancement":"17","prix_standard":"27","prix_bundle":"47","justification_prix":"explication psychologique","lancement":{"avant":["action1","action2","action3"],"jour_j":["action1","action2","action3"],"apres":["action1","action2","action3"]}}`,
      user: `Niche: "${niche}". Titre: "${ctx?.plan?.titre_principal || ""}". JSON valide uniquement.`
    })
  },
  {
    id: "publish", name: "Agent Publication", icon: "🚀", color: "#ff6b6b",
    maxTokens: 2000,
    prompt: (niche, ctx) => ({
      system: `Expert Gumroad. Réponds UNIQUEMENT en JSON valide sans markdown:
{"nom":"nom produit SEO max 80 chars","description_html":"<h2>titre</h2><p>intro</p><h2>Ce que tu vas apprendre</h2><ul><li>point1</li><li>point2</li><li>point3</li><li>point4</li><li>point5</li></ul><h2>Pour qui</h2><p>cible</p><h2>Inclus</h2><ul><li>Ebook 90+ pages</li><li>Bonus 1</li><li>Bonus 2</li></ul><h2>Garantie 30 jours</h2><p>garantie</p>","prix_cents":"1700","tags":["tag1","tag2","tag3","tag4","tag5"],"url":"url-seo","email_confirmation":"email acheteur 150 mots","checklist":["étape 1","étape 2","étape 3","étape 4","étape 5","étape 6"]}`,
      user: `Niche: "${niche}". Titre: "${ctx?.plan?.titre_principal || ""}". JSON valide uniquement.`
    })
  }
];

// ─── APPEL API ────────────────────────────────────────────────────────────────
const api = async (apiKey, system, user, maxTokens = 2000) => {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: maxTokens,
      temperature: 0.85,
      response_format: { type: "json_object" },
      messages: [{ role: "system", content: system }, { role: "user", content: user }]
    })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  const text = data.choices?.[0]?.message?.content || "{}";
  return JSON.parse(text);
};

// ─── GÉNÉRATION D'UNE SECTION ─────────────────────────────────────────────────
const genSection = async (apiKey, titre, chapNum, chapTitre, niche, audience) => {
  return api(apiKey,
    `${STYLE}\nRéponds UNIQUEMENT en JSON: {"titre":"titre exact","contenu":"contenu MINIMUM 600 MOTS. Texte en paragraphes séparés par deux sauts de ligne. Jamais de listes à puces dans le contenu. Exemples avec prénoms fictifs. Style humain et chaleureux."}`,
    `Ebook sur: "${niche}"\nPublic: ${audience}\nChapitre ${chapNum}: "${chapTitre}"\nSection: "${titre}"\n\nRédige cette section avec MINIMUM 600 mots. Développe vraiment. Style humain. Pas de style IA.`,
    1600
  );
};

// ─── GÉNÉRATION DU HTML POUR PDF ──────────────────────────────────────────────
const buildHtml = (results) => {
  const plan = results.plan || {};
  const content = results.content || {};
  const chapters = content.chapitres || [];
  const intro = content.introduction || {};
  const conclusion = content.conclusion || {};

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&family=Inter:wght@400;500;600;700;800&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'Merriweather',Georgia,serif;color:#1a1a2e;background:#fff;font-size:13.5px;line-height:1.95;}
    .cover{background:linear-gradient(135deg,#0d0d2a,#1a0d3a,#0d1a2e);color:#fff;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:60px 80px;}
    .cover-label{font-family:'Inter',sans-serif;font-size:11px;letter-spacing:4px;color:#00ffd5;margin-bottom:28px;text-transform:uppercase;}
    .cover-title{font-family:'Inter',sans-serif;font-size:42px;font-weight:800;line-height:1.2;margin-bottom:20px;color:#fff;}
    .cover-sub{font-size:17px;color:#8888bb;margin-bottom:44px;font-weight:300;max-width:560px;line-height:1.8;}
    .cover-badges{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;}
    .badge{background:rgba(167,139,250,.12);border:1px solid rgba(167,139,250,.3);border-radius:50px;padding:8px 20px;color:#a78bfa;font-family:'Inter',sans-serif;font-size:11px;font-weight:600;}
    .toc{padding:70px 80px;}
    .toc h2{font-family:'Inter',sans-serif;font-size:28px;font-weight:800;color:#0d0d2a;margin-bottom:8px;}
    .toc-line{width:50px;height:4px;background:linear-gradient(90deg,#a78bfa,#00ffd5);border-radius:2px;margin-bottom:36px;}
    .toc-row{display:flex;align-items:center;gap:16px;padding:13px 0;border-bottom:1px solid #f0f0f5;}
    .toc-num{font-family:'Inter',sans-serif;min-width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,#a78bfa,#7c3aed);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;flex-shrink:0;}
    .toc-text{font-family:'Inter',sans-serif;color:#2a2a4a;font-size:14px;font-weight:500;}
    .chapter{padding:70px 80px;}
    .ch-label{font-family:'Inter',sans-serif;font-size:10px;letter-spacing:4px;color:#a78bfa;font-weight:700;margin-bottom:12px;text-transform:uppercase;}
    .ch-title{font-family:'Inter',sans-serif;font-size:32px;font-weight:800;color:#0d0d2a;line-height:1.25;margin-bottom:10px;}
    .ch-sub{font-family:'Inter',sans-serif;font-size:15px;color:#7c7c9a;margin-bottom:34px;font-style:italic;}
    .ch-intro{border-left:4px solid #fb923c;background:#fff9f5;padding:20px 24px;border-radius:0 10px 10px 0;margin-bottom:32px;}
    .ch-intro p{color:#4a2a1a;line-height:2;margin:0;}
    .sec-title{font-family:'Inter',sans-serif;font-size:19px;font-weight:700;color:#2a1a5e;margin:32px 0 14px;padding-bottom:8px;border-bottom:2px solid #f0eeff;}
    .sec-body{color:#3a3a5a;line-height:2.05;}
    .sec-body p{margin-bottom:16px;}
    .box-tip{background:#f0f8ff;border:1px solid #bae6fd;border-radius:12px;padding:20px 24px;margin:26px 0;}
    .box-tip-label{font-family:'Inter',sans-serif;font-size:11px;font-weight:700;color:#0284c7;margin-bottom:8px;letter-spacing:1px;}
    .box-tip p{color:#0c4a6e;line-height:2;margin:0;}
    .box-err{background:#fff5f5;border:1px solid #fecaca;border-radius:12px;padding:20px 24px;margin:26px 0;}
    .box-err-label{font-family:'Inter',sans-serif;font-size:11px;font-weight:700;color:#dc2626;margin-bottom:12px;letter-spacing:1px;}
    .err-item{color:#7f1d1d;font-size:13px;margin-bottom:8px;line-height:1.8;}
    .box-ex{background:#f0fdf4;border:2px solid #86efac;border-radius:12px;padding:24px;margin:26px 0;}
    .box-ex-label{font-family:'Inter',sans-serif;font-size:11px;font-weight:700;color:#16a34a;margin-bottom:8px;letter-spacing:1px;}
    .ex-title{font-family:'Inter',sans-serif;font-size:17px;font-weight:700;color:#14532d;margin-bottom:6px;}
    .ex-meta{font-family:'Inter',sans-serif;font-size:12px;color:#6b7280;margin-bottom:14px;}
    .step{display:flex;gap:12px;align-items:flex-start;margin-bottom:10px;}
    .step-n{min-width:26px;height:26px;border-radius:50%;background:#22c55e;color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;margin-top:2px;}
    .step span{color:#1a3a2a;line-height:1.8;}
    .ex-result{margin-top:14px;padding:10px 14px;background:#bbf7d0;border-radius:8px;color:#065f46;font-family:'Inter',sans-serif;font-size:13px;font-weight:500;}
    .box-key{background:#faf5ff;border:1px solid #e9d5ff;border-radius:12px;padding:20px 24px;margin:26px 0;}
    .box-key-label{font-family:'Inter',sans-serif;font-size:11px;font-weight:700;color:#7c3aed;margin-bottom:8px;letter-spacing:1px;}
    .box-key p{color:#4c1d95;line-height:2;margin:0;}
    .transition{text-align:center;color:#9ca3af;font-style:italic;font-size:13px;padding:22px 0;border-top:1px dashed #e5e7eb;margin-top:18px;}
    .conclusion{padding:70px 80px;}
    .action{display:flex;gap:14px;align-items:flex-start;margin-bottom:14px;}
    .action-w{font-family:'Inter',sans-serif;min-width:42px;height:42px;border-radius:8px;background:linear-gradient(135deg,#34d399,#059669);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;flex-shrink:0;}
    .page-break{page-break-after:always;}
    @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}.page-break{page-break-after:always;}}
  `;

  const renderChapter = (ch) => `
    <div class="chapter">
      <div class="ch-label">CHAPITRE ${ch.numero}</div>
      <div class="ch-title">${ch.titre || ""}</div>
      ${ch.sous_titre ? `<div class="ch-sub">${ch.sous_titre}</div>` : ""}
      ${ch.introduction ? `<div class="ch-intro"><p>${ch.introduction}</p></div>` : ""}
      ${(ch.sections || []).map(s => `
        <div class="sec-title">${s.titre || ""}</div>
        <div class="sec-body">${(s.contenu || "").split("\n\n").map(p => p.trim() ? `<p>${p.replace(/\n/g,"<br/>")}</p>` : "").join("")}</div>
      `).join("")}
      ${ch.conseil ? `<div class="box-tip"><div class="box-tip-label">💡 CONSEIL D'EXPERT</div><p>${ch.conseil}</p></div>` : ""}
      ${ch.erreurs?.length ? `<div class="box-err"><div class="box-err-label">⚠️ ERREURS À ÉVITER</div>${ch.erreurs.map(e=>`<div class="err-item">✗ &nbsp;${e}</div>`).join("")}</div>` : ""}
      ${ch.exercice ? `
        <div class="box-ex">
          <div class="box-ex-label">🏋️ EXERCICE PRATIQUE</div>
          <div class="ex-title">${ch.exercice.titre||""}</div>
          <div class="ex-meta">⏱ ${ch.exercice.duree||"30 min"} &nbsp;·&nbsp; 🎯 ${ch.exercice.objectif||""}</div>
          ${(ch.exercice.etapes||[]).map((e,i)=>`<div class="step"><span class="step-n">${i+1}</span><span>${e}</span></div>`).join("")}
          ${ch.exercice.resultat ? `<div class="ex-result">✅ ${ch.exercice.resultat}</div>` : ""}
        </div>` : ""}
      ${ch.resume ? `<div class="box-key"><div class="box-key-label">📌 CE QU'IL FAUT RETENIR</div><p>${ch.resume}</p></div>` : ""}
      ${ch.transition ? `<div class="transition">${ch.transition}</div>` : ""}
    </div>
    <div class="page-break"></div>
  `;

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"/><title>${plan.titre_principal||"Ebook"}</title>
<style>${css}</style></head><body>
<div class="cover">
  <div class="cover-label">Ebook · Débutant Complet · Zéro Prérequis</div>
  <div class="cover-title">${plan.titre_principal||""}</div>
  <div class="cover-sub">${plan.sous_titre||""}</div>
  <div class="cover-badges">
    <div class="badge">📚 ${chapters.length} Chapitres</div>
    <div class="badge">✏️ 90+ Pages</div>
    <div class="badge">🏋️ Exercices Pratiques</div>
    <div class="badge">⭐ Niveau Débutant</div>
  </div>
</div>
<div class="page-break"></div>
<div class="toc">
  <h2>Table des matières</h2><div class="toc-line"></div>
  <div class="toc-row"><div class="toc-num">📖</div><div class="toc-text">Introduction</div></div>
  ${chapters.map(ch=>`<div class="toc-row"><div class="toc-num">${ch.numero}</div><div class="toc-text">${ch.titre||""}</div></div>`).join("")}
  <div class="toc-row"><div class="toc-num">🎯</div><div class="toc-text">Conclusion & Plan d'action 30 jours</div></div>
</div>
<div class="page-break"></div>
<div class="chapter">
  <div class="ch-label">AVANT-PROPOS</div>
  <div class="ch-title">Introduction</div>
  ${Object.entries(intro).map(([k,v])=>`<div class="sec-title">${k.replace(/_/g," ")}</div><div class="sec-body"><p>${v}</p></div>`).join("")}
</div>
<div class="page-break"></div>
${chapters.map(renderChapter).join("")}
<div class="conclusion">
  <div class="ch-label">POUR FINIR</div>
  <div class="ch-title">Conclusion</div>
  ${conclusion.felicitations ? `<div class="box-tip"><p>${conclusion.felicitations}</p></div>` : ""}
  ${conclusion.recapitulatif ? `<div class="sec-body"><p>${conclusion.recapitulatif}</p></div>` : ""}
  ${conclusion.plan_30j?.length ? `
    <div class="sec-title" style="color:#059669;border-color:#d1fae5">🗓️ Ton Plan d'Action — 30 Jours</div>
    ${conclusion.plan_30j.map((a,i)=>`<div class="action"><div class="action-w">S${i+1}</div><div style="color:#1a3a2a;line-height:1.9;padding-top:10px">${a}</div></div>`).join("")}
  ` : ""}
  ${conclusion.mot_de_fin ? `<div class="box-ex" style="margin-top:32px"><p style="color:#064e3b;font-style:italic;line-height:2">${conclusion.mot_de_fin}</p></div>` : ""}
</div>
<script>window.onload=()=>setTimeout(()=>window.print(),600);</script>
</body></html>`;
};

// ─── GÉNÉRATION ZIP ───────────────────────────────────────────────────────────
const buildAndDownloadZip = async (results, niche) => {
  if (!window.JSZip) {
    await new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  const zip = new window.JSZip();
  const plan = results.plan || {};
  const name = (plan.titre_principal || "ebook").replace(/[^a-zA-Z0-9]/g,"_").slice(0,30);

  // HTML ebook
  zip.file(`${name}_EBOOK.html`, buildHtml(results));

  // Gumroad
  const pub = results.publish || {};
  const cover = results.cover || {};
  zip.file(`${name}_GUMROAD.txt`,
`═══════════════════════════════════════════════
GUMROAD — ${plan.titre_principal||""}
═══════════════════════════════════════════════

NOM DU PRODUIT:
${pub.nom||""}

URL PERSONNALISÉE:
${pub.url||""}

PRIX: ${pub.prix_cents ? parseInt(pub.prix_cents)/100+"€" : "17€"}
(Lancement: ${cover.prix_lancement||"17"}€ — Standard: ${cover.prix_standard||"27"}€ — Bundle: ${cover.prix_bundle||"47"}€)

TAGS SEO:
${(pub.tags||[]).join(", ")}

DESCRIPTION HTML (coller en mode HTML dans Gumroad):
${pub.description_html||""}

EMAIL DE CONFIRMATION ACHETEUR:
${pub.email_confirmation||""}

CHECKLIST DE PUBLICATION:
${(pub.checklist||[]).map((s,i)=>`${i+1}. ${s}`).join("\n")}
`);

  // Page de vente
  const pv = results.marketing?.page_de_vente || {};
  zip.file(`${name}_PAGE_DE_VENTE.txt`,
`═══════════════════════════════════════════════
PAGE DE VENTE — ${plan.titre_principal||""}
═══════════════════════════════════════════════

HEADLINE: ${pv.headline||""}
SOUS-HEADLINE: ${pv.sous_headline||""}

ACCROCHE (storytelling):
${pv.storytelling||""}

PROBLÈME:
${pv.probleme||""}

SOLUTION:
${pv.solution||""}

BÉNÉFICES:
${(pv.benefices||[]).join("\n")}

POUR QUI:
${pv.pour_qui||""}

TÉMOIGNAGES:
${(pv.temoignages||[]).map(t=>`${t.prenom}, ${t.age} — ${t.resultat}\n"${t.texte}"`).join("\n\n")}

OFFRE: ${pv.offre||""}
PRIX BARRÉ: ${pv.prix_barre||""} → PRIX ACTUEL: ${pv.prix_actuel||""}
BOUTON: ${pv.cta||""}

GARANTIE:
${pv.garantie||""}

FAQ:
${(pv.faq||[]).map(f=>`Q: ${f.q||f.question||""}\nR: ${f.r||f.reponse||""}`).join("\n\n")}
`);

  // Emails
  zip.file(`${name}_EMAILS.txt`,
`═══════════════════════════════════════════════
SÉQUENCE EMAILS — ${plan.titre_principal||""}
═══════════════════════════════════════════════
${(results.marketing?.emails||[]).map((e,i)=>`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EMAIL ${i+1} — JOUR ${e.jour}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUJET: ${e.sujet||""}

${e.corps||""}
`).join("\n")}
`);

  // Social
  const s = results.marketing?.social || {};
  zip.file(`${name}_SOCIAL_MEDIA.txt`,
`═══════════════════════════════════════════════
RÉSEAUX SOCIAUX — ${plan.titre_principal||""}
═══════════════════════════════════════════════

LINKEDIN:
${s.linkedin||""}

INSTAGRAM:
${s.instagram||""}

TIKTOK (script 60s):
${s.tiktok||""}

TWITTER/X THREAD:
${(s.twitter||[]).map((t,i)=>`Tweet ${i+1}: ${t}`).join("\n\n")}
`);

  // DALL-E
  zip.file(`${name}_PROMPTS_DALLE.txt`,
`═══════════════════════════════════════════════
PROMPTS DALL-E 3 — ${plan.titre_principal||""}
Colle dans ChatGPT → "Génère cette image"
═══════════════════════════════════════════════

COUVERTURE (portrait 2:3):
${cover.prompt_couverture||""}

BANNIÈRE RÉSEAUX (16:9):
${cover.prompt_banniere||""}

MOCKUP 3D:
${cover.prompt_mockup||""}

DESCRIPTION FRANÇAISE:
${cover.description_fr||""}

PALETTE: ${(cover.palette||[]).join(" · ")}
`);

  // Analyse
  const r = results.research || {};
  zip.file(`${name}_ANALYSE_MARCHE.txt`,
`═══════════════════════════════════════════════
ANALYSE DE MARCHÉ — ${plan.titre_principal||""}
═══════════════════════════════════════════════
VALIDATION: ${r.validation||""} | SCORE: ${r.score_marche||""}
AUDIENCE: ${r.audience_cible||""}
PROBLÈME: ${r.probleme_resolu||""}
CONCURRENCE: ${r.concurrence||""}
PRIX: ${r.prix_recommande||""}
ANGLE: ${r.angle_unique||""}
MOTS-CLÉS: ${(r.mots_cles||[]).join(", ")}
TENDANCES: ${r.tendances||""}
CANAUX: ${(r.canaux||[]).join(" · ")}
VERDICT: ${r.verdict||""}
`);

  // README
  zip.file("README.txt",
`═══════════════════════════════════════════════
DOSSIER COMPLET — ${plan.titre_principal||""}
Créé le ${new Date().toLocaleDateString("fr-FR")}
═══════════════════════════════════════════════

CONTENU:
  📄 ${name}_EBOOK.html     → Ouvre dans Chrome → Ctrl+P → PDF
  📝 ${name}_GUMROAD.txt    → Tout pour créer ta fiche Gumroad
  📝 ${name}_PAGE_DE_VENTE.txt → Headline, storytelling, FAQ, garantie
  📝 ${name}_EMAILS.txt     → 4 emails prêts à configurer
  📝 ${name}_SOCIAL_MEDIA.txt → LinkedIn, Instagram, TikTok, Twitter
  📝 ${name}_PROMPTS_DALLE.txt → 3 prompts images pour ChatGPT
  📝 ${name}_ANALYSE_MARCHE.txt → Analyse complète de ta niche

ÉTAPES:
  1. Ouvre ${name}_EBOOK.html dans Chrome → Ctrl+P → Enregistrer en PDF
  2. Colle les prompts DALL-E dans ChatGPT → télécharge tes 3 visuels
  3. Va sur app.gumroad.com → New Product → copie ${name}_GUMROAD.txt
  4. Upload le PDF + la couverture → Publish → 💰 En vente !
  5. Poste le contenu Social Media + configure les emails dans Brevo (gratuit)
`);

  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${name}_DOSSIER_COMPLET.zip`;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  // UI state seulement — PAS les données volumineuses
  const [niche, setNiche] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [agentStatus, setAgentStatus] = useState({});
  const [logs, setLogs] = useState([]);
  const [wakeLock, setWakeLock] = useState(false);

  // Les données volumineuses dans un REF — ne provoquent JAMAIS de re-render
  const resultsRef = useRef({});
  const wakeLockRef = useRef(null);
  const logsEndRef = useRef(null);

  useEffect(() => { logsEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);

  const log = (msg, color = "#555") =>
    setLogs(prev => [...prev, { msg, color, t: new Date().toLocaleTimeString() }]);

  // Wake Lock
  const acquireWakeLock = async () => {
    try {
      if ("wakeLock" in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
        setWakeLock(true);
        wakeLockRef.current.addEventListener("release", () => { setWakeLock(false); wakeLockRef.current = null; });
      }
    } catch(e) {}
  };
  const releaseWakeLock = () => {
    if (wakeLockRef.current) { wakeLockRef.current.release(); wakeLockRef.current = null; }
    setWakeLock(false);
  };
  useEffect(() => {
    const fn = async () => { if (document.visibilityState === "visible" && running && !wakeLockRef.current) await acquireWakeLock(); };
    document.addEventListener("visibilitychange", fn);
    return () => document.removeEventListener("visibilitychange", fn);
  }, [running]);

  const setStatus = (id, status) => setAgentStatus(prev => ({ ...prev, [id]: status }));

  const run = async () => {
    if (!niche.trim() || !apiKey.trim()) return;
    setRunning(true); setDone(false); setAgentStatus({}); setLogs([]);
    resultsRef.current = {};
    await acquireWakeLock();

    log("🚀 Démarrage du pipeline...", "#fff");
    log(`📌 Niche : "${niche}"`, "#a78bfa");
    log("⏱ Durée estimée : 8–12 minutes", "#3a3a5a");
    if (wakeLockRef.current) log("🔒 Écran maintenu allumé", "#34d399");

    const ctx = () => resultsRef.current;

    // ── Agents principaux ────────────────────────────────────────────────
    for (const agent of AGENTS) {
      setStatus(agent.id, "running");
      log(`\n⚡ ${agent.icon} ${agent.name}...`, agent.color);
      try {
        const p = agent.prompt(niche, ctx());
        const result = await api(apiKey, p.system, p.user, agent.maxTokens);
        resultsRef.current[agent.id] = result;  // stocké dans ref, pas state
        setStatus(agent.id, "done");
        log(`  ✓ Terminé`, agent.color);

        // Après le plan → générer le contenu
        if (agent.id === "plan") {
          setStatus("content", "running");
          log(`\n⚡ ✍️ Agent Contenu — rédaction section par section...`, "#fb923c");

          const planChapitres = result.chapitres || [];
          const audience = ctx().research?.audience_cible || "débutants complets";
          const ebookTitre = result.titre_principal || niche;
          const chapitresRediges = [];

          // Introduction
          log("  📝 Introduction...", "#fb923c");
          const intro = await api(apiKey,
            `${STYLE}\nRéponds en JSON: {"accroche":"200 mots humains","histoire_auteur":"150 mots vécu personnel","ce_que_tu_vas_apprendre":"150 mots concrets","comment_utiliser":"100 mots naturels","encouragement":"80 mots chaleureux"}`,
            `Ebook: "${ebookTitre}"\nNiche: "${niche}"\nPublic: ${audience}\nStyle humain, 600+ mots total. JSON valide.`,
            1200
          );

          // Chapitres
          for (const ch of planChapitres) {
            log(`  📝 Chapitre ${ch.numero}/${planChapitres.length}...`, "#fb923c");
            const sections = [];
            for (const secTitre of (ch.sections || [])) {
              const sec = await genSection(apiKey, secTitre, ch.numero, ch.titre, niche, audience);
              sections.push(sec);
            }

            // Extras du chapitre
            const extras = await api(apiKey,
              `${STYLE}\nRéponds en JSON: {"introduction":"80 mots engageants","conseil":"100 mots pratiques","erreurs":["erreur réaliste 1 avec solution","erreur 2","erreur 3"],"exercice":{"titre":"titre","objectif":"objectif concret","etapes":["étape 1 détaillée","étape 2","étape 3","étape 4"],"duree":"30-45 min","resultat":"résultat tangible"},"resume":"100 mots clés actionnables","transition":"phrase naturelle vers prochain chapitre"}`,
              `Ebook: "${ebookTitre}" — Chapitre ${ch.numero}: "${ch.titre}"\nNiche: "${niche}"\nStyle humain. JSON valide.`,
              1000
            );

            chapitresRediges.push({
              numero: ch.numero,
              titre: ch.titre,
              sous_titre: ch.sous_titre || "",
              sections,
              introduction: extras.introduction,
              conseil: extras.conseil,
              erreurs: extras.erreurs,
              exercice: extras.exercice,
              resume: extras.resume,
              transition: extras.transition
            });

            const mots = sections.reduce((a, s) => a + (s.contenu || "").split(/\s+/).length, 0);
            log(`     ✓ ${sections.length} sections — ~${mots} mots`, "#fb923c");
          }

          // Conclusion
          log("  📝 Conclusion...", "#fb923c");
          const conclusion = await api(apiKey,
            `${STYLE}\nRéponds en JSON: {"felicitations":"100 mots chaleureux","recapitulatif":"200 mots vrais apprentissages","plan_30j":["Semaine 1: action concrète","Semaine 2: action","Semaine 3: action","Semaine 4: action"],"ressources":["ressource gratuite 1","ressource 2","ressource 3"],"mot_de_fin":"120 mots inspirants et humains"}`,
            `Ebook "${ebookTitre}" terminé. Conclusion mémorable et motivante. JSON valide.`,
            1000
          );

          // Stocker dans ref
          resultsRef.current.content = { introduction: intro, chapitres: chapitresRediges, conclusion };
          setStatus("content", "done");

          const totalMots = chapitresRediges.reduce((a, ch) =>
            a + (ch.sections||[]).reduce((b, s) => b + (s.contenu||"").split(/\s+/).length, 0), 0);
          log(`  ✓ Ebook complet — ${chapitresRediges.length} chapitres — ~${totalMots} mots — ~${Math.round(totalMots/300)} pages`, "#fb923c");
        }

      } catch(e) {
        setStatus(agent.id, "error");
        log(`  ✗ Erreur: ${e.message}`, "#ef4444");
      }
    }

    releaseWakeLock();
    log("\n🎉 Tout est prêt ! Télécharge ton dossier ci-dessous.", "#00ffd5");
    setRunning(false);
    setDone(true);  // déclenche l'affichage des livrables
  };

  const handleZip = async () => {
    setDownloading(true);
    try { await buildAndDownloadZip(resultsRef.current, niche); }
    catch(e) { alert("Erreur ZIP: " + e.message); }
    setDownloading(false);
  };

  const handlePdf = () => {
    const html = buildHtml(resultsRef.current);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    if (!w) alert("Autorise les popups du navigateur puis réessaie.");
  };

  const ALL_IDS = [...AGENTS.map(a => a.id), "content"];
  const completedCount = ALL_IDS.filter(id => agentStatus[id] === "done").length;
  const progress = (completedCount / ALL_IDS.length) * 100;

  return (
    <div style={{ minHeight:"100vh", background:"#070710", fontFamily:"'Space Mono',monospace", color:"#fff", padding:"24px 18px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        @keyframes shimmer{0%{transform:translateX(-200%)}100%{transform:translateX(400%)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}
        *{box-sizing:border-box;} input{outline:none!important;}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:#1a1a2e;border-radius:2px}
      `}</style>

      <div style={{ maxWidth:960, margin:"0 auto" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:28 }}>
          <div style={{ width:46, height:46, borderRadius:12, background:"linear-gradient(135deg,#00ffd5,#a78bfa,#ff6b6b)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>⚡</div>
          <div>
            <h1 style={{ margin:0, fontSize:18, fontWeight:700 }}>EBOOK AGENT PIPELINE</h1>
            <div style={{ color:"#3a3a5a", fontSize:11, marginTop:3 }}>GPT-4o · Style humain · 90+ pages · ZIP complet</div>
            {wakeLock && <div style={{ color:"#34d399", fontSize:10, marginTop:3 }}>🔒 Écran maintenu allumé</div>}
          </div>
        </div>

        {/* Config */}
        <div style={{ background:"#0d0d1a", border:"1px solid #1a1a2e", borderRadius:14, padding:22, marginBottom:18 }}>
          <div style={{ marginBottom:14 }}>
            <div style={{ color:"#555", fontSize:10, marginBottom:6 }}>
              OPENAI API KEY &nbsp;
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" style={{ color:"#00ffd5", fontSize:10, textDecoration:"underline" }}>→ Obtenir</a>
              &nbsp;·&nbsp;
              <a href="https://platform.openai.com/settings/billing/overview" target="_blank" rel="noreferrer" style={{ color:"#fb923c", fontSize:10, textDecoration:"underline" }}>→ Ajouter 5$</a>
            </div>
            <input type="password" value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="sk-proj-..." disabled={running}
              style={{ width:"100%", background:"#070710", border:"1px solid #1a1a2e", borderRadius:10, padding:"11px 14px", color:"#fff", fontSize:13, fontFamily:"monospace" }} />
          </div>
          <div>
            <div style={{ color:"#555", fontSize:10, marginBottom:6 }}>NICHE / SUJET</div>
            <div style={{ display:"flex", gap:10 }}>
              <input value={niche} onChange={e=>setNiche(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&!running&&niche.trim()&&apiKey.trim()&&run()}
                placeholder="ex: Gagner 1000€/mois avec l'IA pour débutants..." disabled={running}
                style={{ flex:1, background:"#070710", border:"1px solid #1a1a2e", borderRadius:10, padding:"11px 14px", color:"#fff", fontSize:13, fontFamily:"monospace" }} />
              <button onClick={run} disabled={running||!niche.trim()||!apiKey.trim()}
                style={{ background:running||!niche.trim()||!apiKey.trim()?"#1a1a2e":"linear-gradient(135deg,#00ffd5,#00b4d8)", border:"none", borderRadius:10, padding:"11px 24px", color:running||!niche.trim()||!apiKey.trim()?"#3a3a5a":"#000", fontWeight:700, fontSize:13, cursor:running||!niche.trim()||!apiKey.trim()?"not-allowed":"pointer", fontFamily:"monospace", whiteSpace:"nowrap" }}>
                {running ? "⏳ EN COURS..." : "▶ LANCER"}
              </button>
            </div>
          </div>
        </div>

        {/* Progress */}
        {completedCount > 0 && (
          <div style={{ marginBottom:18 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ color:"#3a3a5a", fontSize:10 }}>PROGRESSION</span>
              <span style={{ color:"#00ffd5", fontSize:10 }}>{completedCount}/{ALL_IDS.length}</span>
            </div>
            <div style={{ background:"#1a1a2e", borderRadius:4, height:4 }}>
              <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg,#00ffd5,#a78bfa,#ff6b6b)", borderRadius:4, transition:"width 0.6s ease" }} />
            </div>
          </div>
        )}

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
          {/* Agents */}
          <div>
            <div style={{ color:"#3a3a5a", fontSize:10, letterSpacing:1, marginBottom:10 }}>AGENTS IA</div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {[...AGENTS, { id:"content", name:"Agent Contenu", icon:"✍️", color:"#fb923c" }].map((agent, i, arr) => {
                const status = agentStatus[agent.id] || "idle";
                return (
                  <div key={agent.id}>
                    <div style={{ border:`1px solid ${status==="idle"?"#1a1a2e":status==="error"?"#ef4444":agent.color}`, background:"#0d0d1a", opacity:status==="idle"?0.45:1, borderRadius:12, padding:"12px 16px", position:"relative", overflow:"hidden", transition:"all 0.3s" }}>
                      {status==="running" && <div style={{ position:"absolute", top:0, left:0, height:2, width:"60%", background:`linear-gradient(90deg,transparent,${agent.color})`, animation:"shimmer 1.2s infinite" }} />}
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <span style={{ fontSize:18 }}>{agent.icon}</span>
                        <div style={{ flex:1, color:"#e2e8f0", fontWeight:700, fontSize:12, fontFamily:"monospace" }}>{agent.name}</div>
                        <div style={{ width:7, height:7, borderRadius:"50%", background:status==="done"?agent.color:status==="running"?agent.color:status==="error"?"#ef4444":"#1e1e3a", boxShadow:status==="running"?`0 0 8px ${agent.color}`:"none", animation:status==="running"?"blink 0.8s infinite":"none" }} />
                      </div>
                      {status==="done" && <div style={{ color:agent.color, fontSize:10, marginTop:3, fontFamily:"monospace" }}>✓ Terminé</div>}
                      {status==="error" && <div style={{ color:"#ef4444", fontSize:10, marginTop:3, fontFamily:"monospace" }}>✗ Erreur</div>}
                    </div>
                    {i < arr.length-1 && <div style={{ width:1, height:5, background:"#1a1a2e", margin:"0 20px" }} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Logs */}
          <div>
            <div style={{ color:"#3a3a5a", fontSize:10, letterSpacing:1, marginBottom:10 }}>LOGS</div>
            <div style={{ background:"#030308", border:"1px solid #1a1a2e", borderRadius:12, padding:14, height:440, overflow:"auto", fontSize:10 }}>
              {logs.length===0
                ? <div style={{ color:"#1a1a2e", textAlign:"center", paddingTop:190 }}>En attente...</div>
                : logs.map((l,i) => (
                  <div key={i} style={{ marginBottom:2 }}>
                    <span style={{ color:"#2a2a4a" }}>[{l.t}] </span>
                    <span style={{ color:l.color }}>{l.msg}</span>
                  </div>
                ))}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>

        {/* LIVRABLES — affiché seulement quand done === true */}
        {done && (
          <div style={{ marginTop:24 }}>
            {/* Téléchargement ZIP */}
            <div style={{ background:"linear-gradient(135deg,#0a0a1a,#140a24)", border:"2px solid #a78bfa", borderRadius:16, padding:28, textAlign:"center", marginBottom:16 }}>
              <div style={{ fontSize:40, marginBottom:12 }}>📦</div>
              <div style={{ color:"#a78bfa", fontSize:11, fontFamily:"monospace", marginBottom:6, letterSpacing:2 }}>LIVRABLE FINAL</div>
              <div style={{ color:"#fff", fontSize:18, fontWeight:700, marginBottom:6 }}>Dossier complet prêt à télécharger</div>
              <div style={{ color:"#555", fontSize:11, marginBottom:22, lineHeight:1.8 }}>
                Ebook HTML · Gumroad · Page de vente · 4 Emails · Social Media · 3 Prompts DALL-E · Analyse marché · README
              </div>
              <button onClick={handleZip} disabled={downloading}
                style={{ background:downloading?"#1a1a2e":"linear-gradient(135deg,#a78bfa,#7c3aed)", border:"none", borderRadius:12, padding:"15px 36px", color:downloading?"#555":"#fff", fontWeight:700, fontSize:15, cursor:downloading?"not-allowed":"pointer", fontFamily:"monospace" }}>
                {downloading ? "⏳ Génération ZIP..." : "⬇️ TÉLÉCHARGER LE ZIP COMPLET"}
              </button>
            </div>

            {/* PDF séparé */}
            <button onClick={handlePdf}
              style={{ width:"100%", background:"#0d0d1a", border:"1px solid #00ffd5", borderRadius:12, padding:16, color:"#00ffd5", cursor:"pointer", fontFamily:"monospace", fontSize:12, fontWeight:700 }}>
              📄 Ouvrir l'ebook &amp; Imprimer en PDF &nbsp;·&nbsp; <span style={{ color:"#3a3a5a", fontWeight:400 }}>Ctrl+P → Enregistrer en PDF</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
