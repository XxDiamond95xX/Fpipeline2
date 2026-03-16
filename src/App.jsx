import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// WRITING STYLE — injecté dans chaque prompt de contenu
// ─────────────────────────────────────────────────────────────────────────────
const HUMAN_WRITING_RULES = `
RÈGLES D'ÉCRITURE ABSOLUES — ton style doit être 100% humain et chaleureux:

1. JAMAIS de formules IA typiques: "Il est important de noter", "En conclusion", "Il convient de souligner", "Dans cette section", "Plongeons dans", "N'hésitez pas à". Ces phrases trahissent l'IA.

2. Écris comme un ami expert qui parle à quelqu'un qu'il connaît. Utilise "tu", sois direct, parfois un peu familier mais toujours respectueux.

3. Utilise des phrases courtes. Alterne avec des phrases plus longues pour le rythme. Fais des paragraphes de 3-5 lignes maximum.

4. Commence parfois des phrases par "Et", "Mais", "Donc", "Car" — comme dans la vraie vie.

5. Partage des anecdotes concrètes, des exemples tirés de la vraie vie avec des prénoms fictifs (ex: "Marie, une de mes clientes, a...").

6. Pose des questions rhétoriques pour maintenir l'engagement: "Tu te demandes peut-être pourquoi ? Bonne question."

7. Utilise des transitions naturelles entre les idées, jamais de "Premièrement, Deuxièmement, Troisièmement".

8. Inclus des moments d'humour léger et des parenthèses conversationnelles.

9. Montre de la vulnérabilité: "J'ai mis du temps à comprendre ça moi-même..." ou "Je me souviens encore de la première fois que..."

10. Chaque section doit faire MINIMUM 600 mots réels. C'est non négociable. Un lecteur qui paie s'attend à du contenu dense et utile.
`;

// ─────────────────────────────────────────────────────────────────────────────
// AGENTS
// ─────────────────────────────────────────────────────────────────────────────
const AGENTS = [
  {
    id: "research",
    name: "Agent Recherche",
    icon: "🔍",
    description: "Analyse de marché approfondie",
    color: "#00ffd5",
    maxTokens: 1500,
    systemPrompt: `Tu es un expert senior en marketing digital et analyse de marché.
Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks:
{
  "validation": "GO ou NO-GO",
  "score_marche": "X/10",
  "audience_cible": "Description très détaillée: qui sont ces personnes, âge, situation, frustrations quotidiennes, aspirations profondes, ce qui les empêche de dormir la nuit",
  "probleme_resolu": "Description profonde et empathique du problème vécu au quotidien, pourquoi les solutions existantes les déçoivent, l'impact émotionnel de ce problème",
  "concurrence": "Analyse détaillée des concurrents existants, leurs forces, leurs faiblesses, les angles non exploités",
  "prix_recommande": "Fourchette précise avec justification psychologique et économique",
  "angle_unique": "Ce qui rend cet ebook unique et indispensable, le positionnement différenciant en 3-4 phrases concrètes",
  "mots_cles": ["mot1","mot2","mot3","mot4","mot5","mot6"],
  "tendances_marche": "Tendances 2025-2026 qui soutiennent cette niche et pourquoi c'est le bon moment",
  "canaux_acquisition": ["Canal 1 avec stratégie détaillée","Canal 2 avec stratégie","Canal 3 avec stratégie"],
  "verdict": "Analyse complète et honnête en 5-6 phrases: opportunité réelle, risques, recommandations stratégiques concrètes"
}`
  },
  {
    id: "plan",
    name: "Agent Structure",
    icon: "📋",
    description: "Architecture pédagogique — 6 chapitres",
    color: "#a78bfa",
    maxTokens: 2000,
    systemPrompt: `Tu es un expert en ingénierie pédagogique spécialisé dans les formations pour grands débutants. Tu sais structurer un apprentissage progressif, logique et motivant.
Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks:
{
  "titre_principal": "Titre accrocheur, humain, qui promet une transformation concrète",
  "sous_titre": "Sous-titre qui précise le public cible et le bénéfice principal sans jargon",
  "promesse": "La promesse de transformation en une phrase claire et mesurable",
  "niveau": "Débutant complet — zéro prérequis",
  "nb_pages_cible": "90",
  "introduction_generale": "Présentation de l'ebook en 3-4 phrases naturelles et engageantes",
  "chapitres": [
    {
      "numero": 1,
      "titre": "Titre humain et engageant du chapitre 1 — commence par les bases fondamentales",
      "sous_titre": "Ce que tu vas maîtriser dans ce chapitre",
      "objectif_pedagogique": "Compétence précise et concrète acquise après lecture",
      "concepts_abordes": ["concept fondamental 1","concept 2","concept 3","concept 4","concept 5"],
      "sections": ["1.1 — Titre section naturel","1.2 — Titre section","1.3 — Titre section","1.4 — Titre section"],
      "exercice_pratique": "Description détaillée d'un exercice concret et faisable immédiatement",
      "resultats_attendus": "Ce que le lecteur sera capable de faire concrètement après ce chapitre"
    },
    {
      "numero": 2,
      "titre": "Titre chapitre 2",
      "sous_titre": "Sous-titre chapitre 2",
      "objectif_pedagogique": "Objectif concret chapitre 2",
      "concepts_abordes": ["concept 1","concept 2","concept 3","concept 4","concept 5"],
      "sections": ["2.1 — Section","2.2 — Section","2.3 — Section","2.4 — Section"],
      "exercice_pratique": "Exercice chapitre 2",
      "resultats_attendus": "Résultats chapitre 2"
    },
    {
      "numero": 3,
      "titre": "Titre chapitre 3",
      "sous_titre": "Sous-titre chapitre 3",
      "objectif_pedagogique": "Objectif concret chapitre 3",
      "concepts_abordes": ["concept 1","concept 2","concept 3","concept 4","concept 5"],
      "sections": ["3.1 — Section","3.2 — Section","3.3 — Section","3.4 — Section"],
      "exercice_pratique": "Exercice chapitre 3",
      "resultats_attendus": "Résultats chapitre 3"
    },
    {
      "numero": 4,
      "titre": "Titre chapitre 4",
      "sous_titre": "Sous-titre chapitre 4",
      "objectif_pedagogique": "Objectif concret chapitre 4",
      "concepts_abordes": ["concept 1","concept 2","concept 3","concept 4","concept 5"],
      "sections": ["4.1 — Section","4.2 — Section","4.3 — Section","4.4 — Section"],
      "exercice_pratique": "Exercice chapitre 4",
      "resultats_attendus": "Résultats chapitre 4"
    },
    {
      "numero": 5,
      "titre": "Titre chapitre 5",
      "sous_titre": "Sous-titre chapitre 5",
      "objectif_pedagogique": "Objectif concret chapitre 5",
      "concepts_abordes": ["concept 1","concept 2","concept 3","concept 4","concept 5"],
      "sections": ["5.1 — Section","5.2 — Section","5.3 — Section","5.4 — Section"],
      "exercice_pratique": "Exercice chapitre 5",
      "resultats_attendus": "Résultats chapitre 5"
    },
    {
      "numero": 6,
      "titre": "Titre chapitre 6 — passage à l'action et premiers résultats concrets",
      "sous_titre": "Sous-titre chapitre 6",
      "objectif_pedagogique": "Objectif concret chapitre 6",
      "concepts_abordes": ["concept 1","concept 2","concept 3","concept 4","concept 5"],
      "sections": ["6.1 — Section","6.2 — Section","6.3 — Section","6.4 — Section"],
      "exercice_pratique": "Exercice final complet chapitre 6",
      "resultats_attendus": "Résultats finaux chapitre 6"
    }
  ],
  "bonus": [
    {"titre": "Bonus 1 titre","description": "Ce que contient ce bonus et sa valeur réelle"},
    {"titre": "Bonus 2 titre","description": "Ce que contient ce bonus et sa valeur réelle"},
    {"titre": "Checklist d'action","description": "Checklist complète pour appliquer tout l'ebook"}
  ],
  "resultats_globaux": ["Résultat concret mesurable 1","Résultat 2","Résultat 3","Résultat 4"]
}`
  },
  {
    id: "marketing",
    name: "Agent Marketing",
    icon: "🎯",
    description: "Page de vente & emails complets",
    color: "#f472b6",
    maxTokens: 3000,
    systemPrompt: `Tu es un expert copywriter de niveau international. Tu maîtrises AIDA, PAS, le storytelling et la psychologie de vente.
Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks:
{
  "page_de_vente": {
    "headline": "Titre principal ultra-accrocheur qui promet une transformation spécifique",
    "sous_headline": "Sous-titre qui précise le public, lève l'objection principale et donne un délai",
    "accroche_storytelling": "Histoire d'ouverture de 200 mots minimum qui parle directement à la douleur du lecteur avec un personnage fictif réaliste",
    "probleme_agite": "Description vivante et empathique du problème en 150 mots, les conséquences dans la vraie vie",
    "solution_presentee": "Présentation de l'ebook comme LA solution avec des détails concrets en 150 mots",
    "benefices": ["✅ Bénéfice concret et mesurable 1","✅ Bénéfice 2","✅ Bénéfice 3","✅ Bénéfice 4","✅ Bénéfice 5","✅ Bénéfice 6"],
    "pour_qui": "Description précise des personnes idéales pour cet ebook en 100 mots",
    "pas_pour_qui": "Honnêteté sur pour qui ce n'est pas adapté en 60 mots",
    "contenu_detaille": "Présentation chapitre par chapitre de ce que contient l'ebook en 200 mots",
    "temoignages": [
      {"prenom": "Prénom1","age": "XX ans","situation": "situation précise","resultat": "résultat chiffré obtenu","texte": "témoignage détaillé et très crédible de 80 mots"},
      {"prenom": "Prénom2","age": "XX ans","situation": "situation précise","resultat": "résultat chiffré obtenu","texte": "témoignage détaillé et très crédible de 80 mots"},
      {"prenom": "Prénom3","age": "XX ans","situation": "situation précise","resultat": "résultat chiffré obtenu","texte": "témoignage détaillé de 80 mots"}
    ],
    "offre_complete": "Description complète et détaillée de tout ce qui est inclus avec valeur perçue de chaque élément",
    "prix_barre": "XX€",
    "prix_actuel": "XX€",
    "urgence": "Raison légitime et crédible de l'offre spéciale",
    "cta_principal": "Texte du bouton d'achat percutant et urgent",
    "garantie": "Texte de garantie satisfait ou remboursé 30 jours très rassurant et détaillé",
    "faq": [
      {"question": "Question fréquente 1 réaliste","reponse": "Réponse détaillée et rassurante"},
      {"question": "Question fréquente 2","reponse": "Réponse détaillée"},
      {"question": "Question fréquente 3","reponse": "Réponse détaillée"},
      {"question": "Question fréquente 4","reponse": "Réponse détaillée"}
    ]
  },
  "email_sequence": [
    {"jour": 0,"sujet": "Objet email bienvenue","preview": "Texte preview","corps": "Corps complet de 250 mots avec storytelling et CTA"},
    {"jour": 2,"sujet": "Objet email valeur pure","preview": "Texte preview","corps": "Email de valeur avec conseil gratuit de 220 mots"},
    {"jour": 4,"sujet": "Objet email preuve sociale","preview": "Texte preview","corps": "Email avec témoignage et résultats de 220 mots"},
    {"jour": 6,"sujet": "Objet email urgence","preview": "Texte preview","corps": "Email urgence finale avec storytelling de 250 mots"}
  ],
  "posts_reseaux": {
    "linkedin": "Post LinkedIn complet de 300 mots avec storytelling, valeur et CTA naturel",
    "instagram_caption": "Caption Instagram engageante avec emojis, mini-story et hashtags ciblés",
    "tiktok_script": "Script TikTok 60 secondes: hook 3 premières secondes ultra-fort, développement valeur, CTA",
    "twitter_thread": ["Tweet 1 hook puissant","Tweet 2 développement","Tweet 3 valeur","Tweet 4 preuve","Tweet 5 CTA"]
  }
}`
  },
  {
    id: "cover",
    name: "Agent Visuel",
    icon: "🖼️",
    description: "Design & stratégie de lancement",
    color: "#34d399",
    maxTokens: 1500,
    systemPrompt: `Tu es un directeur artistique expert en couvertures de livres numériques et en stratégie de lancement de produits digitaux.
Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks:
{
  "prompt_dalle_couverture": "Extremely detailed DALL-E 3 prompt in English for the main ebook cover. Specify: exact visual style, precise color palette with hex codes, typography style, main illustration or visual element, mood, lighting, composition, what makes it professional and compelling in a digital marketplace. Minimum 100 words of detail.",
  "prompt_dalle_banniere": "DALL-E 3 prompt in English for a wide marketing banner (16:9 ratio) for social media promotion of this ebook. Different composition from cover but same visual identity.",
  "prompt_dalle_mockup": "DALL-E 3 prompt in English for a realistic 3D mockup of the ebook on a clean desk or tablet, professional photography style.",
  "prompt_dalle_fr": "Description en français de ce qui sera créé visuellement pour les 3 images",
  "palette_couleurs": ["#hex1 — nom","#hex2 — nom","#hex3 — nom"],
  "style_visuel": "Description complète du parti pris visuel et de la cohérence de marque",
  "strategie_prix": {
    "prix_lancement": "XX",
    "prix_standard": "XX",
    "prix_bundle": "XX",
    "justification": "Explication psychologique et économique détaillée de ces prix"
  },
  "strategie_lancement": {
    "j_moins_7": ["Action 1","Action 2","Action 3"],
    "jour_j": ["Action lancement 1","Action 2","Action 3"],
    "j_plus_7": ["Action suivi 1","Action 2","Action 3"]
  },
  "plateformes": [
    {"nom": "Gumroad","commission": "10%","avantage": "Le plus simple pour débuter, paiement immédiat"},
    {"nom": "Systeme.io","commission": "0%","avantage": "Tunnel de vente + emails inclus, idéal pour scaler"},
    {"nom": "Payhip","commission": "5%","avantage": "Affiliés intégrés, idéal pour le bouche à oreille"}
  ]
}`
  },
  {
    id: "publish",
    name: "Agent Publication",
    icon: "🚀",
    description: "Fiche Gumroad optimisée",
    color: "#ff6b6b",
    maxTokens: 2000,
    systemPrompt: `Tu es un expert en optimisation de fiches produits Gumroad et en copywriting de conversion.
Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks:
{
  "gumroad_name": "Nom produit optimisé SEO (max 80 chars, accrocheur et clair)",
  "gumroad_description_html": "<h2>🎯 [Titre accrocheur]</h2><p><strong>[Promesse en une phrase]</strong></p><br><p>[Introduction empathique 4-5 phrases qui parlent au problème du lecteur]</p><br><h2>📚 Ce que tu vas apprendre</h2><ul><li>✅ Apprentissage concret 1</li><li>✅ Apprentissage 2</li><li>✅ Apprentissage 3</li><li>✅ Apprentissage 4</li><li>✅ Apprentissage 5</li><li>✅ Apprentissage 6</li></ul><br><h2>👤 Cet ebook est fait pour toi si...</h2><p>[Description précise et empathique de la cible idéale]</p><br><h2>📦 Ce qui est inclus</h2><ul><li>📖 L'ebook complet (90+ pages)</li><li>🎁 Bonus 1 avec valeur</li><li>🎁 Bonus 2 avec valeur</li><li>✅ Checklist d'action complète</li></ul><br><h2>💬 Ce qu'en disent les lecteurs</h2><p><em>[Témoignage crédible avec prénom, situation et résultat chiffré]</em></p><br><h2>🛡️ Garantie satisfait ou remboursé 30 jours</h2><p>[Texte de garantie rassurant et détaillé]</p><br><p><strong>[CTA final percutant]</strong></p>",
  "prix_cents": "1700",
  "tags_seo": ["tag1","tag2","tag3","tag4","tag5"],
  "url_suggeree": "url-seo-friendly-sans-accents",
  "email_confirmation": "Email de confirmation envoyé automatiquement à l'acheteur: objet + corps de 150 mots chaleureux avec instructions de téléchargement et prochaines étapes",
  "checklist_publication": ["Étape 1 précise","Étape 2","Étape 3","Étape 4","Étape 5","Étape 6","Étape 7"]
}`
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// APPEL API OPENAI
// ─────────────────────────────────────────────────────────────────────────────
const callOpenAI = async (apiKey, systemPrompt, userPrompt, maxTokens = 2000) => {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: maxTokens,
      temperature: 0.85,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  const text = data.choices?.[0]?.message?.content || "";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
};

// ─────────────────────────────────────────────────────────────────────────────
// GÉNÉRATION D'UNE SECTION (600+ mots, style humain)
// ─────────────────────────────────────────────────────────────────────────────
const generateSection = async (apiKey, sectionTitle, chapterContext, ebookContext) => {
  const systemPrompt = `Tu es un auteur humain expert, passionné et pédagogue. Tu écris un ebook pour des débutants complets.
${HUMAN_WRITING_RULES}

Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks:
{
  "titre_section": "Titre exact de la section",
  "contenu": "Contenu COMPLET de la section. MINIMUM 600 MOTS. Compte les mots. Si tu n'arrives pas à 600 mots, continue à développer avec plus d'exemples, d'anecdotes et d'explications. Structure ton texte en paragraphes de 4-6 lignes. Utilise des retours à la ligne entre chaque paragraphe (représentés par \\n\\n). Inclus minimum 2 exemples concrets avec des prénoms fictifs. Explique chaque concept comme si le lecteur n'a jamais entendu ce terme. Partage ton vécu. Sois humain."
}`;

  const userPrompt = `Ebook: "${ebookContext.titre}"
Niche: "${ebookContext.niche}"
Public cible: ${ebookContext.audience}
Chapitre: ${chapterContext.numero} — "${chapterContext.titre}"
Section à rédiger: "${sectionTitle}"
Concepts du chapitre: ${chapterContext.concepts?.join(", ")}

Rédige cette section avec un style HUMAIN, chaleureux et pédagogique. MINIMUM 600 mots. Développe vraiment le sujet en profondeur avec des exemples de la vraie vie.`;

  const result = await callOpenAI(apiKey, systemPrompt, userPrompt, 1500);
  return result;
};

// ─────────────────────────────────────────────────────────────────────────────
// GÉNÉRATION PDF (HTML → impression)
// ─────────────────────────────────────────────────────────────────────────────
const buildPDFHtml = (content, plan, research) => {
  const chapters = content?.chapitres || [];
  const intro = content?.introduction;
  const conclusion = content?.conclusion;

  const chapterHTML = chapters.map(ch => `
    <div class="chapter">
      <div class="chapter-label">CHAPITRE ${ch.numero}</div>
      <h1 class="chapter-title">${ch.titre || ""}</h1>
      ${ch.sous_titre ? `<div class="chapter-subtitle">${ch.sous_titre}</div>` : ""}
      ${ch.introduction_chapitre ? `<div class="intro-block"><p>${ch.introduction_chapitre}</p></div>` : ""}
      ${(ch.sections || []).map(s => `
        <h2 class="section-title">${s.titre_section || ""}</h2>
        <div class="section-content">${(s.contenu || "").replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br/>")}</div>
      `).join("")}
      ${ch.encadre_conseil ? `
        <div class="conseil-block">
          <div class="conseil-label">💡 CONSEIL D'EXPERT</div>
          <p>${ch.encadre_conseil}</p>
        </div>` : ""}
      ${ch.erreurs_courantes?.length ? `
        <div class="erreurs-block">
          <div class="erreurs-label">⚠️ ERREURS FRÉQUENTES</div>
          ${ch.erreurs_courantes.map(e => `<div class="erreur-item">✗ &nbsp;${e}</div>`).join("")}
        </div>` : ""}
      ${ch.exercice_pratique ? `
        <div class="exercice-block">
          <div class="exercice-label">🏋️ EXERCICE PRATIQUE</div>
          <div class="exercice-titre">${ch.exercice_pratique.titre || ""}</div>
          <div class="exercice-meta">⏱ ${ch.exercice_pratique.duree_estimee || "30 minutes"}</div>
          <p class="exercice-objectif">🎯 ${ch.exercice_pratique.objectif || ""}</p>
          ${(ch.exercice_pratique.etapes || []).map((e, i) => `
            <div class="etape">
              <span class="etape-num">${i + 1}</span>
              <span>${e}</span>
            </div>`).join("")}
          ${ch.exercice_pratique.resultat_attendu ? `<div class="resultat">✅ Résultat attendu : ${ch.exercice_pratique.resultat_attendu}</div>` : ""}
        </div>` : ""}
      ${ch.resume_chapitre ? `
        <div class="resume-block">
          <div class="resume-label">📌 CE QU'IL FAUT RETENIR</div>
          <p>${ch.resume_chapitre}</p>
        </div>` : ""}
      ${ch.transition ? `<div class="transition">${ch.transition}</div>` : ""}
    </div>
    <div class="page-break"></div>
  `).join("");

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<title>${plan?.titre_principal || "Ebook"}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Inter:wght@400;500;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Merriweather',Georgia,serif;color:#1a1a2e;background:#fff;font-size:13px;line-height:2;}
  .cover{background:linear-gradient(135deg,#0d0d2a 0%,#1a0d3a 50%,#0d1a2e 100%);color:white;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:60px 80px;}
  .cover-eyebrow{font-family:'Inter',sans-serif;font-size:11px;letter-spacing:4px;color:#00ffd5;margin-bottom:32px;text-transform:uppercase;}
  .cover-title{font-family:'Inter',sans-serif;font-size:44px;font-weight:800;line-height:1.2;margin-bottom:24px;color:#fff;}
  .cover-subtitle{font-size:16px;color:#aaaacc;margin-bottom:48px;font-weight:300;max-width:600px;line-height:1.8;}
  .cover-info{display:flex;gap:24px;justify-content:center;flex-wrap:wrap;}
  .cover-badge{background:rgba(167,139,250,0.15);border:1px solid rgba(167,139,250,0.4);border-radius:50px;padding:8px 20px;color:#a78bfa;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;}
  .toc{padding:70px 80px;}
  .toc-header{font-family:'Inter',sans-serif;font-size:30px;font-weight:800;color:#0d0d2a;margin-bottom:8px;}
  .toc-divider{width:60px;height:4px;background:linear-gradient(90deg,#a78bfa,#00ffd5);border-radius:2px;margin-bottom:40px;}
  .toc-item{display:flex;align-items:center;gap:16px;padding:14px 0;border-bottom:1px solid #f0f0f5;}
  .toc-num{font-family:'Inter',sans-serif;min-width:38px;height:38px;border-radius:8px;background:linear-gradient(135deg,#a78bfa,#7c3aed);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0;}
  .toc-text{font-family:'Inter',sans-serif;color:#2a2a4a;font-size:14px;font-weight:500;}
  .chapter{padding:70px 80px;}
  .chapter-label{font-family:'Inter',sans-serif;font-size:10px;letter-spacing:4px;color:#a78bfa;font-weight:700;margin-bottom:12px;text-transform:uppercase;}
  .chapter-title{font-family:'Inter',sans-serif;font-size:34px;font-weight:800;color:#0d0d2a;line-height:1.25;margin-bottom:10px;}
  .chapter-subtitle{font-family:'Inter',sans-serif;font-size:16px;color:#7c7c9a;margin-bottom:36px;font-style:italic;}
  .intro-block{border-left:4px solid #fb923c;background:linear-gradient(135deg,#fff8f3,#fff5ee);padding:22px 26px;border-radius:0 12px 12px 0;margin-bottom:36px;}
  .intro-block p{color:#4a2a1a;line-height:2;margin:0;}
  .section-title{font-family:'Inter',sans-serif;font-size:20px;font-weight:700;color:#2a1a5e;margin:36px 0 16px 0;padding-bottom:10px;border-bottom:2px solid #f0eeff;}
  .section-content{color:#3a3a5a;line-height:2.1;margin-bottom:8px;}
  .section-content p{margin-bottom:16px;}
  .conseil-block{background:linear-gradient(135deg,#f0f9ff,#e8f4ff);border:1px solid #bae6fd;border-radius:12px;padding:22px 26px;margin:28px 0;}
  .conseil-label{font-family:'Inter',sans-serif;font-size:11px;font-weight:700;color:#0284c7;margin-bottom:10px;letter-spacing:1px;}
  .conseil-block p{color:#0c4a6e;line-height:2;margin:0;}
  .erreurs-block{background:#fff5f5;border:1px solid #fecaca;border-radius:12px;padding:22px 26px;margin:28px 0;}
  .erreurs-label{font-family:'Inter',sans-serif;font-size:11px;font-weight:700;color:#dc2626;margin-bottom:12px;letter-spacing:1px;}
  .erreur-item{color:#7f1d1d;font-size:13px;margin-bottom:10px;line-height:1.8;}
  .exercice-block{background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:2px solid #86efac;border-radius:12px;padding:26px;margin:28px 0;}
  .exercice-label{font-family:'Inter',sans-serif;font-size:11px;font-weight:700;color:#16a34a;margin-bottom:8px;letter-spacing:1px;}
  .exercice-titre{font-family:'Inter',sans-serif;font-size:18px;font-weight:700;color:#14532d;margin-bottom:8px;}
  .exercice-meta{font-family:'Inter',sans-serif;font-size:12px;color:#6b7280;margin-bottom:16px;}
  .exercice-objectif{font-family:'Inter',sans-serif;color:#166534;font-size:13px;margin-bottom:16px;font-style:italic;}
  .etape{display:flex;gap:14px;align-items:flex-start;margin-bottom:12px;}
  .etape-num{font-family:'Inter',sans-serif;min-width:28px;height:28px;border-radius:50%;background:#22c55e;color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;margin-top:2px;}
  .etape span:last-child{color:#1a3a2a;line-height:1.8;}
  .resultat{margin-top:16px;padding:12px 16px;background:#bbf7d0;border-radius:8px;color:#065f46;font-family:'Inter',sans-serif;font-size:13px;font-weight:500;}
  .resume-block{background:#faf5ff;border:1px solid #e9d5ff;border-radius:12px;padding:22px 26px;margin:28px 0;}
  .resume-label{font-family:'Inter',sans-serif;font-size:11px;font-weight:700;color:#7c3aed;margin-bottom:10px;letter-spacing:1px;}
  .resume-block p{color:#4c1d95;line-height:2;margin:0;}
  .transition{text-align:center;color:#9ca3af;font-style:italic;font-size:13px;padding:24px 0;border-top:1px dashed #e5e7eb;margin-top:20px;}
  .conclusion-section{padding:70px 80px;}
  .action-week{font-family:'Inter',sans-serif;min-width:44px;height:44px;border-radius:8px;background:linear-gradient(135deg,#34d399,#059669);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;flex-shrink:0;}
  .action-item{display:flex;gap:16px;align-items:flex-start;margin-bottom:16px;}
  .page-break{page-break-after:always;}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}.page-break{page-break-after:always;}.cover{page-break-after:always;}.toc{page-break-after:always;}}
</style>
</head>
<body>

<!-- COUVERTURE -->
<div class="cover">
  <div class="cover-eyebrow">Ebook · Niveau Débutant Complet</div>
  <div class="cover-title">${plan?.titre_principal || "Mon Ebook"}</div>
  <div class="cover-subtitle">${plan?.sous_titre || ""}</div>
  <div class="cover-info">
    <div class="cover-badge">📚 ${chapters.length} Chapitres</div>
    <div class="cover-badge">✏️ ${plan?.nb_pages_cible || "90"}+ Pages</div>
    <div class="cover-badge">🏋️ Exercices Pratiques</div>
    <div class="cover-badge">⭐ Zéro Prérequis</div>
  </div>
</div>
<div class="page-break"></div>

<!-- TABLE DES MATIÈRES -->
<div class="toc">
  <div class="toc-header">Table des matières</div>
  <div class="toc-divider"></div>
  <div class="toc-item"><div class="toc-num">📖</div><div class="toc-text">Introduction</div></div>
  ${chapters.map(ch => `<div class="toc-item"><div class="toc-num">${ch.numero}</div><div class="toc-text">${ch.titre}</div></div>`).join("")}
  <div class="toc-item"><div class="toc-num">🎯</div><div class="toc-text">Conclusion & Plan d'action 30 jours</div></div>
</div>
<div class="page-break"></div>

<!-- INTRODUCTION -->
<div class="chapter">
  <div class="chapter-label">AVANT-PROPOS</div>
  <div class="chapter-title">Introduction</div>
  ${intro ? Object.entries(intro).map(([k, v]) => `
    <h2 class="section-title">${k.replace(/_/g, " ")}</h2>
    <div class="section-content"><p>${v}</p></div>
  `).join("") : ""}
</div>
<div class="page-break"></div>

<!-- CHAPITRES -->
${chapterHTML}

<!-- CONCLUSION -->
<div class="conclusion-section">
  <div class="chapter-label">POUR FINIR</div>
  <div class="chapter-title">Conclusion</div>
  ${conclusion?.felicitations ? `<div class="conseil-block"><p>${conclusion.felicitations}</p></div>` : ""}
  ${conclusion?.recapitulatif ? `<div class="section-content"><p>${conclusion.recapitulatif}</p></div>` : ""}
  ${conclusion?.plan_action_30_jours?.length ? `
    <h2 class="section-title" style="color:#059669;border-color:#d1fae5;">🗓️ Ton Plan d'Action — 30 Jours</h2>
    ${conclusion.plan_action_30_jours.map((a, i) => `<div class="action-item"><div class="action-week">S${i+1}</div><div style="color:#1a3a2a;line-height:1.9;padding-top:10px;">${a}</div></div>`).join("")}
  ` : ""}
  ${conclusion?.ressources_complementaires?.length ? `
    <h2 class="section-title">📚 Ressources complémentaires</h2>
    ${conclusion.ressources_complementaires.map(r => `<div style="color:#3a3a5a;margin-bottom:10px;line-height:1.8;">▸ ${r}</div>`).join("")}
  ` : ""}
  ${conclusion?.mot_de_fin ? `<div class="exercice-block" style="margin-top:36px;"><p style="color:#064e3b;font-style:italic;line-height:2;">${conclusion.mot_de_fin}</p></div>` : ""}
</div>

<script>window.onload = () => { setTimeout(() => window.print(), 500); }</script>
</body>
</html>`;
};

// ─────────────────────────────────────────────────────────────────────────────
// GÉNÉRATION DU DOSSIER ZIP
// ─────────────────────────────────────────────────────────────────────────────
const downloadZIP = async (agentResults, niche) => {
  // Charge JSZip dynamiquement
  if (!window.JSZip) {
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  const zip = new window.JSZip();
  const plan = agentResults.plan;
  const research = agentResults.research;
  const marketing = agentResults.marketing;
  const cover = agentResults.cover;
  const publish = agentResults.publish;
  const content = agentResults.content;

  const safeName = (plan?.titre_principal || "ebook").replace(/[^a-zA-Z0-9]/g, "_").slice(0, 30);

  // ── 1. PDF HTML (prêt à imprimer en PDF) ──────────────────────────────
  const pdfHtml = buildPDFHtml(content, plan, research);
  zip.file(`${safeName}_EBOOK.html`, pdfHtml);

  // ── 2. TEXTES GUMROAD (.txt) ──────────────────────────────────────────
  let gumroadTxt = `═══════════════════════════════════════════════════════════
DOSSIER DE PUBLICATION — ${plan?.titre_principal || "Ebook"}
Niche: ${niche}
Date de création: ${new Date().toLocaleDateString("fr-FR")}
═══════════════════════════════════════════════════════════

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. NOM DU PRODUIT GUMROAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${publish?.gumroad_name || ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. URL PERSONNALISÉE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${publish?.url_suggeree || ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. PRIX (EN CENTIMES)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${publish?.prix_cents || "1700"} centimes = ${parseInt(publish?.prix_cents || 1700) / 100}€
Prix lancement: ${cover?.strategie_prix?.prix_lancement || "17"}€
Prix standard:  ${cover?.strategie_prix?.prix_standard || "27"}€
Prix bundle:    ${cover?.strategie_prix?.prix_bundle || "47"}€

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. TAGS SEO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${(publish?.tags_seo || []).join(", ")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. DESCRIPTION HTML GUMROAD (COPIER-COLLER EN MODE HTML)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${publish?.gumroad_description_html || ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. EMAIL DE CONFIRMATION ACHETEUR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${publish?.email_confirmation || ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7. CHECKLIST DE PUBLICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${(publish?.checklist_publication || []).map((s, i) => `${i + 1}. ${s}`).join("\n")}
`;

  zip.file(`${safeName}_GUMROAD.txt`, gumroadTxt);

  // ── 3. PAGE DE VENTE (.txt) ───────────────────────────────────────────
  const pv = marketing?.page_de_vente;
  let pageTxt = `═══════════════════════════════════════════════════════════
PAGE DE VENTE — ${plan?.titre_principal || "Ebook"}
═══════════════════════════════════════════════════════════

HEADLINE PRINCIPAL:
${pv?.headline || ""}

SOUS-HEADLINE:
${pv?.sous_headline || ""}

ACCROCHE STORYTELLING:
${pv?.accroche_storytelling || ""}

LE PROBLÈME:
${pv?.probleme_agite || ""}

LA SOLUTION:
${pv?.solution_presentee || ""}

BÉNÉFICES:
${(pv?.benefices || []).join("\n")}

POUR QUI:
${pv?.pour_qui || ""}

PAS POUR QUI:
${pv?.pas_pour_qui || ""}

CONTENU DE L'EBOOK:
${pv?.contenu_detaille || ""}

TÉMOIGNAGES:
${(pv?.temoignages || []).map(t => `${t.prenom}, ${t.age} — ${t.resultat}\n"${t.texte}"`).join("\n\n")}

L'OFFRE COMPLÈTE:
${pv?.offre_complete || ""}

PRIX BARRÉ: ${pv?.prix_barre || ""}
PRIX ACTUEL: ${pv?.prix_actuel || ""}
URGENCE: ${pv?.urgence || ""}
BOUTON CTA: ${pv?.cta_principal || ""}

GARANTIE:
${pv?.garantie || ""}

FAQ:
${(pv?.faq || []).map(f => `Q: ${f.question}\nR: ${f.reponse}`).join("\n\n")}
`;

  zip.file(`${safeName}_PAGE_DE_VENTE.txt`, pageTxt);

  // ── 4. SÉQUENCE EMAILS (.txt) ─────────────────────────────────────────
  let emailsTxt = `═══════════════════════════════════════════════════════════
SÉQUENCE EMAILS — ${plan?.titre_principal || "Ebook"}
═══════════════════════════════════════════════════════════
`;
  (marketing?.email_sequence || []).forEach((email, i) => {
    emailsTxt += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EMAIL ${i + 1} — JOUR ${email.jour}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUJET: ${email.sujet || ""}
PREVIEW: ${email.preview || ""}

CORPS:
${email.corps || ""}

`;
  });

  zip.file(`${safeName}_EMAILS.txt`, emailsTxt);

  // ── 5. POSTS RÉSEAUX SOCIAUX (.txt) ──────────────────────────────────
  const posts = marketing?.posts_reseaux;
  let socialTxt = `═══════════════════════════════════════════════════════════
POSTS RÉSEAUX SOCIAUX — ${plan?.titre_principal || "Ebook"}
═══════════════════════════════════════════════════════════

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LINKEDIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${posts?.linkedin || ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSTAGRAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${posts?.instagram_caption || ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TIKTOK — SCRIPT 60 SECONDES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${posts?.tiktok_script || ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TWITTER / X — THREAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${(posts?.twitter_thread || []).map((t, i) => `Tweet ${i + 1}: ${t}`).join("\n\n")}
`;

  zip.file(`${safeName}_SOCIAL_MEDIA.txt`, socialTxt);

  // ── 6. PROMPTS DALL-E (.txt) ──────────────────────────────────────────
  let dalleTxt = `═══════════════════════════════════════════════════════════
PROMPTS DALL-E 3 — ${plan?.titre_principal || "Ebook"}
Colle ces prompts dans ChatGPT (GPT-4o avec DALL-E 3)
═══════════════════════════════════════════════════════════

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMAGE 1 — COUVERTURE EBOOK (format portrait 2:3)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${cover?.prompt_dalle_couverture || ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMAGE 2 — BANNIÈRE RÉSEAUX SOCIAUX (format paysage 16:9)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${cover?.prompt_dalle_banniere || ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMAGE 3 — MOCKUP 3D (pour présenter l'ebook)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${cover?.prompt_dalle_mockup || ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESCRIPTION FRANÇAISE (pour comprendre les visuels)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${cover?.prompt_dalle_fr || ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PALETTE DE COULEURS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${(cover?.palette_couleurs || []).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSTRUCTIONS D'UTILISATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Va sur chat.openai.com (tu as déjà un compte)
2. Colle le prompt de la couverture dans le chat
3. Demande "génère cette image"
4. Télécharge le résultat
5. Fais pareil pour la bannière et le mockup
6. Upload la couverture sur Gumroad dans le champ "Cover"
`;

  zip.file(`${safeName}_PROMPTS_DALLE.txt`, dalleTxt);

  // ── 7. ANALYSE DE MARCHÉ (.txt) ───────────────────────────────────────
  let analysisTxt = `═══════════════════════════════════════════════════════════
ANALYSE DE MARCHÉ — ${plan?.titre_principal || "Ebook"}
═══════════════════════════════════════════════════════════

VALIDATION: ${research?.validation || ""}
SCORE MARCHÉ: ${research?.score_marche || ""}

AUDIENCE CIBLE:
${research?.audience_cible || ""}

PROBLÈME RÉSOLU:
${research?.probleme_resolu || ""}

CONCURRENCE:
${research?.concurrence || ""}

PRIX RECOMMANDÉ: ${research?.prix_recommande || ""}

ANGLE UNIQUE:
${research?.angle_unique || ""}

MOTS-CLÉS: ${(research?.mots_cles || []).join(", ")}

TENDANCES MARCHÉ:
${research?.tendances_marche || ""}

CANAUX D'ACQUISITION:
${(research?.canaux_acquisition || []).map((c, i) => `${i + 1}. ${c}`).join("\n")}

VERDICT:
${research?.verdict || ""}
`;

  zip.file(`${safeName}_ANALYSE_MARCHE.txt`, analysisTxt);

  // ── 8. README ─────────────────────────────────────────────────────────
  const readme = `═══════════════════════════════════════════════════════════
DOSSIER COMPLET — ${plan?.titre_principal || "Ebook"}
Créé le ${new Date().toLocaleDateString("fr-FR")}
═══════════════════════════════════════════════════════════

CONTENU DE CE DOSSIER:
───────────────────────────────────────────────────────────

📄 ${safeName}_EBOOK.html
   → Ouvre ce fichier dans Chrome, puis Ctrl+P → "Enregistrer en PDF"
   → C'est ton ebook complet mis en page professionnellement

📝 ${safeName}_GUMROAD.txt
   → Tout ce dont tu as besoin pour créer ta fiche Gumroad:
     nom, prix, description HTML, tags, URL, email de confirmation

📝 ${safeName}_PAGE_DE_VENTE.txt
   → Ta page de vente complète: headline, storytelling, bénéfices,
     témoignages, FAQ, garantie, CTA

📝 ${safeName}_EMAILS.txt
   → Séquence de 4 emails prêts à configurer dans Mailchimp/Brevo

📝 ${safeName}_SOCIAL_MEDIA.txt
   → Posts LinkedIn, Instagram, TikTok (script), Twitter/X thread

📝 ${safeName}_PROMPTS_DALLE.txt
   → 3 prompts DALL-E pour créer tes visuels dans ChatGPT:
     couverture ebook + bannière réseaux + mockup 3D

📝 ${safeName}_ANALYSE_MARCHE.txt
   → Analyse complète de ta niche: audience, concurrence, prix, tendances

═══════════════════════════════════════════════════════════
ÉTAPES POUR LANCER:
═══════════════════════════════════════════════════════════

ÉTAPE 1 — Créer le PDF:
  1. Ouvre ${safeName}_EBOOK.html dans Chrome
  2. Ctrl+P (Cmd+P sur Mac)
  3. Choisir "Enregistrer en PDF"
  4. Nom du fichier: ${safeName}.pdf

ÉTAPE 2 — Créer les visuels:
  1. Ouvre ${safeName}_PROMPTS_DALLE.txt
  2. Colle le 1er prompt dans ChatGPT → télécharge la couverture
  3. Colle le 2ème prompt → télécharge la bannière
  4. Colle le 3ème prompt → télécharge le mockup

ÉTAPE 3 — Publier sur Gumroad:
  1. Va sur app.gumroad.com → New Product → Digital Product
  2. Ouvre ${safeName}_GUMROAD.txt
  3. Copie-colle chaque champ sur Gumroad
  4. Upload ton PDF dans "Content"
  5. Upload la couverture dans "Cover"
  6. Clique "Publish" → 💰 Ton ebook est en vente !

ÉTAPE 4 — Promouvoir:
  1. Poste le contenu de ${safeName}_SOCIAL_MEDIA.txt
  2. Configure la séquence emails de ${safeName}_EMAILS.txt dans Brevo (gratuit)
  3. Utilise la page de vente de ${safeName}_PAGE_DE_VENTE.txt sur ton site
`;

  zip.file("README.txt", readme);

  // ── Génération et téléchargement du ZIP ───────────────────────────────
  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${safeName}_DOSSIER_COMPLET.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ─────────────────────────────────────────────────────────────────────────────
// EBOOK VIEWER
// ─────────────────────────────────────────────────────────────────────────────
const EbookViewer = ({ data, plan, onClose, onDownloadPDF }) => {
  const [activeChapter, setActiveChapter] = useState("intro");
  const chapters = data?.chapitres || [];

  const renderChapter = (ch) => (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ color: "#fb923c", fontSize: 11, fontFamily: "monospace", letterSpacing: 2, marginBottom: 10 }}>CHAPITRE {ch.numero}</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1.3, marginBottom: 10 }}>{ch.titre}</h1>
        {ch.sous_titre && <div style={{ color: "#a78bfa", fontSize: 15, fontStyle: "italic" }}>{ch.sous_titre}</div>}
      </div>
      {ch.introduction_chapitre && (
        <div style={{ borderLeft: "3px solid #fb923c", background: "#120a05", padding: "18px 22px", borderRadius: "0 10px 10px 0", marginBottom: 28 }}>
          <p style={{ color: "#e0c8b0", fontSize: 14, lineHeight: 1.9, margin: 0 }}>{ch.introduction_chapitre}</p>
        </div>
      )}
      {(ch.sections || []).map((s, si) => (
        <div key={si} style={{ marginBottom: 32 }}>
          <h2 style={{ color: "#a78bfa", fontSize: 17, fontWeight: 700, marginBottom: 14, paddingBottom: 8, borderBottom: "1px solid #1a1a2e" }}>{s.titre_section}</h2>
          <div style={{ color: "#d1d5db", fontSize: 14, lineHeight: 2 }}>
            {(s.contenu || "").split("\n\n").map((p, pi) => <p key={pi} style={{ marginBottom: 16 }}>{p}</p>)}
          </div>
        </div>
      ))}
      {ch.encadre_conseil && (
        <div style={{ background: "#0a1520", border: "1px solid #0284c744", borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <div style={{ color: "#38bdf8", fontSize: 11, fontFamily: "monospace", fontWeight: 700, marginBottom: 8 }}>💡 CONSEIL D'EXPERT</div>
          <p style={{ color: "#bae6fd", fontSize: 14, lineHeight: 1.8, margin: 0 }}>{ch.encadre_conseil}</p>
        </div>
      )}
      {ch.erreurs_courantes?.length > 0 && (
        <div style={{ background: "#150808", border: "1px solid #dc262644", borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <div style={{ color: "#f87171", fontSize: 11, fontFamily: "monospace", fontWeight: 700, marginBottom: 12 }}>⚠️ ERREURS À ÉVITER</div>
          {ch.erreurs_courantes.map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <span style={{ color: "#f87171" }}>✗</span>
              <span style={{ color: "#fca5a5", fontSize: 13, lineHeight: 1.7 }}>{e}</span>
            </div>
          ))}
        </div>
      )}
      {ch.exercice_pratique && (
        <div style={{ background: "#081510", border: "2px solid #22c55e44", borderRadius: 12, padding: 22, marginBottom: 24 }}>
          <div style={{ color: "#4ade80", fontSize: 11, fontFamily: "monospace", fontWeight: 700, marginBottom: 6 }}>🏋️ EXERCICE PRATIQUE</div>
          <div style={{ color: "#86efac", fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{ch.exercice_pratique.titre}</div>
          <div style={{ color: "#6b7280", fontSize: 12, marginBottom: 14 }}>⏱ {ch.exercice_pratique.duree_estimee} · 🎯 {ch.exercice_pratique.objectif}</div>
          {(ch.exercice_pratique.etapes || []).map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" }}>
              <div style={{ minWidth: 26, height: 26, borderRadius: "50%", background: "#22c55e", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
              <span style={{ color: "#d1fae5", fontSize: 13, lineHeight: 1.7, paddingTop: 3 }}>{e}</span>
            </div>
          ))}
          {ch.exercice_pratique.resultat_attendu && (
            <div style={{ marginTop: 14, padding: "10px 14px", background: "#14532d44", borderRadius: 8, color: "#4ade80", fontSize: 13 }}>✅ {ch.exercice_pratique.resultat_attendu}</div>
          )}
        </div>
      )}
      {ch.resume_chapitre && (
        <div style={{ background: "#0d0a1a", border: "1px solid #a78bfa33", borderRadius: 10, padding: 18, marginBottom: 16 }}>
          <div style={{ color: "#a78bfa", fontSize: 11, fontFamily: "monospace", fontWeight: 700, marginBottom: 8 }}>📌 CE QU'IL FAUT RETENIR</div>
          <p style={{ color: "#c4b5fd", fontSize: 13, lineHeight: 1.8, margin: 0 }}>{ch.resume_chapitre}</p>
        </div>
      )}
      {ch.transition && <div style={{ textAlign: "center", color: "#4b5563", fontSize: 13, fontStyle: "italic", padding: "20px 0", borderTop: "1px dashed #1f2937", marginTop: 16 }}>{ch.transition}</div>}
    </div>
  );

  const sidebar = [
    { id: "intro", label: "📖 Introduction" },
    ...chapters.map(c => ({ id: `ch${c.numero}`, label: `${c.numero}. ${c.titre?.slice(0, 32)}${c.titre?.length > 32 ? "..." : ""}` })),
    { id: "conclusion", label: "🎯 Conclusion" }
  ];

  const active = chapters.find(c => `ch${c.numero}` === activeChapter);
  const conclusion = data?.conclusion;

  return (
    <div style={{ position: "fixed", inset: 0, background: "#050508", zIndex: 200, display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#0d0d1a", borderBottom: "1px solid #1a1a2e", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 20 }}>📚</span>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{plan?.titre_principal}</div>
          <div style={{ color: "#555", fontSize: 10 }}>{chapters.length} chapitres · Reader</div>
        </div>
        <button onClick={onDownloadPDF} style={{ background: "linear-gradient(135deg,#a78bfa,#7c3aed)", border: "none", color: "#fff", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 11, fontFamily: "monospace", fontWeight: 700, marginRight: 8 }}>⬇️ PDF</button>
        <button onClick={onClose} style={{ background: "#1a1a2e", border: "none", color: "#888", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 11 }}>✕</button>
      </div>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <div style={{ width: 250, background: "#0a0a14", borderRight: "1px solid #1a1a2e", overflow: "auto", padding: "14px 0", flexShrink: 0 }}>
          <div style={{ color: "#2a2a4a", fontSize: 10, letterSpacing: 1, padding: "0 14px", marginBottom: 8 }}>TABLE DES MATIÈRES</div>
          {sidebar.map(item => (
            <div key={item.id} onClick={() => setActiveChapter(item.id)}
              style={{ padding: "9px 14px", cursor: "pointer", fontSize: 11, color: activeChapter === item.id ? "#fff" : "#4a4a6a", background: activeChapter === item.id ? "#1a1a2e" : "transparent", borderLeft: activeChapter === item.id ? "2px solid #a78bfa" : "2px solid transparent", transition: "all 0.15s" }}>
              {item.label}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "40px 60px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            {activeChapter === "intro" && (
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 28 }}>Introduction</h1>
                {data?.introduction && Object.entries(data.introduction).map(([k, v]) => (
                  <div key={k} style={{ marginBottom: 24 }}>
                    <div style={{ color: "#00ffd5", fontSize: 10, fontFamily: "monospace", fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{k.replace(/_/g, " ")}</div>
                    <p style={{ color: "#d1d5db", fontSize: 14, lineHeight: 1.9, margin: 0 }}>{v}</p>
                  </div>
                ))}
              </div>
            )}
            {active && renderChapter(active)}
            {activeChapter === "conclusion" && conclusion && (
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 28 }}>Conclusion</h1>
                {conclusion.felicitations && <div style={{ background: "#0a1520", border: "1px solid #0284c744", borderRadius: 12, padding: 20, marginBottom: 24 }}><p style={{ color: "#bae6fd", fontSize: 14, lineHeight: 1.9, margin: 0 }}>{conclusion.felicitations}</p></div>}
                {conclusion.recapitulatif && <p style={{ color: "#d1d5db", fontSize: 14, lineHeight: 1.9, marginBottom: 24 }}>{conclusion.recapitulatif}</p>}
                {conclusion.plan_action_30_jours?.length > 0 && (
                  <div>
                    <h2 style={{ color: "#4ade80", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>🗓️ Ton Plan d'Action — 30 Jours</h2>
                    {conclusion.plan_action_30_jours.map((a, i) => (
                      <div key={i} style={{ display: "flex", gap: 14, marginBottom: 12 }}>
                        <div style={{ minWidth: 40, height: 40, borderRadius: 8, background: "#22c55e", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 11, flexShrink: 0 }}>S{i+1}</div>
                        <span style={{ color: "#d1fae5", fontSize: 13, lineHeight: 1.8, paddingTop: 10 }}>{a}</span>
                      </div>
                    ))}
                  </div>
                )}
                {conclusion.mot_de_fin && <div style={{ background: "#081510", border: "2px solid #22c55e44", borderRadius: 12, padding: 22, marginTop: 24 }}><p style={{ color: "#86efac", fontSize: 14, lineHeight: 1.9, fontStyle: "italic", margin: 0 }}>{conclusion.mot_de_fin}</p></div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [niche, setNiche] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [running, setRunning] = useState(false);
  const [agentStatus, setAgentStatus] = useState({});
  const [agentResults, setAgentResults] = useState({});
  const [logs, setLogs] = useState([]);
  const [showEbook, setShowEbook] = useState(false);
  const [tab, setTab] = useState("pipeline");
  const [downloading, setDownloading] = useState(false);
  const logsEndRef = useRef(null);

  useEffect(() => { logsEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);
  const addLog = (msg, color = "#555") => setLogs(prev => [...prev, { msg, color, time: new Date().toLocaleTimeString() }]);

  const runPipeline = async () => {
    if (!niche.trim() || !apiKey.trim()) return;
    setRunning(true); setAgentStatus({}); setAgentResults({}); setLogs([]); setTab("pipeline");
    addLog("🚀 Démarrage — génération chapitre par chapitre...", "#fff");
    addLog(`📌 Niche : "${niche}"`, "#a78bfa");
    addLog("⏱ Temps estimé : 8 à 12 minutes (90+ pages de contenu réel)", "#3a3a5a");

    let context = {};

    // ── Agents hors contenu ──────────────────────────────────────────────
    const nonContentAgents = AGENTS.filter(a => a.id !== "content");
    for (const agent of nonContentAgents) {
      setAgentStatus(prev => ({ ...prev, [agent.id]: "running" }));
      addLog(`\n⚡ ${agent.icon} ${agent.name}...`, agent.color);
      try {
        const userPrompt = `Niche: "${niche}"\n${Object.keys(context).length ? `\nContexte:\n${JSON.stringify(context, null, 2)}` : ""}\n\nRéponds uniquement en JSON valide.`;
        const result = await callOpenAI(apiKey, agent.systemPrompt, userPrompt, agent.maxTokens);
        context[agent.id] = result;
        setAgentResults(prev => ({ ...prev, [agent.id]: result }));
        setAgentStatus(prev => ({ ...prev, [agent.id]: "done" }));
        addLog(`  ✓ Terminé`, agent.color);

        // Après le plan → générer le contenu chapitre par chapitre
        if (agent.id === "plan") {
          setAgentStatus(prev => ({ ...prev, content: "running" }));
          addLog(`\n⚡ ✍️ Agent Contenu — rédaction chapitre par chapitre...`, "#fb923c");

          const planChapitres = result.chapitres || [];
          const ebookCtx = { titre: result.titre_principal, niche, audience: context.research?.audience_cible || "débutants complets" };

          // Introduction
          addLog(`  📝 Introduction...`, "#fb923c");
          const intro = await callOpenAI(apiKey,
            `Tu es un auteur humain expert. ${HUMAN_WRITING_RULES}
Réponds en JSON: {"accroche":"200 mots humains et engageants","histoire_auteur":"150 mots de vécu personnel crédible","ce_que_tu_vas_apprendre":"150 mots concrets","comment_utiliser_ce_livre":"100 mots naturels","mot_dencouragement":"80 mots chaleureux et motivants"}`,
            `Ebook: "${ebookCtx.titre}"\nNiche: "${niche}"\nPublic: ${ebookCtx.audience}\n\nRédige une introduction HUMAINE, chaleureuse, engageante. Pas de style IA. 600 mots minimum au total.`,
            1200
          );

          // Chapitres
          const chapitresRediges = [];
          for (const ch of planChapitres) {
            addLog(`  📝 Chapitre ${ch.numero}/${planChapitres.length} — ${ch.titre?.slice(0, 35)}...`, "#fb923c");
            try {
              // Chaque section générée séparément pour garantir 600+ mots
              const sectionsRedigees = [];
              for (const sectionTitle of (ch.sections || [])) {
                const sectionResult = await generateSection(apiKey, sectionTitle, ch, ebookCtx);
                sectionsRedigees.push(sectionResult);
              }

              // Exercice, erreurs, conseil
              const extras = await callOpenAI(apiKey,
                `Tu es un auteur expert pédagogue. ${HUMAN_WRITING_RULES}
Réponds en JSON: {"encadre_conseil":"conseil d'expert pratique en 100 mots humains","erreurs_courantes":["erreur réaliste 1 avec solution","erreur 2 avec solution","erreur 3 avec solution"],"exercice_pratique":{"titre":"titre exercice concret","objectif":"ce que ça apporte concrètement","etapes":["étape 1 détaillée","étape 2","étape 3","étape 4"],"duree_estimee":"30-45 minutes","resultat_attendu":"résultat tangible"},"resume_chapitre":"résumé humain de 100 mots des points clés","introduction_chapitre":"intro engageante de 80 mots","transition":"phrase de transition naturelle vers le prochain chapitre"}`,
                `Ebook: "${ebookCtx.titre}" — Chapitre ${ch.numero}: "${ch.titre}"\nNiche: "${niche}"`,
                1000
              );

              chapitresRediges.push({ numero: ch.numero, titre: ch.titre, sous_titre: ch.sous_titre, sections: sectionsRedigees, ...extras });
              addLog(`     ✓ ${sectionsRedigees.length} sections · ${sectionsRedigees.reduce((a, s) => a + (s.contenu?.split(" ").length || 0), 0)} mots`, "#fb923c");
            } catch (e) {
              addLog(`     ✗ Erreur ch.${ch.numero}: ${e.message}`, "#ef4444");
            }
          }

          // Conclusion
          addLog(`  📝 Conclusion...`, "#fb923c");
          const conclusion = await callOpenAI(apiKey,
            `Tu es un auteur humain. ${HUMAN_WRITING_RULES}
Réponds en JSON: {"felicitations":"100 mots chaleureux et personnels","recapitulatif":"200 mots qui récapitulent vraiment les apprentissages clés","plan_action_30_jours":["Semaine 1: action concrète et détaillée","Semaine 2: action","Semaine 3: action","Semaine 4: action"],"ressources_complementaires":["ressource gratuite pertinente 1","ressource 2","ressource 3"],"mot_de_fin":"120 mots inspirants et humains"}`,
            `Ebook: "${ebookCtx.titre}" terminé. Rédige une conclusion HUMAINE, motivante et mémorable.`,
            1000
          );

          const contentFinal = { introduction: intro, chapitres: chapitresRediges, conclusion };
          context.content = contentFinal;
          setAgentResults(prev => ({ ...prev, content: contentFinal }));
          setAgentStatus(prev => ({ ...prev, content: "done" }));

          const totalWords = chapitresRediges.reduce((acc, ch) =>
            acc + (ch.sections || []).reduce((a, s) => a + (s.contenu?.split(" ").length || 0), 0), 0);
          addLog(`  ✓ Ebook complet — ${chapitresRediges.length} chapitres — ~${totalWords} mots — ~${Math.round(totalWords / 300)} pages`, "#fb923c");
        }

      } catch (e) {
        setAgentStatus(prev => ({ ...prev, [agent.id]: "error" }));
        addLog(`  ✗ Erreur: ${e.message}`, "#ef4444");
      }
    }

    addLog("\n🎉 Tout est prêt ! Télécharge ton dossier complet ci-dessous.", "#00ffd5");
    setRunning(false);
    setTab("deliverables");
  };

  const handleDownloadZIP = async () => {
    setDownloading(true);
    try {
      await downloadZIP(agentResults, niche);
    } catch (e) {
      alert("Erreur ZIP: " + e.message);
    }
    setDownloading(false);
  };

  const handleDownloadPDF = () => {
    const html = buildPDFHtml(agentResults.content, agentResults.plan, agentResults.research);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (!win) alert("Autorise les popups pour télécharger le PDF.");
  };

  const allDone = AGENTS.every(a => agentStatus[a.id] === "done");
  const completedCount = AGENTS.filter(a => agentStatus[a.id] === "done").length;
  const progress = (completedCount / AGENTS.length) * 100;

  return (
    <div style={{ minHeight: "100vh", background: "#070710", fontFamily: "'Space Mono', monospace", color: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        @keyframes shimmer{0%{transform:translateX(-200%)}100%{transform:translateX(400%)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box;} input{outline:none!important;}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#070710} ::-webkit-scrollbar-thumb{background:#1a1a2e;border-radius:2px}
      `}</style>

      {showEbook && agentResults.content && (
        <EbookViewer data={agentResults.content} plan={agentResults.plan} onClose={() => setShowEbook(false)} onDownloadPDF={handleDownloadPDF} />
      )}

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 18px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg,#00ffd5,#a78bfa,#ff6b6b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>⚡</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>EBOOK AGENT PIPELINE</h1>
            <div style={{ color: "#3a3a5a", fontSize: 11, marginTop: 3 }}>GPT-4o · Style humain · 90+ pages réelles · ZIP complet</div>
          </div>
        </div>

        {/* Config */}
        <div style={{ background: "#0d0d1a", border: "1px solid #1a1a2e", borderRadius: 14, padding: 22, marginBottom: 20 }}>
          <div style={{ color: "#3a3a5a", fontSize: 10, marginBottom: 14, letterSpacing: 1 }}>⚙️ CONFIGURATION</div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: "#555", fontSize: 10, marginBottom: 6 }}>
              OPENAI API KEY &nbsp;
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" style={{ color: "#00ffd5", fontSize: 10, textDecoration: "underline" }}>→ Obtenir</a>
              &nbsp;·&nbsp;
              <a href="https://platform.openai.com/settings/billing/overview" target="_blank" rel="noreferrer" style={{ color: "#fb923c", fontSize: 10, textDecoration: "underline" }}>→ Ajouter 5$</a>
            </div>
            <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-proj-..." disabled={running}
              style={{ width: "100%", background: "#070710", border: "1px solid #1a1a2e", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 13, fontFamily: "monospace" }} />
          </div>
          <div>
            <div style={{ color: "#555", fontSize: 10, marginBottom: 6 }}>NICHE / SUJET DE TON EBOOK</div>
            <div style={{ display: "flex", gap: 10 }}>
              <input value={niche} onChange={e => setNiche(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !running && niche.trim() && apiKey.trim() && runPipeline()}
                placeholder="ex: Gagner 1000€/mois avec l'IA pour débutants en 2026..." disabled={running}
                style={{ flex: 1, background: "#070710", border: "1px solid #1a1a2e", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 13, fontFamily: "monospace" }} />
              <button onClick={runPipeline} disabled={running || !niche.trim() || !apiKey.trim()}
                style={{ background: running || !niche.trim() || !apiKey.trim() ? "#1a1a2e" : "linear-gradient(135deg,#00ffd5,#00b4d8)", border: "none", borderRadius: 10, padding: "11px 24px", color: running || !niche.trim() || !apiKey.trim() ? "#3a3a5a" : "#000", fontWeight: 700, fontSize: 13, cursor: running || !niche.trim() || !apiKey.trim() ? "not-allowed" : "pointer", fontFamily: "monospace", whiteSpace: "nowrap" }}>
                {running ? "⏳ EN COURS..." : "▶ LANCER"}
              </button>
            </div>
          </div>
        </div>

        {/* Progress */}
        {completedCount > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "#3a3a5a", fontSize: 10 }}>PROGRESSION</span>
              <span style={{ color: "#00ffd5", fontSize: 10, fontWeight: 700 }}>{completedCount}/{AGENTS.length}</span>
            </div>
            <div style={{ background: "#1a1a2e", borderRadius: 4, height: 4 }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#00ffd5,#a78bfa,#ff6b6b)", borderRadius: 4, transition: "width 0.6s ease" }} />
            </div>
          </div>
        )}

        {/* Tabs */}
        {allDone && (
          <div style={{ display: "flex", gap: 2, marginBottom: 20, background: "#0d0d1a", borderRadius: 10, padding: 4 }}>
            {[{id:"pipeline",l:"⚡ Pipeline"},{id:"deliverables",l:"📦 Livrables"},{id:"ebook_tab",l:"📚 Ebook Reader"}].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ flex: 1, padding: "9px", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, transition: "all 0.2s", background: tab === t.id ? "#1a1a2e" : "transparent", color: tab === t.id ? "#fff" : "#555" }}>
                {t.l}
              </button>
            ))}
          </div>
        )}

        {/* PIPELINE TAB */}
        {tab === "pipeline" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <div>
              <div style={{ color: "#3a3a5a", fontSize: 10, letterSpacing: 1, marginBottom: 10 }}>AGENTS IA</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {AGENTS.map((agent, i) => {
                  const status = agentStatus[agent.id] || "idle";
                  return (
                    <div key={agent.id}>
                      <div style={{ border: `1px solid ${status === "idle" ? "#1a1a2e" : status === "error" ? "#ef4444" : agent.color}`, background: "#0d0d1a", opacity: status === "idle" ? 0.5 : 1, borderRadius: 12, padding: "13px 16px", position: "relative", overflow: "hidden", transition: "all 0.3s", boxShadow: status !== "idle" ? `0 0 18px ${agent.color}15` : "none" }}>
                        {status === "running" && <div style={{ position: "absolute", top: 0, left: 0, height: 2, width: "60%", background: `linear-gradient(90deg,transparent,${agent.color})`, animation: "shimmer 1.2s infinite" }} />}
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 18 }}>{agent.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 12, fontFamily: "monospace" }}>{agent.name}</div>
                            <div style={{ color: "#4a4a6a", fontSize: 10, marginTop: 1 }}>{agent.description}</div>
                          </div>
                          <div style={{ width: 7, height: 7, borderRadius: "50%", background: status === "done" ? agent.color : status === "running" ? agent.color : status === "error" ? "#ef4444" : "#1e1e3a", boxShadow: status === "running" ? `0 0 8px ${agent.color}` : "none", animation: status === "running" ? "blink 0.8s infinite" : "none" }} />
                        </div>
                        {status === "done" && <div style={{ color: agent.color, fontSize: 10, marginTop: 4, fontFamily: "monospace" }}>✓ Terminé</div>}
                      </div>
                      {i < AGENTS.length - 1 && <div style={{ width: 1, height: 5, background: "#1a1a2e", margin: "0 20px" }} />}
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <div style={{ color: "#3a3a5a", fontSize: 10, letterSpacing: 1, marginBottom: 10 }}>LOGS</div>
              <div style={{ background: "#030308", border: "1px solid #1a1a2e", borderRadius: 12, padding: 14, height: 430, overflow: "auto", fontSize: 10 }}>
                {logs.length === 0 ? <div style={{ color: "#1a1a2e", textAlign: "center", paddingTop: 180 }}>En attente...</div>
                  : logs.map((log, i) => (
                    <div key={i} style={{ marginBottom: 2 }}>
                      <span style={{ color: "#2a2a4a" }}>[{log.time}] </span>
                      <span style={{ color: log.color }}>{log.msg}</span>
                    </div>
                  ))}
                <div ref={logsEndRef} />
              </div>
            </div>
          </div>
        )}

        {/* DELIVERABLES TAB */}
        {tab === "deliverables" && allDone && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>

            {/* BIG DOWNLOAD CTA */}
            <div style={{ background: "linear-gradient(135deg,#0a0a1a,#140a24)", border: "2px solid #a78bfa", borderRadius: 16, padding: 28, marginBottom: 20, textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
              <div style={{ color: "#a78bfa", fontSize: 11, fontFamily: "monospace", marginBottom: 8, letterSpacing: 2 }}>LIVRABLE FINAL</div>
              <div style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Dossier complet — tout est dedans</div>
              <div style={{ color: "#555", fontSize: 12, marginBottom: 24, lineHeight: 1.8 }}>
                📄 Ebook HTML (prêt à imprimer en PDF) · 📝 Textes Gumroad · 📝 Page de vente<br/>
                📝 4 Emails · 📝 Posts réseaux sociaux · 📝 3 Prompts DALL-E · 📝 Analyse marché · 📋 README
              </div>
              <button onClick={handleDownloadZIP} disabled={downloading}
                style={{ background: downloading ? "#1a1a2e" : "linear-gradient(135deg,#a78bfa,#7c3aed)", border: "none", borderRadius: 12, padding: "16px 40px", color: downloading ? "#555" : "#fff", fontWeight: 700, fontSize: 16, cursor: downloading ? "not-allowed" : "pointer", fontFamily: "monospace", transition: "all 0.2s" }}>
                {downloading ? "⏳ Génération du ZIP..." : "⬇️ TÉLÉCHARGER LE DOSSIER COMPLET (.ZIP)"}
              </button>
              <div style={{ color: "#2a2a4a", fontSize: 10, marginTop: 12 }}>
                Inclut tout. Tu n'as qu'à ouvrir le README.txt pour les instructions étape par étape.
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
              {[
                { label: "Chapitres", val: agentResults.content?.chapitres?.length || "—", color: "#a78bfa" },
                { label: "Mots estimés", val: `~${agentResults.content?.chapitres?.reduce((a, ch) => a + (ch.sections || []).reduce((b, s) => b + (s.contenu?.split(" ").length || 0), 0), 0) || 0}`, color: "#00ffd5" },
                { label: "Pages estimées", val: `~${Math.round((agentResults.content?.chapitres?.reduce((a, ch) => a + (ch.sections || []).reduce((b, s) => b + (s.contenu?.split(" ").length || 0), 0), 0) || 0) / 300)}`, color: "#34d399" },
                { label: "Score marché", val: agentResults.research?.validation === "GO" ? "✅ GO" : agentResults.research?.validation || "—", color: "#fb923c" }
              ].map((item, i) => (
                <div key={i} style={{ background: "#0d0d1a", border: "1px solid #1a1a2e", borderRadius: 10, padding: 14, textAlign: "center" }}>
                  <div style={{ color: item.color, fontSize: 20, fontWeight: 700 }}>{item.val}</div>
                  <div style={{ color: "#3a3a5a", fontSize: 10, marginTop: 4 }}>{item.label}</div>
                </div>
              ))}
            </div>

            {/* PDF + Reader */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button onClick={handleDownloadPDF}
                style={{ background: "#0d0d1a", border: "1px solid #00ffd5", borderRadius: 12, padding: "16px", color: "#00ffd5", cursor: "pointer", fontFamily: "monospace", fontSize: 12, fontWeight: 700 }}>
                📄 Ouvrir l'ebook → Imprimer en PDF<br/><span style={{ color: "#3a3a5a", fontSize: 10, fontWeight: 400 }}>Ctrl+P → Enregistrer en PDF</span>
              </button>
              <button onClick={() => setShowEbook(true)}
                style={{ background: "#0d0d1a", border: "1px solid #a78bfa", borderRadius: 12, padding: "16px", color: "#a78bfa", cursor: "pointer", fontFamily: "monospace", fontSize: 12, fontWeight: 700 }}>
                📚 Lire l'ebook dans le reader<br/><span style={{ color: "#3a3a5a", fontSize: 10, fontWeight: 400 }}>Navigation chapitre par chapitre</span>
              </button>
            </div>
          </div>
        )}

        {/* EBOOK READER TAB */}
        {tab === "ebook_tab" && allDone && agentResults.content && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ textAlign: "center", padding: 40 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{agentResults.plan?.titre_principal}</div>
              <div style={{ color: "#555", fontSize: 12, marginBottom: 24 }}>{agentResults.content?.chapitres?.length} chapitres rédigés</div>
              <button onClick={() => setShowEbook(true)}
                style={{ background: "linear-gradient(135deg,#a78bfa,#7c3aed)", border: "none", borderRadius: 12, padding: "14px 32px", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "monospace" }}>
                📖 OUVRIR LE READER
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
