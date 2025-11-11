export const questions = [
  // JOUR 1 - Une question de chaque groupe
  {
    id: 1,
    day: 1,
    group: "Navigation aérienne",
    question: "Quelle est la différence principale entre la route vraie (RV) et la route magnétique (RM) ?",
    options: [
      "La route vraie prend en compte le vent",
      "La route magnétique est corrigée de la déclinaison magnétique",
      "La route vraie dépend de la dérive",
      "Elles sont identiques"
    ],
    correctAnswer: 1
  },
  {
    id: 26,
    day: 1,
    group: "Contrôle aérien",
    question: "Quel est le rôle principal du contrôle aérien ?",
    options: [
      "Garantir la sécurité et la régularité du trafic aérien",
      "Vérifier les plans de vol",
      "Gérer les services au sol",
      "Superviser les équipages"
    ],
    correctAnswer: 0
  },
  {
    id: 51,
    day: 1,
    group: "Réglementation aérienne",
    question: "En VFR de jour, le vol doit se faire avec une visibilité minimale de :",
    options: [
      "1 km",
      "5 km",
      "10 km",
      "3 km"
    ],
    correctAnswer: 1
  },
  {
    id: 76,
    day: 1,
    group: "Cartes aéronautiques",
    question: "Sur une carte OACI 1:500 000, 1 cm représente :",
    options: [
      "1 NM",
      "2,7 NM",
      "5 NM",
      "1,85 NM"
    ],
    correctAnswer: 1
  },

  // JOUR 2
  {
    id: 2,
    day: 2,
    group: "Navigation aérienne",
    question: "Si la déclinaison magnétique est de 10° Est, la route magnétique sera :",
    options: [
      "RV + 10°",
      "RV – 10°",
      "RM + 10°",
      "Impossible à déterminer"
    ],
    correctAnswer: 1
  },
  {
    id: 27,
    day: 2,
    group: "Contrôle aérien",
    question: "En espace contrôlé, le pilote doit :",
    options: [
      "Être en contact radio avec l'ATC",
      "Voler en IFR uniquement",
      "Être équipé de radar météo",
      "Avoir un copilote"
    ],
    correctAnswer: 0
  },
  {
    id: 52,
    day: 2,
    group: "Réglementation aérienne",
    question: "L'altitude de transition est :",
    options: [
      "Fixée à 5000 ft",
      "Variable selon l'aérodrome",
      "Toujours 3000 ft",
      "Fixée par l'ATIS"
    ],
    correctAnswer: 1
  },
  {
    id: 77,
    day: 2,
    group: "Cartes aéronautiques",
    question: "Les zones P, R, D signifient respectivement :",
    options: [
      "Prohibited, Restricted, Danger",
      "Police, Radar, Defense",
      "Protected, Regulated, Danger",
      "Privée, Réservée, Délimitée"
    ],
    correctAnswer: 0
  },

  // JOUR 3
  {
    id: 3,
    day: 3,
    group: "Navigation aérienne",
    question: "Le cap compas (CC) diffère du cap magnétique (CM) à cause :",
    options: [
      "De la déclinaison",
      "De la déviation",
      "Du vent",
      "Du gyro"
    ],
    correctAnswer: 1
  },
  {
    id: 28,
    day: 3,
    group: "Contrôle aérien",
    question: "Le code transpondeur 7000 correspond à :",
    options: [
      "Vol IFR",
      "Urgence",
      "Vol VFR standard",
      "Panne radio"
    ],
    correctAnswer: 2
  },
  {
    id: 53,
    day: 3,
    group: "Réglementation aérienne",
    question: "Le calage altimétrique standard est :",
    options: [
      "1013,25 hPa",
      "1000 hPa",
      "1010,00 hPa",
      "1020,25 hPa"
    ],
    correctAnswer: 0
  },
  {
    id: 78,
    day: 3,
    group: "Cartes aéronautiques",
    question: "Une zonne R est :",
    options: [
      "Interdite en tout temps",
      "Soumise à autorisation préalable",
      "Réservée aux IFR",
      "Toujours active"
    ],
    correctAnswer: 1
  },

  // JOUR 4
  {
    id: 4,
    day: 4,
    group: "Navigation aérienne",
    question: "Le vent de face a pour effet :",
    options: [
      "D'augmenter la vitesse sol",
      "De diminuer la vitesse sol",
      "D'augmenter la vitesse indiquée",
      "De modifier la route"
    ],
    correctAnswer: 1
  },
  {
    id: 29,
    day: 4,
    group: "Contrôle aérien",
    question: "Le code 7600 signifie :",
    options: [
      "Détournement",
      "Urgence médicale",
      "Panne radio",
      "Perte de radar secondaire"
    ],
    correctAnswer: 2
  },
  {
    id: 54,
    day: 4,
    group: "Réglementation aérienne",
    question: "Le FL correspond à :",
    options: [
      "Altitude vraie",
      "Niveau de vol basé sur 1013 hPa",
      "Hauteur sol",
      "Altitude GPS"
    ],
    correctAnswer: 1
  },
  {
    id: 79,
    day: 4,
    group: "Cartes aéronautiques",
    question: "Les lignes bleues épaisses sur une carte VFR indiquent :",
    options: [
      "Des routes",
      "Des espaces aériens contrôlés",
      "Des fleuves",
      "Des zones militaires"
    ],
    correctAnswer: 1
  },

  // JOUR 5
  {
    id: 5,
    day: 5,
    group: "Navigation aérienne",
    question: "Quelle est la formule de la dérive approximative ?",
    options: [
      "(Vent × Temps) / Distance",
      "(Vent × 60) / Vitesse vraie",
      "(Vent latéral / Vitesse vraie) × 60",
      "(Cap × Vent) / 100"
    ],
    correctAnswer: 2
  },
  {
    id: 30,
    day: 5,
    group: "Contrôle aérien",
    question: "Le code 7700 est utilisé pour :",
    options: [
      "Panne moteur",
      "Urgence générale",
      "Détournement",
      "Perte d'altimètre"
    ],
    correctAnswer: 1
  },
  {
    id: 55,
    day: 5,
    group: "Réglementation aérienne",
    question: "En VFR, la hauteur minimal au-dessus d'une agglomérations de largeur moyenne comprise entre 1200 m et 3600 m et de :",
    options: [
      "500 ft",
      "3300 ft",
      "1700 ft",
      "5000 ft"
    ],
    correctAnswer: 1
  },
  {
    id: 80,
    day: 5,
    group: "Cartes aéronautiques",
    question: "Un aéroport non controler et indiquer par :",
    options: [
      "Un cercle bleu vide",
      "Un cercle noir avec une croix",
      "Un carré rouge",
      "Un cercle bleu plein"
    ],
    correctAnswer: 0
  },

  // JOUR 6
  {
    id: 6,
    day: 6,
    group: "Navigation aérienne",
    question: "Quelle unité utilise-t-on pour mesurer la vitesse du vent en aviation ?",
    options: [
      "Km/h",
      "M/s",
      "Nœuds",
      "Pieds/min"
    ],
    correctAnswer: 2
  },
  {
    id: 31,
    day: 6,
    group: "Contrôle aérien",
    question: "Le code 7500 signifie :",
    options: [
      "Détournement / Hijack",
      "Urgence médicale",
      "Incendie",
      "Panne d'instruments"
    ],
    correctAnswer: 0
  },
  {
    id: 56,
    day: 6,
    group: "Réglementation aérienne",
    question: "Le plan de vol doit être déposé au moins :",
    options: [
      "10 minutes avant départ",
      "30 minutes avant départ",
      "1 heure avant",
      "15 minutes après départ"
    ],
    correctAnswer: 1
  },
  {
    id: 81,
    day: 6,
    group: "Cartes aéronautiques",
    question: "Les altitudes minimales de sécurité sont indiquées sur :",
    options: [
      "Les cartes VFR",
      "Les cartes IFR (ENR)",
      "Les cartes VAC",
      "Les cartes météo"
    ],
    correctAnswer: 1
  },

  // JOUR 7
  {
    id: 7,
    day: 7,
    group: "Navigation aérienne",
    question: "Un NM (Mille nautique) correspond à :",
    options: [
      "1,609 km",
      "1,852 km",
      "1,944 km",
      "1,789 km"
    ],
    correctAnswer: 1
  },
  {
    id: 32,
    day: 7,
    group: "Contrôle aérien",
    question: "Que signifie l'acronyme ATIS ?",
    options: [
      "Automatic Terminal Information Service",
      "Air Traffic Information System",
      "Air Traffic Instant Signal",
      "Automated Track Information"
    ],
    correctAnswer: 0
  },
  {
    id: 57,
    day: 7,
    group: "Réglementation aérienne",
    question: "Le code OACI d'un aéroport français commence par :",
    options: [
      "LF",
      "FR",
      "FX",
      "AF"
    ],
    correctAnswer: 0
  },
  {
    id: 82,
    day: 7,
    group: "Cartes aéronautiques",
    question: "Une flèche de vent sur carte météo indique :",
    options: [
      "Le sens du vent",
      "La force uniquement",
      "La direction magnétique",
      "L'intensité du trafic"
    ],
    correctAnswer: 0
  },

  // JOUR 8
  {
    id: 8,
    day: 8,
    group: "Navigation aérienne",
    question: "La vitesse indiquée (IAS) ne tient pas compte :",
    options: [
      "De la densité de l'air",
      "De la température",
      "De la pression",
      "Du vent"
    ],
    correctAnswer: 0
  },
  {
    id: 33,
    day: 8,
    group: "Contrôle aérien",
    question: "Dans la JTFF, quelle est la phrase correcte pour demander une clairance de roulage ?",
    options: [
      "\"Tower, ready to taxi.\"",
      "\"TIGER 11, request taxi [type of departure]\"",
      "\"Approach, taxi request.\"",
      "\"Tower, permission to go.\""
    ],
    correctAnswer: 1
  },
  {
    id: 58,
    day: 8,
    group: "Réglementation aérienne",
    question: "L'indicatif d'un avion en vol VFR est basé sur :",
    options: [
      "Le call-sign compagnie",
      "L'immatriculation",
      "Le numéro de plan de vol",
      "Le modèle avion"
    ],
    correctAnswer: 1
  },
  {
    id: 83,
    day: 8,
    group: "Cartes aéronautiques",
    question: "Sur cette carte VAC, le cercle rouge correspond :",
    image: "/images/question83.png",
    options: [
      "Une zone d'ont le survol et a éviter",
      "Une zone d'ont le survol interdit",
      "Une zone d'ont le survol et obligatoire",
      "Un lieu a faible densité de population"
    ],
    correctAnswer: 0
  },

  // JOUR 9
  {
    id: 9,
    day: 9,
    group: "Navigation aérienne",
    question: "Quelle est la principale utilisation du conservateur de cap ?",
    options: [
      "Mesurer la dérive",
      "Donner un cap stable sans oscillations",
      "Mesurer la vitesse",
      "Afficher le vent"
    ],
    correctAnswer: 1
  },
  {
    id: 34,
    day: 9,
    group: "Contrôle aérien",
    question: "Un pilote reçoit l'instruction \"Hold short J runway 26\". Cela signifie :",
    options: [
      "Traverser la piste 26",
      "Attendre au point d'attente J avant la piste 26",
      "Décoller immédiatement",
      "Rouler sur la piste"
    ],
    correctAnswer: 1
  },
  {
    id: 59,
    day: 9,
    group: "Réglementation aérienne",
    question: "En espace de classe C, la séparation est assurée :",
    options: [
      "Entre IFR uniquement",
      "Entre IFR et VFR également",
      "Entre VFR seulement",
      "Aucunement"
    ],
    correctAnswer: 1
  },
  {
    id: 84,
    day: 9,
    group: "Cartes aéronautiques",
    question: "La déclinaison magnétique est indiquée sur les cartes :",
    options: [
      "IFR uniquement",
      "VFR et IFR",
      "Aucune",
      "AIP uniquement"
    ],
    correctAnswer: 1
  },

  // JOUR 10
  {
    id: 10,
    day: 10,
    group: "Navigation aérienne",
    question: "En vol VFR, la navigation à l'estime consiste à :",
    options: [
      "Suivre un cap sans repère visuel",
      "Naviguer uniquement aux instruments",
      "Utiliser le GPS",
      "Lire la carte uniquement"
    ],
    correctAnswer: 0
  },
  {
    id: 35,
    day: 10,
    group: "Contrôle aérien",
    question: "\"Line up and wait\" signifie :",
    options: [
      "Rouler sur le taxiway",
      "Entrer sur la piste et attendre l'autorisation de décoller",
      "Décoller immédiatement",
      "Quitter la piste"
    ],
    correctAnswer: 1
  },
  {
    id: 60,
    day: 10,
    group: "Réglementation aérienne",
    question: "\"CTR\" signifie :",
    options: [
      "Control Terminal Region",
      "Control Traffic Region",
      "Control Traffic aiRspace",
      "Transit Corridor"
    ],
    correctAnswer: 1
  },
  {
    id: 85,
    day: 10,
    group: "Cartes aéronautiques",
    question: "Que signifie MEA :",
    options: [
      "Mer Méditerranée",
      "Minimum Enroute Altitude",
      "Maximum Entry Route",
      "Message En Route"
    ],
    correctAnswer: 1
  },

  // JOUR 11
  {
    id: 11,
    day: 11,
    group: "Navigation aérienne",
    question: "Quelle information fournit un VOR ?",
    options: [
      "Distance uniquement",
      "Cap vrai",
      "Azimut magnétique par rapport à la station",
      "Position géographique exacte"
    ],
    correctAnswer: 2
  },
  {
    id: 36,
    day: 11,
    group: "Contrôle aérien",
    question: "La phrase \"Cleared for takeoff\" est donné :",
    options: [
      "Par l'approche",
      "Par la Tour",
      "Par le Sol",
      "Par l'ATIS"
    ],
    correctAnswer: 1
  },
  {
    id: 61,
    day: 11,
    group: "Réglementation aérienne",
    question: "Un vol VFR spécial est :",
    options: [
      "Un vol IFR d'entraînement",
      "Un vol autorisé dans des conditions marginales",
      "Un vol militaire",
      "Un vol d'urgence"
    ],
    correctAnswer: 1
  },
  {
    id: 86,
    day: 11,
    group: "Cartes aéronautiques",
    question: "Sur cette carte, la flèche bleue signifie :",
    image: "/images/question86.png",
    options: [
      "La direction d'une balise / Aéroport avec une distance",
      "Des trajectoires recommandées",
      "Une altitude",
      "Une balise"
    ],
    correctAnswer: 0
  },

  // JOUR 12
  {
    id: 12,
    day: 12,
    group: "Navigation aérienne",
    question: "Un DME indique :",
    options: [
      "Le cap à suivre",
      "La distance oblique à la station",
      "Le vent",
      "La route magnétique"
    ],
    correctAnswer: 1
  },
  {
    id: 37,
    day: 12,
    group: "Contrôle aérien",
    question: "\"Contact Departure 118.200\" signifie :",
    options: [
      "Le pilote doit changer de fréquence pour contacter le depart",
      "Il reste sur la tour",
      "Il revient au sol",
      "Il coupe la radio"
    ],
    correctAnswer: 0
  },
  {
    id: 62,
    day: 12,
    group: "Réglementation aérienne",
    question: "Le plafond minimum pour le VFR spécial est :",
    options: [
      "600 ft",
      "1500 ft",
      "600 m",
      "1000 m"
    ],
    correctAnswer: 2
  },
  {
    id: 87,
    day: 12,
    group: "Cartes aéronautiques",
    question: "Une TMA est représentée par :",
    options: [
      "Des lignes rouges",
      "Des contours bleus",
      "Des pointillés",
      "Des hachures"
    ],
    correctAnswer: 1
  },

  // JOUR 13
  {
    id: 13,
    day: 13,
    group: "Navigation aérienne",
    question: "Quelle est la précision d'un VOR conventionnel ?",
    options: [
      "±2°",
      "±5°",
      "±10°",
      "±1°"
    ],
    correctAnswer: 0
  },
  {
    id: 38,
    day: 13,
    group: "Contrôle aérien",
    question: "Que veut dire \"Maintain runway heading\" ?",
    options: [
      "Suivre le cap magnétique du terrain",
      "Garder le cap de la piste après décollage",
      "Voler vers la piste",
      "Tourner à gauche après rotation"
    ],
    correctAnswer: 1
  },
  {
    id: 63,
    day: 13,
    group: "Réglementation aérienne",
    question: "Le sigle TMA signifie :",
    options: [
      "Terminal Maneuvering Area",
      "Tower Managed Airspace",
      "Transit Military Area",
      "Traffic Management Area"
    ],
    correctAnswer: 0
  },
  {
    id: 88,
    day: 13,
    group: "Cartes aéronautiques",
    question: "Le relief est indiqué sur une carte par :",
    options: [
      "Des lignes de niveau et des couleurs",
      "Des chiffres uniquement",
      "Des zones ombrées",
      "Des cercles rouges"
    ],
    correctAnswer: 0
  },

  // JOUR 14
  {
    id: 14,
    day: 14,
    group: "Navigation aérienne",
    question: "Quelle est la différence entre un ADF et un VOR ?",
    options: [
      "L'ADF indique la position exacte",
      "L'ADF donne le relèvement de la balise NDB",
      "Le VOR fonctionne sur basse fréquence",
      "L'ADF est utilisé en IFR seulement"
    ],
    correctAnswer: 1
  },
  {
    id: 39,
    day: 14,
    group: "Contrôle aérien",
    question: "Quelle est la fréquence d'urgence VHF internationale utilisée en aviation ?",
    options: [
      "118.000 MHz",
      "121.500 MHz",
      "123.450 MHz",
      "243.000 MHz"
    ],
    correctAnswer: 1
  },
  {
    id: 64,
    day: 14,
    group: "Réglementation aérienne",
    question: "La limite supérieure de la plupart des TMA est :",
    options: [
      "FL095",
      "FL195",
      "FL245",
      "FL350"
    ],
    correctAnswer: 1
  },
  {
    id: 89,
    day: 14,
    group: "Cartes aéronautiques",
    question: "La hauteur d'un relief est indiqué sur une carte par :",
    options: [
      "Un point noir suivie de la hauteur",
      "Un listing en bas de carte",
      "Par des carrés rouges",
      "Par des flèches jaunes"
    ],
    correctAnswer: 0
  },

  // JOUR 15
  {
    id: 15,
    day: 15,
    group: "Navigation aérienne",
    question: "Un plan de vol VFR doit inclure :",
    options: [
      "La route prévue",
      "Les coordonnées GPS exactes",
      "Le nom du contrôleur",
      "Le type de balises uniquement"
    ],
    correctAnswer: 0
  },
  {
    id: 40,
    day: 15,
    group: "Contrôle aérien",
    question: "Quelle phrase utilise-t-on pour signaler une panne radio ?",
    options: [
      "\"Radio failure\"",
      "\"Comms down\"",
      "\"Signal lost\"",
      "Aucune"
    ],
    correctAnswer: 3
  },
  {
    id: 65,
    day: 15,
    group: "Réglementation aérienne",
    question: "L'unité de hauteur utilisée en aviation est :",
    options: [
      "Le mètre",
      "Le pied",
      "Le mile",
      "Le yard"
    ],
    correctAnswer: 1
  },
  {
    id: 90,
    day: 15,
    group: "Cartes aéronautiques",
    question: "Les fréquences ATIS et TWR figurent sur :",
    options: [
      "La carte VAC",
      "La carte OACI",
      "Le METAR",
      "Le plan de vol"
    ],
    correctAnswer: 0
  },

  // JOUR 16
  {
    id: 16,
    day: 16,
    group: "Navigation aérienne",
    question: "Sur une carte, 1 cm représente 2 NM. Si la distance entre deux points est de 7,5 cm, la distance réelle est :",
    options: [
      "10,5 NM",
      "12,5 NM",
      "15 NM",
      "20 NM"
    ],
    correctAnswer: 2
  },
  {
    id: 41,
    day: 16,
    group: "Contrôle aérien",
    question: "Le contrôle d'approche (APP) gère :",
    options: [
      "Les roulages au sol",
      "Les aéronef au sein de sa TMA",
      "Les vols en croisière",
      "Les vols IFR uniquement"
    ],
    correctAnswer: 1
  },
  {
    id: 66,
    day: 16,
    group: "Réglementation aérienne",
    question: "Une NOTAM informe sur :",
    options: [
      "Les conditions météo",
      "Les restrictions temporaires de vol",
      "Le trafic aérien",
      "Les vols IFR"
    ],
    correctAnswer: 1
  },
  {
    id: 91,
    day: 16,
    group: "Cartes aéronautiques",
    question: "Sur une carte d'approche a vue, les itinéraires hélicoptère sont :",
    options: [
      "Indiquer en noir",
      "Indiquer en Vert",
      "En pointiller",
      "Pas indiquer"
    ],
    correctAnswer: 1
  },

  // JOUR 17
  {
    id: 17,
    day: 17,
    group: "Navigation aérienne",
    question: "Le QDR d'un NDB correspond à :",
    options: [
      "Le relèvement de l'aéronef vers la station",
      "Le relèvement de la station vers l'aéronef",
      "Le cap magnétique",
      "L'azimut vrai"
    ],
    correctAnswer: 1
  },
  {
    id: 42,
    day: 17,
    group: "Contrôle aérien",
    question: "Dans un espace aérien de classe D, quelles sont les règles principales ?",
    options: [
      "Le contrôle assure la séparation entre IFR/IFR et VFR/VFR spécial, le contact radio et obligatoire",
      "Seuls les vols IFR sont autorisés",
      "Le contrôle assure la séparation entre IFR/VFR, le contact radio et obligatoire",
      "Le contrôle assure la séparation entre tous les aéronefs, seul les IFR doivent être en contact radio"
    ],
    correctAnswer: 0
  },
  {
    id: 67,
    day: 17,
    group: "Réglementation aérienne",
    question: "Un AIP contient :",
    options: [
      "Les informations aéronautiques officielles",
      "Des annonces temporaires",
      "Les NOTAM",
      "Les METAR uniquement"
    ],
    correctAnswer: 0
  },
  {
    id: 92,
    day: 17,
    group: "Cartes aéronautiques",
    question: "Dans la carte VAC donner en pièce jointe, que faire si je suis en panne radio sur la piste avant le décollage :",
    options: [
      "Je décolle et bas de ailes",
      "Je décolle et sors de la CTR en suivant l'axe de piste",
      "Je dégage la piste par la première sortie et j'attend le véhicule \"Follow Me\"",
      "Je reste sur la piste et attend qu'on vienne me chercher"
    ],
    correctAnswer: 2
  },

  // JOUR 18
  {
    id: 18,
    day: 18,
    group: "Navigation aérienne",
    question: "Le GPS donne directement :",
    options: [
      "La route vraie",
      "Le cap magnétique",
      "La vitesse indiquée",
      "La route compas"
    ],
    correctAnswer: 0
  },
  {
    id: 43,
    day: 18,
    group: "Contrôle aérien",
    question: "Dans un espace G, le pilote :",
    options: [
      "Doit contacter le contrôle",
      "Est responsable de sa propre séparation",
      "Ne peut pas voler",
      "Est sous contrôle radar"
    ],
    correctAnswer: 1
  },
  {
    id: 68,
    day: 18,
    group: "Réglementation aérienne",
    question: "Le METAR fournit :",
    options: [
      "Les prévisions météo",
      "Les observations météo récentes",
      "Les bulletins NOTAM",
      "Les vents prévus"
    ],
    correctAnswer: 1
  },
  {
    id: 93,
    day: 18,
    group: "Cartes aéronautiques",
    question: "Un aérodrome non contrôlé est identifié par :",
    options: [
      "Un cercle noir avec une croix",
      "Un carré bleu",
      "Un point rouge",
      "Un triangle"
    ],
    correctAnswer: 0
  },

  // JOUR 19
  {
    id: 19,
    day: 19,
    group: "Navigation aérienne",
    question: "Le \"Track\" affiché sur le GPS représente :",
    options: [
      "Le cap suivi",
      "La route réellement parcourue au sol",
      "Le vent",
      "La direction du compas"
    ],
    correctAnswer: 1
  },
  {
    id: 44,
    day: 19,
    group: "Contrôle aérien",
    question: "Le message \"Say again\" signifie :",
    options: [
      "Répétez votre dernier message",
      "Attendez",
      "Confirmez",
      "Correction"
    ],
    correctAnswer: 0
  },
  {
    id: 69,
    day: 19,
    group: "Réglementation aérienne",
    question: "Un TAF donne :",
    options: [
      "Une observation",
      "Une prévision météo",
      "Un rapport radar",
      "Un message de détresse"
    ],
    correctAnswer: 1
  },
  {
    id: 94,
    day: 19,
    group: "Cartes aéronautiques",
    question: "L'altitude du terrain (élévation) figure :",
    options: [
      "En pieds sur la VAC",
      "En mètres sur la carte OACI",
      "En FL",
      "En hPa"
    ],
    correctAnswer: 0
  },

  // JOUR 20
  {
    id: 20,
    day: 20,
    group: "Navigation aérienne",
    question: "Quelle erreur est fréquente lors de la navigation à l'estime ?",
    options: [
      "Ne pas corriger la dérive",
      "Utiliser le GPS",
      "Lire la mauvaise échelle",
      "Oublier la vitesse vraie"
    ],
    correctAnswer: 0
  },
  {
    id: 45,
    day: 20,
    group: "Contrôle aérien",
    question: "\"Negative\" signifie :",
    options: [
      "Oui",
      "Non",
      "Je ne sais pas",
      "Possible"
    ],
    correctAnswer: 1
  },
  {
    id: 70,
    day: 20,
    group: "Réglementation aérienne",
    question: "Le QNH permet d'obtenir :",
    options: [
      "L'altitude au-dessus du niveau moyen de la mer",
      "La hauteur sol",
      "Le FL",
      "L'altitude vraie"
    ],
    correctAnswer: 0
  },
  {
    id: 95,
    day: 20,
    group: "Cartes aéronautiques",
    question: "Les obstacles supérieurs à 100 m sont représentés :",
    options: [
      "Par un symbole d'antenne",
      "Par une croix",
      "Par un rond",
      "Par une flèche"
    ],
    correctAnswer: 0
  },

  // JOUR 21
  {
    id: 21,
    day: 21,
    group: "Navigation aérienne",
    question: "La ligne isogone sur une carte indique :",
    options: [
      "L'altitude",
      "L'intensité du vent",
      "La déclinaison magnétique constante",
      "La variation du relief"
    ],
    correctAnswer: 2
  },
  {
    id: 46,
    day: 21,
    group: "Contrôle aérien",
    question: "Quelle est la signification de \"Wilco\" ?",
    options: [
      "Je ne peux pas",
      "Bien reçu et je vais exécuter",
      "J'annule la clairance",
      "Je répète"
    ],
    correctAnswer: 1
  },
  {
    id: 71,
    day: 21,
    group: "Réglementation aérienne",
    question: "Le QFE permet d'obtenir :",
    options: [
      "La hauteur par rapport à la piste",
      "L'altitude moyenne",
      "L'altitude pression",
      "Le niveau de vol"
    ],
    correctAnswer: 0
  },
  {
    id: 96,
    day: 21,
    group: "Cartes aéronautiques",
    question: "Les zones militaires actives sont :",
    options: [
      "Publiées par NOTAM",
      "Publiées sur la carte IFR",
      "Publiées sur VAC",
      "Non publiées"
    ],
    correctAnswer: 0
  },

  // JOUR 22
  {
    id: 22,
    day: 22,
    group: "Navigation aérienne",
    question: "Le calcul du temps de vol se fait à partir de :",
    options: [
      "La vitesse vraie",
      "La vitesse indiquée",
      "La vitesse sol",
      "La vitesse de croisière prévue"
    ],
    correctAnswer: 0
  },
  {
    id: 47,
    day: 22,
    group: "Contrôle aérien",
    question: "\"Unable\" veut dire :",
    options: [
      "Impossible à exécuter",
      "Compris",
      "Reçu",
      "Négatif"
    ],
    correctAnswer: 0
  },
  {
    id: 72,
    day: 22,
    group: "Réglementation aérienne",
    question: "La limite de vitesse sous 10 000 ft est :",
    options: [
      "350 kt",
      "250 kt",
      "200 kt",
      "300 kt"
    ],
    correctAnswer: 1
  },
  {
    id: 97,
    day: 22,
    group: "Cartes aéronautiques",
    question: "Les routes VFR recommandées sont souvent tracées en :",
    options: [
      "Mauve",
      "Vert",
      "Bleu",
      "Rouge"
    ],
    correctAnswer: 1
  },

  // JOUR 23
  {
    id: 23,
    day: 23,
    group: "Navigation aérienne",
    question: "Une erreur de 5° sur le cap après 60 NM entraîne une déviation latérale d'environ :",
    options: [
      "2 NM",
      "5 NM",
      "8 NM",
      "10 NM"
    ],
    correctAnswer: 1
  },
  {
    id: 48,
    day: 23,
    group: "Contrôle aérien",
    question: "Le mot \"Standby\" signifie :",
    options: [
      "Répétez",
      "Attendez",
      "D'accord",
      "Je ne comprends pas"
    ],
    correctAnswer: 1
  },
  {
    id: 73,
    day: 23,
    group: "Réglementation aérienne",
    question: "En VFR, le niveau de croisière est choisi :",
    options: [
      "Selon la route vraie",
      "Selon le vent",
      "Selon la route magnétique",
      "Selon l'altitude du terrain"
    ],
    correctAnswer: 0
  },
  {
    id: 98,
    day: 23,
    group: "Cartes aéronautiques",
    question: "Les points de report VFR sont identifiés par :",
    options: [
      "Des lettres sur fond noir",
      "Des chiffres",
      "Des symboles météo",
      "Des fréquences"
    ],
    correctAnswer: 0
  },

  // JOUR 24
  {
    id: 24,
    day: 24,
    group: "Navigation aérienne",
    question: "En navigation, \"GS\" signifie :",
    options: [
      "Ground Speed",
      "Glide Slope",
      "General Service",
      "Ground Signal"
    ],
    correctAnswer: 0
  },
  {
    id: 49,
    day: 24,
    group: "Contrôle aérien",
    question: "Un \"holding pattern\" est :",
    options: [
      "Une procédure d'attente en vol",
      "Une procédure de décollage",
      "Une manœuvre d'évitement",
      "Une navigation GPS"
    ],
    correctAnswer: 0
  },
  {
    id: 74,
    day: 24,
    group: "Réglementation aérienne",
    question: "En France, la phraséologie se fait principalement en :",
    options: [
      "Anglais et français",
      "Français uniquement",
      "Anglais uniquement",
      "Langue locale"
    ],
    correctAnswer: 0
  },
  {
    id: 99,
    day: 24,
    group: "Cartes aéronautiques",
    question: "Sur la carte OACI, \"LF-R\" suivi d'un numéro désigne :",
    options: [
      "Une zone restreinte",
      "Une zone militaire",
      "Un aérodrome",
      "Un espace C"
    ],
    correctAnswer: 0
  },

  // JOUR 25
  {
    id: 25,
    day: 25,
    group: "Navigation aérienne",
    question: "Quelle est la meilleure méthode pour corriger la dérive en vol VFR ?",
    options: [
      "Ajuster le cap de quelques degrés",
      "Modifier l'altitude",
      "Changer la vitesse",
      "Couper le moteur et recalculer"
    ],
    correctAnswer: 0
  },
  {
    id: 50,
    day: 25,
    group: "Contrôle aérien",
    question: "Le terme \"Cleared to land\" est donné par :",
    options: [
      "Le Sol",
      "La Tour",
      "L'APP",
      "L'ATIS"
    ],
    correctAnswer: 1
  },
  {
    id: 75,
    day: 25,
    group: "Réglementation aérienne",
    question: "Le vol à vue (VFR) est interdit :",
    options: [
      "Au-dessus du FL195",
      "Au-dessus du FL245",
      "En dessous du FL50",
      "Dans les CTR"
    ],
    correctAnswer: 0
  },
  {
    id: 100,
    day: 25,
    group: "Cartes aéronautiques",
    question: "Les coordonnées sur les cartes aéronautiques sont exprimées en :",
    options: [
      "Degrés, minutes et secondes",
      "Radians",
      "Miles et NM",
      "Coordonnées GPS en mètres"
    ],
    correctAnswer: 0
  }
];
