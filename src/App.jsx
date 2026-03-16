import { useState, useRef, useEffect } from "react";

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
    systemPrompt: `Tu es un expert senior en marketing digital et analyse de marché, spécialisé dans la vente de produits numériques.
Ton analyse doit être EXHAUSTIVE, PRÉCISE et ACTIONNABLE.
Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks:
{
  "validation": "GO ou NO-GO",
  "score_marche": "X/10",
  "audience_cible": "Description très détaillée: qui sont ces personnes, leur âge, leur situation professionnelle et personnelle, leurs frustrations quotidiennes, leurs rêves et aspirations, pourquoi ils cherchent une solution maintenant",
  "probleme_resolu": "Description profonde du problème: ce que vivent ces personnes au quotidien, comment ce problème impacte leur vie, pourquoi les solutions existantes ne les satisfont pas",
  "concurrence": "Analyse détaillée: qui sont les concurrents, leurs forces et faiblesses, les lacunes du marché que cet ebook peut combler",
  "prix_recommande": "Fourchette précise avec justification psychologique et économique",
  "angle_unique": "Positionnement différenciant en 3-4 phrases: ce qui rend cet ebook unique et indispensable",
  "mots_cles": ["mot-cle-1", "mot-cle-2", "mot-cle-3", "mot-cle-4", "mot-cle-5", "mot-cle-6"],
  "tendances_marche": "Analyse des tendances 2025-2026 sur cette niche, pourquoi c'est le bon moment",
  "canaux_acquisition": ["canal 1 avec stratégie", "canal 2 avec stratégie", "canal 3 avec stratégie"],
  "verdict": "Conclusion complète en 5-6 phrases: opportunité, risques, recommandations stratégiques"
}`
  },
  {
    id: "plan",
    name: "Agent Structure",
    icon: "📋",
    description: "Architecture pédagogique complète",
    color: "#a78bfa",
    maxTokens: 2000,
    systemPrompt: `Tu es un expert en ingénierie pédagogique et en création de formations pour débutants complets. Tu sais comment structurer un apprentissage progressif et efficace.
L'ebook doit être accessible à quelqu'un qui n'a AUCUNE connaissance préalable du sujet.
Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks:
{
  "titre_principal": "Titre accrocheur, clair, qui promet un résultat concret",
  "sous_titre": "Sous-titre qui précise le public cible et le bénéfice principal",
  "promesse": "Promesse de transformation précise et mesurable",
  "niveau": "Débutant complet — zéro prérequis",
  "duree_lecture": "estimée en heures",
  "introduction_generale": "Présentation de l'ebook en 3-4 phrases, pourquoi ce sujet est important maintenant",
  "chapitres": [
    {
      "numero": 1,
      "titre": "Titre du chapitre 1 - commence par les bases absolues",
      "sous_titre": "Ce que tu vas maîtriser dans ce chapitre",
      "objectif_pedagogique": "Compétence précise acquise après lecture",
      "concepts_abordes": ["concept 1", "concept 2", "concept 3", "concept 4"],
      "sections": [
        "1.1 - Titre section 1",
        "1.2 - Titre section 2",
        "1.3 - Titre section 3",
        "1.4 - Titre section 4"
      ],
      "exercice_pratique": "Exercice détaillé, concret, faisable en 30 minutes",
      "resultats_attendus": "Ce que le lecteur sera capable de faire après ce chapitre",
      "duree_estimee": "X minutes de lecture"
    },
    {
      "numero": 2,
      "titre": "Titre chapitre 2",
      "sous_titre": "Sous-titre chapitre 2",
      "objectif_pedagogique": "Objectif chapitre 2",
      "concepts_abordes": ["concept 1", "concept 2", "concept 3", "concept 4"],
      "sections": ["2.1 - Section", "2.2 - Section", "2.3 - Section", "2.4 - Section"],
      "exercice_pratique": "Exercice chapitre 2",
      "resultats_attendus": "Résultats chapitre 2",
      "duree_estimee": "X minutes"
    },
    {
      "numero": 3,
      "titre": "Titre chapitre 3",
      "sous_titre": "Sous-titre chapitre 3",
      "objectif_pedagogique": "Objectif chapitre 3",
      "concepts_abordes": ["concept 1", "concept 2", "concept 3", "concept 4"],
      "sections": ["3.1 - Section", "3.2 - Section", "3.3 - Section", "3.4 - Section"],
      "exercice_pratique": "Exercice chapitre 3",
      "resultats_attendus": "Résultats chapitre 3",
      "duree_estimee": "X minutes"
    },
    {
      "numero": 4,
      "titre": "Titre chapitre 4",
      "sous_titre": "Sous-titre chapitre 4",
      "objectif_pedagogique": "Objectif chapitre 4",
      "concepts_abordes": ["concept 1", "concept 2", "concept 3", "concept 4"],
      "sections": ["4.1 - Section", "4.2 - Section", "4.3 - Section", "4.4 - Section"],
      "exercice_pratique": "Exercice chapitre 4",
      "resultats_attendus": "Résultats chapitre 4",
      "duree_estimee": "X minutes"
    },
    {
      "numero": 5,
      "titre": "Titre chapitre 5",
      "sous_titre": "Sous-titre chapitre 5",
      "objectif_pedagogique": "Objectif chapitre 5",
      "concepts_abordes": ["concept 1", "concept 2", "concept 3", "concept 4"],
      "sections": ["5.1 - Section", "5.2 - Section", "5.3 - Section", "5.4 - Section"],
      "exercice_pratique": "Exercice chapitre 5",
      "resultats_attendus": "Résultats chapitre 5",
      "duree_estimee": "X minutes"
    },
    {
      "numero": 6,
      "titre": "Titre chapitre 6 - passage à l'action et résultats",
      "sous_titre": "Sous-titre chapitre 6",
      "objectif_pedagogique": "Objectif chapitre 6",
      "concepts_abordes": ["concept 1", "concept 2", "concept 3", "concept 4"],
      "sections": ["6.1 - Section", "6.2 - Section", "6.3 - Section", "6.4 - Section"],
      "exercice_pratique": "Exercice chapitre 6",
      "resultats_attendus": "Résultats chapitre 6",
      "duree_estimee": "X minutes"
    }
  ],
  "bonus": [
    {"titre": "Bonus 1", "description": "Description détaillée du bonus 1 et sa valeur"},
    {"titre": "Bonus 2", "description": "Description détaillée du bonus 2 et sa valeur"},
    {"titre": "Bonus 3", "description": "Checklist ou template offert"}
  ],
  "resultats_globaux": ["Résultat concret 1", "Résultat concret 2", "Résultat concret 3", "Résultat concret 4"]
}`
  },
  {
    id: "content",
    name: "Agent Contenu",
    icon: "✍️",
    description: "Rédaction de l'ebook complet",
    color: "#fb923c",
    maxTokens: 4000,
    systemPrompt: `Tu es un auteur expert reconnu, spécialisé dans la rédaction d'ebooks pédagogiques pour grands débutants. Ton style est: chaleureux, encourageant, concret, jamais condescendant.

RÈGLES ABSOLUES DE RÉDACTION:
- Chaque chapitre doit faire MINIMUM 800 mots de contenu réel
- Utilise des analogies simples pour expliquer les concepts complexes
- Donne des exemples concrets tirés de la vraie vie
- Utilise des sous-titres pour structurer chaque section
- Inclus des "encadrés" avec des conseils pratiques
- Anticipe les questions et doutes du débutant
- Tutoie le lecteur de façon bienveillante
- Termine chaque section par un point clé à retenir

Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks:
{
  "introduction": {
    "accroche": "Paragraphe d'accroche puissant de 80 mots qui parle directement au lecteur de sa situation",
    "histoire_auteur": "Histoire personnelle courte et authentique de l'auteur qui crédibilise son expertise (100 mots)",
    "ce_que_tu_vas_apprendre": "Description détaillée de la transformation que va vivre le lecteur (100 mots)",
    "comment_utiliser_ce_livre": "Guide pratique pour tirer le maximum de cet ebook (80 mots)",
    "mot_dencouragement": "Message personnel et motivant au lecteur (60 mots)"
  },
  "chapitres": [
    {
      "numero": 1,
      "titre": "Titre exact issu du plan",
      "introduction_chapitre": "Introduction du chapitre en 80 mots qui donne envie de lire la suite",
      "sections": [
        {
          "titre_section": "1.1 - Titre de la section",
          "contenu": "Contenu COMPLET et DÉTAILLÉ de cette section: minimum 200 mots. Explications claires, analogies simples, exemples concrets tirés de la vraie vie. Écrit pour un débutant absolu qui ne connaît RIEN au sujet. Chaque concept expliqué comme si c'était la première fois. Langage simple, accessible, encourageant."
        },
        {
          "titre_section": "1.2 - Titre de la section",
          "contenu": "Contenu COMPLET de 200 mots minimum pour cette section."
        },
        {
          "titre_section": "1.3 - Titre de la section",
          "contenu": "Contenu COMPLET de 200 mots minimum pour cette section."
        },
        {
          "titre_section": "1.4 - Titre de la section",
          "contenu": "Contenu COMPLET de 200 mots minimum pour cette section."
        }
      ],
      "encadre_conseil": "Conseil pratique important mis en valeur dans un encadré — une astuce que les experts connaissent et que les débutants ignorent",
      "erreurs_courantes": ["Erreur fréquente 1 avec explication de comment l'éviter", "Erreur fréquente 2 avec solution", "Erreur fréquente 3 avec solution"],
      "exercice_pratique": {
        "titre": "Titre de l'exercice pratique",
        "objectif": "Ce que cet exercice va t'apporter concrètement",
        "etapes": ["Étape 1 très détaillée et actionnable", "Étape 2 détaillée", "Étape 3 détaillée", "Étape 4 détaillée"],
        "duree_estimee": "30 minutes",
        "resultat_attendu": "Ce que tu auras accompli après cet exercice"
      },
      "resume_chapitre": "Résumé des points essentiels du chapitre en 5-6 points clés",
      "transition": "Phrase de transition vers le chapitre suivant qui donne envie de continuer"
    },
    {
      "numero": 2,
      "titre": "Titre exact chapitre 2",
      "introduction_chapitre": "Introduction chapitre 2",
      "sections": [
        {"titre_section": "2.1 - Titre", "contenu": "Contenu 200+ mots pour débutants"},
        {"titre_section": "2.2 - Titre", "contenu": "Contenu 200+ mots pour débutants"},
        {"titre_section": "2.3 - Titre", "contenu": "Contenu 200+ mots pour débutants"},
        {"titre_section": "2.4 - Titre", "contenu": "Contenu 200+ mots pour débutants"}
      ],
      "encadre_conseil": "Conseil important chapitre 2",
      "erreurs_courantes": ["Erreur 1", "Erreur 2", "Erreur 3"],
      "exercice_pratique": {
        "titre": "Exercice chapitre 2",
        "objectif": "Objectif exercice 2",
        "etapes": ["Étape 1", "Étape 2", "Étape 3", "Étape 4"],
        "duree_estimee": "30 minutes",
        "resultat_attendu": "Résultat exercice 2"
      },
      "resume_chapitre": "Résumé chapitre 2",
      "transition": "Transition vers chapitre 3"
    },
    {
      "numero": 3,
      "titre": "Titre exact chapitre 3",
      "introduction_chapitre": "Introduction chapitre 3",
      "sections": [
        {"titre_section": "3.1 - Titre", "contenu": "Contenu 200+ mots pour débutants"},
        {"titre_section": "3.2 - Titre", "contenu": "Contenu 200+ mots pour débutants"},
        {"titre_section": "3.3 - Titre", "contenu": "Contenu 200+ mots pour débutants"},
        {"titre_section": "3.4 - Titre", "contenu": "Contenu 200+ mots pour débutants"}
      ],
      "encadre_conseil": "Conseil important chapitre 3",
      "erreurs_courantes": ["Erreur 1", "Erreur 2", "Erreur 3"],
      "exercice_pratique": {
        "titre": "Exercice chapitre 3",
        "objectif": "Objectif exercice 3",
        "etapes": ["Étape 1", "Étape 2", "Étape 3", "Étape 4"],
        "duree_estimee": "30 minutes",
        "resultat_attendu": "Résultat exercice 3"
      },
      "resume_chapitre": "Résumé chapitre 3",
      "transition": "Transition vers chapitre 4"
    },
    {
      "numero": 4,
      "titre": "Titre exact chapitre 4",
      "introduction_chapitre": "Introduction chapitre 4",
      "sections": [
        {"titre_section": "4.1 - Titre", "contenu": "Contenu 200+ mots pour débutants"},
        {"titre_section": "4.2 - Titre", "contenu": "Contenu 200+ mots pour débutants"},
        {"titre_section": "4.3 - Titre", "contenu": "Contenu 200+ mots pour débutants"},
        {"titre_section": "4.4 - Titre", "contenu": "Contenu 200+ mots pour débutants"}
      ],
      "encadre_conseil": "Conseil important chapitre 4",
      "erreurs_courantes": ["Erreur 1", "Erreur 2", "Erreur 3"],
      "exercice_pratique": {
        "titre": "Exercice chapitre 4",
        "objectif": "Objectif exercice 4",
        "etapes": ["Étape 1", "Étape 2", "Étape 3", "Étape 4"],
        "duree_estimee": "30 minutes",
        "resultat_attendu": "Résultat exercice 4"
      },
      "resume_chapitre": "Résumé chapitre 4",
      "transition": "Transition vers chapitre 5"
    },
    {
      "numero": 5,
      "titre": "Titre exact chapitre 5",
      "introduction_chapitre": "Introduction chapitre 5",
      "sections": [
        {"titre_section": "5.1 - Titre", "contenu": "Contenu 200+ mots pour débutants"},
        {"titre_section": "5.2 - Titre", "contenu": "Contenu 200+ mots pour débutants"},
        {"titre_section": "5.3 - Titre", "contenu": "Contenu 200+ mots pour débutants"},
        {"titre_section": "5.4 - Titre", "contenu": "Contenu 200+ mots pour débutants"}
      ],
      "encadre_conseil": "Conseil important chapitre 5",
      "erreurs_courantes": ["Erreur 1", "Erreur 2", "Erreur 3"],
      "exercice_pratique": {
        "titre": "Exercice chapitre 5",
        "objectif": "Objectif exercice 5",
        "etapes": ["Étape 1", "Étape 2", "Étape 3", "Étape 4"],
        "duree_estimee": "30 minutes",
        "resultat_attendu": "Résultat exercice 5"
      },
      "resume_chapitre": "Résumé chapitre 5",
      "transition": "Transition vers chapitre 6"
    },
    {
      "numero": 6,
      "titre": "Titre exact chapitre 6",
      "introduction_chapitre": "Introduction chapitre 6",
      "sections": [
        {"titre_section": "6.1 - Titre", "contenu": "Contenu 200+ mots pour débutants"},
        {"titre_section": "6.2 - Titre", "contenu": "Contenu 200+ mots pour débutants"},
        {"titre_section": "6.3 - Titre", "contenu": "Contenu 200+ mots pour débutants"},
        {"titre_section": "6.4 - Titre", "contenu": "Contenu 200+ mots pour débutants"}
      ],
      "encadre_conseil": "Conseil important chapitre 6",
      "erreurs_courantes": ["Erreur 1", "Erreur 2", "Erreur 3"],
      "exercice_pratique": {
        "titre": "Exercice chapitre 6",
        "objectif": "Objectif exercice 6",
        "etapes": ["Étape 1", "Étape 2", "Étape 3", "Étape 4"],
        "duree_estimee": "30 minutes",
        "resultat_attendu": "Résultat exercice 6"
      },
      "resume_chapitre": "Résumé chapitre 6",
      "transition": "Message de félicitations pour avoir terminé l'ebook"
    }
  ],
  "conclusion": {
    "felicitations": "Message de félicitations chaleureux pour avoir terminé l'ebook (80 mots)",
    "recapitulatif": "Récapitulatif complet de tout ce que le lecteur a appris (150 mots)",
    "plan_action_30_jours": ["Action semaine 1", "Action semaine 2", "Action semaine 3", "Action semaine 4"],
    "ressources_complementaires": ["Ressource 1 gratuite recommandée", "Ressource 2", "Ressource 3"],
    "mot_de_fin": "Message personnel et inspirant de l'auteur (100 mots)"
  }
}`
  },
  {
    id: "marketing",
    name: "Agent Marketing",
    icon: "🎯",
    description: "Page de vente & séquence emails complète",
    color: "#f472b6",
    maxTokens: 3000,
    systemPrompt: `Tu es un expert copywriter de niveau international, spécialisé dans la vente de produits numériques. Tu maîtrises les frameworks AIDA, PAS et le storytelling.
Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks:
{
  "page_de_vente": {
    "headline": "Titre principal ultra-accrocheur qui promet une transformation",
    "sous_headline": "Sous-titre qui précise le public, le délai et lève l'objection principale",
    "accroche_storytelling": "Histoire d'ouverture de 150 mots qui parle directement à la douleur du lecteur",
    "probleme_agite": "Description vivante et empathique du problème en 120 mots",
    "solution_presentee": "Présentation de l'ebook comme LA solution idéale en 120 mots",
    "benefices": [
      "✅ Bénéfice concret et mesurable 1",
      "✅ Bénéfice concret et mesurable 2",
      "✅ Bénéfice concret et mesurable 3",
      "✅ Bénéfice concret et mesurable 4",
      "✅ Bénéfice concret et mesurable 5",
      "✅ Bénéfice concret et mesurable 6"
    ],
    "pour_qui": "Description précise des personnes pour qui cet ebook est parfait (80 mots)",
    "pas_pour_qui": "Honnêteté sur pour qui ce n'est pas fait (50 mots)",
    "contenu_detaille": "Ce que contient exactement l'ebook chapitre par chapitre (150 mots)",
    "temoignages": [
      {"prenom": "Prénom1", "age": "XX ans", "situation": "situation", "resultat": "résultat obtenu en X semaines", "texte": "témoignage détaillé et crédible de 60 mots"},
      {"prenom": "Prénom2", "age": "XX ans", "situation": "situation", "resultat": "résultat obtenu", "texte": "témoignage détaillé de 60 mots"}
    ],
    "offre_complete": "Description de tout ce qui est inclus avec valeur perçue",
    "prix_barre": "XX€",
    "prix_actuel": "XX€",
    "urgence": "Raison légitime de l'offre spéciale",
    "cta_principal": "Texte du bouton d'achat percutant",
    "garantie": "Texte de garantie satisfait ou remboursé 30 jours rassurant",
    "faq": [
      {"question": "Question fréquente 1", "reponse": "Réponse rassurante"},
      {"question": "Question fréquente 2", "reponse": "Réponse rassurante"},
      {"question": "Question fréquente 3", "reponse": "Réponse rassurante"}
    ]
  },
  "email_sequence": [
    {
      "jour": 0,
      "sujet": "Objet email bienvenue accrocheur",
      "preview": "Texte de prévisualisation",
      "corps": "Corps complet de l'email de bienvenue de 200 mots avec storytelling et CTA"
    },
    {
      "jour": 2,
      "sujet": "Objet email valeur gratuite",
      "preview": "Texte de prévisualisation",
      "corps": "Email de valeur pure: conseil ou astuce gratuite de 180 mots"
    },
    {
      "jour": 4,
      "sujet": "Objet email preuve sociale",
      "preview": "Texte de prévisualisation",
      "corps": "Email avec témoignage et résultats concrets de 180 mots"
    },
    {
      "jour": 6,
      "sujet": "Objet email urgence subtile",
      "preview": "Texte de prévisualisation",
      "corps": "Email d'urgence avec storytelling final de 200 mots"
    }
  ],
  "posts_reseaux": {
    "linkedin": "Post LinkedIn complet de 250 mots avec storytelling, valeur et CTA discret",
    "instagram_caption": "Caption Instagram engageante avec emojis, story courte et hashtags pertinents",
    "tiktok_script": "Script vidéo TikTok de 60 secondes: hook 3 premières secondes, développement, CTA",
    "twitter_thread": [
      "Tweet 1 - Hook puissant (280 chars max)",
      "Tweet 2 - Développement du problème",
      "Tweet 3 - La solution",
      "Tweet 4 - Preuve ou exemple",
      "Tweet 5 - CTA vers l'ebook"
    ]
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
    systemPrompt: `Tu es un directeur artistique expert en couvertures de livres numériques et un stratège en lancement de produits digitaux.
Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks:
{
  "prompt_dalle_v3": "Extremely detailed DALL-E 3 prompt in English for a professional ebook cover: specify exact visual style (e.g. modern minimalist, bold typographic, illustrated), precise color palette with hex codes, typography style and font suggestions, main visual element/illustration, mood and atmosphere, composition details, what makes it stand out in a digital marketplace. Make it compelling and professional.",
  "prompt_dalle_fr": "Même prompt ultra-détaillé en français pour comprendre exactement ce qui sera créé",
  "palette_principale": ["#hexcode1 - nom couleur", "#hexcode2 - nom couleur", "#hexcode3 - nom couleur"],
  "typographie": {"titre": "Police recommandée pour le titre", "sous_titre": "Police pour le sous-titre", "justification": "Pourquoi ces choix typographiques"},
  "style_visuel": "Description complète du parti pris visuel et pourquoi il parle à la cible",
  "strategie_prix": {
    "prix_lancement_7j": "XX€ - prix de lancement 7 premiers jours",
    "prix_standard": "XX€ - prix normal",
    "prix_bundle": "XX€ - bundle avec bonus",
    "justification_psychologique": "Pourquoi ces prix convertissent bien sur ce marché"
  },
  "strategie_lancement": {
    "semaine_avant": ["Action 1", "Action 2", "Action 3"],
    "jour_j": ["Action lancement 1", "Action lancement 2", "Action lancement 3"],
    "semaine_apres": ["Action suivi 1", "Action suivi 2", "Action suivi 3"]
  },
  "plateformes": [
    {"nom": "Gumroad", "commission": "10%", "avantage": "Le plus simple pour débuter, paiement immédiat"},
    {"nom": "Systeme.io", "commission": "0%", "avantage": "Tunnel de vente + emails inclus, idéal pour scaler"},
    {"nom": "Payhip", "commission": "5%", "avantage": "Affiliés intégrés, idéal pour le bouche à oreille"},
    {"nom": "Amazon KDP", "commission": "30-65%", "avantage": "Audience massive, crédibilité auteur"}
  ]
}`
  },
  {
    id: "publish",
    name: "Agent Publication",
    icon: "🚀",
    description: "Préparation publication Gumroad",
    color: "#ff6b6b",
    maxTokens: 2000,
    systemPrompt: `Tu es un expert en optimisation de fiches produits pour Gumroad et en copywriting de conversion.
Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks:
{
  "gumroad_name": "Nom produit optimisé SEO Gumroad (max 80 chars, accrocheur)",
  "gumroad_description_html": "<h2>🎯 [Titre accrocheur]</h2><p><strong>[Promesse en une phrase percutante]</strong></p><br><p>[Introduction 3-4 phrases qui parlent au problème du lecteur]</p><br><h2>📚 Ce que tu vas apprendre</h2><ul><li>✅ Point concret 1</li><li>✅ Point concret 2</li><li>✅ Point concret 3</li><li>✅ Point concret 4</li><li>✅ Point concret 5</li><li>✅ Point concret 6</li></ul><br><h2>👤 Pour qui est cet ebook ?</h2><p>[Description précise de la cible idéale]</p><br><h2>📦 Ce qui est inclus</h2><ul><li>📖 L'ebook complet (80+ pages)</li><li>🎁 Bonus 1</li><li>🎁 Bonus 2</li><li>✅ Checklist d'action</li></ul><br><h2>💬 Témoignages</h2><p><em>[Témoignage crédible avec résultat concret]</em></p><br><h2>🛡️ Garantie 30 jours</h2><p>Si tu n'es pas satisfait, je te rembourse intégralement. Aucune question posée.</p>",
  "prix_cents": "1700",
  "tags_seo": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "categories_suggerees": ["catégorie principale", "catégorie secondaire"],
  "url_suggeree": "nom-url-seo-friendly",
  "checklist_avant_publication": [
    "✅ PDF exporté en haute qualité",
    "✅ Couverture créée avec DALL-E (prompt fourni ci-dessus)",
    "✅ Prix configuré",
    "✅ Description copiée-collée",
    "✅ Tags ajoutés",
    "✅ Email de confirmation personnalisé",
    "✅ Page de remerciement configurée"
  ],
  "resume_business_complet": "Résumé complet de tout le business créé: l'ebook, le marketing, la stratégie de prix et de lancement"
}`
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// EBOOK VIEWER
// ─────────────────────────────────────────────────────────────────────────────
const EbookViewer = ({ data, plan, onClose }) => {
  const [activeChapter, setActiveChapter] = useState("intro");

  const chapters = data?.chapitres || [];
  const intro = data?.introduction;
  const conclusion = data?.conclusion;

  const sidebarItems = [
    { id: "intro", label: "📖 Introduction", icon: "📖" },
    ...chapters.map(c => ({ id: `ch${c.numero}`, label: `${c.numero}. ${c.titre?.slice(0, 35)}${c.titre?.length > 35 ? "..." : ""}`, icon: "📄" })),
    { id: "conclusion", label: "🎯 Conclusion", icon: "🎯" }
  ];

  const renderChapter = (ch) => (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ color: "#fb923c", fontSize: 12, fontFamily: "monospace", marginBottom: 8 }}>
          CHAPITRE {ch.numero}
        </div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#fff", lineHeight: 1.3, marginBottom: 8 }}>
          {ch.titre}
        </h1>
        <div style={{ color: "#a78bfa", fontSize: 14, fontStyle: "italic" }}>
          {plan?.chapitres?.[ch.numero - 1]?.sous_titre}
        </div>
      </div>

      {ch.introduction_chapitre && (
        <div style={{ background: "#0d0d1a", border: "1px solid #1a1a2e", borderRadius: 10, padding: 20, marginBottom: 28, borderLeft: "3px solid #fb923c" }}>
          <p style={{ margin: 0, color: "#c4c4d4", fontSize: 15, lineHeight: 1.8 }}>{ch.introduction_chapitre}</p>
        </div>
      )}

      {(ch.sections || []).map((section, si) => (
        <div key={si} style={{ marginBottom: 28 }}>
          <h2 style={{ color: "#a78bfa", fontSize: 18, fontWeight: 700, marginBottom: 14, paddingBottom: 8, borderBottom: "1px solid #1a1a2e" }}>
            {section.titre_section}
          </h2>
          <p style={{ color: "#d1d5db", fontSize: 15, lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap" }}>
            {section.contenu}
          </p>
        </div>
      ))}

      {ch.encadre_conseil && (
        <div style={{ background: "linear-gradient(135deg, #0a1a2e, #0d1a3a)", border: "1px solid #00ffd544", borderRadius: 12, padding: 20, marginBottom: 28 }}>
          <div style={{ color: "#00ffd5", fontSize: 12, fontWeight: 700, marginBottom: 8, fontFamily: "monospace" }}>💡 CONSEIL D'EXPERT</div>
          <p style={{ margin: 0, color: "#c4c4d4", fontSize: 14, lineHeight: 1.7 }}>{ch.encadre_conseil}</p>
        </div>
      )}

      {ch.erreurs_courantes && ch.erreurs_courantes.length > 0 && (
        <div style={{ background: "#1a0a0a", border: "1px solid #ef444433", borderRadius: 12, padding: 20, marginBottom: 28 }}>
          <div style={{ color: "#ef4444", fontSize: 12, fontWeight: 700, marginBottom: 12, fontFamily: "monospace" }}>⚠️ ERREURS À ÉVITER</div>
          {ch.erreurs_courantes.map((err, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <span style={{ color: "#ef4444" }}>✗</span>
              <span style={{ color: "#c4c4d4", fontSize: 14, lineHeight: 1.6 }}>{err}</span>
            </div>
          ))}
        </div>
      )}

      {ch.exercice_pratique && (
        <div style={{ background: "linear-gradient(135deg, #0a1a0a, #0d1f0d)", border: "1px solid #34d39944", borderRadius: 12, padding: 20, marginBottom: 28 }}>
          <div style={{ color: "#34d399", fontSize: 12, fontWeight: 700, marginBottom: 4, fontFamily: "monospace" }}>🏋️ EXERCICE PRATIQUE</div>
          <div style={{ color: "#34d399", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{ch.exercice_pratique.titre}</div>
          <div style={{ color: "#888", fontSize: 12, marginBottom: 12 }}>⏱ Durée : {ch.exercice_pratique.duree_estimee}</div>
          <div style={{ color: "#a7d4b4", fontSize: 13, marginBottom: 14 }}>🎯 Objectif : {ch.exercice_pratique.objectif}</div>
          {(ch.exercice_pratique.etapes || []).map((etape, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" }}>
              <div style={{ minWidth: 26, height: 26, borderRadius: "50%", background: "#34d399", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                {i + 1}
              </div>
              <span style={{ color: "#c4c4d4", fontSize: 14, lineHeight: 1.6, paddingTop: 3 }}>{etape}</span>
            </div>
          ))}
          <div style={{ marginTop: 14, padding: 12, background: "#34d39922", borderRadius: 8, color: "#34d399", fontSize: 13 }}>
            ✅ Résultat attendu : {ch.exercice_pratique.resultat_attendu}
          </div>
        </div>
      )}

      {ch.resume_chapitre && (
        <div style={{ background: "#0d0d1a", border: "1px solid #a78bfa33", borderRadius: 10, padding: 20, marginBottom: 20 }}>
          <div style={{ color: "#a78bfa", fontSize: 12, fontWeight: 700, marginBottom: 10, fontFamily: "monospace" }}>📌 POINTS CLÉS DU CHAPITRE</div>
          <p style={{ margin: 0, color: "#c4c4d4", fontSize: 14, lineHeight: 1.7 }}>{ch.resume_chapitre}</p>
        </div>
      )}

      {ch.transition && (
        <div style={{ textAlign: "center", padding: "16px 0", color: "#555", fontSize: 13, fontStyle: "italic" }}>
          {ch.transition}
        </div>
      )}
    </div>
  );

  const renderIntro = () => (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Introduction</h1>
      <div style={{ width: 60, height: 3, background: "linear-gradient(90deg, #00ffd5, #a78bfa)", borderRadius: 2, marginBottom: 28 }} />
      {intro && Object.entries(intro).map(([key, val]) => (
        <div key={key} style={{ marginBottom: 24 }}>
          <div style={{ color: "#00ffd5", fontSize: 11, fontFamily: "monospace", fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
            {key.replace(/_/g, " ")}
          </div>
          <p style={{ margin: 0, color: "#d1d5db", fontSize: 15, lineHeight: 1.9 }}>{val}</p>
        </div>
      ))}
    </div>
  );

  const renderConclusion = () => (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Conclusion</h1>
      <div style={{ width: 60, height: 3, background: "linear-gradient(90deg, #ff6b6b, #f472b6)", borderRadius: 2, marginBottom: 28 }} />
      {conclusion && (
        <>
          <div style={{ background: "linear-gradient(135deg, #0a1a2e, #0d1a3a)", border: "1px solid #00ffd544", borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <p style={{ margin: 0, color: "#d1d5db", fontSize: 15, lineHeight: 1.9 }}>{conclusion.felicitations}</p>
          </div>
          <p style={{ color: "#d1d5db", fontSize: 15, lineHeight: 1.9, marginBottom: 24 }}>{conclusion.recapitulatif}</p>
          {conclusion.plan_action_30_jours && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ color: "#34d399", fontSize: 13, fontWeight: 700, marginBottom: 14 }}>🗓️ TON PLAN D'ACTION 30 JOURS</div>
              {conclusion.plan_action_30_jours.map((action, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                  <div style={{ minWidth: 32, height: 32, borderRadius: 8, background: "#34d399", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                    S{i + 1}
                  </div>
                  <span style={{ color: "#c4c4d4", fontSize: 14, lineHeight: 1.6, paddingTop: 6 }}>{action}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ background: "#0a1a0a", border: "1px solid #34d39933", borderRadius: 12, padding: 20 }}>
            <p style={{ margin: 0, color: "#c4c4d4", fontSize: 15, lineHeight: 1.9, fontStyle: "italic" }}>{conclusion.mot_de_fin}</p>
          </div>
        </>
      )}
    </div>
  );

  const activeChapterData = chapters.find(c => `ch${c.numero}` === activeChapter);

  const downloadPDF = () => {
    const introData = data?.introduction;
    const conclusionData = data?.conclusion;

    const chapterHTML = chapters.map(ch => `
      <div class="chapter">
        <div class="chapter-label">CHAPITRE ${ch.numero}</div>
        <h1 class="chapter-title">${ch.titre || ""}</h1>
        ${ch.introduction_chapitre ? `<div class="intro-block"><p>${ch.introduction_chapitre}</p></div>` : ""}
        ${(ch.sections || []).map(s => `
          <h2 class="section-title">${s.titre_section || ""}</h2>
          <p class="section-content">${(s.contenu || "").replace(/\n/g, "<br/>")}</p>
        `).join("")}
        ${ch.encadre_conseil ? `<div class="conseil-block"><div class="conseil-label">💡 CONSEIL D'EXPERT</div><p>${ch.encadre_conseil}</p></div>` : ""}
        ${ch.erreurs_courantes && ch.erreurs_courantes.length ? `
          <div class="erreurs-block">
            <div class="erreurs-label">⚠️ ERREURS À ÉVITER</div>
            ${ch.erreurs_courantes.map(e => `<div class="erreur-item">✗ ${e}</div>`).join("")}
          </div>` : ""}
        ${ch.exercice_pratique ? `
          <div class="exercice-block">
            <div class="exercice-label">🏋️ EXERCICE PRATIQUE</div>
            <div class="exercice-titre">${ch.exercice_pratique.titre || ""}</div>
            <div class="exercice-meta">⏱ ${ch.exercice_pratique.duree_estimee || ""} · 🎯 ${ch.exercice_pratique.objectif || ""}</div>
            ${(ch.exercice_pratique.etapes || []).map((e, i) => `<div class="etape"><span class="etape-num">${i + 1}</span>${e}</div>`).join("")}
            ${ch.exercice_pratique.resultat_attendu ? `<div class="resultat">✅ Résultat attendu : ${ch.exercice_pratique.resultat_attendu}</div>` : ""}
          </div>` : ""}
        ${ch.resume_chapitre ? `<div class="resume-block"><div class="resume-label">📌 POINTS CLÉS</div><p>${ch.resume_chapitre}</p></div>` : ""}
        ${ch.transition ? `<div class="transition">${ch.transition}</div>` : ""}
      </div>
    `).join('<div class="page-break"></div>');

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<title>${plan?.titre_principal || "Ebook"}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; color: #1a1a2e; background: #fff; font-size: 14px; line-height: 1.8; }
  .cover { background: linear-gradient(135deg, #0d0d2a 0%, #1a0d3a 50%, #0d1a2e 100%); color: white; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 60px 40px; }
  .cover-label { font-size: 11px; letter-spacing: 3px; color: #a78bfa; margin-bottom: 24px; text-transform: uppercase; }
  .cover-title { font-size: 42px; font-weight: 800; line-height: 1.2; margin-bottom: 20px; background: linear-gradient(135deg, #ffffff, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .cover-subtitle { font-size: 18px; color: #8888aa; margin-bottom: 40px; font-weight: 300; }
  .cover-badge { background: rgba(0,255,213,0.1); border: 1px solid #00ffd5; border-radius: 50px; padding: 10px 24px; color: #00ffd5; font-size: 13px; font-weight: 600; }
  .toc { padding: 60px 80px; }
  .toc h2 { font-size: 28px; font-weight: 800; color: #0d0d2a; margin-bottom: 32px; padding-bottom: 12px; border-bottom: 3px solid #a78bfa; }
  .toc-item { display: flex; align-items: center; gap: 16px; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
  .toc-num { min-width: 36px; height: 36px; border-radius: 8px; background: linear-gradient(135deg, #a78bfa, #7c3aed); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; }
  .toc-text { color: #2a2a4a; font-size: 15px; font-weight: 500; }
  .chapter { padding: 60px 80px; }
  .chapter-label { font-size: 11px; letter-spacing: 3px; color: #a78bfa; font-weight: 600; margin-bottom: 12px; text-transform: uppercase; }
  .chapter-title { font-size: 32px; font-weight: 800; color: #0d0d2a; line-height: 1.3; margin-bottom: 32px; }
  .intro-block { border-left: 4px solid #fb923c; background: #fff8f5; padding: 20px 24px; border-radius: 0 10px 10px 0; margin-bottom: 28px; color: #4a2a1a; }
  .section-title { font-size: 20px; font-weight: 700; color: #2a1a5e; margin: 28px 0 14px 0; padding-bottom: 8px; border-bottom: 2px solid #f0eeff; }
  .section-content { color: #3a3a5a; line-height: 1.9; margin-bottom: 20px; }
  .conseil-block { background: linear-gradient(135deg, #f0f8ff, #e8f4ff); border: 1px solid #00b4d844; border-radius: 12px; padding: 20px 24px; margin: 24px 0; }
  .conseil-label { font-size: 12px; font-weight: 700; color: #0077aa; margin-bottom: 8px; }
  .erreurs-block { background: #fff5f5; border: 1px solid #ffcccc; border-radius: 12px; padding: 20px 24px; margin: 24px 0; }
  .erreurs-label { font-size: 12px; font-weight: 700; color: #cc3333; margin-bottom: 12px; }
  .erreur-item { color: #553333; font-size: 13px; margin-bottom: 8px; padding-left: 8px; }
  .exercice-block { background: linear-gradient(135deg, #f0fff5, #e8fff2); border: 2px solid #34d39944; border-radius: 12px; padding: 24px; margin: 24px 0; }
  .exercice-label { font-size: 12px; font-weight: 700; color: #059669; margin-bottom: 8px; }
  .exercice-titre { font-size: 18px; font-weight: 700; color: #064e3b; margin-bottom: 8px; }
  .exercice-meta { font-size: 12px; color: #6b7280; margin-bottom: 16px; }
  .etape { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 10px; }
  .etape-num { min-width: 26px; height: 26px; border-radius: 50%; background: #34d399; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
  .resultat { margin-top: 14px; padding: 10px 14px; background: #d1fae5; border-radius: 8px; color: #065f46; font-size: 13px; }
  .resume-block { background: #f8f7ff; border: 1px solid #a78bfa33; border-radius: 10px; padding: 20px 24px; margin: 24px 0; }
  .resume-label { font-size: 12px; font-weight: 700; color: #7c3aed; margin-bottom: 8px; }
  .transition { text-align: center; color: #9ca3af; font-style: italic; font-size: 13px; padding: 20px 0; border-top: 1px dashed #e5e7eb; margin-top: 20px; }
  .conclusion { padding: 60px 80px; }
  .conclusion h1 { font-size: 32px; font-weight: 800; color: #0d0d2a; margin-bottom: 32px; }
  .action-item { display: flex; gap: 14px; align-items: flex-start; margin-bottom: 14px; }
  .action-week { min-width: 40px; height: 40px; border-radius: 8px; background: #34d399; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 11px; flex-shrink: 0; }
  .page-break { page-break-after: always; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page-break { page-break-after: always; }
    .cover { page-break-after: always; }
    .toc { page-break-after: always; }
  }
</style>
</head>
<body>

<!-- COUVERTURE -->
<div class="cover">
  <div class="cover-label">Ebook Complet · Niveau Débutant</div>
  <div class="cover-title">${plan?.titre_principal || "Mon Ebook"}</div>
  <div class="cover-subtitle">${plan?.sous_titre || ""}</div>
  <div class="cover-badge">📚 ${chapters.length} Chapitres · ${plan?.nb_pages_estimees || "80"}+ Pages · Exercices Pratiques</div>
</div>

<div class="page-break"></div>

<!-- TABLE DES MATIÈRES -->
<div class="toc">
  <h2>Table des matières</h2>
  <div class="toc-item"><div class="toc-num">📖</div><div class="toc-text">Introduction</div></div>
  ${chapters.map(ch => `<div class="toc-item"><div class="toc-num">${ch.numero}</div><div class="toc-text">${ch.titre}</div></div>`).join("")}
  <div class="toc-item"><div class="toc-num">🎯</div><div class="toc-text">Conclusion & Plan d'action 30 jours</div></div>
</div>

<div class="page-break"></div>

<!-- INTRODUCTION -->
<div class="chapter">
  <div class="chapter-label">AVANT-PROPOS</div>
  <h1 class="chapter-title">Introduction</h1>
  ${introData ? Object.entries(introData).map(([k, v]) => `
    <h2 class="section-title">${k.replace(/_/g, " ").toUpperCase()}</h2>
    <p class="section-content">${v}</p>
  `).join("") : ""}
</div>

<div class="page-break"></div>

<!-- CHAPITRES -->
${chapterHTML}

<div class="page-break"></div>

<!-- CONCLUSION -->
<div class="conclusion">
  <h1>Conclusion</h1>
  ${conclusionData?.felicitations ? `<div class="conseil-block"><p>${conclusionData.felicitations}</p></div>` : ""}
  ${conclusionData?.recapitulatif ? `<p class="section-content">${conclusionData.recapitulatif}</p>` : ""}
  ${conclusionData?.plan_action_30_jours ? `
    <h2 class="section-title" style="color:#059669">🗓️ Ton Plan d'Action 30 Jours</h2>
    ${conclusionData.plan_action_30_jours.map((a, i) => `<div class="action-item"><div class="action-week">S${i+1}</div><div>${a}</div></div>`).join("")}
  ` : ""}
  ${conclusionData?.mot_de_fin ? `<div class="exercice-block" style="margin-top:32px"><p style="font-style:italic;color:#064e3b">${conclusionData.mot_de_fin}</p></div>` : ""}
</div>

<script>window.onload = () => window.print();</script>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (!win) alert("Autorise les popups pour télécharger le PDF.");
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#050508", zIndex: 200, display: "flex", flexDirection: "column" }}>
      {/* Topbar */}
      <div style={{ background: "#0d0d1a", borderBottom: "1px solid #1a1a2e", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20 }}>📚</span>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{plan?.titre_principal || "Ebook Complet"}</div>
            <div style={{ color: "#555", fontSize: 11 }}>{chapters.length} chapitres · Reader intégré</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={downloadPDF}
            style={{ background: "linear-gradient(135deg,#a78bfa,#7c3aed)", border: "none", color: "#fff", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 12, fontFamily: "monospace", fontWeight: 700 }}>
            ⬇️ Télécharger PDF
          </button>
          <button onClick={onClose} style={{ background: "#1a1a2e", border: "none", color: "#888", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 12, fontFamily: "monospace" }}>
            ✕ Fermer
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{ width: 260, background: "#0a0a14", borderRight: "1px solid #1a1a2e", overflow: "auto", padding: "16px 0" }}>
          <div style={{ color: "#3a3a5a", fontSize: 10, letterSpacing: 1, padding: "0 16px", marginBottom: 10 }}>TABLE DES MATIÈRES</div>
          {sidebarItems.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveChapter(item.id)}
              style={{
                padding: "10px 16px", cursor: "pointer", fontSize: 12,
                color: activeChapter === item.id ? "#fff" : "#555",
                background: activeChapter === item.id ? "#1a1a2e" : "transparent",
                borderLeft: activeChapter === item.id ? "2px solid #a78bfa" : "2px solid transparent",
                transition: "all 0.2s"
              }}
            >
              {item.label}
            </div>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: "40px 60px", maxWidth: 800, margin: "0 auto", width: "100%" }}>
          {activeChapter === "intro" && renderIntro()}
          {activeChapterData && renderChapter(activeChapterData)}
          {activeChapter === "conclusion" && renderConclusion()}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DELIVERABLE CARD
// ─────────────────────────────────────────────────────────────────────────────
const DeliverableCard = ({ title, icon, color, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ border: `1px solid ${open ? color : "#1a1a2e"}`, borderRadius: 12, overflow: "hidden", marginBottom: 12, transition: "all 0.3s" }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ padding: "14px 18px", background: "#0d0d1a", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
      >
        <span style={{ fontSize: 18 }}>{icon}</span>
        <div style={{ flex: 1, color: "#e2e8f0", fontWeight: 700, fontSize: 13, fontFamily: "monospace" }}>{title}</div>
        <span style={{ color: color, fontSize: 12 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{ background: "#070710", padding: "16px 18px", borderTop: `1px solid ${color}33` }}>
          {children}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// GUMROAD PANEL
// ─────────────────────────────────────────────────────────────────────────────
const GumroadPanel = ({ results }) => {
  const [copied, setCopied] = useState({});
  const pub = results.publish;
  const cover = results.cover;

  const copy = (text, key) => {
    navigator.clipboard.writeText(text || "").then(() => {
      setCopied(prev => ({ ...prev, [key]: true }));
      setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 2000);
    });
  };

  const fields = [
    { key: "name", label: "1️⃣ Nom du produit", value: pub?.gumroad_name, hint: "Champ 'Name' sur Gumroad" },
    { key: "price", label: "2️⃣ Prix", value: pub?.prix_cents ? (parseInt(pub.prix_cents) / 100) + "€" : (cover?.strategie_prix?.prix_lancement_7j || "17€"), hint: "Champ 'Price'" },
    { key: "desc", label: "3️⃣ Description HTML", value: pub?.gumroad_description_html, hint: "Mode HTML dans l'éditeur Gumroad" },
    { key: "tags", label: "4️⃣ Tags SEO", value: pub?.tags_seo?.join(", "), hint: "Champ 'Tags'" },
    { key: "url", label: "5️⃣ URL personnalisée", value: pub?.url_suggeree, hint: "Champ 'Custom URL'" }
  ];

  return (
    <div style={{ marginTop: 24, background: "#0d0d1a", border: "1px solid #ff6b6b", borderRadius: 16, padding: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <span style={{ fontSize: 22 }}>🚀</span>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontFamily: "monospace", fontSize: 13 }}>PUBLICATION GUMROAD</div>
          <div style={{ color: "#ff6b6b", fontSize: 11 }}>Copie chaque champ → colle sur Gumroad</div>
        </div>
        <a href="https://app.gumroad.com/products/new" target="_blank" rel="noreferrer"
          style={{ marginLeft: "auto", background: "linear-gradient(135deg,#ff6b6b,#ff4757)", color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 11, fontWeight: 700, textDecoration: "none" }}>
          → Ouvrir Gumroad
        </a>
      </div>

      {pub?.checklist_avant_publication && (
        <div style={{ background: "#070710", border: "1px solid #1a1a2e", borderRadius: 10, padding: 14, marginBottom: 16 }}>
          <div style={{ color: "#34d399", fontSize: 11, fontFamily: "monospace", marginBottom: 10 }}>CHECKLIST AVANT PUBLICATION</div>
          {pub.checklist_avant_publication.map((item, i) => (
            <div key={i} style={{ color: "#888", fontSize: 12, marginBottom: 6 }}>{item}</div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {fields.map(field => (
          <div key={field.key} style={{ background: "#070710", border: "1px solid #1a1a2e", borderRadius: 10, padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <div style={{ color: "#ff6b6b", fontSize: 12, fontWeight: 700 }}>{field.label}</div>
                <div style={{ color: "#333", fontSize: 10, marginTop: 2 }}>{field.hint}</div>
              </div>
              <button onClick={() => copy(field.value, field.key)}
                style={{ background: copied[field.key] ? "#34d399" : "#1a1a2e", border: `1px solid ${copied[field.key] ? "#34d399" : "#2a2a4a"}`, borderRadius: 8, padding: "6px 14px", color: copied[field.key] ? "#000" : "#888", fontSize: 11, cursor: "pointer", fontWeight: 700, transition: "all 0.2s", whiteSpace: "nowrap" }}>
                {copied[field.key] ? "✓ Copié !" : "📋 Copier"}
              </button>
            </div>
            <div style={{ color: "#3a3a5a", fontSize: 11, fontFamily: "monospace", background: "#0a0a14", borderRadius: 6, padding: "8px 10px", maxHeight: 60, overflow: "hidden" }}>
              {(field.value || "—").slice(0, 180)}{(field.value || "").length > 180 ? "..." : ""}
            </div>
          </div>
        ))}
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
  const [showGumroad, setShowGumroad] = useState(false);
  const [tab, setTab] = useState("pipeline");
  const logsEndRef = useRef(null);

  useEffect(() => { logsEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);
  const addLog = (msg, color = "#555") => setLogs(prev => [...prev, { msg, color, time: new Date().toLocaleTimeString() }]);

  // Appel OpenAI générique
  const callOpenAI = async (systemPrompt, userPrompt, maxTokens = 2000) => {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: maxTokens,
        temperature: 0.7,
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

  // Génère UN seul chapitre — évite le JSON trop long
  const generateChapter = async (chapterPlan, context) => {
    const systemPrompt = `Tu es un auteur expert en rédaction d'ebooks pédagogiques pour débutants complets. Style: chaleureux, concret, encourageant, jamais condescendant. Tutoie le lecteur.
Réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks:
{
  "numero": ${chapterPlan.numero},
  "titre": "titre exact du chapitre",
  "introduction_chapitre": "Introduction engageante du chapitre en 80 mots qui donne envie de lire la suite",
  "sections": [
    {
      "titre_section": "Titre de la section",
      "contenu": "Contenu COMPLET de la section: minimum 250 mots. Explications claires pour un débutant absolu. Analogies simples, exemples concrets du quotidien, étapes détaillées si besoin. Jamais de jargon sans explication."
    }
  ],
  "encadre_conseil": "Conseil d'expert pratique et actionnable que les débutants ignorent souvent",
  "erreurs_courantes": ["Erreur 1 avec explication comment l'éviter", "Erreur 2 avec solution", "Erreur 3 avec solution"],
  "exercice_pratique": {
    "titre": "Titre de l'exercice",
    "objectif": "Ce que cet exercice t'apporte concrètement",
    "etapes": ["Étape 1 très détaillée", "Étape 2 détaillée", "Étape 3 détaillée", "Étape 4 détaillée"],
    "duree_estimee": "30 minutes",
    "resultat_attendu": "Ce que tu auras accompli"
  },
  "resume_chapitre": "Points essentiels du chapitre en 4-5 points clés actionnables",
  "transition": "Phrase de transition vers le prochain chapitre qui donne envie de continuer"
}`;

    const userPrompt = `Niche/Sujet de l'ebook: "${niche}"

Chapitre à rédiger:
- Numéro: ${chapterPlan.numero}
- Titre: ${chapterPlan.titre}
- Sous-titre: ${chapterPlan.sous_titre || ""}
- Objectif pédagogique: ${chapterPlan.objectif_pedagogique}
- Sections à couvrir: ${(chapterPlan.sections || []).join(", ")}
- Exercice prévu: ${chapterPlan.exercice_pratique}

Titre de l'ebook: "${context.plan?.titre_principal}"
Public cible: ${context.research?.audience_cible || "débutants complets"}

Rédige ce chapitre COMPLET avec un contenu riche, pédagogique et actionnable. Chaque section doit faire 250 mots minimum. Réponds uniquement en JSON valide.`;

    return callOpenAI(systemPrompt, userPrompt, 2500);
  };

  const runPipeline = async () => {
    if (!niche.trim() || !apiKey.trim()) return;
    setRunning(true); setAgentStatus({}); setAgentResults({}); setLogs([]); setShowGumroad(false); setTab("pipeline");
    addLog("🚀 Démarrage du pipeline ultra-complet...", "#fff");
    addLog(`📌 Niche : "${niche}"`, "#a78bfa");
    addLog("⏱ Temps estimé : 6 à 10 minutes (chaque chapitre généré séparément)", "#3a3a5a");
    let context = {};

    // Agents 0-1-3-4-5 : normaux (research, plan, marketing, cover, publish)
    const normalAgents = AGENTS.filter(a => a.id !== "content");

    for (const agent of normalAgents) {
      setAgentStatus(prev => ({ ...prev, [agent.id]: "running" }));
      addLog(`\n⚡ ${agent.icon} ${agent.name}...`, agent.color);
      try {
        const userPrompt = `Niche/Sujet: "${niche}"\n${Object.keys(context).length > 0 ? `\nContexte:\n${JSON.stringify(context, null, 2)}` : ""}\n\nRéponds uniquement en JSON valide.`;
        const result = await callOpenAI(agent.systemPrompt, userPrompt, agent.maxTokens || 2000);
        context[agent.id] = result;
        setAgentResults(prev => ({ ...prev, [agent.id]: result }));
        setAgentStatus(prev => ({ ...prev, [agent.id]: "done" }));
        addLog(`  ✓ Terminé`, agent.color);

        // Après le plan, générer le contenu chapitre par chapitre
        if (agent.id === "plan") {
          const contentAgent = AGENTS.find(a => a.id === "content");
          setAgentStatus(prev => ({ ...prev, content: "running" }));
          addLog(`\n⚡ ✍️ Agent Contenu — génération chapitre par chapitre...`, "#fb923c");

          const chapitres = result.chapitres || [];
          const chapitresRediges = [];

          // Introduction
          addLog(`  📝 Rédaction introduction...`, "#fb923c");
          const introResult = await callOpenAI(
            `Tu es un auteur expert en ebooks pédagogiques. Réponds UNIQUEMENT en JSON valide:
{"accroche":"80 mots qui parlent directement au lecteur de sa situation et frustration","histoire_auteur":"Histoire courte et authentique qui crédibilise l'auteur (100 mots)","ce_que_tu_vas_apprendre":"Description détaillée de la transformation que va vivre le lecteur (100 mots)","comment_utiliser_ce_livre":"Guide pratique pour tirer le maximum de cet ebook (80 mots)","mot_dencouragement":"Message personnel et motivant au lecteur (60 mots)"}`,
            `Ebook: "${context.plan?.titre_principal}" sur la niche: "${niche}". Public: ${context.research?.audience_cible || "débutants"}. Rédige une introduction complète et engageante.`,
            1200
          );

          // Chapitres un par un
          for (let ci = 0; ci < chapitres.length; ci++) {
            const ch = chapitres[ci];
            addLog(`  📝 Chapitre ${ch.numero}/${chapitres.length} : ${ch.titre?.slice(0, 40)}...`, "#fb923c");
            try {
              const chResult = await generateChapter(ch, context);
              chapitresRediges.push(chResult);
              addLog(`     ✓ Chapitre ${ch.numero} rédigé (${(chResult.sections || []).length} sections)`, "#fb923c");
            } catch (e) {
              addLog(`     ✗ Erreur chapitre ${ch.numero}: ${e.message}`, "#ef4444");
            }
          }

          // Conclusion
          addLog(`  📝 Rédaction conclusion...`, "#fb923c");
          const conclusionResult = await callOpenAI(
            `Tu es un auteur expert. Réponds UNIQUEMENT en JSON valide:
{"felicitations":"Message chaleureux de félicitations (80 mots)","recapitulatif":"Récapitulatif complet de tout ce que le lecteur a appris (150 mots)","plan_action_30_jours":["Action semaine 1","Action semaine 2","Action semaine 3","Action semaine 4"],"ressources_complementaires":["Ressource gratuite 1","Ressource 2","Ressource 3"],"mot_de_fin":"Message personnel et inspirant (100 mots)"}`,
            `Ebook terminé: "${context.plan?.titre_principal}" sur "${niche}". Rédige une conclusion complète et motivante.`,
            1000
          );

          const contentFinal = {
            introduction: introResult,
            chapitres: chapitresRediges,
            conclusion: conclusionResult
          };

          context.content = contentFinal;
          setAgentResults(prev => ({ ...prev, content: contentFinal }));
          setAgentStatus(prev => ({ ...prev, content: "done" }));
          addLog(`  ✓ Ebook complet — ${chapitresRediges.length} chapitres rédigés`, "#fb923c");
        }

      } catch (e) {
        setAgentStatus(prev => ({ ...prev, [agent.id]: "error" }));
        addLog(`  ✗ Erreur: ${e.message}`, "#ef4444");
      }
    }

    setShowGumroad(true);
    addLog("\n🎉 Ebook complet généré ! Explore les livrables ci-dessous.", "#00ffd5");
    setRunning(false);
    setTab("deliverables");
  };

  const completedCount = Object.values(agentStatus).filter(s => s === "done").length;
  const progress = (completedCount / AGENTS.length) * 100;
  const allDone = completedCount === AGENTS.length;

  return (
    <div style={{ minHeight: "100vh", background: "#070710", fontFamily: "'Space Mono', monospace", color: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap');
        @keyframes shimmer { 0%{transform:translateX(-200%)} 100%{transform:translateX(400%)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        input { outline: none !important; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #070710; } ::-webkit-scrollbar-thumb { background: #1a1a2e; border-radius: 3px; }
      `}</style>

      {showEbook && agentResults.content && (
        <EbookViewer data={agentResults.content} plan={agentResults.plan} onClose={() => setShowEbook(false)} />
      )}

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 18px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #00ffd5, #a78bfa, #ff6b6b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>⚡</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: 0.5 }}>EBOOK AGENT PIPELINE</h1>
            <div style={{ color: "#3a3a5a", fontSize: 11, marginTop: 3 }}>
              6 agents IA · GPT-4o · Ebook 80+ pages · Reader intégré · Publication Gumroad
            </div>
          </div>
        </div>

        {/* Config panel */}
        <div style={{ background: "#0d0d1a", border: "1px solid #1a1a2e", borderRadius: 14, padding: 22, marginBottom: 20 }}>
          <div style={{ color: "#3a3a5a", fontSize: 10, marginBottom: 14, letterSpacing: 1 }}>⚙️ CONFIGURATION — GPT-4o</div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: "#555", fontSize: 10, marginBottom: 6 }}>
              OPENAI API KEY &nbsp;
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" style={{ color: "#00ffd5", fontSize: 10, textDecoration: "underline" }}>→ Obtenir ma clé</a>
              &nbsp;·&nbsp;
              <a href="https://platform.openai.com/settings/billing/overview" target="_blank" rel="noreferrer" style={{ color: "#fb923c", fontSize: 10, textDecoration: "underline" }}>→ Ajouter 5$ de crédits</a>
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
              <span style={{ color: "#3a3a5a", fontSize: 10 }}>PROGRESSION DU PIPELINE</span>
              <span style={{ color: "#00ffd5", fontSize: 10, fontWeight: 700 }}>{completedCount}/{AGENTS.length} agents terminés</span>
            </div>
            <div style={{ background: "#1a1a2e", borderRadius: 4, height: 4 }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#00ffd5,#a78bfa,#ff6b6b)", borderRadius: 4, transition: "width 0.6s ease" }} />
            </div>
          </div>
        )}

        {/* Tabs */}
        {allDone && (
          <div style={{ display: "flex", gap: 2, marginBottom: 20, background: "#0d0d1a", borderRadius: 10, padding: 4 }}>
            {[
              { id: "pipeline", label: "⚡ Pipeline" },
              { id: "deliverables", label: "📦 Livrables" },
              { id: "marketing_tab", label: "🎯 Marketing" },
              { id: "publication", label: "🚀 Publication" }
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ flex: 1, padding: "8px 12px", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "monospace", fontSize: 11, fontWeight: 700, transition: "all 0.2s", background: tab === t.id ? "#1a1a2e" : "transparent", color: tab === t.id ? "#fff" : "#555" }}>
                {t.label}
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
                {AGENTS.map((agent, i) => (
                  <div key={agent.id}>
                    <div style={{ border: `1px solid ${agentStatus[agent.id] === "idle" || !agentStatus[agent.id] ? "#1a1a2e" : agentStatus[agent.id] === "error" ? "#ef4444" : agent.color}`, background: "#0d0d1a", opacity: !agentStatus[agent.id] || agentStatus[agent.id] === "idle" ? 0.5 : 1, borderRadius: 12, padding: "13px 16px", transition: "all 0.3s", position: "relative", overflow: "hidden", boxShadow: agentStatus[agent.id] && agentStatus[agent.id] !== "idle" ? `0 0 20px ${agent.color}18` : "none" }}>
                      {agentStatus[agent.id] === "running" && (
                        <div style={{ position: "absolute", top: 0, left: 0, height: 2, width: "60%", background: `linear-gradient(90deg,transparent,${agent.color})`, animation: "shimmer 1.2s infinite" }} />
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 20 }}>{agent.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 12, fontFamily: "monospace" }}>{agent.name}</div>
                          <div style={{ color: "#4a4a6a", fontSize: 11, marginTop: 1 }}>{agent.description}</div>
                        </div>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: agentStatus[agent.id] === "done" ? agent.color : agentStatus[agent.id] === "running" ? agent.color : agentStatus[agent.id] === "error" ? "#ef4444" : "#1e1e3a", boxShadow: agentStatus[agent.id] === "running" ? `0 0 10px ${agent.color}` : "none", animation: agentStatus[agent.id] === "running" ? "blink 0.8s infinite" : "none" }} />
                      </div>
                      {agentStatus[agent.id] === "done" && <div style={{ color: agent.color, fontSize: 10, marginTop: 5, fontFamily: "monospace" }}>✓ Terminé</div>}
                      {agentStatus[agent.id] === "error" && <div style={{ color: "#ef4444", fontSize: 10, marginTop: 5, fontFamily: "monospace" }}>✗ Erreur</div>}
                    </div>
                    {i < AGENTS.length - 1 && <div style={{ width: 1, height: 6, background: "#1a1a2e", margin: "0 20px" }} />}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ color: "#3a3a5a", fontSize: 10, letterSpacing: 1, marginBottom: 10 }}>LOGS EN TEMPS RÉEL</div>
              <div style={{ background: "#030308", border: "1px solid #1a1a2e", borderRadius: 12, padding: 14, height: 420, overflow: "auto", fontSize: 11 }}>
                {logs.length === 0 ? <div style={{ color: "#1a1a2e", textAlign: "center", paddingTop: 180 }}>En attente...</div>
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
        )}

        {/* DELIVERABLES TAB */}
        {tab === "deliverables" && allDone && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            {/* Ebook CTA */}
            <div style={{ background: "linear-gradient(135deg, #0d0d2a, #1a0d2e)", border: "1px solid #a78bfa", borderRadius: 14, padding: 22, marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 40 }}>📚</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#a78bfa", fontSize: 11, fontFamily: "monospace", marginBottom: 4 }}>TON EBOOK COMPLET EST PRÊT</div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{agentResults.plan?.titre_principal}</div>
                <div style={{ color: "#555", fontSize: 12 }}>{agentResults.content?.chapitres?.length} chapitres · {agentResults.plan?.nb_pages_estimees}+ pages · Niveau débutant</div>
              </div>
              <button onClick={() => setShowEbook(true)}
                style={{ background: "linear-gradient(135deg, #a78bfa, #7c3aed)", border: "none", borderRadius: 10, padding: "12px 22px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "monospace", whiteSpace: "nowrap" }}>
                📖 LIRE L'EBOOK
              </button>
            </div>

            {/* Research */}
            <DeliverableCard title="🔍 Analyse de marché" icon="🔍" color="#00ffd5" defaultOpen>
              {agentResults.research && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {Object.entries(agentResults.research).map(([key, val]) => (
                    <div key={key} style={{ background: "#0a0a14", borderRadius: 8, padding: 12 }}>
                      <div style={{ color: "#00ffd5", fontSize: 10, fontFamily: "monospace", marginBottom: 6 }}>{key.replace(/_/g, " ").toUpperCase()}</div>
                      {Array.isArray(val)
                        ? <div>{val.map((v, i) => <div key={i} style={{ color: "#c4c4d4", fontSize: 12, marginBottom: 3 }}>▸ {v}</div>)}</div>
                        : <div style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.6 }}>{val}</div>}
                    </div>
                  ))}
                </div>
              )}
            </DeliverableCard>

            {/* Plan */}
            <DeliverableCard title="📋 Plan de l'ebook — 6 chapitres" icon="📋" color="#a78bfa">
              {agentResults.plan && (
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ color: "#a78bfa", fontSize: 18, fontWeight: 700 }}>{agentResults.plan.titre_principal}</div>
                    <div style={{ color: "#888", fontSize: 13, marginTop: 4, fontStyle: "italic" }}>{agentResults.plan.sous_titre}</div>
                  </div>
                  {(agentResults.plan.chapitres || []).map(ch => (
                    <div key={ch.numero} style={{ background: "#0a0a14", borderRadius: 8, padding: 14, marginBottom: 10 }}>
                      <div style={{ color: "#a78bfa", fontSize: 12, fontWeight: 700 }}>Chapitre {ch.numero} — {ch.titre}</div>
                      <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>🎯 {ch.objectif_pedagogique}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                        {(ch.sections || []).map((s, i) => (
                          <div key={i} style={{ background: "#1a1a2e", borderRadius: 6, padding: "3px 8px", color: "#555", fontSize: 10 }}>{s}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DeliverableCard>

            {/* Cover */}
            <DeliverableCard title="🖼️ Prompt DALL-E & Stratégie de prix" icon="🖼️" color="#34d399">
              {agentResults.cover && (
                <div>
                  <div style={{ background: "#0a1a0a", border: "1px solid #34d39933", borderRadius: 10, padding: 14, marginBottom: 14 }}>
                    <div style={{ color: "#34d399", fontSize: 11, fontFamily: "monospace", marginBottom: 8 }}>PROMPT DALL-E 3 (EN ANGLAIS)</div>
                    <div style={{ color: "#c4c4d4", fontSize: 13, lineHeight: 1.7 }}>{agentResults.cover.prompt_dalle_v3}</div>
                    <button onClick={() => navigator.clipboard.writeText(agentResults.cover.prompt_dalle_v3 || "")}
                      style={{ marginTop: 10, background: "#34d399", border: "none", borderRadius: 6, padding: "6px 14px", color: "#000", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                      📋 Copier le prompt
                    </button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {["prix_lancement_7j", "prix_standard", "prix_bundle"].map(key => (
                      <div key={key} style={{ background: "#0a0a14", borderRadius: 8, padding: 12 }}>
                        <div style={{ color: "#34d399", fontSize: 10, fontFamily: "monospace" }}>{key.replace(/_/g, " ").toUpperCase()}</div>
                        <div style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginTop: 4 }}>{agentResults.cover.strategie_prix?.[key]}</div>
                      </div>
                    ))}
                    <div style={{ background: "#0a0a14", borderRadius: 8, padding: 12 }}>
                      <div style={{ color: "#34d399", fontSize: 10, fontFamily: "monospace" }}>JUSTIFICATION</div>
                      <div style={{ color: "#c4c4d4", fontSize: 12, marginTop: 4, lineHeight: 1.6 }}>{agentResults.cover.strategie_prix?.justification_psychologique}</div>
                    </div>
                  </div>
                </div>
              )}
            </DeliverableCard>
          </div>
        )}

        {/* MARKETING TAB */}
        {tab === "marketing_tab" && allDone && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <DeliverableCard title="🎯 Page de vente complète" icon="🎯" color="#f472b6" defaultOpen>
              {agentResults.marketing?.page_de_vente && (
                <div>
                  {Object.entries(agentResults.marketing.page_de_vente).map(([key, val]) => (
                    <div key={key} style={{ background: "#0a0a14", borderRadius: 8, padding: 14, marginBottom: 10 }}>
                      <div style={{ color: "#f472b6", fontSize: 10, fontFamily: "monospace", marginBottom: 6 }}>{key.replace(/_/g, " ").toUpperCase()}</div>
                      {Array.isArray(val)
                        ? <div>{val.map((v, i) => typeof v === "object"
                          ? <div key={i} style={{ background: "#111120", borderRadius: 6, padding: 10, marginBottom: 6 }}>{Object.entries(v).map(([k2, v2]) => <div key={k2} style={{ color: "#c4c4d4", fontSize: 12, marginBottom: 2 }}><span style={{ color: "#f472b6" }}>{k2}: </span>{v2}</div>)}</div>
                          : <div key={i} style={{ color: "#c4c4d4", fontSize: 13, marginBottom: 4 }}>▸ {v}</div>)}</div>
                        : <div style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.7 }}>{val}</div>}
                    </div>
                  ))}
                </div>
              )}
            </DeliverableCard>

            <DeliverableCard title="📧 Séquence emails (4 emails)" icon="📧" color="#f472b6">
              {(agentResults.marketing?.email_sequence || []).map((email, i) => (
                <div key={i} style={{ background: "#0a0a14", borderRadius: 8, padding: 14, marginBottom: 10 }}>
                  <div style={{ color: "#f472b6", fontSize: 11, fontFamily: "monospace", marginBottom: 4 }}>EMAIL JOUR {email.jour}</div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>Sujet : {email.sujet}</div>
                  <div style={{ color: "#888", fontSize: 11, marginBottom: 8, fontStyle: "italic" }}>Preview : {email.preview}</div>
                  <div style={{ color: "#c4c4d4", fontSize: 13, lineHeight: 1.7 }}>{email.corps}</div>
                </div>
              ))}
            </DeliverableCard>

            <DeliverableCard title="📱 Posts réseaux sociaux" icon="📱" color="#f472b6">
              {agentResults.marketing?.posts_reseaux && (
                <div>
                  {Object.entries(agentResults.marketing.posts_reseaux).map(([key, val]) => (
                    <div key={key} style={{ background: "#0a0a14", borderRadius: 8, padding: 14, marginBottom: 10 }}>
                      <div style={{ color: "#f472b6", fontSize: 10, fontFamily: "monospace", marginBottom: 8 }}>{key.replace(/_/g, " ").toUpperCase()}</div>
                      {Array.isArray(val)
                        ? val.map((v, i) => <div key={i} style={{ color: "#c4c4d4", fontSize: 13, marginBottom: 6, padding: "6px 10px", background: "#111120", borderRadius: 6 }}>{v}</div>)
                        : <div style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{val}</div>}
                    </div>
                  ))}
                </div>
              )}
            </DeliverableCard>
          </div>
        )}

        {/* PUBLICATION TAB */}
        {tab === "publication" && allDone && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <GumroadPanel results={agentResults} />
          </div>
        )}

      </div>
    </div>
  );
}
