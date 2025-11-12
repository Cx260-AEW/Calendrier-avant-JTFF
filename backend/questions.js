// Questions du calendrier de l'Avent - Navigation Aérienne
// 100 questions réparties sur 25 jours (4 par jour)
// Chaque question a maintenant une explication !

export const questions = [
  // ========================================
  // JOUR 1
  // ========================================
  {
    id: 1,
    day: 1,
    group: "🧭Navigation aérienne",
    question: "Quelle est la différence principale entre la route vraie (RV) et la route magnétique (RM) ?",
    options: [
      "La route vraie prend en compte le vent",
      "La route magnétique est corrigée de la déclinaison magnétique",
      "La route vraie dépend de la dérive",
      "Elles sont identiques"
    ],
    correctAnswer: 1,
    explanation: "💬La route vraie est mesurée par rapport au nord géographique, la route magnétique par rapport au nord magnétique. \n 📚Source : OACI Annexe 4 – Cartes aéronautiques."
  },
  {
    id: 2,
    day: 1,
    group: "🎧Contrôle aérien",
    question: "Quel est le rôle principal du contrôle aérien ?",
    options: [
      "Garantir la sécurité et la régularité du trafic aérien",
      "Vérifier les plans de vol",
      "Gérer les services au sol",
      "Superviser les équipages"
    ],
    correctAnswer: 0,
    explanation: "💬Le contrôle aérien prévient les collisions et assure la fluidité du trafic. \n 📚Source : OACI Annexe 11."
  },
  {
    id: 3,
    day: 1,
    group: "📜Réglementation",
    question: "En règle générale quelle est la visibilité minimale en vol VFR de classe G en dessous de 3000 ft AMSL ?",
    options: [
      "1 km",
      "3 km",
      "5 km",
      "8 km"
    ],
    correctAnswer: 2,
    explanation: "💬En classe G en dessous de 3000 ft AMSL, la visibilité minimale en VFR est de 5 km. \n 📚Source : SERA.5005."
  },
  {
    id: 4,
    day: 1,
    group: "🗺️ Cartes aéronautiques",
    question: "Sur une carte OACI 1:500 000, 1 cm représente :",
    options: [
      "1 NM",
      "2,7 NM",
      "5 NM",
      "1,85 NM"
    ],
    correctAnswer: 1,
    explanation: "💬À cette échelle, 1 cm sur la carte équivaut à 5 km, soit environ 2,7 NM. \n 📚Source : IGN / OACI – Carte VFR France."
  },

  // ========================================
  // JOUR 2
  // ========================================
  {
    id: 5,
    day: 2,
    group: "🧭Navigation aérienne",
    question: "Si la déclinaison magnétique est de 10° Est, la route magnétique sera :",
    options: [
      "Route Vraie + 10°",
      "Route Vraie – 10°",
      "Route Magnétique + 10°",
      "Impossible à déterminer"
    ],
    correctAnswer: 1,
    explanation: "💬Si la déclinaison est Est, on soustrait la valeur à la route vraie pour obtenir la route magnétique, et si la déclinaison est Ouest on ajoute \n 📚Source : Manuel de navigation DGAC."
  },
  {
    id: 6,
    day: 2,
    group: "🎧Contrôle aérien",
    question: "En espace contrôlé, le pilote doit :",
    options: [
      "Être en contact radio avec l'ATC",
      "Voler en IFR uniquement",
      "Être équipé de radar météo",
      "Avoir un copilote"
    ],
    correctAnswer: 0,
    explanation: "💬Le contact radio permanent avec l'ATC est obligatoire pour tout vol dans un espace contrôlé. \n 📚Source : SERA.6001."
  },
  {
    id: 7,
    day: 2,
    group: "📜Réglementation",
    question: "Quelle est la distance minimale par rapport aux nuages en classe G sous 3000 ft AMSL ?",
    options: [
      "Hors des nuages, en vue du sol",
      "300 m horizontal, 150 m vertical",
      "1000 m horizontal, 300 m vertical",
      "1500 m horizontal, 300 m vertical"
    ],
    correctAnswer: 0,
    explanation: "💬En classe G sous 3000 ft AMSL, le pilote doit rester hors des nuages et en vue du sol. \n 📚Source : SERA.5005."
  },
  {
    id: 8,
    day: 2,
    group: "🗺️ Cartes aéronautiques",
    question: "Les zones P, R, D signifient respectivement :",
    options: [
      "Prohibited, Restricted, Danger",
      "Police, Radar, Defense",
      "Protected, Regulated, Danger",
      "Privée, Réservée, Délimitée"
    ],
    correctAnswer: 0,
    explanation: "💬P = interdite, R = restreinte, D = dangereuse ; symboles OACI standard. \n 📚Source : AIP France ENR 5.1."
  },

  // ========================================
  // JOUR 3
  // ========================================
  {
    id: 9,
    day: 3,
    group: "🧭Navigation aérienne",
    question: "Le cap compas (CC) diffère du cap magnétique (CM) à cause :",
    options: [
      "De la déclinaison",
      "De la déviation",
      "Du vent",
      "Du gyro"
    ],
    correctAnswer: 1,
    explanation: "💬La déviation est due aux perturbations magnétiques internes de l'aéronef. \n 📚Source : DGAC – Manuel du pilote privé."
  },
  {
    id: 10,
    day: 3,
    group: "🎧Contrôle aérien",
    question: "Le code transpondeur 7000 correspond à :",
    options: [
      "Vol IFR",
      "Urgence",
      "Vol VFR standard",
      "Panne radio"
    ],
    correctAnswer: 2,
    explanation: "💬7000 est le code standard pour les vols VFR en Europe. \n 📚Source : SERA.13001."
  },
  {
    id: 11,
    day: 3,
    group: "📜Réglementation",
    question: "En classe D, un vol VFR doit :",
    options: [
      "Recevoir une clearance et des informations de trafic",
      "Voler en IFR uniquement",
      "Avoir un plan de vol déposé",
      "Être guidé en permanence"
    ],
    correctAnswer: 0,
    explanation: "💬En classe D, le VFR reçoit une autorisation (clearance) et des informations de trafic. \n 📚Source : SERA.6001."
  },
  {
    id: 12,
    day: 3,
    group: "🗺️ Cartes aéronautiques",
    question: "Une zone R est :",
    options: [
      "Interdite en tout temps",
      "Soumise à autorisation préalable",
      "Réservée aux IFR",
      "Toujours active"
    ],
    correctAnswer: 1,
    explanation: "💬Une zone R est restreinte et nécessite autorisation du gestionnaire avant pénétration. \n 📚Source : AIP France ENR 5.1."
  },

  // ========================================
  // JOUR 4
  // ========================================
  {
    id: 13,
    day: 4,
    group: "🧭Navigation aérienne",
    question: "Le vent de face a pour effet :",
    options: [
      "D'augmenter la vitesse sol",
      "De diminuer la vitesse sol",
      "D'augmenter la vitesse indiquée",
      "De modifier la route"
    ],
    correctAnswer: 1,
    explanation: "💬Un vent de face réduit la vitesse sol car il s'oppose à la progression de l'aéronef. \n 📚Source : OACI PANS-OPS Vol I."
  },
  {
    id: 14,
    day: 4,
    group: "🎧Contrôle aérien",
    question: "Le code 7600 signifie :",
    options: [
      "Détournement",
      "Urgence médicale",
      "Panne radio",
      "Vol militaire"
    ],
    correctAnswer: 2,
    explanation: "💬7600 indique une panne radio complète. \n 📚Source : SERA.13001."
  },
  {
    id: 15,
    day: 4,
    group: "📜Réglementation",
    question: "En France il est recommandé de deposer un plan de vol VFR :",
    options: [
      "Uniquement pour les vols internationaux",
      "Pour tout vol dépassant 30 km",
      "Pour les vols de plus de 100 km ou franchissant une frontière",
      "Pour tous les vols VFR"
    ],
    correctAnswer: 2,
    explanation: "💬La DGAC recommande le dépôt de plan de vol pour tout vol de plus de 100 km. \n 📚Source : DGAC."
  },
  {
    id: 16,
    day: 4,
    group: "🗺️ Cartes aéronautiques",
    question: "Les lignes bleues épaisses sur une carte VFR indiquent :",
    options: [
      "Des routes",
      "Des espaces aériens contrôlés",
      "Des fleuves",
      "Des zones militaires"
    ],
    correctAnswer: 1,
    explanation: "💬Elles délimitent les CTR, TMA ou espaces aériens de classe D ou C. \n 📚Source : OACI Annexe 4."
  },

  // ========================================
  // JOUR 5
  // ========================================
  {
    id: 17,
    day: 5,
    group: "🧭Navigation aérienne",
    question: "Quelle est la formule de la dérive approximative ?",
    options: [
      "(Vent × Temps) / Distance",
      "(Vent × 60) / Vitesse vraie",
      "(Vent latéral / Vitesse vraie) × 60",
      "(Cap × Vent) / 100"
    ],
    correctAnswer: 2,
    explanation: "💬La dérive dépend du vent latéral et de la vitesse vraie, ramenée à une base de 60 NM/h. \n 📚Source : DGAC – Manuel de navigation."
  },
  {
    id: 18,
    day: 5,
    group: "🎧Contrôle aérien",
    question: "En approche finale, le pilote reçoit l'autorisation \"Cleared to land\". Cela signifie :",
    options: [
      "Vous pouvez atterrir",
      "Vous devez atterrir immédiatement",
      "La piste est libre",
      "Vous êtes prioritaire sur tous les autres trafics"
    ],
    correctAnswer: 0,
    explanation: "💬\"Cleared to land\" autorise l'atterrissage, mais le pilote reste responsable de vérifier que la piste est libre. \n 📚Source : OACI Doc 4444."
  },
  {
    id: 19,
    day: 5,
    group: "📜Réglementation",
    question: "En France, la règle semi-circulaire VFR s'applique à partir de :",
    options: [
      "La surface",
      "1500 ft AMSL",
      "3000 ft AMSL",
      "5000 ft AMSL"
    ],
    correctAnswer: 2,
    explanation: "💬La règle semi-circulaire commence à 3000 ft AMSL. \n 📚Source : SERA.5005."
  },
  {
    id: 20,
    day: 5,
    group: "🗺️ Cartes aéronautiques",
    question: "Un aérodrome non contrôlé est indiqué par :",
    options: [
      "Un cercle bleu vide",
      "Un cercle bleu plein",
      "Un carré rouge",
      "Un cercle rouge"
    ],
    correctAnswer: 0,
    explanation: "💬Sur une carte OACI, un cercle bleu vide indique un aérodrome non contrôlé ou avec un agent AFIS. \n 📚Source : Légende carte OACI France."
  },

  // ========================================
  // JOUR 6
  // ========================================
  {
    id: 21,
    day: 6,
    group: "🧭Navigation aérienne",
    question: "Quelle unité utilise-t-on pour mesurer la vitesse du vent en aviation ?",
    options: [
      "Km/h",
      "M/s",
      "Nœuds",
      "Pieds/min"
    ],
    correctAnswer: 2,
    explanation: "💬1 nœud = 1 mille nautique par heure. \n 📚Source : OACI Annexe 5 – Unités de mesure."
  },
  {
    id: 22,
    day: 6,
    group: "🎧Contrôle aérien",
    question: "Que signifie l'instruction \"Orbit left\" ?",
    options: [
      "Tourner à gauche",
      "Faire un 360° à gauche",
      "Virer à gauche puis à droite",
      "Rester en attente"
    ],
    correctAnswer: 1,
    explanation: "💬\"Orbit left\" demande un tour complet (360°) vers la gauche. \n 📚Source : OACI Doc 4444."
  },
  {
    id: 23,
    day: 6,
    group: "📜Réglementation",
    question: "Quelle est la vitesse maximale en dessous de 10 000 ft ?",
    options: [
      "200 kt",
      "220 kt",
      "250 kt",
      "300 kt"
    ],
    correctAnswer: 2,
    explanation: "💬Limite réglementaire pour maintenir une séparation suffisante. \n 📚Source : SERA.6005."
  },
  {
    id: 24,
    day: 6,
    group: "🗺️ Cartes aéronautiques",
    question: "La Grid MORA fournit :",
    options: [
      "L’altitude minimale pour suivre une procédure d’approche",
      "L’altitude minimale de sécurité dans une grille de 1°×1°",
      "L’altitude de transition d’un pays",
      "La hauteur minimale de survol d’une ville"
    ],
    correctAnswer: 1,
    explanation: "💬La Grid MORA pour Minimum Off-Route Altitude donne une altitude minimale de sécurité pour chaque grille de latitude/longitude. \n 📚Source : OACI Doc 8168."
  },

  // ========================================
  // JOUR 7
  // ========================================
  {
    id: 25,
    day: 7,
    group: "🧭Navigation aérienne",
    question: "Un NM (mille nautique) correspond à :",
    options: [
      "1,609 km",
      "1,852 km",
      "1,944 km",
      "1,789 km"
    ],
    correctAnswer: 1,
    explanation: "💬1 NM équivaut à 1 minute d'arc terrestre, soit 1,852 km. \n 📚Source : OACI Annexe 5."
  },
  {
    id: 26,
    day: 7,
    group: "🎧Contrôle aérien",
    question: "Un QNH de 1013 hPa correspond à :",
    options: [
      "Pression standard au niveau de la mer",
      "Altitude pression",
      "QFE de l'aérodrome",
      "QFF corrigé"
    ],
    correctAnswer: 0,
    explanation: "💬1013,25 hPa est la pression atmosphérique standard au niveau de la mer (ISA). \n 📚Source : OACI Annexe 3."
  },
  {
    id: 27,
    day: 7,
    group: "📜Réglementation",
    question: "En VFR, le niveau de croisière est choisi :",
    options: [
      "Selon la route vraie",
      "Selon la route magnétique",
      "Selon le vent",
      "Selon l'altitude du terrain"
    ],
    correctAnswer: 1,
    explanation: "💬Les niveaux VFR sont déterminés selon la route magnétique : impair (000–179°), pair (180–359°). \n 📚Source : SERA.5005."
  },
  {
    id: 28,
    day: 7,
    group: "🗺️ Cartes aéronautiques",
    image: true,
    question: "Cette flèche de vent indique :",
    options: [
      "65 Kts",
      "60 Kts",
      "45 kts",
      "75 Kts"
    ],
    correctAnswer: 0,
    explanation: "💬Le triangle indique 50, une barre complète indique 10 et une demi-barre indique 5. \n 📚Source : Météo-France / OACI Annexe 3."
  },

  // ========================================
  // JOUR 8
  // ========================================
  {
    id: 29,
    day: 8,
    group: "🧭Navigation aérienne",
    question: "La vitesse indiquée (IAS) ne tient pas compte :",
    options: [
      "De la densité de l'air",
      "De la température",
      "De la pression",
      "Du vent"
    ],
    correctAnswer: 0,
    explanation: "💬L'IAS dépend de la pression dynamique mais pas de la densité réelle. \n 📚Source : OACI Doc 8168."
  },
  {
    id: 30,
    day: 8,
    group: "🎧Contrôle aérien",
    question: "Que signifie \"Roger\" ?",
    options: [
      "J'ai reçu votre message",
      "Je comprends",
      "D'accord",
      "Affirmatif"
    ],
    correctAnswer: 0,
    explanation: "💬\"Roger\" signifie uniquement que le message a été reçu, pas nécessairement compris. \n 📚Source : OACI Annexe 10."
  },
  {
    id: 31,
    day: 8,
    group: "📜Réglementation",
    question: "En France, la phraséologie se fait principalement en :",
    options: [
      "Français et Anglais",
      "Français uniquement",
      "Anglais uniquement",
      "Langue locale"
    ],
    correctAnswer: 0,
    explanation: "💬Les deux langues officielles sont autorisées sur les fréquences nationales. \n 📚Source : AIP France GEN 3.4."
  },
  {
    id: 32,
    day: 8,
    group: "🗺️ Cartes aéronautiques",
    image: true,
    question: "Sur une carte VAC, le cercle bleu correspond à :",
    options: [
      "Une zone dont le survol est à éviter",
      "Une zone dont le survol est interdit",
      "Une zone où le survol est obligatoire",
      "Une zone à faible densité de population"
    ],
    correctAnswer: 0,
    explanation: "💬Ces zones signalent un survol à éviter pour cause de bruit ou de sécurité. \n 📚Source : Légende VAC – SIA France."
    
  },

  // ========================================
  // JOUR 9
  // ========================================
  {
    id: 33,
    day: 9,
    group: "🧭Navigation aérienne",
    question: "Quelle est la principale utilisation du conservateur de cap ?",
    options: [
      "Mesurer la dérive",
      "Donner un cap stable sans oscillations",
      "Mesurer la vitesse",
      "Afficher le vent"
    ],
    correctAnswer: 1,
    explanation: "💬Le conservateur de cap est gyroscopique, donc insensible aux variations magnétiques. \n 📚Source : DGAC – Manuel de pilotage."
  },
  {
    id: 34,
    day: 9,
    group: "🎧Contrôle aérien",
    question: "La phrase \"Say again\" signifie :",
    options: [
      "Répétez votre message",
      "Parlez plus fort",
      "Changez de fréquence",
      "Attendez"
    ],
    correctAnswer: 0,
    explanation: "💬\"Say again\" demande la répétition du dernier message. \n 📚Source : OACI Annexe 10."
  },
  {
    id: 35,
    day: 9,
    group: "📜Réglementation",
    question: "En Europe, Le vol à vue (VFR) est interdit :",
    options: [
      "Au-dessus du FL195",
      "Au-dessus du FL245",
      "En dessous du FL50",
      "Dans les CTR"
    ],
    correctAnswer: 0,
    explanation: "💬Le FL195 marque la limite supérieure du VFR dans l'espace aérien supérieur (classe A). \n 📚Source : SERA.5005."
  },
  {
    id: 36,
    day: 9,
    group: "🗺️ Cartes aéronautiques",
    question: "La déclinaison magnétique est indiquée sur les cartes :",
    options: [
      "IFR uniquement",
      "VFR et IFR",
      "Aucune",
      "AIP uniquement"
    ],
    correctAnswer: 1,
    explanation: "💬Elle permet la conversion entre route vraie et route magnétique. \n 📚Source : OACI Annexe 4."
  },

  // ========================================
  // JOUR 10
  // ========================================
  {
    id: 37,
    day: 10,
    group: "🧭Navigation aérienne",
    question: "En vol VFR, la navigation à l'estime consiste à :",
    options: [
      "Suivre un cap sans repère visuel",
      "Naviguer uniquement aux instruments",
      "Utiliser le GPS",
      "Lire la carte uniquement"
    ],
    correctAnswer: 0,
    explanation: "💬La navigation à l'estime repose sur le cap, la vitesse, le temps et la distance parcourue. \n 📚Source : OACI Doc 9613 – Performance-Based Navigation."
  },
  {
    id: 38,
    day: 10,
    group: "🎧Contrôle aérien",
    question: "\"Standby\" signifie :",
    options: [
      "Restez à l'écoute, je vous rappelle",
      "Maintenez votre position",
      "Préparez-vous au décollage",
      "Attendez l'autorisation"
    ],
    correctAnswer: 0,
    explanation: "💬\"Standby\" demande d'attendre un instant sur la fréquence. \n 📚Source : OACI Annexe 10."
  },
  {
    id: 39,
    day: 10,
    group: "📜Réglementation",
    question: "L'équipement obligatoire pour un vol VFR de jour inclut :",
    options: [
      "Un extincteur",
      "Une radio VHF",
      "Des feux de navigation",
      "Un GPS"
    ],
    correctAnswer: 1,
    explanation: "💬La radio VHF est obligatoire en espace contrôlé. \n 📚Source : SERA.5005."
  },
  {
    id: 40,
    day: 10,
    group: "🗺️ Cartes aéronautiques",
    question: "Que signifie MEA :",
    options: [
      "Mer Méditerranée",
      "Minimum Enroute Altitude",
      "Maximum Entry Route",
      "Message En Route"
    ],
    correctAnswer: 1,
    explanation: "💬Altitude minimale sur une route IFR garantissant séparation, couverture radio et sécurité obstacle. \n 📚Source : OACI Doc 8168."
  },

  // ========================================
  // JOUR 11
  // ========================================
  {
    id: 41,
    day: 11,
    group: "🧭Navigation aérienne",
    question: "Quelle information fournit un VOR ?",
    options: [
      "Distance uniquement",
      "Cap vrai",
      "Azimut magnétique par rapport à la station",
      "Position géographique exacte"
    ],
    correctAnswer: 2,
    explanation: "💬Le VOR indique le radial magnétique à partir de la station. \n 📚Source : OACI Annexe 10."
  },
  {
    id: 42,
    day: 11,
    group: "🎧Contrôle aérien",
    question: "La tour de contrôle est désignée par l'abréviation :",
    options: [
      "APP",
      "TWR",
      "ACC",
      "GND"
    ],
    correctAnswer: 1,
    explanation: "💬TWR (Tower) gère les mouvements sur l'aérodrome et dans la CTR. \n 📚Source : OACI Annexe 11."
  },
  {
    id: 43,
    day: 11,
    group: "📜Réglementation",
    question: "La limite inférieure d'un espace aérien est exprimée en :",
    options: [
      "Altitude (AMSL) ou hauteur (AGL)",
      "Pieds uniquement",
      "Niveaux de vol uniquement",
      "Mètres"
    ],
    correctAnswer: 0,
    explanation: "💬Les limites peuvent être en altitude (AMSL) ou hauteur (AGL) selon le contexte. \n 📚Source : OACI Annexe 11."
  },
  {
    id: 44,
    day: 11,
    group: "🗺️ Cartes aéronautiques",
    image: true,
    question: "Sur cette carte, la flèche bleue signifie :",
    options: [
      "Informations radiales/distances par rapport à un repère donné",
      "Des trajectoires recommandées",
      "Une altitude",
      "Une balise"
    ],
    correctAnswer: 0,
    explanation: "💬Indique un axe de relèvement (QDR/QDM) et distance depuis un repère (souvent balise ou aérodrome). \n 📚Source : Légende VAC – SIA France."
  },

  // ========================================
  // JOUR 12
  // ========================================
  {
    id: 45,
    day: 12,
    group: "🧭Navigation aérienne",
    question: "Un DME indique :",
    options: [
      "Le cap à suivre",
      "La distance oblique à la station",
      "Le vent",
      "La route magnétique"
    ],
    correctAnswer: 1,
    explanation: "💬Le DME mesure la distance en ligne droite entre l'aéronef et la balise. \n 📚Source : OACI Annexe 10."
  },
  {
    id: 46,
    day: 12,
    group: "🎧Contrôle aérien",
    question: "L'approche (APP) gère :",
    options: [
      "Les départs",
      "Les arrivées et départs dans la TMA",
      "Les vols en route",
      "Le sol uniquement"
    ],
    correctAnswer: 1,
    explanation: "💬APP coordonne les arrivées et départs dans la zone terminale (TMA). \n 📚Source : OACI Annexe 11."
  },
  {
    id: 47,
    day: 12,
    group: "📜Réglementation",
    question: "Un espace aérien de classe A est :",
    options: [
      "Réservé aux vols IFR",
      "Ouvert aux VFR avec clearance",
      "Non contrôlé",
      "Mixte IFR/VFR"
    ],
    correctAnswer: 0,
    explanation: "💬Seuls les vols IFR sont autorisés en classe A. \n 📚Source : OACI Annexe 11."
  },
  {
    id: 48,
    day: 12,
    group: "🗺️ Cartes aéronautiques",
    question: "Une TMA est représentée par :",
    options: [
      "Des lignes rouges",
      "Des contours bleus",
      "Des pointillés",
      "Des hachures"
    ],
    correctAnswer: 1,
    explanation: "💬Les zones TMA sont représentées par des traits bleus avec limites verticales indiquées. \n 📚Source : OACI Annexe 4."
  },

  // ========================================
  // JOUR 13
  // ========================================
  {
    id: 49,
    day: 13,
    group: "🧭Navigation aérienne",
    question: "Quelle est la précision d'un VOR conventionnel ?",
    options: [
      "±2°",
      "±5°",
      "±10°",
      "±1°"
    ],
    correctAnswer: 0,
    explanation: "💬La tolérance d'erreur d'un VOR est de ±2° selon les normes OACI. \n 📚Source : OACI Doc 8071."
  },
  {
    id: 50,
    day: 13,
    group: "🎧Contrôle aérien",
    question: "Le centre de contrôle en route est appelé :",
    options: [
      "TWR",
      "APP",
      "ACC",
      "FIS"
    ],
    correctAnswer: 2,
    explanation: "💬ACC (Area Control Center) gère les vols en route. \n 📚Source : OACI Annexe 11."
  },
  {
    id: 51,
    day: 13,
    group: "📜Réglementation",
    question: "En classe B, les vols VFR doivent :",
    options: [
      "Obtenir une clearance et rester séparés",
      "Voler sans clearance",
      "Éviter les IFR",
      "Suivre uniquement les règles de séparation visuelle"
    ],
    correctAnswer: 0,
    explanation: "💬Les vols VFR en classe B reçoivent une clearance et sont séparés de tous les trafics. \n 📚Source : OACI Annexe 11."
  },
  {
    id: 52,
    day: 13,
    group: "🗺️ Cartes aéronautiques",
    question: "Le relief est indiqué sur une carte par :",
    options: [
      "Des lignes de niveau et des couleurs",
      "Des chiffres uniquement",
      "Des zones ombrées",
      "Des cercles rouges"
    ],
    correctAnswer: 0,
    explanation: "💬Les dégradés de couleur représentent les altitudes du terrain. \n 📚Source : OACI Annexe 4 ; IGN."
  },

  // ========================================
  // JOUR 14
  // ========================================
  {
    id: 53,
    day: 14,
    group: "🧭Navigation aérienne",
    question: "Quelle est la différence entre un ADF et un VOR ?",
    options: [
      "L'ADF indique la position exacte",
      "L'ADF donne le relèvement de la balise NDB",
      "Le VOR fonctionne sur basse fréquence",
      "L'ADF est utilisé en IFR seulement"
    ],
    correctAnswer: 1,
    explanation: "💬L'ADF capte les ondes d'une NDB et indique le relèvement vers celle-ci. \n 📚Source : OACI Annexe 10."
  },
  {
    id: 54,
    day: 14,
    group: "🎧Contrôle aérien",
    question: "Une clearance donnée par un ATC est :",
    options: [
      "Une autorisation",
      "Une demande d'information",
      "Un avis de trafic",
      "Un message météo"
    ],
    correctAnswer: 0,
    explanation: "💬La clearance autorise un aéronef à évoluer selon des conditions dictée par l'ATC. \n 📚Source : OACI Doc 4444."
  },
  {
    id: 55,
    day: 14,
    group: "📜Réglementation",
    question: "En classe C, les vols VFR :",
    options: [
      "Reçoivent des informations de trafic",
      "Reçoivent une clearance uniquement",
      "Reçoivent une clearance et des informations de trafic",
      "Volent sans contact radio"
    ],
    correctAnswer: 2,
    explanation: "💬En classe C, le VFR reçoit une clearance et des informations de trafic. \n 📚Source : OACI Annexe 11."
  },
  {
    id: 56,
    day: 14,
    group: "🗺️ Cartes aéronautiques",
    question: "La hauteur d'un relief est indiquée sur une carte par :",
    options: [
      "Un point noir suivi de la hauteur",
      "Un listing en bas de carte",
      "Des carrés rouges",
      "Des flèches jaunes"
    ],
    correctAnswer: 0,
    explanation: "💬Ces points indiquent les altitudes maximales du relief local. \n 📚Source : Légende VAC – SIA France."
  },

  // ========================================
  // JOUR 15
  // ========================================
  {
    id: 57,
    day: 15,
    group: "🧭Navigation aérienne",
    question: "Un plan de vol VFR doit inclure :",
    options: [
      "La route prévue",
      "Les coordonnées GPS exactes",
      "Le nom du contrôleur",
      "Le type de balises uniquement"
    ],
    correctAnswer: 0,
    explanation: "💬Le plan de vol décrit la route, l'altitude, la vitesse et les prévisions de temps de vol. \n 📚Source : SERA.4001."
  },
  {
    id: 58,
    day: 15,
    group: "🎧Contrôle aérien",
    question: "Que signifie ATIS ?",
    options: [
      "Automatic Terminal Information Service",
      "Air Traffic Information System",
      "Airport Traffic Information Service",
      "Aeronautical Terminal Instruction System"
    ],
    correctAnswer: 0,
    explanation: "💬ATIS diffuse les informations d'aérodrome (météo, piste en service, etc.). \n 📚Source : OACI Annexe 11."
  },
  {
    id: 59,
    day: 15,
    group: "📜Réglementation",
    question: "En classe E, les vols VFR sont :",
    options: [
      "Séparés des IFR",
      "Reçoivent uniquement des informations de trafic si possible",
      "Guidés en permanence",
      "Interdits"
    ],
    correctAnswer: 1,
    explanation: "💬En classe E, le VFR reçoit des informations de trafic dans la mesure du possible. \n 📚Source : OACI Annexe 11."
  },
  {
    id: 60,
    day: 15,
    group: "🗺️ Cartes aéronautiques",
    question: "Les fréquences ATIS et TWR figurent sur :",
    options: [
      "La carte VAC",
      "La carte OACI",
      "Le METAR",
      "Le plan de vol"
    ],
    correctAnswer: 0,
    explanation: "💬Chaque fiche VAC indique les fréquences de communication officielles. \n 📚Source : AIP France AD 2."
  },

  // ========================================
  // JOUR 16
  // ========================================
  {
    id: 61,
    day: 16,
    group: "🧭Navigation aérienne",
    question: "Sur une carte, 1 cm représente 2 NM. Si la distance entre deux points est de 7,5 cm, la distance réelle est :",
    options: [
      "10,5 NM",
      "12,5 NM",
      "15 NM",
      "20 NM"
    ],
    correctAnswer: 2,
    explanation: "💬7,5 cm × 2 NM/cm = 15 NM. \n 📚Source : OACI Annexe 4."
  },
  {
    id: 62,
    day: 16,
    group: "🎧Contrôle aérien",
    question: "Le QNE correspond à :",
    options: [
      "Pression au niveau de la mer",
      "Pression calée sur 1013 hPa",
      "Pression aérodrome",
      "Altitude vraie"
    ],
    correctAnswer: 1,
    explanation: "💬QNE est utilisé pour les niveaux de vol (FL). \n 📚Source : OACI Annexe 5."
  },
  {
    id: 63,
    day: 16,
    group: "📜Réglementation",
    question: "En classe F, les vols VFR :",
    options: [
      "Reçoivent une clearance",
      "Reçoivent des informations de trafic si possible",
      "Sont interdits",
      "Doivent déposer un plan de vol"
    ],
    correctAnswer: 1,
    explanation: "💬En classe F (non contrôlée), le service de trafic fournit des informations si possible. \n 📚Source : OACI Annexe 11."
  },
  {
    id: 64,
    day: 16,
    group: "🗺️ Cartes aéronautiques",
    question: "Sur une carte d'approche à vue, les itinéraires hélicoptère sont :",
    options: [
      "Indiqués en noir",
      "Indiqués en vert",
      "En pointillé",
      "Non indiqués"
    ],
    correctAnswer: 1,
    explanation: "💬Les itinéraires hélicoptères sont tracés en vert selon les conventions OACI. \n 📚Source : AIP France AD 2."
  },

  // ========================================
  // JOUR 17
  // ========================================
  {
    id: 65,
    day: 17,
    group: "🧭Navigation aérienne",
    question: "Le QDR d'un NDB correspond à :",
    options: [
      "Le relèvement de l'aéronef vers la station",
      "Le relèvement de la station vers l'aéronef",
      "Le cap magnétique",
      "L'azimut vrai"
    ],
    correctAnswer: 1,
    explanation: "💬Le QDR indique la direction de l'aéronef vue depuis la station. \n 📚Source : OACI Doc 9432."
  },
  {
    id: 66,
    day: 17,
    group: "🎧Contrôle aérien",
    question: "Le QFE correspond à :",
    options: [
      "Pression au niveau de la mer",
      "Pression à l'altitude de l'aérodrome",
      "Pression standard",
      "Température au sol"
    ],
    correctAnswer: 1,
    explanation: "💬QFE donne l'altitude 0 au seuil de piste. \n 📚Source : OACI Annexe 5."
  },
  {
    id: 67,
    day: 17,
    group: "📜Réglementation",
    question: "En classe G, les vols VFR :",
    options: [
      "Sont séparés de tous les trafics",
      "Reçoivent uniquement des informations de trafic si possible",
      "Reçoivent une clearance",
      "Sont interdits"
    ],
    correctAnswer: 1,
    explanation: "💬En classe G (non contrôlée), les informations de trafic sont fournies dans la mesure du possible. \n 📚Source : OACI Annexe 11."
  },
  {
    id: 68,
    day: 17,
    group: "🗺️ Cartes aéronautiques",
    image: true,
    question: "Sur la carte VAC de LFMT, que faire en cas de panne radio avant le décollage ?",
    options: [
      "Décoller et battre des ailes",
      "Décoller et quitter la CTR",
      "Dégager la piste par la première sortie et attendre le véhicule \"Follow Me\"",
      "Rester sur la piste et attendre"
    ],
    correctAnswer: 2,
    explanation: "💬Procédure indiquée sur la VAC : dégager la piste et attendre l'assistance. \n 📚Source : AIP France AD 2 LFMT TXT 05."
  },

  // ========================================
  // JOUR 18
  // ========================================
  {
    id: 69,
    day: 18,
    group: "🧭Navigation aérienne",
    question: "Le GPS donne directement :",
    options: [
      "La route vraie",
      "Le cap magnétique",
      "La vitesse indiquée",
      "La route compas"
    ],
    correctAnswer: 0,
    explanation: "💬Le GPS fournit la position géographique et la route vraie entre deux points. \n 📚Source : OACI Doc 9613."
  },
  {
    id: 70,
    day: 18,
    group: "🎧Contrôle aérien",
    question: "Un NOTAM informe sur :",
    options: [
      "Les modifications temporaires des installations aéronautiques",
      "La météo uniquement",
      "Les plans de vol",
      "Les horaires des aérodromes"
    ],
    correctAnswer: 0,
    explanation: "💬NOTAM = Notice To Airmen, diffuse les changements opérationnels. \n 📚Source : OACI Annexe 15."
  },
  {
    id: 71,
    day: 18,
    group: "📜Réglementation",
    question: "La CTR (Control Zone) est :",
    options: [
      "Un espace contrôlé autour d'un aérodrome",
      "Une zone militaire",
      "Un espace non contrôlé",
      "Une zone d'entraînement"
    ],
    correctAnswer: 0,
    explanation: "💬La CTR protège le trafic aux abords d'un aérodrome contrôlé. \n 📚Source : OACI Annexe 11."
  },
  {
    id: 72,
    day: 18,
    group: "🗺️ Cartes aéronautiques",
    question: "Un aérodrome fermé est identifié par :",
    options: [
      "Un cercle noir avec une croix",
      "Un carré bleu",
      "Un point rouge",
      "Un triangle"
    ],
    correctAnswer: 0,
    explanation: "💬Symbole d'un terrain désaffecté. \n 📚Source : Légende carte OACI France."
  },

  // ========================================
  // JOUR 19
  // ========================================
  {
    id: 73,
    day: 19,
    group: "🧭Navigation aérienne",
    question: "Le \"Track\" affiché sur le GPS représente :",
    options: [
      "Le cap suivi",
      "La route réellement parcourue au sol",
      "Le vent",
      "La direction du compas"
    ],
    correctAnswer: 1,
    explanation: "💬Le \"track\" tient compte du vent et montre la trajectoire sol. \n 📚Source : OACI Doc 9613."
  },
  {
    id: 74,
    day: 19,
    group: "🎧Contrôle aérien",
    question: "La séparation verticale minimale entre deux aéronefs en route est :",
    options: [
      "500 ft",
      "1000 ft",
      "2000 ft",
      "3000 ft"
    ],
    correctAnswer: 1,
    explanation: "💬1000 ft est la séparation verticale standard en dessous du FL290. \n 📚Source : OACI Doc 4444."
  },
  {
    id: 75,
    day: 19,
    group: "📜Réglementation",
    question: "La TMA (Terminal Control Area) est :",
    options: [
      "Un espace contrôlé établi autour des grands aérodromes",
      "Une zone militaire",
      "Un espace non contrôlé",
      "Une zone d'attente"
    ],
    correctAnswer: 0,
    explanation: "💬La TMA entoure un ou plusieurs aérodromes importants. \n 📚Source : OACI Annexe 11."
  },
  {
    id: 76,
    day: 19,
    group: "🗺️ Cartes aéronautiques",
    question: "L'altitude du terrain (élévation) figure :",
    options: [
      "En pieds sur la VAC",
      "En mètres sur la carte OACI",
      "En FL",
      "En hPa"
    ],
    correctAnswer: 0,
    explanation: "💬Elle est indiquée en haut de chaque fiche VAC, en pieds AMSL. \n 📚Source : AIP France AD 2."
  },

  // ========================================
  // JOUR 20
  // ========================================
  {
    id: 77,
    day: 20,
    group: "🧭Navigation aérienne",
    question: "Quelle erreur est fréquente lors de la navigation à l'estime ?",
    options: [
      "Ne pas corriger la dérive",
      "Utiliser le GPS",
      "Lire la mauvaise échelle",
      "Oublier la vitesse vraie"
    ],
    correctAnswer: 0,
    explanation: "💬La dérive due au vent est la principale \n 📚Source d'erreur de trajectoire. \n 📚Source : DGAC – Manuel de navigation."
  },
  {
    id: 78,
    day: 20,
    group: "🎧Contrôle aérien",
    question: "Une instruction \"Hold short\" signifie :",
    options: [
      "Arrêtez-vous avant la piste",
      "Décollez immédiatement",
      "Roulez lentement",
      "Dégagez la piste"
    ],
    correctAnswer: 0,
    explanation: "💬\"Hold short\" demande de rester en deçà d'un point spécifié (souvent le seuil de piste). \n 📚Source : OACI Doc 4444."
  },
  {
    id: 79,
    day: 20,
    group: "📜Réglementation",
    question: "La différence entre AMSL et AGL est :",
    options: [
      "AMSL = altitude par rapport au niveau de la mer, AGL = hauteur par rapport au sol",
      "AMSL = hauteur, AGL = altitude",
      "Elles sont identiques",
      "AMSL est utilisé en IFR uniquement"
    ],
    correctAnswer: 0,
    explanation: "💬AMSL (Above Mean Sea Level) et AGL (Above Ground Level) définissent des références d'altitude différentes. \n 📚Source : OACI Annexe 5."
  },
  {
    id: 80,
    day: 20,
    group: "🗺️ Cartes aéronautiques",
    question: "Les obstacles supérieurs à 100 m sont représentés :",
    options: [
      "Par un symbole d'antenne",
      "Par une croix",
      "Par un rond",
      "Par une flèche"
    ],
    correctAnswer: 0,
    explanation: "💬Ces symboles représentent les antennes, tours ou bâtiments élevés. \n 📚Source : Légende carte OACI."
  },

  // ========================================
  // JOUR 21
  // ========================================
  {
    id: 81,
    day: 21,
    group: "🧭Navigation aérienne",
    question: "La ligne isogone sur une carte indique :",
    options: [
      "L'altitude",
      "L'intensité du vent",
      "La déclinaison magnétique constante",
      "La variation du relief"
    ],
    correctAnswer: 2,
    explanation: "💬Une isogone relie les points de même déclinaison magnétique. \n 📚Source : OACI Annexe 4."
  },
  {
    id: 82,
    day: 21,
    group: "🎧Contrôle aérien",
    question: "\"Line up and wait\" signifie :",
    options: [
      "Alignez-vous sur la piste et attendez l'autorisation de décoller",
      "Roulez jusqu'à la piste",
      "Décollez immédiatement",
      "Dégagez la piste"
    ],
    correctAnswer: 0,
    explanation: "💬Cette instruction demande de s'aligner sur la piste mais d'attendre le feu vert pour décoller. \n 📚Source : OACI Doc 4444."
  },
  {
    id: 83,
    day: 21,
    group: "📜Réglementation",
    question: "Un niveau de vol (FL) est basé sur :",
    options: [
      "La pression standard 1013 hPa",
      "La pression QNH",
      "La pression QFE",
      "L'altitude vraie"
    ],
    correctAnswer: 0,
    explanation: "💬Les FL utilisent le calage altimétrique standard de 1013,25 hPa. \n 📚Source : OACI Annexe 5."
  },
  {
    id: 84,
    day: 21,
    group: "🗺️ Cartes aéronautiques",
    question: "Les zones militaires actives sont :",
    options: [
      "Publiées par NOTAM",
      "Publiées sur la carte IFR",
      "Publiées sur VAC",
      "Non publiées"
    ],
    correctAnswer: 0,
    explanation: "💬Leur activation est temporaire et communiquée par NOTAM. \n 📚Source : AIP France ENR 5.1."
  },

  // ========================================
  // JOUR 22
  // ========================================
  {
    id: 85,
    day: 22,
    group: "🧭Navigation aérienne",
    question: "Le calcul du temps de vol se fait à partir de :",
    options: [
      "Distance / La vitesse vraie",
      "Distance / La vitesse indiquée",
      "Distance / La vitesse sol",
      "Distance / La vitesse de croisière moyenne"
    ],
    correctAnswer: 2,
    explanation: "💬Le temps de vol estimé découle de la vitesse sol . \n 📚Source : DGAC – Manuel du pilote privé."
  },
  {
    id: 86,
    day: 22,
    group: "🎧Contrôle aérien",
    question: "\"Vacate runway\" signifie :",
    options: [
      "Dégagez la piste",
      "Arrêtez-vous sur la piste",
      "Alignez-vous",
      "Roulez lentement"
    ],
    correctAnswer: 0,
    explanation: "💬Instruction de libérer la piste dès que possible. \n 📚Source : OACI Doc 4444."
  },
  {
    id: 87,
    day: 22,
    group: "📜Réglementation",
    question: "L'altitude de transition est :",
    options: [
      "L'altitude à partir de laquelle on utilise le FL",
      "L'altitude minimale de survol",
      "La hauteur de décision",
      "L'altitude maximale VFR"
    ],
    correctAnswer: 0,
    explanation: "💬Au-dessus de l'altitude de transition, les altitudes sont exprimées en niveaux de vol (FL). \n 📚Source : AIP France ENR 1.7."
  },
  {
    id: 88,
    day: 22,
    group: "🗺️ Cartes aéronautiques",
    question: "Les routes VFR obligatoires avec contact radio sont tracées en :",
    options: [
      "Ligne noire pleine (____)",
      "Ligne de points (.....)",
      "Ligne de tirets (– – – –)",
      "En rouge"
    ],
    correctAnswer: 2,
    explanation: "💬Sur les cartes OACI, les routes VFR obligatoires avec contact radio sont tracées par une ligne de tirets noirs. \n 📚Source : Légende carte OACI France."
  },

  // ========================================
  // JOUR 23
  // ========================================
  {
    id: 89,
    day: 23,
    group: "🧭Navigation aérienne",
    question: "Une erreur de 5° sur le cap après 60 NM entraîne une déviation latérale d'environ :",
    options: [
      "2 NM",
      "5 NM",
      "8 NM",
      "10 NM"
    ],
    correctAnswer: 1,
    explanation: "💬Règle pratique : déviation ≈ distance × erreur (en NM × sin 5° ≈ 0,087 × 60 ≈ 5). \n 📚Source : DGAC – Navigation pratique."
  },
  {
    id: 90,
    day: 23,
    group: "🎧Contrôle aérien",
    question: "Un service d'information de vol (FIS) fournit :",
    options: [
      "Des informations météo, trafic et NOTAM",
      "Des clearances",
      "Des séparations",
      "Des autorisations de décollage"
    ],
    correctAnswer: 0,
    explanation: "💬FIS donne des informations utiles au vol mais n'émet pas de clearances. \n 📚Source : OACI Annexe 11."
  },
  {
    id: 91,
    day: 23,
    group: "📜Réglementation",
    question: "Le niveau de transition est :",
    options: [
      "Le niveau de vol le plus bas utilisable au-dessus de l'altitude de transition",
      "Le FL minimum",
      "Le FL maximum",
      "L'altitude de croisière"
    ],
    correctAnswer: 0,
    explanation: "💬C'est le FL le plus bas disponible après l'altitude de transition. \n 📚Source : AIP France ENR 1.7."
  },
  {
    id: 92,
    day: 23,
    group: "🗺️ Cartes aéronautiques",
    question: "Les points de report VFR sont identifiés par :",
    options: [
      "Une lettre dans un cercle à fond blanc et contour noir",
      "Des chiffres",
      "Des symboles météo",
      "Des fréquences"
    ],
    correctAnswer: 0,
    explanation: "💬Ces points géographiques servent aux reports radio des pilotes VFR. \n 📚Source : AIP France AD 2."
  },

  // ========================================
  // JOUR 24
  // ========================================
  {
    id: 93,
    day: 24,
    group: "🧭Navigation aérienne",
    question: "En navigation, \"GS\" signifie :",
    options: [
      "Ground Speed",
      "Glide Slope",
      "General Service",
      "Ground Signal"
    ],
    correctAnswer: 0,
    explanation: "💬C'est la vitesse sol réelle de l'aéronef. \n 📚Source : OACI Annexe 5."
  },
  {
    id: 94,
    day: 24,
    group: "🎧Contrôle aérien",
    question: "Le service d'alerte (ALRS) est activé en cas de :",
    options: [
      "Incertitude, alerte ou détresse",
      "Panne radio uniquement",
      "Mauvais temps",
      "Retard de vol"
    ],
    correctAnswer: 0,
    explanation: "💬ALRS coordonne les opérations de recherche et sauvetage (SAR). \n 📚Source : OACI Annexe 11."
  },
  {
    id: 95,
    day: 24,
    group: "📜Réglementation",
    question: "La couche de transition est :",
    options: [
      "L'espace entre l'altitude et le niveau de transition",
      "Une zone militaire",
      "Un espace non contrôlé",
      "Une zone d'attente"
    ],
    correctAnswer: 0,
    explanation: "💬C'est la zone où l'on passe du calage QNH au calage standard 1013 hPa. \n 📚Source : AIP France ENR 1.7."
  },
  {
    id: 96,
    day: 24,
    group: "🗺️ Cartes aéronautiques",
    question: "Sur la carte OACI, \"LF-R\" suivi d'un numéro désigne :",
    options: [
      "Une zone restreinte",
      "Une zone militaire",
      "Un aérodrome",
      "Un espace C"
    ],
    correctAnswer: 0,
    explanation: "💬Code d'identification officiel des zones restreintes françaises. \n 📚Source : AIP France ENR 5.1."
  },

  // ========================================
  // JOUR 25
  // ========================================
  {
    id: 97,
    day: 25,
    group: "🧭Navigation aérienne",
    question: "Quelle est la meilleure méthode pour corriger la dérive en vol VFR ?",
    options: [
      "Ajuster le cap de quelques degrés",
      "Modifier l'altitude",
      "Changer la vitesse",
      "Couper le moteur et recalculer"
    ],
    correctAnswer: 0,
    explanation: "💬Une correction de quelques degrés permet de compenser le vent latéral. \n📚Source : DGAC – Manuel du pilote privé."
  },
  {
    id: 98,
    day: 25,
    group: "🎧Contrôle aérien",
    question: "\"Mayday\" est utilisé pour :",
    options: [
      "Une situation de détresse",
      "Une panne mineure",
      "Une demande d'information",
      "Un changement de fréquence"
    ],
    correctAnswer: 0,
    explanation: "💬\"Mayday\" signale une situation de détresse immédiate (danger grave et imminent). \n 📚Source : OACI Annexe 10."
  },
  {
    id: 99,
    day: 25,
    group: "📜Réglementation",
    question: "Un espace aérien FIR (Flight Information Region) fournit :",
    options: [
      "Des services d'information de vol et d'alerte",
      "Des clearances uniquement",
      "Des séparations radar",
      "Des autorisations de décollage"
    ],
    correctAnswer: 0,
    explanation: "💬La FIR couvre une région où sont assurés les services d'information de vol et d'alerte. \n 📚Source : OACI Annexe 11."
  },
  {
    id: 100,
    day: 25,
    group: "🗺️ Cartes aéronautiques",
    question: "Les coordonnées sur les cartes aéronautiques sont exprimées en :",
    options: [
      "Degrés, minutes et secondes",
      "Radians",
      "Milles nautiques",
      "Coordonnées GPS en mètres"
    ],
    correctAnswer: 0,
    explanation: "💬Format géographique normalisé OACI pour toutes les cartes aéronautiques. \n 📚Source : OACI Annexe 4."
  }
];
