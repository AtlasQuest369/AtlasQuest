# AtlasQuest Cloud — Installation du backend (5 minutes, depuis un téléphone)

AtlasQuest Cloud v1 permet la **sauvegarde multi-appareils** de la progression
de l'enfant, via un **code famille** secret affiché dans l'Espace Parent.

- **Coût : 0 DA/mois** (palier gratuit Supabase : 500 Mo de base de données,
  largement suffisant — une sauvegarde AtlasQuest pèse quelques Ko).
- **Aucun serveur à gérer** : Supabase héberge tout.
- **Confidentialité** : la table est inaccessible en direct (RLS sans policy) ;
  seul le code famille exact permet de lire/écrire UNE sauvegarde. Pas d'email,
  pas de compte enfant, pas de donnée nominative obligatoire.
- **Hors-ligne préservé** : tant que le backend n'est pas configuré, l'app
  n'émet AUCUNE requête réseau ; le Mode Enfant n'y accède jamais (la
  fonctionnalité vit dans l'Espace Parent, protégé par PIN).

## Étapes (navigateur du téléphone)

1. Ouvrir **https://supabase.com** → *Start your project* → créer un compte
   (Google ou email).
2. **New project** :
   - Name : `atlasquest`
   - Database password : en générer un et le garder (il ne sert qu'à l'admin)
   - Region : `West EU (Paris)` (le plus proche de l'Algérie)
   - Plan : **Free**
3. Attendre ~2 min que le projet démarre.
4. Menu latéral → **SQL Editor** → *New query* → coller tout le contenu de
   [`supabase/schema.sql`](../supabase/schema.sql) → **Run**.
   Résultat attendu : `Success. No rows returned`.
5. Menu latéral → **Project Settings → API** et copier ces 2 valeurs :
   - **Project URL** (ex. `https://abcdefgh.supabase.co`)
   - **anon public key** (longue chaîne `eyJ...`)
6. Transmettre ces 2 valeurs au studio (ou les renseigner soi-même dans
   `index.html`, objet `CLOUD` : `var CLOUD={url:'…',key:'…'};`).

> ℹ️ La clé `anon` est **conçue pour être publique** (elle est embarquée dans
> toute app Supabase côté client). La sécurité des données repose sur les
> règles RLS + fonctions RPC du schéma, pas sur le secret de cette clé.

## Ce que ça active dans l'app

Dès que `CLOUD` est renseigné, l'Espace Parent affiche une section
**☁️ Sauvegarde Cloud** :

- **Code famille** (UUID généré localement, à garder secret) ;
- **☁️ Sauvegarder maintenant** : envoie la progression dans le cloud ;
- **Restaurer avec un code famille** : sur un nouvel appareil, saisir le code
  pour récupérer toute la progression.

## Feuille de route backend

| Version | Fonction | Infra requise |
|---|---|---|
| **v1 (cette étape)** | Sauvegarde/restauration par code famille | Table + 2 RPC |
| v2 | Compte parent (email) multi-enfants | Supabase Auth |
| v3 | Espace enseignant : classes, codes élèves, tableau de bord | Tables classes/élèves + RLS par rôle |
