// Arbres de progrès par défaut.
// Chaque nœud : { id, icon, title, desc, type?, target?, unit?, children? }
//   type   : 'task' (Progrès, 10 XP) | 'goal' (Objectif, 25 XP) | 'challenge' (Défi, 50 XP)
//   target : si présent, le nœud a un compteur (ex. 100 km) et se débloque tout seul à l'objectif
// Les ids doivent être uniques et NE DOIVENT PAS changer (c'est la clé de ta progression sauvegardée).

window.DEFAULT_TABS = [
  {
    id: 'sport', title: 'Sport', icon: '🏃', color: '#3d6b35',
    tree: {
      id: 'sp.root', icon: '👟', title: 'Bouger son corps', desc: 'Faire une vraie séance de sport. Le début de tout.',
      children: [
        { id: 'sp.run1', icon: '🏃', title: 'Premier footing', desc: 'Courir 20 minutes sans t\'arrêter.', children: [
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
        { id: 'sp.pull1', icon: '💪', title: 'Suspendu', desc: 'Faire ta première traction stricte.', children: [
          { id: 'sp.pull10', icon: '🦍', title: 'Gorille', desc: '10 tractions d\'affilée.', type: 'goal', children: [
            { id: 'sp.muscleup', icon: '🚀', title: 'Muscle-up', desc: 'Passer au-dessus de la barre.', type: 'challenge', children: [
              { id: 'sp.frontlever', icon: '🦅', title: 'Front lever', desc: 'Tenir un front lever 5 secondes.', type: 'challenge' },
            ] },
          ] },
          { id: 'sp.push50', icon: '🤜', title: '50 pompes', desc: '50 pompes d\'affilée, propres.', type: 'goal' },
        ] },
        { id: 'sp.plank', icon: '🧱', title: 'Gainé', desc: 'Tenir 2 minutes de gainage.', children: [
          { id: 'sp.handstand', icon: '🤸', title: 'Le monde à l\'envers', desc: 'Tenir 30 s en équilibre sur les mains sans mur.', type: 'challenge' },
          { id: 'sp.split', icon: '🩰', title: 'Élastique', desc: 'Faire le grand écart.', type: 'challenge' },
        ] },
        { id: 'sp.bike50', icon: '🚴', title: 'Sortie vélo', desc: 'Rouler 50 km dans la journée.', children: [
          { id: 'sp.bike100', icon: '💯', title: 'Centurion', desc: 'Rouler 100 km dans la journée.', type: 'goal', children: [
            { id: 'sp.col', icon: '🏔️', title: 'Grimpeur', desc: 'Monter un col de montagne mythique à vélo.', type: 'challenge' },
          ] },
        ] },
        { id: 'sp.swim', icon: '🏊', title: 'Poisson', desc: 'Nager 1 km sans t\'arrêter.', children: [
          { id: 'sp.openwater', icon: '🌊', title: 'Eau libre', desc: 'Faire une traversée en eau libre.', type: 'goal' },
        ] },
        { id: 'sp.streak7', icon: '📅', title: 'Semaine active', desc: '7 jours d\'affilée avec une activité physique.', target: 7, unit: 'jours', children: [
          { id: 'sp.streak30', icon: '🔥', title: 'Habitude', desc: '30 jours d\'affilée avec une activité physique.', type: 'goal', target: 30, unit: 'jours', children: [
            { id: 'sp.streak365', icon: '♾️', title: 'Machine', desc: 'Un an d\'activité physique quotidienne.', type: 'challenge', target: 365, unit: 'jours' },
          ] },
          { id: 'sp.6am', icon: '🌅', title: 'Lève-tôt', desc: 'Séance de sport terminée avant 7h du matin.' },
        ] },
        { id: 'sp.compet', icon: '🎽', title: 'Dossard', desc: 'Participer à une compétition officielle (n\'importe quel sport).', children: [
          { id: 'sp.podium', icon: '🥇', title: 'Podium', desc: 'Monter sur un podium.', type: 'challenge' },
        ] },
      ],
    },
  },

  {
    id: 'parkour', title: 'Parkour', icon: '🧗', color: '#5a4a3a',
    tree: {
      id: 'pk.root', icon: '🏙️', title: 'La ville est un terrain de jeu', desc: 'Faire ta première session de parkour dehors.',
      children: [
        { id: 'pk.roll', icon: '🔄', title: 'Roulade', desc: 'Roulade propre sur béton, sans douleur.', children: [
          { id: 'pk.drop', icon: '⬇️', title: 'Réception', desc: 'Drop de 2 m avec réception + roulade.', type: 'goal' },
        ] },
        { id: 'pk.prec', icon: '🎯', title: 'Précision', desc: 'Saut de précision stické, pieds joints.', children: [
          { id: 'pk.rail', icon: '🛤️', title: 'Funambule', desc: 'Précision sur une rambarde.', type: 'goal', children: [
            { id: 'pk.bigprec', icon: '📏', title: 'Grand saut', desc: 'Précision de plus de 3 m.', type: 'challenge' },
          ] },
        ] },
        { id: 'pk.vault', icon: '🐒', title: 'Passement', desc: 'Maîtriser speed vault et lazy vault.', children: [
          { id: 'pk.kong', icon: '🦍', title: 'Saut de chat', desc: 'Kong vault propre.', children: [
            { id: 'pk.dkong', icon: '🦍', title: 'Double kong', desc: 'Double saut de chat.', type: 'goal', children: [
              { id: 'pk.kongpre', icon: '🎯', title: 'Kong précision', desc: 'Kong enchaîné sur une précision.', type: 'challenge' },
            ] },
          ] },
        ] },
        { id: 'pk.wallrun', icon: '🧱', title: 'Passe-muraille', desc: 'Monter un mur de 2,5 m en wall run.', children: [
          { id: 'pk.tictac', icon: '⏲️', title: 'Tic-tac', desc: 'Tic-tac maîtrisé des deux côtés.' },
          { id: 'pk.cat', icon: '🐈', title: 'Chat perché', desc: 'Saut de bras (cat leap) sur un mur.', type: 'goal' },
        ] },
        { id: 'pk.backflip', icon: '🔙', title: 'Salto arrière', desc: 'Backflip au sol, sans parade.', type: 'goal', children: [
          { id: 'pk.sideflip', icon: '↔️', title: 'Side flip', desc: 'Salto latéral au sol.', type: 'goal' },
          { id: 'pk.frontflip', icon: '🔜', title: 'Front flip', desc: 'Salto avant au sol.', type: 'goal', children: [
            { id: 'pk.webster', icon: '🦵', title: 'Webster', desc: 'Salto avant sur une jambe.', type: 'challenge' },
          ] },
          { id: 'pk.gainer', icon: '🌀', title: 'Gainer', desc: 'Salto arrière en avançant.', type: 'challenge', children: [
            { id: 'pk.cork', icon: '🌪️', title: 'Cork', desc: 'Salto vrillé.', type: 'challenge' },
          ] },
        ] },
        { id: 'pk.line', icon: '🎥', title: 'Ligne filmée', desc: 'Filmer une ligne complète (5 mouvements ou plus) sans faute.', children: [
          { id: 'pk.edit', icon: '🎬', title: 'Premier edit', desc: 'Monter et publier un edit parkour.', type: 'goal', children: [
            { id: 'pk.views', icon: '👀', title: 'Viral-ish', desc: '1000 vues sur un edit.', type: 'challenge', target: 1000, unit: 'vues' },
          ] },
        ] },
        { id: 'pk.jam', icon: '🤝', title: 'Jam', desc: 'Participer à une jam avec une autre crew.', children: [
          { id: 'pk.teach', icon: '👨‍🏫', title: 'Transmettre', desc: 'Apprendre un mouvement à un débutant.', type: 'goal' },
          { id: 'pk.abroad', icon: '✈️', title: 'Spot étranger', desc: 'Entraînement dans un spot connu à l\'étranger.', type: 'goal' },
        ] },
      ],
    },
  },

  {
    id: 'aventure', title: 'Aventure', icon: '🧭', color: '#2f5f73',
    tree: {
      id: 'av.root', icon: '🎒', title: 'Sac sur le dos', desc: 'Partir quelque part juste pour découvrir.',
      children: [
        { id: 'av.stars', icon: '🌌', title: 'Belle étoile', desc: 'Dormir dehors, sans tente.', children: [
          { id: 'av.bivouac', icon: '⛺', title: 'Bivouac', desc: 'Bivouac en montagne.', children: [
            { id: 'av.gr', icon: '🥾', title: 'Itinérance', desc: 'Randonnée de 5 jours ou plus en autonomie.', type: 'goal', children: [
              { id: 'av.long', icon: '🗺️', title: 'Le grand chemin', desc: 'Faire un GR complet ou un chemin mythique (Compostelle, GR20…).', type: 'challenge' },
            ] },
          ] },
          { id: 'av.sunrise', icon: '🌄', title: 'Premier rayon', desc: 'Voir le lever du soleil depuis un sommet.', type: 'goal' },
        ] },
        { id: 'av.summit3k', icon: '🏔️', title: 'Tête dans les nuages', desc: 'Atteindre un sommet de plus de 3000 m.', type: 'goal', children: [
          { id: 'av.summit4k', icon: '🧊', title: 'Quatre mille', desc: 'Gravir un sommet de plus de 4000 m.', type: 'challenge' },
        ] },
        { id: 'av.country', icon: '🛂', title: 'Frontière', desc: 'Visiter un autre pays.', children: [
          { id: 'av.c10', icon: '🌐', title: 'Globe-trotter', desc: 'Visiter 10 pays.', type: 'goal', target: 10, unit: 'pays', children: [
            { id: 'av.c30', icon: '🗾', title: 'Citoyen du monde', desc: 'Visiter 30 pays.', type: 'challenge', target: 30, unit: 'pays' },
          ] },
          { id: 'av.continent', icon: '🌏', title: 'Autre continent', desc: 'Mettre les pieds sur un autre continent.', type: 'goal' },
          { id: 'av.solo', icon: '🧍', title: 'En solo', desc: 'Voyager seul au moins une semaine.', type: 'goal' },
        ] },
        { id: 'av.roadtrip', icon: '🚐', title: 'Road trip', desc: 'Un road trip d\'une semaine minimum.', children: [
          { id: 'av.nomad', icon: '🏕️', title: 'Nomade', desc: 'Vivre un mois en van / sur la route.', type: 'challenge' },
        ] },
        { id: 'av.adrenaline', icon: '⚡', title: 'Adrénaline', desc: 'Faire une activité à sensations (rafting, via ferrata, accrobranche extrême…).', children: [
          { id: 'av.parapente', icon: '🪂', title: 'Voler', desc: 'Faire du parapente.', type: 'goal' },
          { id: 'av.skydive', icon: '🛩️', title: 'Chute libre', desc: 'Sauter en parachute.', type: 'challenge' },
          { id: 'av.dive', icon: '🤿', title: 'Grand bleu', desc: 'Faire un baptême de plongée.', type: 'goal', children: [
            { id: 'av.diver', icon: '🐠', title: 'Plongeur', desc: 'Obtenir un niveau de plongée (N1 / Open Water).', type: 'challenge' },
          ] },
        ] },
        { id: 'av.aurora', icon: '🌠', title: 'Ciel vivant', desc: 'Voir une aurore boréale.', type: 'challenge' },
      ],
    },
  },

  {
    id: 'creation', title: 'Création', icon: '🎨', color: '#6b3d5e',
    tree: {
      id: 'cr.root', icon: '✏️', title: 'Créer un truc', desc: 'Finir un projet créatif, peu importe lequel.',
      children: [
        { id: 'cr.video', icon: '🎞️', title: 'Monteur', desc: 'Monter une vidéo de A à Z.', children: [
          { id: 'cr.channel', icon: '📺', title: 'Ta chaîne', desc: 'Publier 10 vidéos sur ta chaîne.', type: 'goal', target: 10, unit: 'vidéos', children: [
            { id: 'cr.subs100', icon: '👥', title: 'Communauté', desc: '100 abonnés.', type: 'goal', target: 100, unit: 'abonnés', children: [
              { id: 'cr.subs1k', icon: '📈', title: 'Monétisable', desc: '1000 abonnés.', type: 'challenge', target: 1000, unit: 'abonnés' },
            ] },
          ] },
          { id: 'cr.color', icon: '🎨', title: 'Étalonneur', desc: 'Étalonner une vidéo entière dans DaVinci Resolve.' },
        ] },
        { id: 'cr.photo', icon: '📷', title: 'Photographe', desc: 'Faire une photo dont tu es fier.', children: [
          { id: 'cr.360', icon: '🌐', title: 'Tour complet', desc: 'Publier une visite virtuelle 360.', type: 'goal', children: [
            { id: 'cr.client', icon: '💶', title: 'Pro', desc: 'Premier client payant pour une création.', type: 'challenge' },
          ] },
          { id: 'cr.expo', icon: '🖼️', title: 'Exposé', desc: 'Faire imprimer une photo en grand format.' },
        ] },
        { id: 'cr.music', icon: '🎸', title: 'Mélomane', desc: 'Commencer un instrument.', children: [
          { id: 'cr.song', icon: '🎶', title: 'Un morceau entier', desc: 'Jouer un morceau en entier sans te tromper.', type: 'goal', children: [
            { id: 'cr.live', icon: '🎤', title: 'Sur scène', desc: 'Jouer devant un public.', type: 'challenge' },
          ] },
          { id: 'cr.compose', icon: '🎼', title: 'Compositeur', desc: 'Composer un morceau original.', type: 'goal' },
        ] },
        { id: 'cr.code', icon: '💻', title: 'Hello world', desc: 'Écrire un programme qui te sert vraiment.', children: [
          { id: 'cr.site', icon: '🌍', title: 'En ligne', desc: 'Publier un site web.', children: [
            { id: 'cr.users', icon: '🧑‍🤝‍🧑', title: 'Utilisateurs', desc: 'Un projet utilisé par au moins 10 personnes.', type: 'challenge' },
          ] },
        ] },
        { id: 'cr.fpv', icon: '🛸', title: 'Pilote', desc: 'Premier vol en drone.', children: [
          { id: 'cr.fpvfree', icon: '🌀', title: 'Freestyle', desc: 'Faire un power loop en FPV.', type: 'goal', children: [
            { id: 'cr.fpvbuild', icon: '🔧', title: 'Fait maison', desc: 'Monter ton propre drone FPV.', type: 'challenge' },
          ] },
        ] },
        { id: 'cr.write', icon: '📝', title: 'Plume', desc: 'Écrire une nouvelle ou un texte long.', children: [
          { id: 'cr.book', icon: '📚', title: 'Auteur', desc: 'Écrire un livre.', type: 'challenge' },
        ] },
        { id: 'cr.diy', icon: '🔨', title: 'Bricoleur', desc: 'Fabriquer un objet utile de tes mains.' },
      ],
    },
  },

  {
    id: 'esprit', title: 'Esprit', icon: '🧠', color: '#3b4a7a',
    tree: {
      id: 'es.root', icon: '💡', title: 'Curiosité', desc: 'Apprendre quelque chose de nouveau juste parce que.',
      children: [
        { id: 'es.book1', icon: '📖', title: 'Lecteur', desc: 'Finir un livre.', children: [
          { id: 'es.book12', icon: '📚', title: 'Un par mois', desc: 'Lire 12 livres dans l\'année.', type: 'goal', target: 12, unit: 'livres', children: [
            { id: 'es.book52', icon: '🏛️', title: 'Bibliothèque vivante', desc: 'Lire 52 livres dans l\'année.', type: 'challenge', target: 52, unit: 'livres' },
          ] },
        ] },
        { id: 'es.lang', icon: '🗣️', title: 'Bonjour, hello, hola', desc: 'Tenir une conversation de 10 min dans une langue étrangère.', children: [
          { id: 'es.lang2', icon: '🎬', title: 'Sans sous-titres', desc: 'Regarder un film en VO sans sous-titres et tout comprendre.', type: 'goal', children: [
            { id: 'es.dream', icon: '💭', title: 'Bilingue', desc: 'Rêver dans une autre langue.', type: 'challenge' },
          ] },
          { id: 'es.lang3', icon: '🈚', title: 'Polyglotte', desc: 'Apprendre les bases d\'une 3e langue.', type: 'goal' },
        ] },
        { id: 'es.cook', icon: '🍳', title: 'Cuistot', desc: 'Cuisiner un plat sans recette.', children: [
          { id: 'es.cook10', icon: '👨‍🍳', title: 'Carnet de recettes', desc: 'Maîtriser 10 plats par cœur.', type: 'goal', target: 10, unit: 'plats', children: [
            { id: 'es.dinner', icon: '🍽️', title: 'Chef', desc: 'Préparer un repas complet pour 8 personnes.', type: 'challenge' },
          ] },
          { id: 'es.bread', icon: '🥖', title: 'Boulanger', desc: 'Faire ton propre pain.' },
        ] },
        { id: 'es.medit', icon: '🧘', title: 'Silence', desc: 'Méditer 10 minutes.', children: [
          { id: 'es.medit30', icon: '🕯️', title: 'Esprit calme', desc: 'Méditer 30 jours d\'affilée.', type: 'goal', target: 30, unit: 'jours' },
        ] },
        { id: 'es.chess', icon: '♟️', title: 'Échec et mat', desc: 'Gagner une partie d\'échecs.', children: [
          { id: 'es.elo', icon: '♛', title: 'Stratège', desc: 'Atteindre 1500 elo.', type: 'challenge' },
        ] },
        { id: 'es.skills', icon: '🎓', title: 'Diplômé de la vie', desc: 'Obtenir une certification / formation.', children: [
          { id: 'es.psc1', icon: '⛑️', title: 'Secouriste', desc: 'Passer le PSC1 (premiers secours).', type: 'goal' },
          { id: 'es.licence', icon: '📇', title: 'Nouveau permis', desc: 'Passer un nouveau permis (moto, bateau, drone, pilote…).', type: 'goal' },
        ] },
        { id: 'es.speak', icon: '🎙️', title: 'Orateur', desc: 'Parler devant plus de 20 personnes.', type: 'goal' },
      ],
    },
  },

  {
    id: 'social', title: 'Social', icon: '❤️', color: '#7a3b3b',
    tree: {
      id: 'so.root', icon: '🤗', title: 'Pas tout seul', desc: 'Faire quelque chose de sympa pour quelqu\'un, sans raison.',
      children: [
        { id: 'so.volunteer', icon: '🙌', title: 'Bénévole', desc: 'Donner une journée pour une association.', children: [
          { id: 'so.volunteer10', icon: '🤲', title: 'Engagé', desc: '10 actions bénévoles.', type: 'goal', target: 10, unit: 'actions' },
        ] },
        { id: 'so.blood', icon: '🩸', title: 'Sang pour sang', desc: 'Donner ton sang.', children: [
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

  {
    id: 'vie', title: 'Vie & Pro', icon: '💼', color: '#5e5a2f',
    tree: {
      id: 'vi.root', icon: '📇', title: 'Adulte certifié', desc: 'Gérer un truc administratif chiant sans procrastiner.',
      children: [
        { id: 'vi.salary', icon: '💶', title: 'Premier salaire', desc: 'Toucher ton premier salaire.', children: [
          { id: 'vi.safety', icon: '🏦', title: 'Coussin de sécurité', desc: '3 mois de dépenses mis de côté.', type: 'goal', children: [
            { id: 'vi.invest', icon: '📈', title: 'Investisseur', desc: 'Faire ton premier investissement long terme.', type: 'goal', children: [
              { id: 'vi.10k', icon: '💰', title: '5 chiffres', desc: '10 000 € d\'épargne / investis.', type: 'challenge' },
            ] },
          ] },
          { id: 'vi.budget', icon: '🧾', title: 'Comptable', desc: 'Tenir un budget 3 mois d\'affilée.' },
        ] },
        { id: 'vi.company', icon: '🏢', title: 'Entrepreneur', desc: 'Créer ton entreprise / micro-entreprise.', children: [
          { id: 'vi.client1', icon: '🤝', title: 'Premier client', desc: 'Être payé pour ton travail en indépendant.', type: 'goal', children: [
            { id: 'vi.ca1k', icon: '💸', title: 'Ça tourne', desc: '1000 € de chiffre d\'affaires.', type: 'goal', target: 1000, unit: '€', children: [
              { id: 'vi.passion', icon: '🌟', title: 'Vivre de sa passion', desc: 'Gagner ta vie avec ce que tu aimes faire.', type: 'challenge' },
            ] },
          ] },
        ] },
        { id: 'vi.move', icon: '📦', title: 'Chez soi', desc: 'Emménager dans ton propre logement.', children: [
          { id: 'vi.furniture', icon: '🪑', title: 'Maître IKEA', desc: 'Monter un meuble sans vis en trop.' },
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

  {
    id: 'sante', title: 'Santé', icon: '🌿', color: '#2f6b5a',
    tree: {
      id: 'sa.root', icon: '🌱', title: 'Prendre soin de soi', desc: 'Décider de faire attention à ta santé.',
      children: [
        { id: 'sa.sleep', icon: '😴', title: 'Marmotte', desc: '7 nuits d\'affilée de 8 h de sommeil.', target: 7, unit: 'nuits', children: [
          { id: 'sa.noscreen', icon: '📵', title: 'Écran noir', desc: 'Pas d\'écran 1 h avant de dormir, pendant 2 semaines.', type: 'goal' },
        ] },
        { id: 'sa.water', icon: '💧', title: 'Hydraté', desc: 'Boire 2 L d\'eau par jour pendant une semaine.' },
        { id: 'sa.cold', icon: '🥶', title: 'Douche froide', desc: 'Prendre une douche froide.', children: [
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
