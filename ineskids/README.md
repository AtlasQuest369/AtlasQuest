# Ines Kids

Application enfant/famille dérivée d'AtlasQuest — **produit distinct**, univers clair et joyeux (cf. logo), portée par la mascotte **Ines** et la chaîne YouTube du même nom.

## État (fondation)

- App autonome dans `ineskids/index.html` — clé de stockage isolée `ineskids_v1`
  (aucune interférence avec AtlasQuest, même installées côte à côte).
- **Thème clair Ines** (`body.ines-app`) : fond crème, cartes blanches arrondies,
  couleurs du logo (magenta/jaune/vert/bleu). Le thème sombre d'AtlasQuest est neutralisé.
- **Démarre directement dans le hub enfant**, logo intégré, titre « Ines Kids ».
- **Sans pub**, **sans chrome adulte** (bottom-nav, vies, gemmes, boutique retirés de l'affichage).
- Moteur pédagogique complet réutilisé : programme MEN, 6 ateliers (dictée, phrases,
  tri, tables…), étoiles, répétition espacée, remédiation, espace parent, cloud, profils.

## Publication Play Store

Dossier complet de soumission : **`docs/PLAY-RELEASE.md`** (réponses Play Console
pré-remplies, fiche FR/EN/AR, Data Safety, Familles).

Pipeline & assets fournis :
- **`4 - Release Ines Kids (AAB Play Store)`** : AAB signé, Capacitor 7 / targetSdk 35, versionné.
- **`5 - Generate Ines Kids Keystore`** : clé de dépôt Ines dédiée.
- **`ineskids/privacy.html` + `terms.html`** : pages publiques (URL politique de confidentialité).
- **`ineskids/store/`** : icône 512, bannière 1024×500, 4 captures téléphone.

## Reste à faire (itérations suivantes)

1. Retirer physiquement le code adulte mort (allègement du binaire).
2. v1.1 : brancher les pubs récompensées familles (`INES_ADMOB.rewardedId`).
3. Extraction vers un repo GitHub dédié `ines-kids`.
