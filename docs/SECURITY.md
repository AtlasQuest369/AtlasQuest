# AtlasQuest — Sécurité, vie privée & contrôle d'accès v1

> Équipe cybersécurité & vie privée. Ce document est **honnête sur le modèle
> de confiance** : AtlasQuest est une app monofichier hors-ligne sur un
> appareil familial partagé — la « vraie » frontière de sécurité est le
> backend ; les contrôles locaux sont des garde-fous d'usage, pas de la
> cryptographie.

---

## 1. Modèle de sécurité

**Trois zones de confiance :**

| Zone | Contenu | Niveau |
|---|---|---|
| **Appareil familial** | `userData` local, profils, PIN parent | garde-fous d'usage (l'appareil est partagé par la famille, le modèle de menace est l'enfant curieux, pas l'attaquant) |
| **Frontière réseau** | uniquement les 2 RPC Supabase (+ Pages pour l'app) | contrôle strict : **zéro requête depuis le Mode Enfant**, auto-save opt-in parental |
| **Backend Supabase** | table `backups` | **sécurité réelle** : RLS sans policy, RPC `security definer`, code-capacité UUID non énumérable, plafond 200 Ko |

**Principes** : surface d'attaque minimale (hors-ligne d'abord, zéro
dépendance runtime, zéro contenu distant) ; privacy by design (pas de compte,
pas d'email, pas de tracking) ; « ne pas se fier au client » ⇒ ne **rien**
mettre côté serveur qui suppose un client honnête (le serveur ne fait
confiance qu'au code famille exact et au plafond de taille).

## 2. Rôles et permissions

| Capacité | Enfant | Adulte | Parent (PIN) |
|---|---|---|---|
| Vues `child` (hub, leçons, ateliers, révision) | ✅ | ✅ | ✅ |
| Vues `adult` (quiz monde, classement, boutique) | ✅* | ✅ | ✅ |
| Publicité / liens externes | ❌ jamais | ✅ | ❌ dans l'espace parent |
| Tableau de bord, bulletin, partage | ❌ | ❌ | ✅ |
| Cloud (sauvegarde, restauration, auto-save) | ❌ | ❌ | ✅ |
| Profils (ajout, bascule, suppression) | ❌ | ❌ | ✅ |
| Réinitialisation de la progression | ❌ | ❌ | ✅ + confirmation |

\* produit familial sans session : la séparation enfant/adulte est une
séparation de **contenu et de flux** (registre `KIDS_CAT_RE`, table `ROUTES`),
pas d'authentification. La protection porte sur : l'argent, les données, la
publicité et les liens sortants — tous derrière le PIN parent.

## 3. Contrôle parental

- **PIN 4 chiffres** (haché localement) : garde d'accès à l'espace parent.
  Statut honnête : hash djb2 = **dissuasif**, pas cryptographique.
  Améliorations backlog : SHA-256 via WebCrypto + délai progressif après
  échecs (anti-essais répétés par l'enfant).
- **Jardin clos structurel** : `ROUTES` + `updateAdVisibility` (testés par la
  spec `isolation`) garantissent zéro pub/lien externe en vue enfant.
- **Opt-in réseau** : l'auto-save cloud est désactivée par défaut ; le parent
  l'active explicitement. Aucune requête réseau sinon.
- Suppression du profil actif impossible ; suppression = confirmation.

## 4. Règles de protection des données (minimisation)

1. **Aucune donnée nominative requise** : pas d'email, pas de nom de famille,
   pas de date de naissance. Le prénom du profil est optionnel, choisi par le
   parent, tronqué (20 car.) et **assaini** (`<>&"'` retirés).
2. **Cloud pseudonyme** : la sauvegarde est indexée par UUID aléatoire ; le
   serveur ne sait pas qui est l'enfant.
3. **Pas de télémétrie, pas d'analytics, pas de SDK tiers** — par conception.
4. Stockage local encodé base64 (`enc/dec`) : anti-manipulation légère,
   **pas du chiffrement** — le dire ainsi, ne jamais le vendre autrement.
5. La clé Supabase embarquée est la clé **publiable** (publique par
   conception) ; la `service_role` ne doit **jamais** apparaître dans le
   repo, l'app ou le chat.
6. Rétention : la donnée cloud vit tant que la famille la garde ;
   `resetChildProgress` + écrasement de sauvegarde = droit à l'effacement
   praticable.

## 5. Menaces et mitigations

| Menace | Mitigation en place | Reste à faire |
|---|---|---|
| Énumération des sauvegardes | RLS sans policy + RPC exigeant l'UUID exact | — |
| Abus de quota (spam RPC anonyme) | plafond 200 Ko/écriture | rate-limit Supabase si abus constaté |
| Enfant qui devine le PIN | dissuasion + rien de dangereux derrière (pas d'achat réel) | délai progressif, SHA-256 |
| XSS via saisies (prénom profil, code restauration) | assainissement des prénoms, validation stricte UUID du code | test dédié d'injection dans le harnais |
| Fuite de contenu adulte vers l'enfant | registre `KIDS_CAT_RE` + `ROUTES` + spec `isolation` | — |
| Supply chain | zéro dépendance runtime ; Tailwind inliné figé ; Playwright en dev only | — |
| Perte du code famille | — | v2 : compte parent email (récupération) |
| Manipulation locale du storage | assumée (données de jeu sur l'appareil familial) | — |

## 6. Tests de sécurité

**Déjà mécanisés (`npm test`)** : jardin clos pub/liens (spec `isolation`),
PIN refusé/accepté (spec `parent`), mot de dictée jamais dans le DOM,
réseau intégralement bloqué hors mock (contexte offline du harnais).

**Checklist à ajouter** :
- [ ] injection dans le prénom de profil (`<img onerror=…>`) → affichage inerte ;
- [ ] code de restauration non-UUID → rejeté sans requête ;
- [ ] délai progressif PIN après N échecs (quand implémenté) ;
- [ ] `grep` CI : absence de `service_role`, de clés `sb_secret_`, d'URL non
      déclarées.

## 7. Notes d'implémentation

Backlog sécurité priorisé : **(1)** test d'injection prénom, **(2)** délai
progressif PIN, **(3)** PIN en SHA-256 (WebCrypto, avec migration douce du
hash existant), **(4)** `userData.v` (version de schéma) avant la v2 cloud,
**(5)** grep CI anti-secrets. Chaque item = petite PR sur le harnais existant.
