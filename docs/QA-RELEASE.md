# AtlasQuest — Qualité, performance & releases v1

> Équipe QA, ingénierie de performance & release management. Priorité aux
> parcours réels sur la couverture théorique — le harnais existant teste des
> flux utilisateur complets, pas des unités isolées.

---

## 1. Stratégie de qualité

**Pyramide inversée assumée** : sur une app monofichier sans build, les tests
les plus rentables sont les **e2e hors-ligne sur parcours réels** (déjà 9
specs), complétés par des **vérifications structurelles** (parse-check,
conformité ROUTES/leçons/banques) intégrées aux mêmes specs. Pas de framework
de tests unitaires séparé tant que le domaine pur n'est pas regroupé (étape 6
du plan d'architecture).

**Ce que le harnais protège aujourd'hui** : boot, onboarding, quiz enfant
complet, étoiles best-of, répétition espacée, remédiation avec leçon,
séparation enfant/adulte (pub, liens), PIN parent, cloud (payload vérifié),
profils multi-enfants (reload réels), 4 ateliers, exactitude arithmétique
des tables. **CI sur chaque PR** (~50 s).

## 2. Plan de tests (priorités)

| Priorité | Axe | Statut |
|---|---|---|
| P0 | Parcours enfant complet + progression correcte | ✅ specs `kids`, `tables`, `dictation`, `wordorder`, `sorting` |
| P0 | Séparation enfant/adulte/parent | ✅ specs `isolation`, `parent` + table ROUTES vérifiée |
| P0 | Intégrité cloud (sauvegarde/restauration) | ✅ spec `parent` (mock), test réel : manuel sur appareil |
| P1 | Multilingue : les 3 interfaces bootent et jouent | 🔶 partiel (FR testé de bout en bout) — à ajouter : boucle ar/en sur le parcours kids |
| P1 | Injection/validation des entrées (prénom, code) | 🔶 backlog SECURITY.md |
| P2 | RTL visuel (miroir, isolats) | manuel sur appareil |
| P2 | Migration de schéma `userData` | à créer avec `userData.v` |

**Validation de contenu** (mécanisée) : structure des banques, ≥ options
uniques, leçon obligatoire par catégorie atelier, exactitude des tables.
L'exactitude éditoriale reste une revue humaine (CONTENT-MODEL.md §5).

## 3. Plan de performance

Budgets (mesurés sur téléphone Android d'entrée de gamme, cible du marché) :

| Métrique | Budget | État |
|---|---|---|
| Taille `index.html` | **< 1 Mo** (alerte à 900 Ko) | ~700 Ko |
| Démarrage à froid (TTI) | < 3 s sur appareil bas de gamme | à mesurer par release |
| Webfonts | 3 familles max, jamais plus | ✅ figé |
| Réseau au démarrage | 0 requête bloquante (SW cache-first) | ✅ |
| Mémoire quiz | pas de fuite sur 50 questions (recovery inclus) | couvert indirectement par e2e |

Règle : toute PR qui ajoute > 20 Ko doit le justifier (contenu pédagogique
= oui ; bibliothèque = non).

## 4. Checklist de release

1. ✅ CI verte (`npm test`, 9+ specs) sur la PR finale ;
2. ✅ Smoke test manuel sur téléphone : boot AR/FR/EN, un quiz enfant, un
   atelier, Espace Parent (PIN + bulletin), sauvegarde cloud réelle ;
3. ✅ Vérifier le déploiement Pages (run `pages build and deployment` vert) ;
4. ✅ PWA : fermer/rouvrir l'app → la nouvelle version arrive (cache SW) ;
5. ✅ Doctrine : recherche rapide القدس / Sahara occidental inchangés ;
6. Pour une release APK : pipeline `build-android.yml`, test d'installation
   sur appareil, versionCode incrémenté.

## 5. Rollback et surveillance

- **Rollback** = `git revert` du merge fautif sur `main` → Pages redéploie
  (~1 min). Le SW cache-first implique : prévenir l'utilisateur de
  fermer/rouvrir l'app. Pas de schéma de données à rétro-migrer tant que les
  migrations `userData` restent additives (règle : **ne jamais renommer ni
  supprimer un champ**, seulement ajouter).
- **Surveillance** : pas d'analytics par choix de vie privée. On surveille :
  (1) le dashboard Supabase (croissance de `backups`, erreurs RPC),
  (2) les runs Pages/CI, (3) les retours utilisateurs. Si un crash-tracker
  devient nécessaire un jour, il sera opt-in et anonyme — décision produit.

## 6. Risques

| Risque | Gravité | Parade |
|---|---|---|
| Cache SW servant une vieille version après release | 🟠 | consigne fermer/rouvrir ; versionner le cache SW à chaque release |
| Parcours AR/EN moins testés que FR | 🟠 | P1 du plan : boucle multilingue dans la spec kids |
| Croissance du fichier vers 1 Mo | 🟡 | budget + alerte ; issue de secours build documentée |
| Données locales corrompues (localStorage plein) | 🟡 | try/catch systématiques déjà en place ; futur : détection + proposition de restauration cloud |
| Suppression accidentelle par l'enfant | 🟢 | actions destructives derrière PIN + confirmation |

## 7. Recommandations pour la prochaine release

1. Ajouter la **boucle multilingue** à la spec `kids` (P1 le plus rentable) ;
2. **Versionner le cache du service worker** pour fiabiliser les mises à jour ;
3. Introduire `userData.v` avant tout changement de schéma (prérequis v2 cloud) ;
4. Première **release APK candidate** via le pipeline existant, testée sur
   2 appareils réels (bas + milieu de gamme) avant toute soumission store.
