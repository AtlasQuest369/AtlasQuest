# AtlasQuest — Audit visuel & montée en gamme (studio)

> Audit demandé : « application haut de gamme, visuel haute résolution,
> séparation nette enfant/adulte ». Ce document liste les constats, ce qui est
> **fait**, et le plan priorisé restant.

## Méthode

L'app est monofichier, hors-ligne, sur téléphone Android d'entrée de gamme.
« Haute résolution » ⇒ **vectoriel (SVG)** partout : net à toute densité
d'écran, zéro asset lourd, zéro réseau. Le levier n'est pas le format mais la
**qualité du dessin** et la **cohérence du système**.

## Constats & statut

| # | Constat | Gravité | Statut |
|---|---|---|---|
| 1 | Monuments = scribbles ~250 o ; 5 sans image (texte brut) | 🔴 | ✅ Fait (PR #64) — 24 redessinés, style unifié |
| 2 | Enfant et adulte partagent le même habillage (fond noir + or) → pas de séparation ressentie | 🟠 | ✅ Fait — thème `kids-mode` (fond sarcelle + bulles pastel, boutons ronds à relief, sans pub) |
| 3 | Illustrations de leçons enfant (`ILLUS`) hétérogènes (qualité variable) | 🟠 | ⏳ À faire — passer au même standard que les monuments |
| 4 | Cartes de catégories adultes : émojis + fonds génériques | 🟡 | ⏳ À faire — illustrations vectorielles dédiées par catégorie |
| 5 | Mascotte Fennec : présence limitée au hub enfant | 🟡 | ⏳ À faire — états animés (réussite, encouragement) dans le parcours enfant |
| 6 | Écran de résultats identique enfant/adulte | 🟡 | Partiel — hérite du thème `kids-mode` ; peut être enrichi (récompense enfant dédiée) |
| 7 | `prefers-reduced-motion` | 🟢 | ✅ Fait (PR #53) |

## Système de séparation enfant / adulte (fait)

Choke point unique : `switchView()` bascule `body.kids-mode` selon le mode.

- **Adulte** : fond quasi-noir + particules dorées, boutons anguleux, or/cyan,
  Playfair — sobre, mature, premium.
- **Enfant** : fond bleu-sarcelle chaleureux + bulles pastel (mint/corail/ciel),
  boutons arrondis (rayon 20 px) avec relief tactile, barre de progression
  mint→cyan, **jamais de publicité**.
- **Parent** : reste neutre (ni thème enfant, ni particules ludiques).

Garde-fou : la spec `isolation` vérifie que `kids-mode` s'applique au hub et au
quiz enfant, et **jamais** en mode adulte ni dans l'espace parent.

## Plan priorisé restant (à exécuter par incréments testés)

1. **Illustrations de leçons enfant** (`ILLUS`) au standard monuments —
   fort impact pédagogique, même méthode (panneau, palette, détail).
2. **Cartes de catégories adultes** — illustrations vectorielles dédiées
   (drapeaux, capitales, histoire…) plutôt qu'émoji + fond plat.
3. **Mascotte Fennec animée** — états (idle, cheer, think) présents aux moments
   clés du parcours enfant (bonne réponse, fin de quiz).
4. **Écran de résultats enfant dédié** — récompense visuelle distincte de
   l'adulte (coffre, étoiles animées) sous `kids-mode`.

Chaque incrément : une PR, une spec, CI verte, aperçu visuel partagé.
