# AtlasQuest — Quiz Géographie Monde 🌍

Application web de quiz de géographie et d'histoire, **multilingue (FR / EN / AR avec support RTL)**.
Un seul fichier autonome — pas de backend, pas de base de données. Tout tourne dans le navigateur.

**En ligne :** https://atlasquest369.github.io/AtlasQuest

---

## Architecture

| Fichier | Rôle |
|---|---|
| `index.html` | **L'application complète** (HTML + CSS + JS en un seul fichier). Source de vérité unique. |
| `manifest.json` | Manifeste PWA (installable sur Android) |
| `sw.js` | Service worker (mode hors-ligne + installation) |
| `privacy.html` / `terms.html` | Pages légales dédiées (URL requises par le Play Store) |
| `icons/` | Icônes PWA / Android (192, 512, maskable) |
| `.github/workflows/` | Pipeline d'automatisation de l'APK (voir ci-dessous) |

Stack : Tailwind CSS (CDN), Lucide icons (CDN), Google Fonts (DM Sans / Playfair / Cairo).
Stockage : `localStorage`, clé unique `atlasquest_v2`, encodée en base64 (anti-triche léger, pas un chiffrement réel).

---

## Fonctionnalités

- 9 catégories : Drapeaux, Capitales, Monuments, Histoire, Continents, Culture G., **Algérie**, **Monde Arabe**, **Chiffres**
- 3 difficultés (Facile / Normal / Expert) avec timer, + Mode Entraînement et Mode Duel (2 joueurs)
- XP, niveaux, séries, vies (5/jour), gems, quêtes quotidiennes, classement par ligue, boutique
- Multilingue FR / EN / AR complet avec RTL
- PWA installable + mode hors-ligne
- Sons (Web Audio API, aucun fichier externe), confettis, badges

---

## Déploiement Web (GitHub Pages)

`index.html` est servi directement par GitHub Pages (branche `main`, dossier racine).
Pour mettre à jour : remplacer `index.html` puis commit → GitHub Pages se met à jour en 1–2 min.

---

## Génération de l'APK / AAB (Play Store) — via GitHub Actions

Aucun PC requis. Deux workflows manuels (onglet **Actions** du dépôt) :

**1 — Generate Keystore** (`generate-keystore.yml`) — à lancer **une seule fois**
- Génère et signe une clé. Télécharge l'artefact `KEYSTORE-SAUVEGARDER`.
- Copier le contenu de `keystore.b64.txt` dans le secret GitHub `KEYSTORE_BASE64`.
- Créer les secrets : `KEYSTORE_PASSWORD`, `KEY_PASSWORD` (le mot de passe affiché), `KEY_ALIAS` = `atlasquest`.

> ⚠️ Ne jamais perdre ce keystore : Google exige **exactement la même clé** pour chaque mise à jour. Ne jamais le committer dans le dépôt.

**2 — Build Android APK** (`build-android.yml`)
- Empaquette `index.html` (+ légal + icônes) avec Capacitor et produit un **APK** et un **AAB** signés.
- Artefacts : `AtlasQuest-APK` (test) et `AtlasQuest-AAB-PlayStore` (soumission Play Store).

---

## Publier sur le Play Store

1. Compte développeur : https://play.google.com/console (frais unique de 25 $)
2. Créer l'app → titre, description, captures, icône 512×512, **URL de politique de confidentialité** (utiliser la page `privacy.html` hébergée sur GitHub Pages)
3. Production → Nouvelle release → uploader le fichier `.aab`
4. Questionnaire de classification → Soumettre. Revue : 1–3 jours.

---

## Notes géopolitiques (à ne jamais régresser)

Le contenu suit les positions officielles de la République Algérienne et les résolutions de l'ONU :
- **Palestine** incluse (🇵🇸, capitale administrative Ramallah ; Al-Qods comme capitale revendiquée). **Israël n'est pas un pays jouable.**
- **Sahara occidental** présenté comme territoire distinct (non rattaché au Maroc).
- **Algérie : 69 wilayas.** Russie classée en Europe. « Washington D.C. ».
