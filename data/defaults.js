// Arbres de progrès par défaut.
// Organisation : un onglet = une grande catégorie ; les branches qui partent de la racine
// = les sous-catégories (ex. Montagne → Randonnée, Alpinisme, Escalade…).
//
// Chaque nœud : { id, icon, title, desc, type?, target?, unit?, hub?, children? }
//   hub    : affiche le nom du nœud dans l'arbre (les branches de la racine l'ont d'office)
//   type   : 'task' (Rune, 10) | 'goal' (Sceau, 25) | 'challenge' (Relique, 50)
//   target : si présent, le nœud a un compteur (ex. 100 km) et se débloque tout seul à l'objectif
// Les ids doivent être uniques et NE DOIVENT PAS changer (c'est la clé de ta progression sauvegardée).
// On peut par contre déplacer un nœud d'un onglet ou d'une branche à l'autre sans rien perdre.

window.DEFAULT_TABS = [
  // =====================================================================
  {
    id: 'sport', title: 'Sport', icon: '🏃', color: '#2fae6a',
    tree: {
      id: 'sp.root', icon: '👟', title: 'Bouger son corps', desc: 'Faire une vraie séance de sport. Le début de tout.',
      children: [
        // ---------- Parkour ----------
        { id: 'pk.root', icon: '🏙️', title: 'Parkour', desc: 'Première session de parkour dehors : la ville est un terrain de jeu.', children: [
          { id: 'pk.roll', icon: '🔄', title: 'Roulade', desc: 'Roulade propre sur béton, sans douleur.', children: [
            { id: 'pk.drop', icon: '⬇️', title: 'Réception', desc: 'Drop de 2 m avec réception + roulade.', type: 'goal' },
          ] },
          { id: 'pk.prec', icon: '🎯', title: 'Précision', desc: 'Saut de précision stické, pieds joints.', children: [
            { id: 'pk.rail', icon: '🛤️', title: 'Funambule', desc: 'Précision sur une rambarde.', type: 'goal', children: [
              { id: 'pk.bigprec', icon: '📏', title: 'Grand saut', desc: 'Précision de plus de 3 m.', type: 'challenge' },
            ] },
            { id: 'pk.roofgap', icon: '🏚️', title: 'Roof gap', desc: 'Sauter d\'un toit à un autre.', type: 'goal' },
          ] },
          { id: 'pk.vault', icon: '🐒', title: 'Passement', desc: 'Maîtriser speed vault et lazy vault.', children: [
            { id: 'pk.kong', icon: '🦍', title: 'Saut de chat', desc: 'Kong vault propre.', children: [
              { id: 'pk.dkong', icon: '🦍', title: 'Double kong', desc: 'Double saut de chat.', type: 'goal', children: [
                { id: 'pk.kongpre', icon: '🎯', title: 'Kong précision', desc: 'Kong enchaîné sur une précision.', type: 'challenge' },
              ] },
            ] },
          ] },
          { id: 'pk.wallrun', icon: '🧱', title: 'Passe-muraille', desc: 'Monter un mur de 2,5 m.', children: [
            { id: 'pk.tictac', icon: '⏲️', title: 'Tic-tac', desc: 'Tic-tac maîtrisé des deux côtés.' },
            { id: 'pk.cat', icon: '🐈', title: 'Chat perché', desc: 'Saut de bras (cat leap) sur un mur.', type: 'goal' },
          ] },
          { id: 'pk.line', icon: '🎥', title: 'Ligne filmée', desc: 'Filmer une ligne complète (5 mouvements ou plus) sans faute.', children: [
            { id: 'pk.edit', icon: '🎬', title: 'Premier edit', desc: 'Monter et publier un edit parkour.', type: 'goal', children: [
              { id: 'pk.views', icon: '👀', title: 'Viral-ish', desc: '1000 vues sur un edit.', type: 'challenge', target: 1000, unit: 'vues' },
            ] },
          ] },
          { id: 'pk.jam', icon: '🤝', title: 'Jam', desc: 'Participer à une jam avec d\'autres crews.', children: [
            { id: 'pk.jam3', icon: '🎪', title: 'Habitué des jams', desc: 'Participer à 3 jams.', type: 'goal', target: 3, unit: 'jams' },
            { id: 'pk.teach', icon: '👨‍🏫', title: 'Transmettre', desc: 'Apprendre un mouvement à un débutant.', type: 'goal' },
            { id: 'pk.abroad', icon: '✈️', title: 'Spot étranger', desc: 'S\'entraîner sur un spot à l\'étranger.', type: 'goal' },
          ] },
        ] },

        // ---------- Acrobatie ----------
        { id: 'ac.root', icon: '🤸', title: 'Acrobatie', desc: 'Roue et rondade propres : le début des acrobaties.', children: [
          { id: 'pk.backflip', icon: '🔙', title: 'Salto arrière', desc: 'Backflip au sol, sans parade.', type: 'goal', children: [
            { id: 'pk.sideflip', icon: '↔️', title: 'Side flip', desc: 'Salto latéral au sol.', type: 'goal' },
            { id: 'pk.frontflip', icon: '🔜', title: 'Front flip', desc: 'Salto avant au sol.', type: 'goal', children: [
              { id: 'pk.webster', icon: '🦵', title: 'Webster', desc: 'Salto avant sur une jambe.', type: 'challenge' },
            ] },
            { id: 'pk.gainer', icon: '🌀', title: 'Gainer', desc: 'Salto arrière en avançant.', type: 'challenge', children: [
              { id: 'pk.cork', icon: '🌪️', title: 'Cork', desc: 'Salto vrillé.', type: 'challenge' },
            ] },
            { id: 'ac.sand', icon: '🏖️', title: 'Flips sur le sable', desc: 'Enchaîner des saltos sur la plage.' },
          ] },
          { id: 'ac.tricking', icon: '🥋', title: 'Tricking', desc: 'Enchaîner 3 figures de tricking en salle.', type: 'goal', children: [
            { id: 'ac.btwist', icon: '🦋', title: 'B-twist', desc: 'Butterfly twist propre.', type: 'goal' },
            { id: 'ac.full', icon: '🌀', title: 'Vrille', desc: 'Salto arrière avec une vrille complète (full).', type: 'challenge', children: [
              { id: 'ac.double', icon: '💫', title: 'Double salto', desc: 'Double salto arrière.', type: 'challenge' },
            ] },
          ] },
        ] },

        // ---------- Trekking ----------
        { id: 'tk.root', icon: '🎒', title: 'Trekking', desc: 'Un trek d\'au moins 2 jours, sac sur le dos.', children: [
          { id: 'tk.alti', icon: '🏔️', title: 'Trek d\'altitude', desc: 'Trek au-dessus de 3000 m.', type: 'goal', children: [
            { id: 'tk.ebc', icon: '🏕️', title: 'Camp de base', desc: 'Rejoindre le camp de base de l\'Everest (5364 m).', type: 'challenge' },
          ] },
          { id: 'tk.jungle', icon: '🌴', title: 'Jungle', desc: 'Trek en immersion dans la jungle.', type: 'goal' },
          { id: 'tk.desert', icon: '🏜️', title: 'Désert', desc: 'Trek dans le désert.', type: 'challenge' },
          { id: 'tk.100', icon: '🥾', title: 'Semelles usées', desc: 'Cumuler 100 km de trek.', type: 'goal', target: 100, unit: 'km', children: [
            { id: 'tk.1000', icon: '👣', title: 'Mille kilomètres à pied', desc: 'Cumuler 1000 km de trek.', type: 'challenge', target: 1000, unit: 'km' },
          ] },
        ] },

        // ---------- Course ----------
        { id: 'sp.run1', icon: '🏃', title: 'Course', desc: 'Courir 20 minutes sans t\'arrêter.', children: [
          { id: 'sp.run5k', icon: '5️⃣', title: 'Le 5 bornes', desc: 'Courir 5 km d\'une traite.', children: [
            { id: 'sp.run10k', icon: '🔟', title: 'Double chiffre', desc: 'Courir 10 km.', type: 'goal', children: [
              { id: 'sp.semi', icon: '🏅', title: 'À mi-chemin de la légende', desc: 'Finir un semi-marathon (21,1 km).', type: 'goal', children: [
                { id: 'sp.marathon', icon: '🏆', title: 'Phidippidès', desc: 'Finir un marathon (42,195 km).', type: 'challenge', children: [
                  { id: 'sp.trail', icon: '⛰️', title: 'Ultra', desc: 'Finir un ultra-trail (> 42 km avec du dénivelé).', type: 'challenge' },
                ] },
              ] },
              { id: 'sp.sub50', icon: '⏱️', title: 'Chrono qui pique', desc: '10 km en moins de 50 minutes.', type: 'goal' },
            ] },
          ] },
          { id: 'sp.run100', icon: '🛣️', title: 'Kilomètres au compteur', desc: 'Cumuler 100 km de course.', type: 'goal', target: 100, unit: 'km', children: [
            { id: 'sp.run1000', icon: '🌍', title: 'Mille bornes', desc: 'Cumuler 1000 km de course.', type: 'challenge', target: 1000, unit: 'km' },
          ] },
        ] },

        // ---------- Force ----------
        { id: 'sp.pull1', icon: '💪', title: 'Force', desc: 'Faire ta première traction stricte.', children: [
          { id: 'sp.pull10', icon: '🦍', title: 'Gorille', desc: '10 tractions d\'affilée.', type: 'goal', children: [
            { id: 'sp.muscleup', icon: '🚀', title: 'Muscle-up', desc: 'Passer au-dessus de la barre.', type: 'challenge', children: [
              { id: 'sp.frontlever', icon: '🦅', title: 'Front lever', desc: 'Tenir un front lever 5 secondes.', type: 'challenge' },
            ] },
          ] },
          { id: 'sp.push50', icon: '🤜', title: '50 pompes', desc: '50 pompes d\'affilée, propres.', type: 'goal' },
          { id: 'sp.plank', icon: '🧱', title: 'Gainé', desc: 'Tenir 2 minutes de gainage.', children: [
            { id: 'sp.handstand', icon: '🤸', title: 'Le monde à l\'envers', desc: 'Tenir 30 s en équilibre sur les mains sans mur.', type: 'challenge' },
            { id: 'sp.split', icon: '🩰', title: 'Élastique', desc: 'Faire le grand écart.', type: 'challenge' },
          ] },
        ] },

        // ---------- Vélo / eau / régularité ----------
        { id: 'sp.bike50', icon: '🚴', title: 'Vélo', desc: 'Rouler 50 km dans la journée.', children: [
          { id: 'sp.bike100', icon: '💯', title: 'Centurion', desc: 'Rouler 100 km dans la journée.', type: 'goal', children: [
            { id: 'sp.col', icon: '🏔️', title: 'Grimpeur', desc: 'Monter un col de montagne mythique à vélo.', type: 'challenge' },
          ] },
        ] },
        { id: 'sp.swim', icon: '🏊', title: 'Natation', desc: 'Nager 1 km sans t\'arrêter.', children: [
          { id: 'sp.openwater', icon: '🌊', title: 'Eau libre', desc: 'Faire une traversée en eau libre.', type: 'goal' },
        ] },
        { id: 'sp.streak7', icon: '📅', title: 'Régularité', desc: '7 jours d\'affilée avec une activité physique.', target: 7, unit: 'jours', children: [
          { id: 'sp.streak30', icon: '🔥', title: 'Habitude', desc: '30 jours d\'affilée avec une activité physique.', type: 'goal', target: 30, unit: 'jours', children: [
            { id: 'sp.streak365', icon: '♾️', title: 'Machine', desc: 'Un an d\'activité physique quotidienne.', type: 'challenge', target: 365, unit: 'jours' },
          ] },
          { id: 'sp.6am', icon: '🌅', title: 'Lève-tôt', desc: 'Séance de sport terminée avant 7h du matin.' },
        ] },
        { id: 'sp.compet', icon: '🎽', title: 'Compétition', desc: 'Participer à une compétition officielle (n\'importe quel sport).', children: [
          { id: 'sp.podium', icon: '🥇', title: 'Podium', desc: 'Monter sur un podium.', type: 'challenge' },
        ] },
      ],
    },
  },

  // =====================================================================
  {
    id: 'montagne', title: 'Montagne', icon: '🏔️', color: '#4f7fbf',
    tree: {
      id: 'mo.root', icon: '⛰️', title: 'L\'appel des cimes', desc: 'Passer une journée entière en montagne.',
      children: [
        // ---------- Randonnée ----------
        { id: 'mo.rando', icon: '🥾', title: 'Randonnée', desc: 'Une vraie rando de plus de 10 km.', children: [
          // dénivelé positif cumulé sur une seule sortie
          { id: 'mo.dplus', icon: '📈', title: 'Mille mètres', desc: '1000 m de D+ cumulé en une seule sortie.', children: [
            { id: 'mo.dplus2', icon: '🚠', title: 'Cuisses d\'acier', desc: '2000 m de D+ cumulé en une seule sortie.', type: 'goal', children: [
              { id: 'mo.dplus4', icon: '🦵', title: 'Quatre mille', desc: '4000 m de D+ cumulé en une seule sortie.', type: 'goal', children: [
                { id: 'mo.dplus5', icon: '⛰️', title: 'Cinq mille', desc: '5000 m de D+ cumulé en une seule sortie.', type: 'challenge', children: [
                  { id: 'mo.dplus10', icon: '🌋', title: 'Dix mille', desc: '10 000 m de D+ en une seule sortie : un ultra-trail.', type: 'challenge' },
                ] },
              ] },
            ] },
          ] },
          { id: 'av.gr', icon: '🗺️', title: 'Itinérance', desc: 'Randonnée de 5 jours ou plus en autonomie.', type: 'goal', children: [
            { id: 'av.long', icon: '🧭', title: 'Le grand chemin', desc: 'Faire un GR complet ou un chemin mythique (Compostelle, GR20…).', type: 'challenge' },
          ] },
          { id: 'mo.massifs', icon: '🗻', title: 'Explorateur de massifs', desc: 'Randonner dans 5 massifs différents (Chartreuse, Belledonne, Vercors, Atlas…).', type: 'goal', target: 5, unit: 'massifs', children: [
            { id: 'mo.massifs15', icon: '🗺️', title: 'Cartographe', desc: 'Randonner dans 15 massifs différents.', type: 'challenge', target: 15, unit: 'massifs' },
          ] },
          { id: 'av.sunrise', icon: '🌄', title: 'Premier rayon', desc: 'Voir le lever du soleil depuis un sommet.', type: 'goal' },
          { id: 'av.stars', icon: '🌌', title: 'Belle étoile', desc: 'Dormir dehors, sans tente.', children: [
            { id: 'av.bivouac', icon: '⛺', title: 'Bivouac', desc: 'Bivouac en montagne.' },
          ] },
        ] },

        // ---------- Alpinisme ----------
        { id: 'mo.alpi', icon: '⛓️', title: 'Alpinisme', desc: 'Première sortie encordée pour apprendre les bases.', children: [
          { id: 'mo.crampons', icon: '🧊', title: 'Crampons & piolet', desc: 'Première course de neige avec crampons et piolet.', children: [
            { id: 'mo.glacier', icon: '🏔️', title: 'Glacier', desc: 'Traverser un glacier encordé.', type: 'goal', children: [
              { id: 'mo.montblanc', icon: '👑', title: 'Toit de l\'Europe', desc: 'Gravir le Mont Blanc.', type: 'challenge' },
            ] },
          ] },
          // altitude : un palier tous les 1000 m
          { id: 'mo.2k', icon: '🌲', title: 'Deux mille', desc: 'Atteindre un sommet de plus de 2000 m.', children: [
            { id: 'av.summit3k', icon: '☁️', title: 'Trois mille', desc: 'Atteindre un sommet de plus de 3000 m.', type: 'goal', children: [
              { id: 'av.summit4k', icon: '🏔️', title: 'Quatre mille', desc: 'Gravir un sommet de plus de 4000 m.', type: 'challenge', children: [
                { id: 'mo.5k', icon: '🦒', title: 'Cinq mille', desc: 'Gravir un sommet de plus de 5000 m (Kilimandjaro, Elbrouz…).', type: 'challenge', children: [
                  { id: 'mo.6k', icon: '🦙', title: 'Six mille', desc: 'Gravir un sommet de plus de 6000 m (Aconcagua, pics himalayens…).', type: 'challenge', children: [
                    { id: 'mo.7k', icon: '🐉', title: 'Sept mille', desc: 'Gravir un sommet de plus de 7000 m.', type: 'challenge', children: [
                      { id: 'mo.8k', icon: '👑', title: 'Huit mille', desc: 'Gravir un des quatorze sommets de plus de 8000 m.', type: 'challenge' },
                    ] },
                  ] },
                ] },
              ] },
            ] },
          ] },
          { id: 'mo.rappel', icon: '🧗', title: 'Rappel', desc: 'Descendre en rappel en autonomie.' },
          { id: 'mo.lead', icon: '🧭', title: 'Premier de cordée', desc: 'Mener une course d\'alpinisme en autonomie.', type: 'challenge' },
        ] },

        // ---------- Escalade ----------
        { id: 'mo.esc', icon: '🧗', title: 'Escalade', desc: 'Première voie en falaise.', children: [
          // voie
          { id: 'mo.tete', icon: '🔗', title: 'En tête', desc: 'Grimper une voie en tête.', children: [
            { id: 'mo.6a', icon: '6️⃣', title: 'Sixième degré', desc: 'Enchaîner une voie en 6a.', type: 'goal', children: [
              { id: 'mo.7a', icon: '7️⃣', title: 'Septième degré', desc: 'Enchaîner une voie en 7a.', type: 'goal', children: [
                { id: 'mo.7b', icon: '🧗', title: 'Sept B', desc: 'Enchaîner une voie en 7b.', type: 'challenge', children: [
                  { id: 'mo.8a', icon: '8️⃣', title: 'Huitième degré', desc: 'Enchaîner une voie en 8a.', type: 'challenge' },
                ] },
              ] },
            ] },
          ] },
          // bloc
          { id: 'mo.bloc', icon: '🖐️', title: 'Bloc', desc: 'Sortir un premier bloc dehors.', children: [
            { id: 'mo.bloc7a', icon: '7️⃣', title: 'Bloc 7A', desc: 'Sortir un bloc en 7A.', type: 'goal', children: [
              { id: 'mo.bloc7b', icon: '💪', title: 'Bloc 7B', desc: 'Sortir un bloc en 7B.', type: 'challenge', children: [
                { id: 'mo.bloc7c', icon: '🔥', title: 'Bloc 7C', desc: 'Sortir un bloc en 7C.', type: 'challenge', children: [
                  { id: 'mo.bloc8a', icon: '8️⃣', title: 'Bloc 8A', desc: 'Sortir un bloc en 8A.', type: 'challenge' },
                ] },
              ] },
            ] },
          ] },
          { id: 'mo.gv', icon: '🧱', title: 'Grande voie', desc: 'Grimper une grande voie de plusieurs longueurs.', type: 'goal' },
          { id: 'mo.ferrata', icon: '🔩', title: 'Via ferrata', desc: 'Faire une via ferrata.' },
        ] },

        // ---------- Neige ----------
        { id: 'mo.neige', icon: '❄️', title: 'Neige', desc: 'Faire une sortie en raquettes.', children: [
          { id: 'mo.skirando', icon: '⛷️', title: 'Peaux de phoque', desc: 'Faire une sortie en ski de randonnée.', type: 'goal', children: [
            { id: 'mo.igloo', icon: '⛄', title: 'Igloo', desc: 'Passer une nuit dans un igloo construit par toi.', type: 'challenge' },
          ] },
        ] },
      ],
    },
  },

  // =====================================================================
  {
    id: 'aventure', title: 'Voyage', icon: '🧭', color: '#2f8fd0',
    tree: {
      id: 'av.root', icon: '🎒', title: 'Sac sur le dos', desc: 'Partir quelque part juste pour découvrir.',
      children: [
        // ---------- Autostop ----------
        { id: 'vo.stop', icon: '👍', title: 'Autostop', desc: 'Faire un premier trajet en stop.', children: [
          { id: 'vo.stop1k', icon: '🛣️', title: 'Pouce levé', desc: 'Cumuler 1000 km en stop.', type: 'goal', target: 1000, unit: 'km', children: [
            { id: 'vo.stop10k', icon: '🌍', title: 'Autostoppeur légendaire', desc: 'Cumuler 10 000 km en stop.', type: 'challenge', target: 10000, unit: 'km', children: [
              { id: 'vo.shanghai', icon: '🏯', title: 'Route de la Soie', desc: 'Rejoindre Shanghai en stop en partant de France. L\'objectif ultime.', type: 'challenge' },
            ] },
          ] },
          { id: 'vo.cars', icon: '🚗', title: 'Cent conducteurs', desc: 'Monter dans 100 voitures différentes en stop.', type: 'goal', target: 100, unit: 'voitures' },
          { id: 'vo.border', icon: '🛃', title: 'Sans frontières', desc: 'Passer une frontière en stop.' },
        ] },

        // ---------- Pays ----------
        // ---------- Horizons : des expériences, pas des lieux (les lieux se cochent sur la carte) ----------
        { id: 'av.country', icon: '🛂', title: 'Horizons', desc: 'Partir à l\'étranger pour la première fois.', children: [
          { id: 'av.solo', icon: '🧍', title: 'En solo', desc: 'Voyager seul au moins une semaine.', type: 'goal' },
          { id: 'vx.overland', icon: '🛤️', title: 'Sans avion', desc: 'Traverser un continent uniquement par voie terrestre.', type: 'goal', children: [
            { id: 'eu.transsib', icon: '🚂', title: 'Transsibérien', desc: 'Traverser la Russie par le Transsibérien.', type: 'challenge' },
            { id: 'vx.noplane', icon: '🌍', title: 'Terre à terre', desc: 'Un an de voyages sans prendre l\'avion.', type: 'challenge' },
          ] },
          { id: 'vx.live', icon: '🏠', title: 'Expatrié', desc: 'Vivre au moins 3 mois dans un pays étranger.', type: 'goal', children: [
            { id: 'vx.work', icon: '💼', title: 'Travail à l\'étranger', desc: 'Travailler à l\'étranger.', type: 'goal' },
          ] },
          { id: 'vx.nighttrain', icon: '🚆', title: 'Train de nuit', desc: 'Voyager en train de nuit.' },
          { id: 'vx.walkborder', icon: '🚶', title: 'À pied', desc: 'Passer une frontière à pied.' },
          { id: 'vx.zero', icon: '🆓', title: 'Zéro euro', desc: 'Une journée entière de voyage sans dépenser un centime.' },
          { id: 'vx.nogps', icon: '🧭', title: 'Sans GPS', desc: 'Voyager une journée sans téléphone ni carte, en demandant ton chemin.', type: 'goal' },
          { id: 'vx.fest', icon: '🎆', title: 'Fête locale', desc: 'Vivre une fête traditionnelle dans un pays étranger.' },
          { id: 'vx.midnight', icon: '🌞', title: 'Soleil de minuit', desc: 'Voir le soleil de minuit au-delà du cercle polaire.', type: 'goal' },
          { id: 'vx.desert', icon: '🐪', title: 'Nuit dans le désert', desc: 'Dormir dans un désert.', type: 'goal' },
          { id: 'vx.equator', icon: '🧵', title: 'Équateur', desc: 'Passer l\'équateur par voie terrestre ou maritime.', type: 'challenge' },
          { id: 'vx.bike', icon: '🚲', title: 'Cyclotourisme', desc: 'Un voyage de plusieurs jours à vélo, en autonomie.', type: 'goal' },
        ] },

        // ---------- Hospitalité ----------
        { id: 'vo.host', icon: '🏡', title: 'Hospitalité', desc: 'Dormir chez l\'habitant.', children: [
          { id: 'vo.host10', icon: '☕', title: 'Accueilli partout', desc: 'Être hébergé 10 fois chez l\'habitant.', type: 'goal', target: 10, unit: 'accueils', children: [
            { id: 'vo.host50', icon: '🏘️', title: 'Mille portes', desc: 'Être hébergé 50 fois chez l\'habitant.', type: 'challenge', target: 50, unit: 'accueils' },
          ] },
          { id: 'vo.welcome', icon: '🚪', title: 'Porte ouverte', desc: 'Accueillir chez toi des voyageurs que tu ne connaissais pas.', type: 'goal' },
        ] },

        // ---------- Route ----------
        { id: 'av.roadtrip', icon: '🚐', title: 'Road trip', desc: 'Un road trip d\'une semaine minimum.', children: [
          { id: 'av.nomad', icon: '🏕️', title: 'Nomade', desc: 'Vivre un mois sur la route.', type: 'challenge' },
        ] },

        // ---------- Survie ----------
        { id: 'sv.root', icon: '🔥', title: 'Survie', desc: 'Allumer un feu sans briquet.', children: [
          { id: 'sv.water', icon: '💧', title: 'Eau potable', desc: 'Purifier ton eau toi-même.' },
          { id: 'sv.harpon', icon: '🐟', title: 'Pêcheur', desc: 'Pêcher ton repas au harpon.', type: 'goal' },
          { id: 'sv.cabane', icon: '🎋', title: 'Bâtisseur', desc: 'Construire une cabane pour y dormir.', type: 'goal', children: [
            { id: 'sv.island', icon: '🏝️', title: 'Naufragé volontaire', desc: 'Vivre 30 jours sur une île isolée.', type: 'challenge' },
          ] },
          { id: 'sv.team', icon: '🧑‍🤝‍🧑', title: 'Chef d\'expédition', desc: 'Monter une expédition et constituer l\'équipe.', type: 'goal' },
        ] },

        // ---------- Sensations ----------
        { id: 'av.adrenaline', icon: '⚡', title: 'Sensations', desc: 'Faire une activité à sensations (rafting, canyoning…).', children: [
          { id: 'av.parapente', icon: '🪂', title: 'Voler', desc: 'Faire du parapente.', type: 'goal' },
          { id: 'av.skydive', icon: '🛩️', title: 'Chute libre', desc: 'Sauter en parachute.', type: 'challenge' },
        ] },
        { id: 'av.aurora', icon: '🌠', title: 'Ciel vivant', desc: 'Voir une aurore boréale.', type: 'challenge' },
      ],
    },
  },

  // =====================================================================
  {
    id: 'eau', title: 'Eau', icon: '🌊', color: '#1fa0c0',
    tree: {
      id: 'ea.root', icon: '⚓', title: 'L\'appel du large', desc: 'Passer une journée entière en mer.',
      children: [
        // ---------- Voile ----------
        { id: 'ea.voile', icon: '⛵', title: 'Voile', desc: 'Première navigation en voilier.', children: [
          { id: 'ea.barre', icon: '☸️', title: 'À la barre', desc: 'Savoir barrer et régler les voiles (stage ou apprentissage à bord).', children: [
            { id: 'ea.night', icon: '🌙', title: 'Quart de nuit', desc: 'Naviguer de nuit et tenir un quart.', type: 'goal', children: [
              { id: 'ea.crossing', icon: '🧭', title: 'Traversée', desc: 'Une traversée de plusieurs jours sans voir la terre.', type: 'goal', children: [
                { id: 'ea.transat', icon: '🌎', title: 'Transatlantique', desc: 'Traverser l\'Atlantique en voilier.', type: 'challenge' },
              ] },
            ] },
            { id: 'ea.skipper', icon: '👨‍✈️', title: 'Skipper', desc: 'Mener toi-même un bateau avec un équipage.', type: 'challenge' },
          ] },
        ] },

        // ---------- Voyager en bateau ----------
        { id: 'ea.boat', icon: '🛳️', title: 'Voyager en bateau', desc: 'Rejoindre un autre pays par la mer.', children: [
          { id: 'ea.island', icon: '🏝️', title: 'Cap sur une île', desc: 'Rejoindre une île en bateau.' },
          { id: 'ea.boatstop', icon: '👍', title: 'Bateau-stop', desc: 'Trouver une place d\'équipier sur un bateau en bateau-stop.', type: 'goal', children: [
            { id: 'ea.cargo', icon: '🚢', title: 'Cargo', desc: 'Traverser un océan à bord d\'un cargo.', type: 'challenge' },
          ] },
        ] },

        // ---------- Plongée ----------
        { id: 'av.dive', icon: '🤿', title: 'Plongée', desc: 'Faire un baptême de plongée.', children: [
          { id: 'av.diver', icon: '🐠', title: 'Plongeur', desc: 'Obtenir un niveau de plongée (N1 / Open Water).', type: 'challenge' },
          { id: 'ea.apnee', icon: '🐬', title: 'Apnée', desc: 'Descendre à 10 m en apnée.', type: 'goal' },
        ] },

        // ---------- Glisse ----------
        { id: 'ea.surf', icon: '🏄', title: 'Surf', desc: 'Te lever sur une planche de surf.', children: [
          { id: 'ea.green', icon: '🌊', title: 'Vague verte', desc: 'Surfer une vague verte (non déferlée).', type: 'goal' },
        ] },
        { id: 'ea.kayak', icon: '🛶', title: 'Kayak de mer', desc: 'Faire une sortie en kayak de mer.', children: [
          { id: 'ea.kayaktrip', icon: '🗺️', title: 'Raid kayak', desc: 'Un raid de plusieurs jours en kayak.', type: 'goal' },
        ] },
      ],
    },
  },

  // =====================================================================
  {
    id: 'scene', title: 'Spectacle', icon: '🎭', color: '#c04a8a',
    tree: {
      id: 'sc.root', icon: '🎭', title: 'Sous les projecteurs', desc: 'Se produire devant un public, quel qu\'il soit.',
      children: [
        // ---------- Démonstration ----------
        { id: 'sc.demo', icon: '🎪', title: 'Démonstration', desc: 'Faire une démo de parkour ou d\'acrobatie en public.', children: [
          { id: 'sc.festival', icon: '🎡', title: 'Festival', desc: 'Jouer dans un festival.', type: 'goal', children: [
            { id: 'sc.tour', icon: '🚌', title: 'En tournée', desc: 'Partir en tournée avec un spectacle.', type: 'challenge' },
          ] },
          { id: 'sc.street', icon: '🎩', title: 'Art de rue', desc: 'Jouer un spectacle de rue.' },
        ] },

        // ---------- Compagnie ----------
        { id: 'sc.cie', icon: '🦎', title: 'Compagnie', desc: 'Intégrer une compagnie.', type: 'goal', children: [
          { id: 'sc.creation', icon: '🧩', title: 'Création', desc: 'Participer à la création d\'un spectacle de A à Z.', type: 'goal', children: [
            { id: 'sc.own', icon: '👑', title: 'Ton spectacle', desc: 'Créer et porter ton propre spectacle (solo ou ta compagnie).', type: 'challenge' },
          ] },
          { id: 'sc.abroad', icon: '🌐', title: 'Jouer à l\'étranger', desc: 'Jouer un spectacle à l\'étranger.', type: 'goal' },
          { id: 'sc.paid', icon: '💶', title: 'Cachet', desc: 'Être payé pour un spectacle.', type: 'goal', children: [
            { id: 'sc.intermittent', icon: '📜', title: 'Intermittent', desc: 'Obtenir le statut d\'intermittent du spectacle.', type: 'challenge' },          ] },
        ] },

        // ---------- Transmission ----------
        { id: 'sc.workshop', icon: '👨‍🏫', title: 'Transmission', desc: 'Animer un atelier ou un cours.', children: [
          { id: 'sc.coach', icon: '📋', title: 'Coach', desc: 'Donner des cours toute une saison.', type: 'goal' },
        ] },

        // ---------- Écran ----------
        { id: 'sc.screen', icon: '🎬', title: 'Écran', desc: 'Apparaître dans un tournage (clip, pub, film).', type: 'goal', children: [
          { id: 'sc.stunt', icon: '💥', title: 'Cascadeur', desc: 'Faire une cascade dans une production.', type: 'challenge' },
        ] },
      ],
    },
  },

  // =====================================================================
  {
    id: 'musique', title: 'Musique', icon: '🎸', color: '#e0703a',
    tree: {
      id: 'cr.music', icon: '🎸', title: 'Mélomane', desc: 'Commencer un instrument.',
      children: [
        // ---------- Partage ----------
        { id: 'mu.stage', icon: '🤝', title: 'Partage', desc: 'Faire de la musique avec d\'autres.', children: [
          { id: 'cr.song', icon: '🎶', title: 'Un morceau entier', desc: 'Jouer un morceau en entier sans te tromper.', type: 'goal', children: [
            { id: 'cr.live', icon: '🎤', title: 'Sur scène', desc: 'Jouer devant un public.', type: 'goal', children: [
              { id: 'mu.concert', icon: '🎟️', title: 'Concert', desc: 'Donner un concert d\'une heure.', type: 'challenge' },
            ] },
            { id: 'mu.record', icon: '🎙️', title: 'Enregistré', desc: 'Enregistrer un morceau proprement.', type: 'goal', children: [
              { id: 'mu.ep', icon: '💿', title: 'EP', desc: 'Sortir un EP (au moins 4 morceaux).', type: 'challenge' },
            ] },
          ] },
          { id: 'mu.share', icon: '🌍', title: 'Langage universel', desc: 'Faire de la musique avec des gens rencontrés en voyage.', type: 'goal' },
          { id: 'mu.duo', icon: '🎼', title: 'Harmonies', desc: 'Chanter ou jouer à deux voix en harmonie.', type: 'goal' },
          { id: 'cr.compose', icon: '✍️', title: 'Compositeur', desc: 'Composer un morceau original.', type: 'goal' },
        ] },

        // ---------- Théorie : du débutant au pro (repères : grades 1 à 8 ABRSM) ----------
        { id: 'th.root', icon: '📖', title: 'Théorie', desc: 'Débutant : connaître le nom des notes, les tons et les demi-tons.', children: [
          // lecture
          { id: 'th.staff', icon: '🎼', title: 'Clé de sol', desc: 'Débutant : lire les notes en clé de sol.', children: [
            { id: 'th.bass', icon: '🔑', title: 'Clé de fa', desc: 'Débutant : lire les notes en clé de fa.', children: [
              { id: 'th.sight', icon: '👀', title: 'Lecture à vue', desc: 'Intermédiaire : déchiffrer une mélodie simple à vue.', type: 'goal', children: [
                { id: 'th.transpose', icon: '🔀', title: 'Transposition', desc: 'Avancé : clés d\'ut et transposition des instruments (sib, fa, mib).', type: 'challenge' },
              ] },
            ] },
          ] },
          // rythme
          { id: 'th.rhythm', icon: '⏱️', title: 'Rythmes', desc: 'Débutant : lire rondes, blanches, noires, croches, doubles croches et silences.', children: [
            { id: 'th.compound', icon: '🌊', title: 'Mesures composées', desc: 'Intermédiaire : mesures composées et irrégulières (6/8, 7/8, 5/4).', type: 'goal', children: [
              { id: 'th.poly', icon: '🔁', title: 'Polyrythmies', desc: 'Avancé : jouer et lire des polyrythmies (3 contre 2, 4 contre 3).', type: 'challenge' },
            ] },
          ] },
          // gammes
          { id: 'th.major', icon: '🎹', title: 'Gamme majeure', desc: 'Débutant : construire les gammes majeures, armures et cycle des quintes.', children: [
            { id: 'th.minor', icon: '🌙', title: 'Gammes mineures', desc: 'Intermédiaire : mineures naturelle, harmonique et mélodique.', type: 'goal', children: [
              { id: 'th.modes', icon: '🎨', title: 'Les 7 modes', desc: 'Intermédiaire : ionien, dorien, phrygien, lydien, mixolydien, éolien, locrien.', type: 'goal', children: [
                { id: 'th.exotic', icon: '🐍', title: 'Gammes exotiques', desc: 'Avancé : gammes par tons, diminuée, altérée, harmoniques des musiques du monde.', type: 'challenge' },
              ] },
            ] },
          ] },
          // harmonie
          { id: 'th.triads', icon: '🔺', title: 'Accords parfaits', desc: 'Débutant : construire les accords majeurs, mineurs, diminués et augmentés.', children: [
            { id: 'th.degrees', icon: '🪜', title: 'Degrés', desc: 'Intermédiaire : harmoniser une gamme (I à VII) et reconnaître les grilles courantes.', type: 'goal', children: [
              { id: 'th.sevenths', icon: '7️⃣', title: 'Accords de 7e', desc: 'Intermédiaire : accords de 7e et leurs renversements.', type: 'goal', children: [
                { id: 'th.cadences', icon: '🏁', title: 'Cadences', desc: 'Avancé : cadences et fonctions tonique / sous-dominante / dominante.', type: 'goal', children: [
                  { id: 'th.chromatic', icon: '🌈', title: 'Harmonie chromatique', desc: 'Avancé : dominantes secondaires, sixte napolitaine, sixtes augmentées, modulations.', type: 'challenge', children: [
                    { id: 'th.jazz', icon: '🎷', title: 'Harmonie jazz', desc: 'Pro : ii-V-I dans les 12 tonalités, substitution tritonique, réharmonisation.', type: 'challenge' },
                  ] },
                  { id: 'th.counter', icon: '⛪', title: 'Choral à 4 voix', desc: 'Pro : écrire un choral à 4 voix et du contrepoint dans le style de Bach.', type: 'challenge', children: [
                    { id: 'th.arrange', icon: '🎻', title: 'Arrangeur', desc: 'Pro : arranger un morceau pour un ensemble (quatuor, cuivres, big band).', type: 'challenge' },
                  ] },
                  { id: 'th.analysis', icon: '🔬', title: 'Analyse', desc: 'Pro : analyser la forme et l\'harmonie d\'une œuvre (sonate, fugue, standard).', type: 'challenge' },
                ] },
              ] },
            ] },
          ] },
          // oreille
          { id: 'th.intervals', icon: '👂', title: 'Intervalles', desc: 'Intermédiaire : reconnaître les intervalles à l\'oreille.', type: 'goal', children: [
            { id: 'th.chordear', icon: '🎧', title: 'Oreille harmonique', desc: 'Intermédiaire : reconnaître accords et grilles à l\'oreille.', type: 'goal', children: [
              { id: 'th.transcribe', icon: '📝', title: 'Relevé', desc: 'Avancé : relever un morceau entier à l\'oreille (mélodie + accords).', type: 'challenge', children: [
                { id: 'th.dictation', icon: '🎓', title: 'Dictée à deux voix', desc: 'Pro : dictée musicale à deux voix.', type: 'challenge' },
              ] },
            ] },
          ] },
        ] },
      ],
    },
  },

  // =====================================================================
  {
    id: 'creation', title: 'Création', icon: '🎨', color: '#c040a8',
    tree: {
      id: 'cr.root', icon: '✏️', title: 'Créer un truc', desc: 'Finir un projet créatif, peu importe lequel.',
      children: [
        { id: 'cr.video', icon: '🎞️', title: 'Vidéo', desc: 'Monter une vidéo de A à Z.', children: [
          { id: 'cr.channel', icon: '📺', title: 'Ta chaîne', desc: 'Publier 10 vidéos.', type: 'goal', target: 10, unit: 'vidéos', children: [
            { id: 'cr.subs100', icon: '👥', title: 'Communauté', desc: '100 abonnés.', type: 'goal', target: 100, unit: 'abonnés', children: [
              { id: 'cr.subs1k', icon: '📈', title: 'Audience', desc: '1000 abonnés.', type: 'challenge', target: 1000, unit: 'abonnés' },
            ] },
          ] },
          { id: 'cr.color', icon: '🎨', title: 'Étalonneur', desc: 'Étalonner une vidéo entière dans DaVinci Resolve.' },
        ] },
        { id: 'cr.photo', icon: '📷', title: 'Photo', desc: 'Faire une photo dont tu es fier.', children: [
          { id: 'cr.360', icon: '🌐', title: 'Tour complet', desc: 'Publier une visite virtuelle 360.', type: 'goal', children: [
            { id: 'cr.client', icon: '💶', title: 'Pro', desc: 'Premier client payant pour une création.', type: 'challenge' },
          ] },
          { id: 'cr.expo', icon: '🖼️', title: 'Exposé', desc: 'Faire imprimer une photo en grand format.' },
        ] },
        { id: 'cr.fpv', icon: '🛸', title: 'Drone FPV', desc: 'Premier vol en drone.', children: [
          { id: 'cr.fpvfree', icon: '🌀', title: 'Freestyle', desc: 'Faire un power loop en FPV.', type: 'goal', children: [
            { id: 'cr.fpvbuild', icon: '🔧', title: 'Fait maison', desc: 'Monter ton propre drone FPV.', type: 'challenge' },
          ] },
        ] },
        { id: 'cr.code', icon: '💻', title: 'Code', desc: 'Écrire un programme qui te sert vraiment.', children: [
          { id: 'cr.site', icon: '🌍', title: 'En ligne', desc: 'Publier un site web.', children: [
            { id: 'cr.users', icon: '🧑‍🤝‍🧑', title: 'Utilisateurs', desc: 'Un projet utilisé par au moins 10 personnes.', type: 'challenge' },
          ] },
        ] },
        { id: 'cr.write', icon: '📝', title: 'Écriture', desc: 'Écrire une nouvelle ou un texte long.', children: [
          { id: 'cr.book', icon: '📚', title: 'Auteur', desc: 'Écrire un livre.', type: 'challenge' },
        ] },
        { id: 'cr.diy', icon: '🔨', title: 'Bricoleur', desc: 'Fabriquer un objet utile de tes mains.' },
      ],
    },
  },

  // =====================================================================
  {
    id: 'esprit', title: 'Esprit', icon: '🧠', color: '#6a5ff0',
    tree: {
      id: 'es.root', icon: '💡', title: 'Curiosité', desc: 'Apprendre quelque chose de nouveau juste parce que.',
      children: [
        { id: 'es.book1', icon: '📖', title: 'Lecture', desc: 'Finir un livre.', children: [
          { id: 'es.book12', icon: '📚', title: 'Un par mois', desc: 'Lire 12 livres dans l\'année.', type: 'goal', target: 12, unit: 'livres', children: [
            { id: 'es.book52', icon: '🏛️', title: 'Bibliothèque vivante', desc: 'Lire 52 livres dans l\'année.', type: 'challenge', target: 52, unit: 'livres' },
          ] },
        ] },
        { id: 'es.lang', icon: '🗣️', title: 'Langues', desc: 'Tenir une conversation de 10 min dans une langue étrangère.', children: [
          { id: 'es.en', icon: '💂', title: 'Anglais courant', desc: 'Parler anglais couramment.', type: 'goal', children: [
            { id: 'es.lang2', icon: '🎬', title: 'Sans sous-titres', desc: 'Regarder un film en VO sans sous-titres et tout comprendre.', type: 'goal', children: [
              { id: 'es.dream', icon: '💭', title: 'Bilingue', desc: 'Rêver dans une autre langue.', type: 'challenge' },
            ] },
          ] },
          { id: 'es.lang3', icon: '🈚', title: 'Polyglotte', desc: 'Apprendre les bases d\'une 3e langue.', type: 'goal', children: [
            { id: 'es.es', icon: '💃', title: 'Espagnol courant', desc: 'Tenir une vraie discussion en espagnol sans chercher tes mots.', type: 'goal' },
            { id: 'es.pt', icon: '⚽', title: 'Português fluente', desc: 'Tenir une vraie discussion en portugais sans chercher tes mots.', type: 'goal' },
            { id: 'es.4', icon: '🌐', title: 'Quatre langues', desc: 'Parler couramment 4 langues.', type: 'challenge' },
            { id: 'es.asia', icon: '🀄', title: 'Autre alphabet', desc: 'Apprendre les bases d\'une langue à l\'alphabet différent (russe, mandarin, arabe…).', type: 'challenge' },
          ] },
        ] },
        { id: 'es.cook', icon: '🍳', title: 'Cuisine', desc: 'Cuisiner un plat sans recette.', children: [
          { id: 'es.cook10', icon: '👨‍🍳', title: 'Carnet de recettes', desc: 'Maîtriser 10 plats par cœur.', type: 'goal', target: 10, unit: 'plats', children: [
            { id: 'es.dinner', icon: '🍽️', title: 'Chef', desc: 'Préparer un repas complet pour 8 personnes.', type: 'challenge' },
          ] },
          { id: 'es.bread', icon: '🥖', title: 'Boulanger', desc: 'Faire ton propre pain.' },
        ] },
        { id: 'es.medit', icon: '🧘', title: 'Méditation', desc: 'Méditer 10 minutes.', children: [
          { id: 'es.medit30', icon: '🕯️', title: 'Esprit calme', desc: 'Méditer 30 jours d\'affilée.', type: 'goal', target: 30, unit: 'jours' },
        ] },
        { id: 'es.chess', icon: '♟️', title: 'Échecs', desc: 'Gagner une partie d\'échecs.', children: [
          { id: 'es.elo', icon: '♛', title: 'Stratège', desc: 'Atteindre 1500 elo.', type: 'challenge' },
        ] },
        { id: 'es.skills', icon: '🎓', title: 'Formations', desc: 'Obtenir une certification / formation.', children: [
          { id: 'es.psc1', icon: '⛑️', title: 'Secouriste', desc: 'Passer le PSC1 (premiers secours).', type: 'goal' },
          { id: 'es.licence', icon: '📇', title: 'Nouveau permis', desc: 'Passer un nouveau permis (moto, bateau, drone, pilote…).', type: 'goal' },
        ] },
        { id: 'es.speak', icon: '🎙️', title: 'Orateur', desc: 'Parler devant plus de 20 personnes.', type: 'goal' },
      ],
    },
  },

  // =====================================================================
  {
    id: 'social', title: 'Social', icon: '❤️', color: '#d8404f',
    tree: {
      id: 'so.root', icon: '🤗', title: 'Pas tout seul', desc: 'Faire quelque chose de sympa pour quelqu\'un, sans raison.',
      children: [
        { id: 'so.volunteer', icon: '🙌', title: 'Bénévolat', desc: 'Donner une journée pour une association.', children: [
          { id: 'so.volunteer10', icon: '🤲', title: 'Engagé', desc: '10 actions bénévoles.', type: 'goal', target: 10, unit: 'actions' },
        ] },
        { id: 'so.blood', icon: '🩸', title: 'Don du sang', desc: 'Donner ton sang.', children: [
          { id: 'so.blood10', icon: '💉', title: 'Donneur régulier', desc: 'Donner ton sang 10 fois.', type: 'challenge', target: 10, unit: 'dons' },
          { id: 'so.organ', icon: '💗', title: 'Donneur', desc: 'Parler du don d\'organes à tes proches.' },
        ] },
        { id: 'so.party', icon: '🎉', title: 'Hôte', desc: 'Organiser une soirée chez toi.', children: [
          { id: 'so.surprise', icon: '🎁', title: 'Surprise !', desc: 'Organiser une fête surprise.', type: 'goal' },
          { id: 'so.trip', icon: '🚗', title: 'Organisateur', desc: 'Organiser un voyage entre potes.', type: 'goal' },
        ] },
        { id: 'so.oldfriend', icon: '📞', title: 'Retrouvailles', desc: 'Reprendre contact avec un vieil ami.' },
        { id: 'so.letter', icon: '✉️', title: 'À l\'ancienne', desc: 'Écrire une lettre à la main à quelqu\'un.' },
        { id: 'so.family', icon: '👨‍👩‍👧', title: 'Racines', desc: 'Enregistrer les souvenirs d\'un grand-parent.', type: 'goal' },
        { id: 'so.mentor', icon: '👨‍🏫', title: 'Mentor', desc: 'Aider quelqu\'un à progresser sur plusieurs mois.', type: 'challenge' },
      ],
    },
  },

  // =====================================================================
  {
    id: 'vie', title: 'Vie & Pro', icon: '💼', color: '#d0a830',
    tree: {
      id: 'vi.root', icon: '📇', title: 'Adulte certifié', desc: 'Gérer un truc administratif chiant sans procrastiner.',
      children: [
        { id: 'vi.salary', icon: '💶', title: 'Argent', desc: 'Toucher ton premier salaire.', children: [
          { id: 'vi.safety', icon: '🏦', title: 'Coussin de sécurité', desc: '3 mois de dépenses mis de côté.', type: 'goal', children: [
            { id: 'vi.invest', icon: '📈', title: 'Investisseur', desc: 'Faire ton premier investissement long terme.', type: 'goal', children: [
              { id: 'vi.10k', icon: '💰', title: '5 chiffres', desc: '10 000 € d\'épargne / investis.', type: 'challenge' },
            ] },
          ] },
          { id: 'vi.budget', icon: '🧾', title: 'Comptable', desc: 'Tenir un budget 3 mois d\'affilée.' },
        ] },
        { id: 'vi.company', icon: '🏢', title: 'Entreprendre', desc: 'Créer ton entreprise / micro-entreprise.', children: [
          { id: 'vi.client1', icon: '🤝', title: 'Premier client', desc: 'Être payé pour ton travail en indépendant.', type: 'goal', children: [
            { id: 'vi.ca1k', icon: '💸', title: 'Ça tourne', desc: '1000 € de chiffre d\'affaires.', type: 'goal', target: 1000, unit: '€', children: [
              { id: 'vi.passion', icon: '🌟', title: 'Vivre de sa passion', desc: 'Gagner ta vie avec ce que tu aimes faire.', type: 'challenge' },
            ] },
          ] },
        ] },
        { id: 'vi.move', icon: '📦', title: 'Chez soi', desc: 'Emménager dans ton propre logement.', children: [
          { id: 'vi.furniture', icon: '🛋️', title: 'Maître IKEA', desc: 'Monter un meuble sans vis en trop.' },
          { id: 'vi.plant', icon: '🌵', title: 'Main verte', desc: 'Garder une plante en vie un an.', type: 'goal' },
        ] },
        { id: 'vi.repair', icon: '🔧', title: 'Débrouillard', desc: 'Réparer toi-même un truc au lieu de le remplacer.', children: [
          { id: 'vi.bikefix', icon: '🚲', title: 'Mécano', desc: 'Faire l\'entretien complet de ton vélo.' },
          { id: 'vi.pcbuild', icon: '🖥️', title: 'Monteur PC', desc: 'Monter un PC de A à Z.', type: 'goal' },
        ] },
        { id: 'vi.zero', icon: '📭', title: 'Inbox zéro', desc: 'Zéro mail non traité et zéro papier en retard.' },
      ],
    },
  },

  // =====================================================================
  {
    id: 'sante', title: 'Santé', icon: '🌿', color: '#2fc0a0',
    tree: {
      id: 'sa.root', icon: '🌱', title: 'Prendre soin de soi', desc: 'Décider de faire attention à ta santé.',
      children: [
        { id: 'sa.sleep', icon: '😴', title: 'Sommeil', desc: '7 nuits d\'affilée de 8 h de sommeil.', target: 7, unit: 'nuits', children: [
          { id: 'sa.noscreen', icon: '📵', title: 'Écran noir', desc: 'Pas d\'écran 1 h avant de dormir, pendant 2 semaines.', type: 'goal' },
        ] },
        { id: 'sa.water', icon: '💧', title: 'Hydraté', desc: 'Boire 2 L d\'eau par jour pendant une semaine.' },
        { id: 'sa.cold', icon: '🥶', title: 'Froid', desc: 'Prendre une douche froide.', children: [
          { id: 'sa.cold30', icon: '🧊', title: 'Viking', desc: '30 douches froides d\'affilée.', type: 'goal', target: 30, unit: 'jours', children: [
            { id: 'sa.icebath', icon: '🏔️', title: 'Bain glacé', desc: 'Bain en eau < 5 °C.', type: 'challenge' },
          ] },
        ] },
        { id: 'sa.dry', icon: '🚱', title: 'Sobre', desc: 'Un mois sans alcool.', type: 'goal', children: [
          { id: 'sa.sugar', icon: '🍬', title: 'Sans sucre', desc: 'Un mois sans sucre ajouté.', type: 'challenge' },
        ] },
        { id: 'sa.detox', icon: '🔌', title: 'Déconnecté', desc: 'Un week-end complet sans téléphone.', type: 'goal' },
        { id: 'sa.checkup', icon: '🩺', title: 'Révision', desc: 'Faire un check-up : médecin, dentiste, prise de sang.' },
        { id: 'sa.veggie', icon: '🥦', title: 'Végé-curieux', desc: 'Une semaine de repas 100 % végétariens.' },
      ],
    },
  },
];
