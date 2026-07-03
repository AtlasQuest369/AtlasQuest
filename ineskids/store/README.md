# Assets Store — Ines Kids

Assets prêts pour la fiche Google Play (voir `docs/PLAY-RELEASE.md`).

| Fichier | Usage Play | Spéc | Statut |
|---|---|---|---|
| `icon-512.png` | Icône de l'app | 512×512, PNG 32-bit | ✅ |
| `feature-graphic.png` | Image mise en avant | 1024×500, PNG 24-bit | ✅ |
| `screenshot-1-accueil.png` | Capture téléphone | 1236×2460 (ratio 1.99) | ✅ |
| `screenshot-2-quiz.png` | Capture téléphone | 1236×2460 | ✅ |
| `screenshot-3-resultats.png` | Capture téléphone | 1236×2460 | ✅ |
| `screenshot-4-espace-parent.png` | Capture téléphone | 1236×2460 | ✅ |

Notes :
- Captures ≥ 2 requises (4 fournies). Ratio < 2:1, sans canal alpha.
- Icône et bannière reprennent le logo Ines (identité produit).
- Régénération : `PLAYWRIGHT` pour les captures + `Pillow` pour la bannière
  (scripts dans l'historique de la PR de publication).
