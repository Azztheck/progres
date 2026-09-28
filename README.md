# 🏆 Progrès — les trophées de ma vie

Un système de « Progrès » à la Minecraft, mais pour la vraie vie : des arbres par domaine
(sport, parkour, aventure, création, esprit, social, vie & pro, santé…) avec des objectifs
à débloquer, de l'XP, des niveaux et des toasts « Progrès réalisé ! ».

## Utilisation

- **Clic sur un bloc** → détail, bouton *Débloquer !*, date, notes/souvenirs, compteur (km, livres…).
- **＋ Sous-objectif** sur n'importe quel bloc → ajoute ta propre branche (même sous les objectifs génériques).
- **🚫 Pas pour moi** → masque une branche générique qui ne te concerne pas (réaffichable dans le menu).
- **＋ Onglet** → crée un nouvel arbre pour un domaine perso.
- **☰** → journal des déblocages, stats par onglet, export/import de la sauvegarde.
- Glisser pour se déplacer, molette / pincer pour zoomer.

Types de blocs (comme dans Minecraft) :

| Cadre | Type | XP |
|---|---|---|
| carré | Progrès | 10 |
| arrondi | Objectif | 25 |
| étoile | Défi | 50 |

## Sauvegarde

La progression est dans le `localStorage` du navigateur. Pour passer du PC au téléphone :
☰ → *Exporter* puis *Importer* le fichier `.json` sur l'autre appareil.

## Faire évoluer les objectifs par défaut

Tout est dans [`data/defaults.js`](data/defaults.js). Un nœud :

```js
{ id: 'sp.run10k', icon: '🔟', title: 'Double chiffre', desc: 'Courir 10 km.',
  type: 'goal',            // 'task' | 'goal' | 'challenge'
  target: 100, unit: 'km', // optionnel : compteur, se débloque tout seul
  children: [ ... ] }
```

⚠️ Ne jamais changer un `id` existant : c'est la clé de la progression sauvegardée.

## Idées pour la suite

- Synchro auto entre appareils (Gist GitHub ou petit backend)
- Récompenses / titres à débloquer selon le niveau
- Objectifs récurrents (hebdo / annuels) et statistiques dans le temps
- Photos attachées aux souvenirs
- PWA installable sur le téléphone
