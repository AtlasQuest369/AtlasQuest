# Ines Kids — Dossier de publication Google Play

> Dossier studio prêt-à-soumettre. Chaque réponse du Play Console est
> pré-remplie. Ce qui est **[TOI]** exige une action du propriétaire du compte
> (compte payant, upload, secrets). Tout le reste (build, textes, assets,
> conformité) est fourni.

**App** : Ines Kids · **Package** : `com.ineskids.app` · **Catégorie** : Éducation
**Public** : enfants 3–8 ans · **Programme** : *Designed for Families*
**Modèle v1** : gratuit, **sans publicité**, sans achat intégré, sans compte.

---

## 0. Pré-requis [TOI]

- [ ] Compte **Google Play Console** (frais unique 25 $).
- [ ] Compte développeur vérifié (identité + adresse — obligatoire depuis 2023).
- [ ] Accès en écriture au dépôt GitHub (pour créer les secrets).

---

## 1. Clé de signature (upload key + Play App Signing)

Play gère la clé d'app finale (**Play App Signing**) ; toi tu signes chaque
envoi avec une **clé de dépôt** dédiée.

1. Lance le workflow **« 5 - Generate Ines Kids Keystore »** (onglet Actions).
2. Télécharge l'artefact `INES-KEYSTORE-A-SAUVEGARDER`, **sauvegarde-le hors GitHub** (perte = plus de mises à jour possibles).
3. Crée 4 secrets GitHub (Settings → Secrets and variables → Actions), valeurs dans `LISEZ-MOI-INES.txt` :
   - `INES_KEYSTORE_BASE64`, `INES_KEYSTORE_PASSWORD`, `INES_KEY_ALIAS`, `INES_KEY_PASSWORD`

> Tant que ces secrets n'existent pas, le build retombe sur la clé de test
> partagée (utile pour valider, **à ne pas utiliser pour le dépôt final**).

---

## 2. Construire l'AAB signé

1. Lance **« 4 - Release Ines Kids (AAB Play Store) »**.
   - `versionName` = `1.0.0` · `versionCode` = `1` (incrémenter à chaque dépôt).
2. Récupère l'artefact **`InesKids-AAB-Play`** → `app-release.aab` (fichier à déposer).
   - `InesKids-APK-test` sert seulement au test sur téléphone.

Config technique produite : Capacitor 7, `targetSdk 35` / `compileSdk 35`,
`minSdk 23`, icône adaptative logo Ines, signé.

---

## 3. Créer l'app dans Play Console [TOI]

- **Nom** : `Ines Kids`
- **Langue par défaut** : Français (France) — `fr-FR`
- **App ou jeu** : Application · **Gratuit ou payant** : Gratuit
- Déclarations : accepter les règles Play + lois export US.

---

## 4. Fiche du Store (à copier-coller)

### Français (fr-FR)
- **Titre** (≤30) : `Ines Kids`
- **Description courte** (≤80) :
  `Éveil et apprentissage pour les 3–8 ans : langues, chiffres, sciences, monde.`
- **Description complète** (≤4000) :
```
Ines Kids est une application éducative joyeuse et bienveillante, pensée pour les enfants de 3 à 8 ans et guidée par la mascotte Ines.

🌈 CE QUE L'ENFANT APPREND
• Les langues : français, anglais et arabe
• Les chiffres, les tables et le calcul en douceur
• Les sciences, la nature et la découverte du monde
• La lecture, les phrases et la dictée audio

⭐ UNE EXPÉRIENCE PENSÉE POUR LES PETITS
• Interface claire, colorée et sans distraction
• Grandes tuiles, icônes lisibles, retour à l'accueil en un geste
• Étoiles et encouragements positifs (jamais de pression)
• Contenu aligné sur le programme scolaire

👨‍👩‍👧 CONÇUE POUR LES FAMILLES
• Sans publicité, sans achat intégré, sans compte
• Espace parent protégé par code : langue, niveau, suivi de progression
• Aucune donnée personnelle collectée — tout reste sur l'appareil
• Fonctionne hors-ligne

Ines Kids accompagne l'enfant pas à pas, à son rythme, dans un univers rassurant.
```

### English (en-US)
- **Title** : `Ines Kids`
- **Short** : `Fun early learning for ages 3–8: languages, numbers, science, the world.`
- **Full** :
```
Ines Kids is a joyful, caring educational app for children aged 3 to 8, guided by the mascot Ines.

🌈 WHAT YOUR CHILD LEARNS
• Languages: French, English and Arabic
• Numbers, times tables and gentle math
• Science, nature and discovering the world
• Reading, sentences and audio dictation

⭐ DESIGNED FOR LITTLE ONES
• Clean, colorful, distraction-free interface
• Big tiles, readable icons, one-tap home
• Stars and positive encouragement (never pressure)
• Content aligned with the school curriculum

👨‍👩‍👧 MADE FOR FAMILIES
• No ads, no in-app purchases, no account
• Code-protected parent area: language, level, progress tracking
• No personal data collected — everything stays on the device
• Works offline

Ines Kids supports your child step by step, at their own pace, in a reassuring world.
```

### العربية (ar)
- **العنوان** : `Ines Kids`
- **وصف قصير** : `تعلّم مرح للأعمار 3–8: لغات، أرقام، علوم واكتشاف العالم.`
- **وصف كامل** :
```
Ines Kids تطبيق تعليمي مرح ولطيف للأطفال من 3 إلى 8 سنوات، تقوده الشخصية إيناس.

🌈 ماذا يتعلّم طفلك
• اللغات: الفرنسية والإنجليزية والعربية
• الأرقام وجداول الضرب والحساب المبسّط
• العلوم والطبيعة واكتشاف العالم
• القراءة والجُمل والإملاء الصوتي

⭐ مصمَّم للصغار
• واجهة واضحة وملوّنة وبلا تشتيت
• أزرار كبيرة وأيقونات واضحة وعودة للرئيسية بلمسة
• نجوم وتشجيع إيجابي (بلا ضغط)
• محتوى متوافق مع المنهاج الدراسي

👨‍👩‍👧 صُمِّم للعائلات
• بلا إعلانات، بلا مشتريات، بلا حساب
• مساحة والدين محمية برمز: اللغة، المستوى، متابعة التقدّم
• لا جمع لأي بيانات شخصية — كل شيء يبقى على الجهاز
• يعمل دون اتصال

يرافق Ines Kids طفلك خطوة بخطوة، حسب إيقاعه، في عالم مطمئن.
```

---

## 5. Assets graphiques

Fournis dans `ineskids/store/` (voir `ineskids/store/README.md`) :
- **Icône** 512×512 (PNG 32-bit) → `icon-512.png`
- **Image mise en avant** 1024×500 → `feature-graphic.png`
- **Captures téléphone** (≥2, 1080×… portrait) → `screenshot-*.png`

> Icône et bannière reprennent le logo Ines sur fond crème (identité produit).

---

## 6. Classification du contenu (questionnaire IARC) [TOI]

App **éducative pour enfants**, aucun contenu sensible. Réponses :
- Catégorie : **Application** → **Éducation / Références**.
- Violence, sang, sexualité, nudité, grossièretés, drogues, jeux d'argent, peur : **Non** partout.
- Interactions : partage de localisation → **Non** ; contenu généré par l'utilisateur → **Non** ; achats numériques → **Non**.
- Résultat attendu : **PEGI 3 / ESRB Everyone / Tout public**.

---

## 7. Public cible et contenu (Families) [TOI]

- **Tranches d'âge cibles** : cocher **5 ans et moins** + **6–8 ans**.
  (L'app vise 3–8 ; comme un public enfant est inclus → programme Familles.)
- **Attrait auprès des enfants** : Oui → l'app entre dans le **programme Designed for Families**.
- Confirmer la conformité à la **politique Familles** de Google Play.
- **Store presence / Designed for Families** : demander le badge (facultatif mais recommandé).

---

## 8. Sécurité des données (Data Safety) [TOI]

Parcours enfant : aucune collecte. Une **sauvegarde cloud optionnelle**
(activée par le parent, sous un « code famille » anonyme) existe — à déclarer
honnêtement.

- **Votre app collecte/partage des données ?** :
  - Si tu **laisses la sauvegarde cloud désactivée et n'en fais pas la promo** : tu peux répondre **Non** (rien ne quitte l'appareil par défaut). *Recommandé pour la v1.*
  - Si tu **veux proposer la sauvegarde** : répondre **Oui**, puis :
    - Type : **Actions dans l'app** (progression/activité). 
    - **Collectées** (pas seulement partagées) · **Optionnel** · **Non lié à l'identité** · **Non utilisé pour la pub**.
    - **Partage** : Non. **Chiffrement en transit** : Oui. **Suppression** : Oui (désinstallation / effacer données).
- **Aucune donnée personnelle**, aucun identifiant, aucune position, aucun contact.
- Lien politique de confidentialité : voir §9.

> Recommandation studio : **v1 sans mettre en avant la sauvegarde** → Data
> Safety « aucune donnée » = revue Familles la plus fluide.

---

## 9. Déclarations « Contenu de l'app » [TOI]

- **Politique de confidentialité (URL)** : héberger la page fournie via GitHub Pages, puis coller l'URL :
  `https://atlasquest369.github.io/AtlasQuest/ineskids/privacy.html`
  (Activer Pages sur la branche `main` si ce n'est pas déjà fait — Settings → Pages.)
- **Publicités** : **Non, cette app ne contient pas de publicité** (vrai en v1).
- **Accès à l'app** : toutes les fonctionnalités sont accessibles sans identifiants.
- **Public cible enfants** : Oui (cf. §7).
- **Actualités / COVID / finance** : Non.

---

## 10. Créer la release [TOI]

1. **Test interne** d'abord (recommandé) : Production → *Testing → Internal testing* → créer une release → déposer `app-release.aab`.
2. Vérifier sur un appareil, puis promouvoir en **Production**.
3. Notes de version (fr) : `Première version d'Ines Kids : activités d'éveil et d'apprentissage pour les 3–8 ans, sans publicité.`
4. Déploiement progressif (ex. 20 %) puis 100 %.

---

## 11. Après le lancement — feuille de route monétisation

La couche « publicités récompensées parent-opt-in » est déjà câblée mais
**désactivée** (`INES_ADMOB.rewardedId` non configuré). Pour la **v1.1** :
1. Créer un compte **AdMob**, activer le contenu **« adapté aux familles »** (annonces non personnalisées uniquement).
2. Renseigner `INES_ADMOB.rewardedId` + intégrer le SDK **certifié Families** (pas d'AdSense-in-WebView).
3. Mettre à jour **Data Safety** (SDK pub) et la déclaration **Publicités = Oui**.
4. Rester dans les limites Familles : récompensé uniquement, non personnalisé, déclenché par le parent, fréquence faible.

---

## 12. Check-list express

```
[ ] Secrets INES_KEYSTORE_* créés
[ ] AAB signé produit (workflow 4)
[ ] App créée (nom, gratuit, fr-FR)
[ ] Fiche 3 langues collée (§4)
[ ] Icône + bannière + 2 captures (§5)
[ ] Classification IARC → Tout public (§6)
[ ] Public cible enfants + Familles (§7)
[ ] Data Safety rempli (§8)
[ ] URL politique de confidentialité active (§9)
[ ] Pub = Non (§9)
[ ] Release test interne → production (§10)
```
