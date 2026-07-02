# AtlasQuest — Modèle de contenu & workflow éditorial v1

> Équipe contenu / gestion des connaissances / éditorial multilingue.
> Codifie l'organisation du contenu existant (~130 banques scolaires,
> banques de culture générale, leçons, dictées, illustrations) et fixe les
> règles pour toute évolution.

---

## 1. Modèle de contenu

**Deux domaines étanches** (règle : ne jamais les mélanger) :

| Domaine | Contenu | Catégories | Public |
|---|---|---|---|
| **A. Scolaire** | programme MEN par matière/année/trimestre + dictées | `{subj}_s{1-5}_t{1-3}`, `dict_{ar,fr,en}` | Mode Enfant |
| **B. Culture générale** | drapeaux, capitales, monuments, continents, histoire, quiz thématiques | `flags`, `capitals`, `monuments`, `history`, `algeria`… | Mode Adulte |

La frontière est le **registre de contenu** (`KIDS_CAT_RE`, ARCHITECTURE.md
§4.3) : une catégorie est d'un seul domaine, testé par le harnais.

**Types de contenu** :
1. **Question QCM trilingue** — l'unité de base (voir §2) ;
2. **Question vrai/faux** (banques `TF`) — même schéma, 2 options ;
3. **Item de dictée** — mono-langue : `[mot, [3 graphies fautives]]` ;
4. **Leçon** (`LESSONS[catégorie]`) — `{p:[règles], e:[exemples], illus}` ;
5. **Illustration** (`ILLUS`) — SVG embarqué, hors-ligne, texte en arabe.

## 2. Standard de métadonnées

**Schéma canonique d'une question** (invariant) :

```js
{ fr:'…', en:'…', ar:'…',                 // énoncé dans les 3 langues
  answer:{fr:'…',en:'…',ar:'…'},          // réponse unique
  wrong:[{fr,en,ar},{fr,en,ar},{fr,en,ar}] } // exactement 3 distracteurs
```

- **Métadonnées structurelles** (pas de champs libres) : la compétence, la
  matière, l'année et le trimestre sont portés par la **banque d'appartenance**
  — une question ne peut pas être mal taguée.
- **Nommage des banques** : cible `SUBJ_S{année}_T{trimestre}` (ex.
  `SCI_S3_T2`). Les écarts historiques (`AR_S2T1`, `MATH_S1T1`) sont une
  dette recensée (ARCHITECTURE.md §6 étape 5) — tout **nouveau** contenu suit
  la cible.
- **Constructeurs canoniques** : `arq/mq/sciQ/iq/cq/hq/gq/frQ/enQ` — chaque
  matière a son helper et son emoji (📖🔢🔬🕌🤝📜🗺️🇫🇷🇬🇧). Ne jamais créer
  d'objet question à la main.
- Expressions mathématiques en contexte RTL : isolats LTR `⁦…⁩` (gérés par
  `mq()`).

## 3. Stratégie de versioning

- **Git est le CMS** : chaque ajout/correction de contenu = une PR relue,
  testée (`npm test`) et mergée — traçabilité complète (qui, quoi, quand,
  pourquoi) via l'historique.
- Banques **append-only par défaut** : on ajoute ; une correction remplace
  l'entrée fautive avec un message de commit explicite (`fix(content): …`).
- Pas de CMS externe ni de contenu distant : le hors-ligne est un principe
  produit — tout le contenu est embarqué et versionné avec l'app.
- La **densification** (compléments de banques) suit le motif IIFE existant,
  après les constantes de base.

## 4. Règles multilingues

1. **Trilingue ou rien** (domaine B) : une question de culture générale
   existe dans les 3 langues simultanément — jamais de langue manquante ni
   de repli silencieux.
2. **Le scolaire suit la langue du programme** : les matières MEN sont en
   arabe (langue d'enseignement du primaire) ; les cours FR/EN et les
   dictées sont mono-langue par nature.
3. **Glossaire de terminologie** : les termes clés gardent une traduction
   unique et constante (ex. wilaya = ولاية = wilaya ; l'indépendance =
   الاستقلال ; unité de mesure = وحدة القياس). Toute nouvelle PR de contenu
   réutilise les termes déjà en banque — la cohérence prime sur l'élégance.
4. **Jamais de traduction automatique non relue.** L'arabe est relu comme
   langue de premier rang (pas traduit depuis le français).
5. RTL : pas d'italique ni de letter-spacing en arabe ; segments LTR isolés
   (DESIGN-SYSTEM.md §7.4).

## 5. Workflow éditorial

```
Proposer (PR) → Vérifier (sources) → Tester (npm test) → Relire → Merger
```

- **Vérification des faits** : contenu scolaire aligné sur les manuels et
  programmes MEN ; culture générale sur des références standard. **Aucun
  contenu inventé non vérifiable.**
- **Doctrine (non négociable, vérifiée à chaque revue)** : la capitale de la
  Palestine est **القدس (Al-Quds)** ; le Sahara occidental est un territoire
  distinct (soutien à l'autodétermination) ; Israël n'est pas jouable.
- Les tests automatiques valident la **structure** (3 distracteurs, pas de
  doublons d'options, ≥ 12 questions/banque scolaire, réponse présente) ; la
  revue humaine valide l'**exactitude** — les deux sont obligatoires.

## 6. Structure histoire / géographie

- **Scolaire** (`hist_sY_tT`, `geo_sY_tT`) : progression **du proche au
  lointain**, conforme au programme — famille/école → quartier/commune →
  wilaya → Algérie (symboles, 1er novembre 1954, figures nationales) →
  Maghreb/monde arabe → monde. Repères avant analyse : dates-clés,
  personnages, lieux.
- **Culture générale adulte** (`history`, `monuments`, `flags`, cartes) :
  organisation thématique et par continent ; références algériennes
  présentes et valorisées (histoire nationale, patrimoine).
- Les deux ne partagent **jamais** une banque : un fait historique destiné
  aux enfants est reformulé à leur niveau, pas recyclé du quiz adulte.

## 7. Règles de qualité

1. **Adapté à l'âge** : phrases courtes, vocabulaire du niveau ciblé,
   1 notion par question ; jamais de piège ambigu ni de double négation.
2. **Distracteurs** : plausibles mais indiscutablement faux ; jamais une
   deuxième réponse défendable ; en dictée, graphies fautives réalistes
   (ة/ه, ذ/ز, accents, doubles consonnes).
3. **Volumes minimaux** : ≥ 12 questions par banque scolaire (rotation sans
   répétition immédiate), ≥ 10 mots par banque de dictée.
4. **Charge cognitive** : sessions de 6–10 questions (PEDAGOGY.md §6) ; les
   leçons tiennent sur un écran (règles ≤ 4 points, exemples ≤ 3).
5. Toute banque nouvelle arrive **avec sa leçon** (`LESSONS`) — pas de
   pratique sans explication.

## 8. Notes d'implémentation

- Les banques vivent dans la section `10-data` du monofichier
  (ARCHITECTURE.md §2), enregistrées dans la map `BANKS` de
  `generateForCat()` ; les dictées dans `DICT_BANKS` ; les vrai/faux dans
  `TF` ; les leçons dans `LESSONS` ; les illustrations dans `ILLUS`.
- **Checklist « ajouter une banque »** :
  1. constante `SUBJ_S{y}_T{t}` via les constructeurs canoniques ;
  2. entrée dans `BANKS` ; 3. leçon dans `LESSONS` ; 4. ≥ 12 questions ;
  5. `npm test` vert ; 6. revue humaine (exactitude + doctrine) ; 7. PR.
- Le harnais (`tests/`) est le gardien structurel ; ce document est le
  gardien éditorial.
