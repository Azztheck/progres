# ⚔️ Arcanes du Destin — les trophées de ma vie

Des arbres de hauts faits pour la vraie vie, en pixel art dark fantasy : un arbre par
domaine (sport, parkour, aventure, création, esprit, social, vie & pro, santé…), des runes
à éveiller, de l'essence (XP), des niveaux, et des notifications « Relique obtenue ».

👉 https://azztheck.github.io/progres/

## Utilisation

- **Clic sur un bloc** → détail, bouton *Débloquer !*, date, notes/souvenirs, compteur (km, livres…).
- **＋ Sous-objectif** sur n'importe quel bloc → ajoute ta propre branche (même sous les objectifs génériques).
- **🚫 Pas pour moi** → masque une branche générique qui ne te concerne pas (réaffichable dans le menu).
- **＋ Onglet** → crée un nouvel arbre pour un domaine perso.
- **🗺️ Carte** → un globe : glisse pour le faire tourner, pince / molette pour zoomer, touche les pays visités (ou « Liste des pays » pour chercher, y compris les micro-États).
- **☰** → hauts faits à vérifier, journal, stats par onglet, export/import de la sauvegarde.
- Glisser pour se déplacer, molette / pincer pour zoomer.

Types de blocs :

| Forme | Type | Essence |
|---|---|---|
| carré crénelé | Rune (`task`) | 10 |
| écu | Sceau (`goal`) | 25 |
| losange | Relique (`challenge`) | 50 |

L'habillage est dans `themes.css` (variables de couleur en haut), le vocabulaire dans
`THEMES` au début de `app.js`.

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
- Vraies icônes en pixel art à la place des emojis
