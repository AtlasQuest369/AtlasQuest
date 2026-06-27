# AtlasQuest — Quiz Géographie Monde 🌍

Application web de quiz de géographie et d'histoire, **multilingue (FR / EN / AR avec support RTL)**.
Un seul fichier autonome — pas de backend, pas de base de données. Tout tourne dans le navigateur.

**En ligne :** https://atlasquest369.github.io/AtlasQuest

---

## Architecture

| Fichier | Rôle |
|---|---|
| `index.html` | **L'application complète** (HTML + CSS + JS en un seul fichier). Source de vérité unique. |
| `worldmap.js` | Données de la **carte du monde embarquée** (polygones des pays, ~110 Ko, aucune dépendance réseau). Voir crédits ci-dessous. |
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

## 🗺️ Puzzle : carte du monde embarquée

La rubrique **🧩 Puzzle** propose deux modes :
- **Continents** — repère le bon continent (facile, idéal débutants/enfants).
- **Pays sur la carte** — localise le pays sur une **vraie carte du monde** (zoom par région : Monde / Afrique / Europe / Asie / Amériques). La détection du tap est tolérante (test du pays touché + plus proche centroïde) pour rester jouable sur mobile, même pour les petits pays.

La carte est **100 % embarquée** (`worldmap.js`, aucun CDN) : elle fonctionne hors-ligne et ne peut pas « échouer à charger ».

**Crédit (obligatoire, licence CC BY 4.0) :** données de la carte dérivées de [`@svg-maps/world`](https://github.com/VictorCazanave/svg-maps) © Victor Cazanave & contributeurs, simplifiées (Douglas-Peucker) pour l'intégration hors-ligne. Le Sahara occidental et la Palestine y sont **préservés comme entités distinctes**, conformément à la doctrine éditoriale (résolutions de l'ONU + positions de l'Algérie).

---

## Notes géopolitiques (à ne jamais régresser)

Le contenu suit les positions officielles de la République Algérienne et les résolutions de l'ONU :
- **Palestine** incluse (🇵🇸, capitale administrative Ramallah ; Al-Qods comme capitale revendiquée). **Israël n'est pas un pays jouable.**
- **Sahara occidental** présenté comme territoire distinct (non rattaché au Maroc).
- **Algérie : 69 wilayas.** Russie classée en Europe. « Washington D.C. ».

---

## 💰 Monétisation (publicité)

L'app contient une **bannière publicitaire simulée** par défaut (aucun revenu). Deux pistes réelles :

### A. Web (GitHub Pages) — Google AdSense
1. Crée un compte sur https://adsense.google.com et ajoute le site `atlasquest369.github.io`.
2. Édite **`ads.txt`** : remplace `pub-0000000000000000` par ton **ID éditeur** réel.
3. Dans **`index.html`**, renseigne en haut du script :
   - `var ADSENSE_CLIENT='ca-pub-XXXXXXXXXXXXXXXX';`
   - `var ADSENSE_SLOT='1234567890';`
4. Dès que ces deux valeurs sont remplies, la vraie pub AdSense remplace automatiquement la bannière simulée. Tant qu'elles sont vides, rien n'est chargé (zéro risque de blocage de compte).
> AdSense exige un site avec du contenu et un trafic réel, puis une validation (1–14 jours). Les utilisateurs Premium ne voient pas la pub (déjà géré).

### B. Application Android (Play Store) — Google AdMob
AdSense est pour le web ; dans l'APK, utilise **AdMob** (SDK natif) :
```
npm install @capacitor-community/admob && npx cap sync
```
Puis initialise AdMob au démarrage et remplace le modal « regarder une pub » par un `RewardVideoAd`. IDs de test pendant le dev, IDs réels avant publication.

### ⚠️ Réalité paiement (Algérie)
- AdSense/AdMob **sont accessibles aux éditeurs algériens**, seuil de paiement **100 $**.
- Le paiement se fait par **virement bancaire (EFT) vers un compte au nom du titulaire** — **pas vers une carte virtuelle ni Grey**. Prévois un compte bancaire (ou via un proche de confiance) au nom du bénéficiaire AdSense.

---

## 🍏 iOS / App Store (iPhone)

**Oui, c'est techniquement possible** avec le même code (Capacitor cible aussi iOS), mais c'est plus lourd que pour Android :
- Il faut un **compte Apple Developer** : **99 $/an** (récurrent), payable par carte (ta carte virtuelle Grey peut convenir si c'est une Visa/Mastercard valide).
- Compiler iOS exige **macOS + Xcode** — donc soit un Mac, soit un **CI macOS** (GitHub Actions runner `macos`, ou Codemagic). Pas faisable directement depuis Android comme l'APK.
- Apple applique la règle **4.2 (functionalité minimale)** : un simple « site emballé » peut être refusé. Il faut soigner l'expérience native (offline, animations, pas de bouton de paiement web).

**Solution immédiate gratuite :** sur iPhone, Safari → Partager → **« Sur l'écran d'accueil »** installe déjà AtlasQuest comme une app (PWA), sans App Store ni frais.

**Recommandation studio :** lancer d'abord sur **Google Play + Web (AdSense)** depuis l'Algérie (coût 25 $ unique), construire l'audience et les premiers revenus, puis envisager l'App Store iOS dans un second temps.
