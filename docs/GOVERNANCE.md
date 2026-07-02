# AtlasQuest — Gouvernance & standards d'ingénierie v1

> Équipe gouvernance. Les règles permanentes du projet — pratiques, courtes,
> vérifiables. Ce document renvoie aux référentiels spécialisés plutôt que de
> les dupliquer : ARCHITECTURE.md, DESIGN-SYSTEM.md, PEDAGOGY.md,
> CONTENT-MODEL.md, SECURITY.md, QA-RELEASE.md.

---

## 1. Principes de gouvernance

1. **La doctrine n'est pas négociable** : capitale de la Palestine = القدس ;
   Sahara occidental distinct (autodétermination) ; Israël non jouable ;
   contenu scolaire aligné MEN. Vérifiée à chaque revue de contenu.
2. **Hors-ligne d'abord** : aucune fonctionnalité ne doit exiger le réseau
   pour apprendre ; aucune requête depuis le Mode Enfant sans opt-in parental.
3. **Ne rien casser** : la progression des enfants est sacrée — changements
   de schéma additifs uniquement, jamais de renommage/suppression de champ.
4. **Incrémental, jamais de big-bang** : chaque PR est petite, testée,
   réversible par revert.
5. **Une source de vérité par sujet** : registre de contenu, table de routes,
   tokens de couleur, glossaire — on étend la source, on ne duplique pas.

## 2. Règles de code et de nommage

- **Style** : vanilla JS du fichier (pas de framework, pas de build) ;
  `var`/fonctions déclarées pour tout code exécuté au chargement (pas de TDZ) ;
  try/catch autour de tout accès storage/JSON.
- **Nommage** (obligatoire) : `kids*` domaine enfant · `render*` présentation
  pure · `cloud*` services cloud · `prof*` profils · `ord/sort/dict/mult`
  ateliers · banques `SUBJ_S{année}_T{trimestre}` · catégories dans
  `KIDS_CAT_RE` uniquement.
- **UI** : couleurs via tokens CSS ; classes Tailwind existantes seulement ;
  composants conformes à DESIGN-SYSTEM.md §3-4 (marqueurs par mode).
- **Interdits** : dépendance runtime ; contenu distant ; `innerHTML` avec
  saisie utilisateur non assainie ; duplication du motif de catégories ;
  secret dans le repo (seule la clé *publiable* Supabase est autorisée).

## 3. Workflow Git et revue

- **Branche de travail → PR → CI verte → merge par le propriétaire.**
  Jamais de push direct sur `main`. Une PR = un sujet (feature, contenu,
  consolidation) ; si deux sujets s'empilent (branche unique), le titre et
  la description l'assument explicitement.
- **Message de commit** : première ligne = quoi + où (français) ; corps =
  pourquoi + vérifications.
- **Checklist de revue** :
  - [ ] `npm test` vert (CI) ; nouvelle feature ⇒ nouvelle spec ou spec étendue ;
  - [ ] doctrine et jardin clos intacts (aucune pub/lien externe côté enfant) ;
  - [ ] i18n : les 3 langues pour tout texte UI (`T`/`PT`) ; RTL vérifié si UI ;
  - [ ] schéma `userData` : changements additifs only ;
  - [ ] taille : +20 Ko max sauf contenu pédagogique justifié ;
  - [ ] docs/ mis à jour si architecture, design ou contenu-modèle changent.

## 4. Gouvernance des releases

- **Web (Pages)** : chaque merge sur `main` déploie — donc *chaque merge est
  une release* ; la checklist QA-RELEASE.md §4 s'applique aux merges à
  risque (feature majeure, schéma, cloud).
- **APK/Store** : release explicite, décidée par le propriétaire ;
  versionCode incrémenté ; test sur 2 appareils réels ; les gates de
  sécurité (§6) passées.
- **Rollback** : `git revert` du merge + consigne fermer/rouvrir (SW).

## 5. Gouvernance du contenu

Référentiel : CONTENT-MODEL.md. Résumé opérationnel : tout contenu passe par
PR ; sources vérifiables (manuels MEN / références standard) ; trilingue ou
langue du programme ; glossaire de terminologie respecté ; ≥ 12 questions par
banque scolaire, leçon obligatoire (mécanisé dans le smoke) ; doctrine
vérifiée par un humain à chaque revue de contenu.

## 6. Gates de sécurité (avant release)

- [ ] Aucun secret (`sb_secret_`, `service_role`, keystore) dans le diff ;
- [ ] Aucune nouvelle requête réseau hors RPC cloud déclarés ;
- [ ] Jardin clos enfant vérifié (spec `isolation` verte) ;
- [ ] Entrées utilisateur nouvelles → assainies + validées ;
- [ ] Permissions : toute opération sensible nouvelle est derrière le PIN.

## 7. Gates de qualité (avant merge)

- [ ] CI `tests / e2e` verte (bloquant de fait — à promouvoir en *required
      check* dans les réglages GitHub du repo) ;
- [ ] Parse-check inclus (spec `smoke`) ;
- [ ] Feature enfant ⇒ intégrée au registre + leçon + spec ;
- [ ] Pas de régression du budget de taille.

## 8. Recommandations finales

1. **Marquer `tests / e2e` comme required check** dans les réglages GitHub
   (Settings → Branches → main) — 1 minute, et plus aucun merge rouge possible.
2. Adopter un **CHANGELOG.md** léger (une ligne par PR mergée) quand les
   releases APK commenceront.
3. Relire ce document à chaque changement structurel majeur (backend v2,
   espace enseignant) — la gouvernance suit le produit, pas l'inverse.
