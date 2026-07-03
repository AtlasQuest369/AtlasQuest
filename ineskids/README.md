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

## Reste à faire (itérations suivantes)

1. Retirer physiquement le code adulte mort (allègement du binaire).
2. Espace parent : y loger le lien YouTube + la future pub récompensée (opt-in, SDK familles certifié, non personnalisée).
3. Écran de résultats enfant dédié + mascotte Ines en héroïne (Fennec en compagnon).
4. Icônes/splash à partir de `icon-512.png` ; workflow de build Android dédié
   (appId `com.ineskids.app`, keystore propre — nécessite génération côté propriétaire).
5. Extraction vers un repo GitHub dédié `ines-kids`.

## Build

À terme : pipeline Capacitor 7 / targetSdk 35, `webDir` = ce dossier, appId `com.ineskids.app`.
