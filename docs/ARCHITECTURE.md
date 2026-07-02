# AtlasQuest — Architecture logicielle v1

> Équipe architecture — spécification de production. État des lieux au moment
> de la rédaction : **un fichier `index.html` de ~657 Ko**, ~199 fonctions,
> 18 vues, 3 modes (Enfant / Adulte / Parent), PWA hors-ligne, GitHub Pages,
> backend Supabase (sauvegarde par code famille). Aucun test versionné.

---

## 1. Vue d'ensemble de l'architecture

### 1.1 Décision structurante : monofichier assumé, modularité disciplinée

Le monofichier n'est pas un accident : il garantit le **hors-ligne trivial**
(un seul asset à mettre en cache), le **déploiement zéro-outillage** (GitHub
Pages sert le fichier tel quel) et l'**absence de chaîne de build** à
maintenir. Le remplacer par une SPA à bundler serait une réécriture — interdite
par nos règles.

**Recommandation : architecture en couches *logiques* à l'intérieur du
monofichier**, avec frontières explicites (bannières de section, conventions
de nommage, règles de dépendance), et un **harnais de tests versionné** qui
rend chaque refactor sûr. Une migration vers un build « multi-fichiers →
sortie monofichier » (Vite + plugin singlefile) reste l'issue de secours
documentée si le fichier devient ingérable (> ~1 Mo ou > 2 contributeurs).

### 1.2 Les quatre couches

```
┌────────────────────────────────────────────────────┐
│ PRÉSENTATION   vues, render*, switchView, i18n UI  │  ← aucune logique métier
├────────────────────────────────────────────────────┤
│ DOMAINE        maîtrise, répétition espacée,       │  ← fonctions pures,
│                difficulté adaptative, gamification │    testables isolément
├────────────────────────────────────────────────────┤
│ DONNÉES        banques de questions, LESSONS,      │  ← constantes + accès
│                registre de contenu, dict. i18n     │    via helpers uniquement
├────────────────────────────────────────────────────┤
│ INFRASTRUCTURE saveData/loadData (enc), cloudRpc,  │  ← seul code autorisé à
│                service worker, audio, haptique     │    toucher localStorage/fetch
└────────────────────────────────────────────────────┘
```

**Règle de dépendance : vers le bas uniquement.** La présentation appelle le
domaine ; le domaine lit les données et écrit via l'infrastructure ; jamais
l'inverse. Un `render*` ne calcule pas d'étoiles ; un calcul de maîtrise ne
fait pas de `getElementById`.

---

## 2. Structure « dossiers » (sections du monofichier)

L'équivalent des dossiers : **sections balisées, dans un ordre canonique**,
chaque bannière `// ===== ... =====` faisant office de module.

```
index.html
├── <style>                    tokens + composants (voir DESIGN-SYSTEM.md)
├── <body>                     18 vues : view-* (présentation déclarative)
└── <script>
    ├── 00-infra/              SK, enc/dec, saveData/loadData, réglages
    ├── 01-i18n/               T{fr,en,ar}, t(), PT, pt(), applyTranslations
    ├── 10-data/               banques (AR_*, MATH_*, …), LESSONS, ILLUS,
    │                          KIDS_SUBJECTS_BY_LANG, MATCH
    ├── 20-domain/             maîtrise (kidsSubjStars…), répétition espacée
    │                          (reviewInterval, kidsDueList…), adaptatif
    │                          (kidsAdaptiveCount), objectif quotidien, badges
    ├── 30-services/           cloud (CLOUD, cloudRpc, cloudSave/Restore/Auto),
    │                          partage (shareScore, shareParentReport),
    │                          [futur] profils multi-enfants
    ├── 40-presentation/       switchView + gardes, render* par mode,
    │                          quiz runtime (startQuiz…endQuiz), onboarding
    └── 90-boot/               init, chargement userData, service worker
```

Conventions de nommage (déjà émergentes, désormais obligatoires) :
`kids*` = domaine/présentation Enfant · `render*` = présentation pure ·
`cloud*` = service cloud · `prof*` = profils · préfixe de constante = banque.

---

## 3. Responsabilités des modules

| Module | Responsabilité | Ne fait JAMAIS |
|---|---|---|
| **infra/storage** | (dé)chiffrement, lecture/écriture `localStorage`, clés `SK`, `aq_*` | de logique métier, de DOM |
| **i18n** | dictionnaires, résolution `t()/pt()`, application RTL | d'accès réseau |
| **data/banques** | contenu pédagogique statique, doctrine incluse | d'être modifié à l'exécution |
| **data/registre** | `CONTENT_REGISTRY` : catégorie → mode propriétaire (voir §4) | — |
| **domain/maîtrise** | étoiles, tiers, états de compétence, bulletins | de toucher au DOM ou au storage direct |
| **domain/répétition** | intervalles, échéances, listes de révision | — |
| **domain/adaptatif** | taille de quiz selon maîtrise, questions de renfort | — |
| **services/cloud** | RPC Supabase, coalescence auto-save, code famille | d'être appelé depuis le Mode Enfant sans opt-in parent |
| **présentation** | rendu des vues, gestion d'événements, toasts | de calculer un score ou une échéance |
| **boot** | ordre d'initialisation, migrations de schéma `userData` | — |

---

## 4. Routage et contrôle d'accès

### 4.1 Routage existant, formalisé

`switchView(id)` est le routeur. On le dote d'une **table de routes** unique :

```js
var ROUTES={
  'view-kids':      {mode:'child'},
  'view-lesson':    {mode:'child'},
  'view-match':     {mode:'child'},
  'view-review':    {mode:'child'},
  'view-kidsreport':{mode:'child'},
  'view-parent':    {mode:'parent', guard:'pin'},
  'view-dashboard': {mode:'adult'},
  /* … les 18 vues … */
};
```

`isChildView()` et `updateAdVisibility()` (existants) deviennent des lectures
de cette table au lieu de listes codées en dur — une seule source de vérité.

### 4.2 Contrôle d'accès par rôle

- **Enfant** : accès libre aux vues `child` uniquement. Les vues `adult`
  restent accessibles à l'utilisateur adulte de l'appareil (produit familial,
  pas de session) ; la protection porte sur le *contenu* (§4.3) et l'*argent /
  les données* (PIN).
- **Parent** : garde `pin` (hash local `parentHash`). Toute action sensible
  (réinitialisation, cloud, futurs achats) vit derrière cette garde.
- **Adulte** : par défaut. Publicités et liens externes autorisés **uniquement**
  ici (`updateAdVisibility` fait respecter la frontière).

### 4.3 Barrière de contenu (anti-fuite adulte → enfant)

Les catégories Enfant matchent `^(ar|math|sci|fr|en|islam|civic|hist|geo)_s[1-5]_t[1-3]$`.
Règle d'architecture : **le générateur de quiz Enfant (`startKids`) refuse
toute catégorie hors registre `child`**, et réciproquement le flux adulte ne
propose jamais une catégorie `child`. Le test e2e de non-fuite (à maintenir
dans `tests/`) vérifie : (1) aucune bannière pub dans une vue `child`,
(2) aucune catégorie adulte atteignable depuis le hub Enfant, (3) aucun lien
externe (`http`) dans le DOM des vues `child`.

---

## 5. État et flux de données

### 5.1 Un seul état persistant : `userData`

`userData` (objet global) est **l'unique source de vérité persistée**, écrite
exclusivement par `saveData()`. Les sous-états sérialisés (`kids_stars`,
`kids_review`, `category_stats`…) sont des chaînes JSON internes — historique
assumé, coût de migration non justifié.

Règles :
1. **Écriture uniquement via mutation + `saveData(userData)` immédiat** —
   jamais d'état modifié sans persistance dans la même fonction.
2. **Lecture au rendu** : chaque `render*` relit `userData` — pas de cache de
   présentation.
3. L'état *éphémère* de quiz (`questions`, `current`, `streak`,
   `recoveryAdded`…) reste en variables de module, réinitialisé par
   `startQuiz` — il n'est jamais persisté.

### 5.2 Flux unidirectionnel

```
événement UI → fonction domaine (pure) → mutation userData → saveData()
     ↑                                                            │
     └────────────── render* (relit userData) ←───────────────────┘
```

### 5.3 Couche de suivi de progression

Le domaine « progression » expose des **sélecteurs** (lecture) et
**enregistreurs** (écriture) nommés : `kidsSubjStars`, `kidsCompState`,
`kidsDueList` / enregistrement en fin de quiz (`endQuiz` orchestre : étoiles →
badges → répétition espacée → objectif quotidien → cloud auto). `endQuiz` est
le **seul point d'écriture** de la progression — toute nouvelle mécanique s'y
branche par hook `if(typeof x==='function')x()`.

### 5.4 Cloud : cache-aside, local d'abord

Le local est maître ; le cloud est une copie (backup/restore explicites +
auto-save opt-in coalescé 8 s). Pas de fusion bidirectionnelle : une
restauration **remplace** l'état local (choix assumé v1 — simple et prévisible).

---

## 6. Plan de refactorisation (incrémental, jamais de big-bang)

| # | Étape | Risque | Valeur |
|---|---|---|---|
| 1 | **Versionner le harnais de tests** : `tests/e2e/` (Playwright hors-ligne : parse-check, onboarding, quiz Enfant complet, Espace Parent, non-fuite pub/contenu, cloud simulé) + `npm test` | nul | 🔥 protège tout le reste |
| 2 | **Bannières de sections** : réordonner *sans modifier* les fonctions selon §2 ; ajouter la bannière manquante par module | faible | lisibilité, onboarding dev |
| 3 | **Table `ROUTES`** : remplacer les listes en dur de `isChildView` / `updateAdVisibility` / gardes | faible | source de vérité unique |
| 4 | **Registre de contenu** : dériver le regex des catégories Enfant d'une constante unique partagée par `endQuiz`, `startKids`, `kidsAdaptiveCount` (aujourd'hui dupliqué ×3) | faible | anti-divergence |
| 5 | **Uniformiser les noms de banques** (`AR_S2T1` → `AR_S2_T1`…) via script + alias temporaires | moyen | cohérence data |
| 6 | **Extraction du domaine pur** : regrouper les fonctions pures (maîtrise, répétition, adaptatif) en tête de script, documentées, sans dépendance DOM | moyen | testabilité unitaire |

Cadence : une étape = une PR, chaque PR passe le harnais de l'étape 1.
Règle d'or maintenue : **chaque PR de feature met en conformité ce qu'elle
touche** (adoption opportuniste, cf. DESIGN-SYSTEM.md §7).

---

## 7. Risques et dette technique

| Risque / dette | Gravité | Mitigation |
|---|---|---|
| **Aucun test versionné** (e2e ad hoc hors repo) | 🔴 | Étape 1 du plan — priorité absolue |
| Fichier ~657 Ko, 199 fonctions, croissance continue | 🟠 | Sections §2 ; seuil d'alerte 1 Mo → envisager build singlefile |
| Regex de catégories dupliqué (3 occurrences) | 🟠 | Étape 4 |
| Nommage de banques incohérent (`AR_S2T1` vs `AR_S1_T1`) | 🟡 | Étape 5 |
| `userData` non versionné (pas de champ `schema`) | 🟡 | Ajouter `userData.v` + migrations au boot avant la v2 cloud |
| Restauration cloud = remplacement total (pas de fusion) | 🟡 | Documenté ; v2 : horodatage par sous-état si besoin réel |
| Clé publiable + RPC ouverts à `anon` (quota gratuit épuisable par abus) | 🟡 | Contrainte de taille en place ; v2 : rate-limit Supabase / captcha si abus constaté |
| Pas de `prefers-reduced-motion` | 🟡 | Dette design (DESIGN-SYSTEM.md §5) |
| Tailwind inliné figé v3.4.17 | 🟢 | Assumé — pas de build |

---

## 8. Prochaine étape d'implémentation

**Étape 1 du plan : versionner le harnais de tests** (`tests/e2e/` +
`package.json` avec `npm test`), car elle conditionne la sécurité de toutes
les autres. Contenu minimal :

1. `smoke.spec` — parse-check du script + boot sans erreur de page ;
2. `kids.spec` — onboarding → hub Enfant → quiz complet → étoiles/bulletin ;
3. `isolation.spec` — non-fuite : pub invisible en vues `child`, aucun lien
   externe, catégories adultes inaccessibles du hub Enfant ;
4. `parent.spec` — PIN, tableau de bord, partage, cloud simulé (mock réseau).

Puis reprise de la feature en file d'attente (profils multi-enfants), qui
s'appuiera sur ce harnais et sur les modules `30-services/profils` définis ici.
