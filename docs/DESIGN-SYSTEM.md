# AtlasQuest — Design System v1

> Équipe UX/UI — spécification du langage visuel. Une marque, trois expériences :
> **Mode Enfant** (coloré, doux, guidé), **Mode Adulte** (mature, élégant,
> centré savoir), **Mode Parent** (pratique, analytique).
> Contrainte structurante : application monofichier, hors-ligne, mobile-first,
> trilingue FR/EN/AR avec RTL complet.

---

## 1. Principes de design

1. **Une marque, trois registres.** Même fond sombre premium partout (continuité
   de marque), mais chaque mode a son accent, sa densité et sa forme. On ne
   change pas de produit, on change de registre.
2. **Le contenu d'abord.** Le decorum (lueurs, dégradés, confettis) célèbre la
   réussite pédagogique ; il ne remplit jamais un écran vide.
3. **Une action principale par écran (Mode Enfant).** L'enfant ne choisit
   jamais entre deux gestes équivalents ; le chemin est guidé.
4. **Le hors-ligne est une contrainte de design.** Pas de nouvelle webfont, pas
   d'images distantes : iconographie = emoji système + SVG embarqué.
5. **La sobriété protège.** Mode Enfant : jamais de publicité, de lien externe,
   de contenu tiers. La séparation visuelle des modes rend cette frontière
   perceptible même par un enfant.
6. **RTL natif, pas adapté.** L'arabe est une langue de premier rang : chaque
   composant est conçu pour les deux sens de lecture dès le départ.

---

## 2. Système de couleurs et typographie

### 2.1 Tokens de couleur (CSS custom properties, `:root`)

| Token | Valeur | Rôle |
|---|---|---|
| `--bg` | `#0f0f1a` | Fond principal (tous modes) |
| `--bg2` | `#1a1a2e` | Fond secondaire, dégradés |
| `--card` | `rgba(255,255,255,.06)` | Surface de carte translucide |
| `--gold` | `#FFD700` | **Accent Mode Adulte** + marque (logo, niveaux) |
| `--cyan` | `#00E5FF` | Accent secondaire adulte (stats, liens internes) |
| `--purple` | `#a78bfa` | Révision / répétition espacée |
| Succès | `#22c55e` | Réussite, toasts verts, validation |
| Alerte | `#f59e0b` | Points à renforcer, toasts « or » |
| Erreur | `#ef4444` | Mauvaise réponse, échec réseau |
| Info / Parent | `#3b82f6` | **Accent Mode Parent** (cloud, tableaux de bord) |

**Accents par mode** (règle de séparation) :
- **Enfant** : couleurs par matière (vives mais désaturées ~80 %), succès vert,
  or réservé aux étoiles/récompenses. Jamais de Playfair.
- **Adulte** : or + cyan, dégradé signature `linear-gradient(135deg,var(--gold),#f59e0b)`
  avec **texte noir** sur bouton or (contraste maximal).
- **Parent** : bleu `#3b82f6` + vert fonctionnel. Aucun confetti, aucune mascotte.

**Texte sur fond sombre** — hiérarchie par opacité : titre `#fff` 100 %,
corps 80 %, secondaire 60–70 %, désactivé 40 %. Minimum de contraste : voir §5.

### 2.2 Typographie

| Usage | Police | Graisses |
|---|---|---|
| Corps FR/EN | **DM Sans** | 400 / 500 / 700 / 900 |
| Titres Mode Adulte (h1, h2, `.playfair`) | **Playfair Display** | 700 / 900 |
| **Tout l'arabe** (corps ET titres) | **Cairo** | 400 / 700 / 900 |
| Code famille, données techniques | monospace système | 400 |

Règles :
- **Jamais de Playfair en arabe ni en Mode Enfant.** Titres arabes : Cairo 900.
  Titres enfant : DM Sans 900 (FR/EN) / Cairo 900 (AR).
- Échelle : 12 / 14 / **16 (base)** / 18 / 20 / 24 / 30 / 36 px.
  Mode Enfant : corps ≥ 16 px, question de quiz ≥ 20 px, réponses ≥ 18 px.
  Mode Adulte : corps 14–16 px (densité acceptée). Parent : libellés 12–14 px
  + chiffres clés 20–24 px en gras.
- Arabe : interligne +10 % (Cairo est haute), **jamais d'italique**, jamais de
  `letter-spacing` (casse les ligatures).
- Pas de texte justifié (lisibilité dys) ; `leading-relaxed` pour les leçons.

---

## 3. Système de composants

Bibliothèque construite sur les utilitaires Tailwind inlinés + tokens CSS.
Chaque composant existe en 3 registres quand il apparaît dans plusieurs modes.

| Composant | Recette | Notes |
|---|---|---|
| **Bouton primaire** | `rounded-xl font-bold py-3 px-6 shadow-lg` + dégradé du mode | 1 seul par écran. Enfant : `rounded-2xl`, hauteur ≥ 52 px. Texte noir sur or, blanc sur vert/bleu |
| **Bouton secondaire** | fond `--card`, bordure `white/10`, texte 80 % | Actions de second rang |
| **Bouton tertiaire** | texte souligné `text-xs opacity-60` | Actions rares/destructives (réinitialiser) |
| **Carte** | `rounded-xl p-3` fond `--card` bordure `white/10` | Variante `gold-card` (adulte) ; carte matière (enfant) avec emoji 28 px+ |
| **Barre de progression** | piste `white/10` h-1.5, remplissage dégradé vert→or | Toujours accompagnée du % en clair |
| **Étoiles de maîtrise** | ★★★ or / `white/18` | 0–3, animation d'apparition décalée (0,18 s) |
| **Toast** | vert = succès, or = information, rouge = erreur | Sémantique stricte ; 1 seul à la fois |
| **Modale** | fond `black/40` + carte centrée `max-w-xs` | PIN parent, confirmations |
| **Navigation basse** | `tab-btn`, actif = `--gold` + drop-shadow | Mode Adulte uniquement |
| **Chip / badge** | `rounded-full text-xs px-2 py-1` teinte du statut à 15 % + bordure 40 % | Points à renforcer, statuts de compétence |
| **Ligne de classement** | `lb-row`, soi-même = bordure or + lueur | Mode Adulte |
| **Interrupteur / case** | case native + libellé cliquable `text-xs` | Espace Parent (auto-sauvegarde) |
| **Mascotte** | SVG embarqué (`mascotSVG`), états happy/cheer | **Mode Enfant uniquement** |

États obligatoires : normal, pressé (scale .97), désactivé (opacité 40 %),
chargement (libellé remplacé, jamais de spinner seul).

---

## 4. Règles UI par mode

### Mode Enfant 🧒
- **Une action principale par écran.** Le reste : navigation retour + éléments
  d'état (gemmes, objectif du jour).
- Cibles tactiles ≥ 48 px (52 px pour les réponses de quiz).
- Feedback émotionnel : mascotte + confettis (≥ 2 étoiles) + toast vert.
  L'échec n'est jamais rouge vif plein écran : correction pédagogique
  (📌 règle + 💡 exemple) avant tout.
- Emoji-iconographie en tête de chaque matière ; texte court, jamais de
  paragraphe > 3 lignes hors leçon.
- **Interdits** : publicité, lien externe, Playfair, navigation basse adulte,
  écrans à choix multiples équivalents.

### Mode Adulte 🌍
- Densité acceptée : grilles 2–4 colonnes, classements, stats.
- Registre élégant : Playfair pour les titres, or/cyan, cartes compactes.
- Gamification sobre : niveaux, séries, badges — pas de mascotte.

### Mode Parent 👪
- **Structure fixe du tableau de bord** : 1. Vue d'ensemble (progression par
  matière) → 2. Points à renforcer → 3. Activité → 4. Cloud → 5. Réassurance
  sécurité → 6. Actions (partager / réinitialiser).
- Analytique : chaque barre a son % ; chaque chiffre a son libellé.
- Aucun élément ludique. Bleu fonctionnel. Actions destructives en tertiaire +
  confirmation.
- Accès : modale PIN neutre (ni enfantine ni punitive).

**Séparation visuelle des modes** — un écran doit être identifiable en < 1 s :
Enfant = rayons 2xl + emoji géants + vert/matières ; Adulte = Playfair + or ;
Parent = bleu + barres + chiffres. Ne jamais mélanger ces marqueurs.

---

## 5. Règles d'accessibilité

1. **Contraste** : corps ≥ 4.5:1, grands titres ≥ 3:1 sur `--bg`. L'or et le
   cyan passent sur fond sombre ; **jamais** d'or sur blanc ni de texte à
   opacité < 60 % pour une information indispensable.
2. **Cibles tactiles** : ≥ 44 px partout, ≥ 48 px Mode Enfant.
3. **Jamais la couleur seule** : étoiles + %, icône + teinte, texte + toast.
4. **Mouvement** : animations 150–300 ms `ease-out` ; confettis uniquement à la
   réussite ; respecter `prefers-reduced-motion` (désactiver confettis, lueurs
   pulsées, étoiles animées). *(À implémenter — voir §7.)*
5. **Sons et haptique** : toujours débrayables (réglages existants `aq_sound`,
   `aq_haptic`) ; jamais porteurs seuls d'une information.
6. **Focus visible** au clavier sur tout élément interactif.
7. **Lisibilité dys** : pas de justification, interlignes généreux, phrases
   courtes en Mode Enfant.

---

## 6. Architecture des écrans

Gabarit mobile-first unique : `max-w-md` centré, header fixe, contenu défilant,
`pb-32` pour ne jamais cacher de contenu sous la navigation.

| Écran | Zones (haut → bas) |
|---|---|
| **Accueil adulte** | Header marque + niveau/XP → Défi du jour (1 CTA) → grille catégories → nav basse |
| **Quiz** | Progression (n/total) + série → question → 4 réponses pleine largeur → jokers |
| **Résultats** | Étoiles → mascotte/emoji → message → stats → 2 actions (rejouer / partager) |
| **Hub Enfant** | Titre + gemmes → objectif du jour → bouton révision (si dû) → grille matières (1 colonne d'années par matière) |
| **Leçon** | Illustration SVG → règle (📌) → exemples (💡) → 1 CTA « Pratiquer » |
| **Révision** | Liste des compétences dues (chip état + étoiles) → toucher = quiz |
| **Bulletin enfant** | Par matière : barre + étoiles ; badges obtenus |
| **Espace Parent** | Structure fixe §4 (Parent) |
| **Onboarding** | 1 question par écran, points de progression, 1 CTA or |

Navigation : Adulte = nav basse persistante ; Enfant = pile hiérarchique
(hub → matière → quiz → résultat) avec retour unique ; Parent = vue unique
défilante derrière PIN.

---

## 7. Notes d'implémentation pour les développeurs

1. **Tokens = CSS custom properties** dans `:root`. Toute nouvelle couleur passe
   par un token ; pas de nouvelles valeurs hex en dur dans le HTML.
2. **Tailwind est inliné et figé** (`#tw-base`, v3.4.17) : n'utiliser que les
   classes déjà présentes ; sinon, ajouter une classe utilitaire au bloc
   `<style>` maison — ne pas régénérer le fichier Tailwind.
3. **Budget hors-ligne** : aucune nouvelle webfont (les 3 familles actuelles
   suffisent) ; icônes = emoji ou SVG inline ; illustrations = SVG embarqué
   (voir `ILLUS`).
4. **RTL** :
   - `dir` porté par la racine + `body[lang="ar"]` bascule sur Cairo ;
   - utiliser flex/grid + `gap` (auto-miroir) — éviter `margin-left/right`
     directionnels, préférer les classes logiques ou `justify-between` ;
   - **isoler tout segment LTR** en contexte arabe : expressions mathématiques
     (isolats ⁦…⁩ déjà en place via `mq()`), codes techniques
     (`direction:ltr` sur le code famille), URLs ;
   - chiffres : numération occidentale (0-9) pour les maths, conforme aux
     manuels algériens ;
   - miroiter les icônes directionnelles (flèches) ; ne pas miroiter les
     emoji sémantiques.
5. **Motion** : durées 150–300 ms, `ease-out` ; à faire — media query
   `@media (prefers-reduced-motion: reduce)` coupant `confetti`,
   `glow-active` et les animations d'étoiles.
6. **Discipline de registre** : avant d'ajouter un écran, identifier son mode
   et n'employer que les marqueurs de ce mode (§4). Un composant partagé
   (toast, modale) reste neutre : pas d'or en Mode Enfant, pas d'emoji géant
   en Mode Parent.
7. **Non-régression visuelle** : ce document codifie l'existant — l'adoption se
   fait par retouches opportunistes (chaque PR met en conformité ce qu'elle
   touche), jamais par refonte globale.
