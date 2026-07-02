# AtlasQuest — Modèle pédagogique v1 (cycle primaire algérien)

> Équipe pédagogie — spécification du modèle d'apprentissage par compétences,
> aligné sur l'approche par compétences (APC) du programme officiel du
> Ministère de l'Éducation Nationale (MEN). Ce document codifie et étend les
> mécaniques déjà en production.

---

## 1. Principes pédagogiques

1. **Approche par compétences (APC)** — on ne « finit » pas un chapitre, on
   **maîtrise une compétence**, conformément à la pédagogie officielle du
   primaire algérien.
2. **L'erreur est un matériau** — jamais punitive : chaque erreur déclenche
   explication → remédiation → renforcement (voir §4).
3. **Apprendre avant de pratiquer** — chaque bloc a sa leçon illustrée
   (règle 📌 + exemples 💡 + SVG) ; le quiz vérifie, il n'enseigne pas seul.
   *C'est ce qui distingue AtlasQuest d'un moteur de quiz.*
4. **Sessions courtes, régularité longue** — 6 à 10 questions par session,
   objectif quotidien de 3 sessions ; la régularité prime sur le volume.
5. **Apprentissage visible** — l'enfant voit ses étoiles, son objectif du
   jour, ses révisions ; le parent voit le bulletin. Rien n'est caché.
6. **Encouragement constant** — mascotte Fennec, célébrations calibrées
   (confettis à la réussite seulement), jamais d'écran d'échec rouge.

## 2. Modèle de compétence

Hiérarchie (implémentée) :

```
Année (1–5) → Matière (7 + FR/EN + dictée) → Trimestre (1–3)
  → BLOC DE COMPÉTENCE  (= catégorie `{matière}_s{année}_t{trimestre}`)
      → items (questions), tous rattachés au bloc
      → leçon du bloc (LESSONS[bloc] : règles + exemples + illustration)
```

- **Chaque question appartient à exactement un bloc de compétence** — le lien
  question→compétence exigé par le modèle est structurel (l'appartenance à la
  banque), pas déclaratif : impossible d'avoir une question orpheline.
- Matières : اللغة العربية، الرياضيات، التربية العلمية، التربية الإسلامية،
  التربية المدنية، التاريخ، الجغرافيا (+ cours FR/EN, + dictée par langue).
- Granularité plus fine (micro-compétences intra-trimestre) : évolution
  possible via un tag `comp` par question — non nécessaire en v1.

## 3. Modèle de progression

États d'un bloc (implémentés dans `kidsCompState`) :

| État | Condition | Visuel |
|---|---|---|
| **Nouveau** | jamais joué | carte neutre |
| **En cours** | ≥ 1 % de réussite (1★) | 1 étoile |
| **Acquis** | ≥ 50 % (2★) | 2 étoiles |
| **Maîtrisé** | ≥ 80 % (3★) | 3 étoiles or |
| **À revoir** | échéance de révision atteinte | badge 🔁 |

- Les étoiles sont **best-of** (jamais reprises) : la progression ne recule
  pas, seule l'échéance de révision revient.
- Agrégations visibles : % par matière (bulletin + espace parent), paliers
  bronze/argent/or par matière (badges), objectif quotidien (3 sessions).

## 4. Modèle de remédiation

Après **chaque** erreur, trois temps (implémentés) :

1. **Expliquer** (immédiat) : carte de correction montrant la bonne réponse
   + 📌 la règle (2 premiers points de la leçon du bloc) + 💡 un exemple.
2. **Remédier** (même session) : jusqu'à **3 questions de renfort** inédites
   injectées en temps réel dans la session (`recoveryAdded`) — l'enfant
   repratique immédiatement la compétence fragile.
3. **Renforcer** (lendemain) : le bloc raté revient en révision à J+1
   (voir §5) ; la difficulté adaptative (§ difficulté) réduit la taille des
   sessions suivantes pour reconsolider.

Ton : la correction est encourageante (💡, jamais ❌ plein écran) ; en dictée
et langues, l'enfant peut ré-écouter le mot.

## 5. Modèle de révision (répétition espacée)

Intervalles par bloc, fonction de la maîtrise (implémentés) :

| Étoiles à la dernière session | Prochaine révision |
|---|---|
| 3★ | **J+7** |
| 2★ | **J+3** |
| 0–1★ | **J+1** |

- File de révision dédiée (bouton 🔁 du hub, compteur d'échéances) ; une
  révision est une session normale — la réussite repousse l'échéance, l'échec
  la rapproche.
- Le parent voit le nombre de compétences à revoir dans son tableau de bord.
- Principe : **la maîtrise s'entretient** — un bloc 3★ révisé à J+7 reste
  vivant au lieu d'être oublié.

## 6. Modèle d'évaluation

- **Formative et continue** : chaque session évalue ; il n'existe pas
  d'« examen » séparé au primaire — conforme à l'esprit APC.
- Barème simple et constant : ≥ 80 % = 3★, ≥ 50 % = 2★, ≥ 1 % = 1★.
- **Anti-triche proportionné** : plancher de temps (3 s/question) pour
  invalider le zapping ; pas de surveillance au-delà.
- **Difficulté adaptative** : taille de session selon l'état du bloc —
  nouveau/en cours = 6 questions, acquis = 8, maîtrisé = 10 (défi de
  consolidation annoncé) ; + questions de renfort après erreur (§4).
- L'objectif quotidien (3 sessions, +15 💎) évalue la **régularité**, pas la
  performance.

## 7. Visibilité parent / enseignant

- **Parent (en production)** : espace protégé par PIN — % de maîtrise par
  matière, top-3 des points à renforcer, compétences à revoir, activité
  (sessions, série, dernière activité), **bulletin partageable**
  (WhatsApp/presse-papiers), profils par enfant, sauvegarde cloud.
- **Enseignant (phase P4, nécessite le backend v3)** : classes, codes élèves,
  tableau de bord de classe (distribution de maîtrise par compétence),
  export. Le modèle de données actuel (blocs de compétence) est déjà
  compatible — aucune refonte à prévoir.

## 8. Notes d'implémentation

Correspondance modèle ↔ code (état : en production) :

| Concept | Code |
|---|---|
| Bloc de compétence | catégorie `subj_sY_tT` / `dict_*` (`KIDS_CAT_RE`) |
| Étoiles / états | `userData.kids_stars`, `kidsCompState()` |
| Répétition espacée | `userData.kids_review`, `reviewInterval()`, `kidsDueList()` |
| Remédiation immédiate | `showFact()` + `LESSONS[cat]` |
| Renfort temps réel | `recoveryAdded` (max 3) dans `selectAnswer()` |
| Difficulté adaptative | `kidsAdaptiveCount()` |
| Objectif quotidien | `kidsGoalGet/Bump()` |
| Bulletin / paliers | `kidsSubjStars()`, `kidsSubjTier()`, vue `view-kidsreport` |
| Point d'écriture unique | `endQuiz()` (ARCHITECTURE.md §5.3) |

Invariants protégés par le harnais (`npm test`) : étoiles best-of, révision
planifiée après session, mot de dictée jamais affiché, jardin clos sans pub.
