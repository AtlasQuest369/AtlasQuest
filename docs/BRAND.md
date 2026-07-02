# AtlasQuest — Stratégie de marque & croissance v1

> Équipe marque, marketing digital & growth. Une marque, trois expériences —
> jamais « une app pour enfants », jamais « un quiz de plus ».

---

## 1. Stratégie de marque

**Positionnement** : *AtlasQuest est la plateforme éducative de la famille —
l'école primaire algérienne pour les enfants, la culture générale pour les
adultes, le suivi pour les parents. Premium, hors-ligne, sans publicité pour
les enfants, et fière de ses racines algériennes.*

**Piliers** : 🎓 sérieux pédagogique (programme MEN, approche par
compétences) · 🛡️ confiance (jardin clos enfant, zéro donnée personnelle,
contrôle parental) · 🇩🇿 ancrage algérien (arabe langue première, repères
nationaux, gratuit et hors-ligne — pensé pour la réalité locale) ·
✨ qualité premium (design or/sombre, contenu vérifié, pas de pub intrusive).

**Preuves** (à utiliser dans toute communication) : fonctionne 100 % sans
Internet · aligné sur le programme officiel · aucun compte requis · les
enfants ne voient jamais de publicité · bulletin de compétences pour les
parents.

## 2. Segments cibles

1. **Le parent prescripteur (cœur de cible)** — 28-45 ans, smartphone
   Android milieu de gamme, data limitée, veut aider ses enfants à réussir
   à l'école. *Décide de l'installation.*
2. **L'enfant du primaire (5-11 ans)** — utilisateur quotidien du Mode
   Enfant. *Décide de la rétention.*
3. **L'adulte curieux** — joue aux quiz monde/histoire/drapeaux, souvent le
   même parent le soir. *Monétisable (pub) sans toucher aux enfants.*
4. **L'enseignant du primaire** (futur, P4) — prescripteur multiplicateur.

## 3. Message par mode

| Mode | Message | Ton |
|---|---|---|
| **Enfant** | « Apprends en jouant, avec Fennec ! » | chaleureux, encourageant, jamais culpabilisant |
| **Adulte** | « Combien de capitales connais-tu vraiment ? » | défi, élégance, fierté du savoir |
| **Parent** | « Suivez les progrès réels de vos enfants, matière par matière. » | sérieux, factuel, rassurant |
| **Marque ombrelle** | « Une seule application pour toute la famille. » | premium, familial |

## 4. Stratégie de croissance

- **Boucle organique n°1 — le bulletin partagé** : le parent partage le
  bulletin sur WhatsApp (déjà en prod) → chaque partage est une publicité
  authentique auprès d'autres parents. Ajouter le lien de l'app au message
  (fait) et soigner sa mise en forme.
- **Boucle n°2 — le code famille** : multi-appareils = l'app s'installe
  naturellement sur le téléphone des deux parents et la tablette.
- **Contenu marketing** (Facebook/TikTok DZ, où sont les parents) :
  « Le saviez-vous ? » histoire d'Algérie · mini-défis de tables de
  multiplication filmés · témoignages de parents · captures du bulletin.
- **Canaux gratuits d'abord** : groupes Facebook de parents d'élèves,
  bouche-à-oreille enseignants ; pas d'achat média avant le product-market
  fit mesuré par la rétention.

## 5. Stratégie de rétention

Déjà en produit (les mécaniques SONT la rétention) : objectif quotidien
(3 sessions, gemmes) · répétition espacée (raison de revenir demain) ·
étoiles/badges/paliers · mascotte Fennec. À venir : notification locale
douce de révision (« 3 compétences à revoir aujourd'hui ») — locale,
jamais un canal marketing ; résumé hebdomadaire pour le parent.

## 6. Stratégie App Store / Play Store

- **Nom** : AtlasQuest — École & Quiz Famille (à tester : الأطلس التعليمي).
- **Screenshots** : 1 « toute la famille » (3 modes) → 2-3 Mode Enfant
  (hub, dictée, étoiles) → 4 bulletin parent → 5 quiz adulte. Versions AR
  et FR des captures.
- **Mots-clés** : تعليم ابتدائي، برنامج المدرسة الجزائرية, école primaire
  Algérie, jeux éducatifs arabe, quiz culture générale, hors-ligne.
- **Catégorie** : Éducation (pas Jeux). Classification contenu : famille.
- **Description** : ouvrir par le parent (« Aidez vos enfants à réussir le
  programme officiel »), pas par l'enfant — c'est le parent qui lit le store.
- Le pipeline APK existe déjà (`build-android.yml`) : la release store est
  une décision produit, pas un chantier technique.

## 7. Risques de marque

| Risque | Parade |
|---|---|
| Être perçu comme « app pour enfants » only | toujours montrer les 3 modes ; le quiz adulte en screenshot |
| Être perçu comme « encore un quiz » | mettre en avant compétences, bulletin, programme officiel |
| Promesse sécurité trahie par une pub mal placée | le jardin clos est testé par CI — en faire un argument public |
| Sur-promesse pédagogique | ne jamais promettre de notes ; promettre la visibilité des progrès |
| Incohérence AR/FR dans la comm | glossaire de terminologie (CONTENT-MODEL.md §4) appliqué au marketing |

## 8. Notes d'implémentation

Le produit contient déjà ses meilleurs arguments marketing — la priorité
n'est pas de créer des assets mais de **les rendre visibles** : (1) soigner
le texte du bulletin partagé (c'est notre publicité), (2) préparer 5
captures store par langue, (3) une page « Pourquoi AtlasQuest » dans l'app
(confiance parent), (4) mesurer la rétention avant tout investissement payant.
