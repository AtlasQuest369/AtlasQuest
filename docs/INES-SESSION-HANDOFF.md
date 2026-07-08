# Ines Kids — Passation de session (handoff)

> But : permettre à une **nouvelle session** de reprendre le travail sans perte de
> contexte. Lire ce fichier en entier avant d'agir. Développer et pousser sur la
> branche **`claude/studio-analysis-4xg0mu`** (PR #83).

## 1. Projet
- **Ines Kids** = app enfant/famille (3–8 ans) alignée au **programme MEN algérien**,
  dérivée d'AtlasQuest. Fichier unique : **`ineskids/index.html`** (HTML/JS/CSS,
  PWA hors-ligne). Flag `var INES=true`, thème clair `body.ines-app`, stockage
  localStorage `ineskids_v1`.
- Langues **AR / FR / EN** (barre en haut, drapeau **algérien 🇩🇿** pour l'arabe),
  RTL arabe, polices auto-hébergées (Fredoka latin, Cairo arabe, dans
  `ineskids/fonts/`).
- Service worker `ineskids/sw.js` : **incrémenter `CACHE_NAME` (`ineskids-vN`) à
  chaque changement de contenu** (actuellement **v16**).

## 2. Architecture du contenu (à respecter)
- **Catégories** : `subj_sYEAR_tTRIM` (ex. `fr_s4_t2`). Matières : `ar, fr, en,
  math, sci, islam, civic, hist, geo`. Années 1–5, trimestres 1–3.
- **Banques de questions** : `const NAME=[ ... ]`, format objet
  `{fr,en,ar,answer:{fr,en,ar},wrong:[{…}×3]}`. Helpers par matière (préfixent une
  émoji) : `frQ`(🇫🇷) `enQ` `arq`(📖) `mq`(🔢) `sciQ`(🔬) `iq`(🕌) `cq`(🤝)
  `gq`(🗺️, géo). Enregistrées dans l'objet `BANKS={…}`.
- **Densification** : un bloc `(function(){ var X=[ [BANK,[extraQ…]], … ];
  X.forEach(p=>p[0].push.apply(p[0],p[1])); })();` ajoute des questions aux banques.
  Il y a plusieurs blocs de ce type (langues, MEN, etc.). Pour enrichir une banque,
  éditer **la banque de base ET sa ligne de densification**.
- **Leçons `LESSONS`** : DEUX formes coexistent —
  1. littéral objet `var LESSONS={'ar_s1_t1':{t,i,p:[],e:[]}, …}` (utilisé par
     ar/math/sci/islam/civic/hist/geo années de base) ;
  2. assignations `LESSONS['fr_s1_t1']=L(t,i,[p],[e]);` (fr/en + ajouts).
     `function L(t,i,p,e){return {t,i,p,e};}`. `t`=titre, `i`=intro, `p`=puces,
     `e`=exemples.
- **Vrai/Faux `TF`** : idem deux formes (`'x':[…]` dans un littéral, ou
  `TF['x']=[s('…',true),…]`). Le helper `s()` peut ne pas être défini au moment du
  littéral → dans le littéral, garder des objets inline `{fr,en,ar,answer,wrong}`.
- **Niveaux** : par unité, 3 niveaux × 10 questions (`userData.ines_catq`).

## 3. Système d'illustrations (IMPORTANT)
- `var ILLUS={ key:'<svg …>' , … }` : SVG **inline** hors-ligne (fond sombre,
  police Cairo pour l'arabe). `var ILLUS_FOR={ cat:'key', … }` mappe une catégorie
  à une illustration. Rendu dans `openLesson()` via `#lesson-illus`.
- **Couverture = 100 %** : les **135 leçons** ont une illustration. On **réutilise**
  une même illustration pour plusieurs leçons apparentées.
- **Règles de dessin** (éviter les bugs) :
  - viewBox `0 0 320 180`, `width="100%" style="max-height:210px;…"`.
  - **Toujours `text-anchor="middle"`** pour les labels : en contexte RTL,
    `text-anchor="end"` s'inverse et déborde hors du cadre (bug déjà rencontré).
  - Insérer les nouvelles entrées **avant l'ancre `  hist_occupation:'`** dans
    `ILLUS`, et ajouter le mapping dans `ILLUS_FOR`.
  - Vérifier le rendu par capture d'écran (voir §5).
- Illustrations dédiées créées cette session (exemples) : `ar_verbsentence`,
  `ar_letters`, `ar_book`, `lang_abc/hello/numbers/grammar`, `fr_quartier`,
  `math_numbers/ops/fractions/measure/geometry`, `sci_animals/skeleton/matter`,
  `civ_family/school/health/flag/city/rights/green`, `hist_time/ancient`,
  `islam_mosque/prayer/manners/books/zakat/quran`,
  `geo_landforms/weather/globe/economy/mapparts`, `sci_digestive`, + réutilisation
  des existantes (`algeria`, `shapes`, `organs`, `plant`, `hist_independence`…).

## 4. Rendu RTL des maths
- Entourer les expressions numériques d'**isolats bidi** : `⁦ … ⁩`
  (LRI/PDI, notés `⁦ ⁩`) pour un affichage correct (ex.
  `mq('… ⁦6+4+3+5 = 18⁩ سم …')`).

## 5. Workflow de vérification (obligatoire avant commit)
1. **Parse** : extraire le plus gros bloc `<script>` et `new Function(block)` — doit
   réussir (« PARSE OK »).
2. **Tests** : `NODE_PATH=/opt/node22/lib/node_modules
   PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers npm test` → **11 specs** doivent passer.
3. **Capture Playwright** (chromium `/opt/pw-browsers/chromium`) : ouvrir la leçon
   (`finishOnboard(); setLang('ar'|'fr'); openLesson(subj,year,tn);`) et vérifier
   l'illustration + le texte (pas de débordement RTL). Pour l'arabe faire
   `setLang('ar')`.
- Éditer via **scripts node** avec ancres **uniques** (assert « not found / not
  unique ») et **une seule écriture finale** (rollback implicite si une ancre
  échoue). Ne jamais faire de `replace` global fragile (a déjà cassé le JS une fois).

## 6. Git / livraison
- Commits en français, descriptifs. Terminer par :
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>` +
  `Claude-Session: https://claude.ai/code/session_01JwECW2ngvDcUAePxtKhfae`.
- Push : `git push -u origin claude/studio-analysis-4xg0mu` (retries si réseau).
- **Ne jamais** mettre l'identifiant de modèle dans un commit/PR/code.
- Build APK : workflow **`build-ineskids.yml`** (workflow_dispatch) → artefact
  `InesKids-APK`. Release Play (AAB) : `release-ineskids.yml`.

## 7. Contraintes doctrinales (à préserver)
- **القدس (Al-Quds) = capitale de la Palestine**. **Sahara occidental** = droit à
  l'autodétermination (entité **distincte** ; ne pas l'assimiler à un pays voisin).
- Drapeau algérien (vert/blanc + **croissant+étoile rouges**), **jamais** saoudien.
- Alignement **programme MEN**. Pas de pub dans le flux enfant ; pub récompensée =
  opt-in parent, OFF tant qu'aucun ID AdMob. Aucun secret dans le dépôt.
- **Vie privée** : ne **jamais** intégrer le filigrane des fiches sources (nom,
  photo, n° de téléphone de l'enseignante). On n'extrait que le **contenu
  pédagogique** ; on **redessine** soi-même les illustrations.

## 8. Méthode « photos → intégration »
Pour chaque matière/trimestre fourni en photos : scan minutieux → refondre la
leçon de la catégorie correspondante avec le **contenu MEN authentique** (remplacer
le placeholder si besoin) → enrichir la banque (base + densification) → ajouter/mapper
une illustration → vérifs §5 → commit + push. **Versets coraniques** : n'inclure que
des fragments courts, ultra-connus, **relus au rendu** (jamais en réponse/distracteur).

### Lecture d'images volumineuses (contournement)
Les captures téléphone sont **720×1604** (barres noires) → parfois refusées par
l'API. Redimensionner localement avec PIL (crop bande centrale `y 300→1300`, largeur
~520–720) avant lecture. **Attention** : si la conversation est **saturée d'images**
(beaucoup de photos déjà chargées), l'API refuse **toute** nouvelle image quelle que
soit sa taille → il faut une **nouvelle session** (budget d'images remis à zéro).

## 9. Déjà intégré (Année 4, poussé sur PR #83)
Histoire (fiches illustrées) · **Géographie T1** (carte, eau/terre, localisation) ·
**Sciences** (respiration/digestion/circulation) · **Éduc. islamique**
(كتب سماوية / زكاة / سور، versets vérifiés) · **Éduc. civique** (patrimoine
national/local) · **Arabe T1** (grammaire : كلمة/جملة) · **Français T1**
(« Tu habites où ? / le quartier ») · **Maths T2** (géométrie & division) ·
**Illustrations sur les 135 leçons** · retrait de l'émoji arc-en-ciel de l'accueil.

## 10. Tâches en attente
1. **Français T2 (`fr_s4_t2`)** — 20 photos à renvoyer dans la nouvelle session.
   Déjà lu (à réutiliser) : **Les synonymes** (joli=beau, finir=terminer,
   grand=énorme…) et **« être » et « avoir » au présent** (je suis/tu es/… ;
   j'ai/tu as/…). L'actuel `fr_s4_t2` = « Le futur & l'imparfait » → à refondre
   vers le vrai T2 (synonymes/contraires, conjugaison présent, etc.).
2. **Relancer le build APK** après le français T2 pour packager tout à jour — le
   dernier build (commit `b8641b4`) ne contient PAS Français T1 (`a495a9d`) ni
   Maths T2 (`673b71a`).

## 11. Repères de commits récents (branche)
`b49897f` retrait arc-en-ciel · `b8641b4` illustrations partout (135/135) ·
`a495a9d` Français T1 · `673b71a` Maths T2. (HEAD peut avoir avancé.)
