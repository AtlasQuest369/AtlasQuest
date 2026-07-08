# CLAUDE.md — Guide de développement (Ines Kids & AtlasQuest)

> Mémoire projet lue automatiquement par Claude Code à chaque session.
> **Lire en entier avant d'agir.** Complété par `docs/INES-SESSION-HANDOFF.md`
> (architecture détaillée du contenu) et les autres docs de `docs/`.

## 1. Les deux applications

Le dépôt contient **deux apps** qui partagent le même moteur (contenu dupliqué —
voir Dette §7) :

| Fichier | App | Public | Thème |
|---|---|---|---|
| `ineskids/index.html` | **Ines Kids** | enfants 3–8 ans, familles | clair (`body.ines-app`), `var INES=true` |
| `index.html` (racine) | **AtlasQuest** | ados/adultes (géo-quiz gamifié) | sombre, `INES` absent |

- **PWA hors-ligne strictes** : tout est inline (HTML/CSS/JS), polices
  auto-hébergées (`ineskids/fonts/`), service worker (`ineskids/sw.js`, `sw.js`).
- Ines Kids : stockage `localStorage` = `ineskids_v1`. Langues **AR / FR / EN**
  (RTL arabe, drapeau algérien 🇩🇿). Aligné **programme MEN algérien**.
- AtlasQuest : `worldmap.js` (carte pays SVG), `img/monuments/*.svg` (24). **À
  préserver** — projet mis en pause, repris après le lancement d'Ines Kids.
- **Le garde anti-monétisation d'Ines Kids** (`switchView`) ne s'active que sous
  `INES=true` → AtlasQuest garde duel/boutique/classement/premium intacts.

## 2. Lancer les tests (obligatoire avant tout commit)

```bash
NODE_PATH=/opt/node22/lib/node_modules PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers npm test
```
→ **11 specs** doivent passer. Chromium : `/opt/pw-browsers/chromium`.
Ne pas lancer `playwright install`.

## 3. Modèle de contenu (catégories `subj_sANNÉE_tTRIM`)

- Matières : `ar, fr, en, math, sci, islam, civic, hist, geo`. Années 1–5, trim. 1–3.
- **Leçons** `LESSONS['fr_s4_t2']=L(titre, intro, [puces], [exemples])`.
- **Banques de questions** : `const NAME=[ {fr,en,ar,answer:{fr,en,ar},wrong:[×3]} ]`.
  Helpers (préfixent une émoji) : `frQ`🇫🇷 `enQ` `arq`📖 `mq`🔢 `sciQ`🔬 `iq`🕌
  `cq`🤝 `gq`🗺️. Enregistrées dans `BANKS={…}`.
- **Densification** : blocs `X.forEach(p=>p[0].push.apply(p[0],p[1]))` — pour
  enrichir une banque, éditer **la banque de base ET sa ligne de densification**.
- **Vrai/Faux** `TF['x']` (helper `sf(q, estVrai)`).
- **i18n** : objet `T={fr,en,ar}` + une table `id → clé` qui localise le DOM via
  `setLang(lang)`. Tout libellé visible doit passer par une clé (sinon fuite FR,
  cf. bug « Mon programme »). Numéraux : localiser (`1 2 3` FR/EN, `١ ٢ ٣` AR).

## 4. Système d'illustrations (100 % de couverture)

- `var ILLUS={ key:'<svg …>' }` (SVG inline hors-ligne) + `var ILLUS_FOR={ cat:'key' }`.
  Rendu dans `openLesson()` via `#lesson-illus`.
- **Règles anti-bug** : viewBox `0 0 320 180`, `width="100%"`, **toujours
  `text-anchor="middle"`** (en RTL, `end` déborde). Insérer les nouvelles entrées
  **avant l'ancre `hist_occupation:'`**. **Une seule catégorie = une seule entrée
  dans `ILLUS_FOR`** (les doublons : la dernière gagne — déjà vu avec `fr_s4_t2`).
- Vectoriel = HD par nature. Redessiner soi-même (jamais copier une image source).
- Maths en RTL : entourer les expressions d'isolats bidi `⁦ … ⁩` (LRI/PDI).

## 5. Méthode « photos → intégration »

Scan minutieux des photos → refondre la leçon avec le **contenu MEN authentique**
(remplacer le placeholder) → enrichir la banque (base + densification) →
ajouter/mapper une illustration SVG HD → **vérifs §2 + capture d'écran** →
commit + push. Versets coraniques : fragments courts, ultra-connus, relus au
rendu, **jamais** en réponse/distracteur.
> Astuce : si la conversation est saturée d'images, l'API refuse les nouvelles
> photos → **ouvrir une nouvelle session** (budget d'images remis à zéro).

## 6. Contraintes doctrinales & vie privée (NON négociable)

- **القدس (Al-Quds) = capitale de la Palestine.** **Sahara occidental** = droit à
  l'autodétermination, entité **distincte** (ne pas l'assimiler à un voisin).
- Drapeau algérien (vert/blanc + croissant+étoile **rouges**), **jamais** saoudien.
- Aucune pub dans le flux enfant. Pub récompensée = opt-in parent, OFF sans ID AdMob.
- **Jamais** intégrer le filigrane des fiches sources (nom/photo/téléphone de
  l'enseignante) — on n'extrait que le **contenu pédagogique**.
- Aucun secret dans le dépôt.

## 7. Dette technique connue (roadmap studio)

1. **Contenu dupliqué** entre `index.html` et `ineskids/index.html` → source unique.
2. **Pas de tokens de design** : couleurs en dur + 69 `!important` → système de tokens.
3. **Monolithe** 700 Ko inline → découpage / build.
4. **Navigation « Mon programme »** = accordéon infini → parcours « une décision/écran ».
> Priorité recommandée : tokens → purge code mort monétisation → dé-duplication.

## 8. Git & livraison

- Développer sur une branche `claude/…`, jamais directement sur `main`. Commits en
  **français**, descriptifs, terminés par le trailer `Co-Authored-By` + `Claude-Session`.
- **Ne jamais** écrire l'identifiant de modèle dans un commit / PR / code.
- Après push : ouvrir une **PR draft**. CI = workflow `tests.yml`.
- Build APK : `build-ineskids.yml` (workflow_dispatch) → artefact `InesKids-APK`.
  Release Play (AAB) : `release-ineskids.yml`. Keystores : workflows `generate-*`.
- Incrémenter `CACHE_NAME` (`ineskids-vN`) dans `sw.js` à chaque changement de contenu.

## 9. État actuel (juillet 2026)

Branches `main` et `studio-analysis` **réconciliées** (rien de perdu) : 152 leçons,
52 illustrations, « Mon programme » traduit AR, contenu MEN 4ᵉ année (Histoire, Géo,
Sciences, Civique, Islamique, Arabe, Français T1, Maths T2), `fr_s4_t2` authentique,
contrastes AA, quiz premium, bundle enfant sans monétisation.
**À venir** : cours T2/T3 4ᵉ année des autres matières (créneaux prêts) + roadmap §7.
