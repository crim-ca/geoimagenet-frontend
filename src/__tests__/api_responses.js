export const TAXONOMY_RESPONSE = [{
  'name_fr': 'Couverture de sol',
  'slug': 'couverture-de-sol',
  'versions': [{
    'taxonomy_id': 2,
    'root_taxonomy_class_id': 205,
    'version': '1'
  }],
  'name_en': 'Land cover'
}, {
  'name_fr': 'Objets',
  'slug': 'objets',
  'versions': [{
    'taxonomy_id': 1,
    'root_taxonomy_class_id': 1,
    'version': '1'
  }],
  'name_en': 'Objects'
}];
export const TAXONOMY_CLASSES_RESPONSE = [{
  'id': 205,
  'name_fr': 'Couverture de sol',
  'taxonomy_id': 2,
  'code': 'COUV',
  'name_en': 'Land cover',
  'children': [{
    'id': 206,
    'name_fr': 'Urbain ou bâti',
    'taxonomy_id': 2,
    'code': 'URBA',
    'name_en': 'Urban or Built-up Land',
    'children': [{
      'id': 207,
      'name_fr': 'Zone résidentielle',
      'taxonomy_id': 2,
      'code': 'RESD',
      'name_en': 'Residential',
      'children': [{
        'id': 208,
        'name_fr': 'Densité faible',
        'taxonomy_id': 2,
        'code': 'DENS',
        'name_en': 'Low density',
        'children': []
      }, {
        'id': 209,
        'name_fr': 'Densité moyenne',
        'taxonomy_id': 2,
        'code': 'DENI',
        'name_en': 'Medium density',
        'children': []
      }, {
        'id': 210,
        'name_fr': 'Densité élevée',
        'taxonomy_id': 2,
        'code': 'DENT',
        'name_en': 'High density',
        'children': []
      }, {
        'id': 211,
        'name_fr': 'Parc de maisons mobiles',
        'taxonomy_id': 2,
        'code': 'PARC',
        'name_en': 'Mobile home park',
        'children': []
      }]
    }, {
      'id': 212,
      'name_fr': 'Zone commerciales et services',
      'taxonomy_id': 2,
      'code': 'COMC',
      'name_en': 'Commercial and Services',
      'children': [{
        'id': 213,
        'name_fr': 'Terrain associé au commerce ou au service',
        'taxonomy_id': 2,
        'code': 'TERR',
        'name_en': 'Ground related to commercial or services',
        'children': []
      }, {
        'id': 278,
        'name_fr': 'Campus (université ou collège)',
        'taxonomy_id': 2,
        'code': 'CAMP',
        'name_en': 'Campus (university or college)',
        'children': []
      }]
    }, {
      'id': 214,
      'name_fr': 'Zone industrielle',
      'taxonomy_id': 2,
      'code': 'INDS',
      'name_en': 'Industrial',
      'children': [{
        'id': 215,
        'name_fr': 'Terrain associé à l\'industrie',
        'taxonomy_id': 2,
        'code': 'TERA',
        'name_en': 'Ground related to industry',
        'children': []
      }]
    }, {
      'id': 216,
      'name_fr': 'Zone de transport',
      'taxonomy_id': 2,
      'code': 'TRAS',
      'name_en': 'Transportation',
      'children': [{
        'id': 217,
        'name_fr': 'Emprise/corridor de transport routier',
        'taxonomy_id': 2,
        'code': 'EMPR',
        'name_en': 'Road corridor',
        'children': []
      }, {
        'id': 218,
        'name_fr': 'Emprise/corridor de transport ferroviaire',
        'taxonomy_id': 2,
        'code': 'EMPI',
        'name_en': 'Train corridor',
        'children': []
      }, {
        'id': 219,
        'name_fr': 'Zone portuaire',
        'taxonomy_id': 2,
        'code': 'ZONE',
        'name_en': 'Harbour area',
        'children': []
      }, {
        'id': 220,
        'name_fr': 'Zone aéroportuaire',
        'taxonomy_id': 2,
        'code': 'ZONA',
        'name_en': 'Airport area',
        'children': []
      }]
    }, {
      'id': 221,
      'name_fr': 'Énergie',
      'taxonomy_id': 2,
      'code': 'ENEY',
      'name_en': 'Energy',
      'children': [{
        'id': 222,
        'name_fr': 'Emprise/corridor de transport d\'énergie électrique',
        'taxonomy_id': 2,
        'code': 'EMPS',
        'name_en': 'Electrical power right of way',
        'children': []
      }, {
        'id': 223,
        'name_fr': 'Emprise de pipeline',
        'taxonomy_id': 2,
        'code': 'EMPE',
        'name_en': 'Pipeline right of way',
        'children': []
      }, {
        'id': 224,
        'name_fr': 'Parc solaire',
        'taxonomy_id': 2,
        'code': 'PARS',
        'name_en': 'Solar park',
        'children': []
      }]
    }, {
      'id': 225,
      'name_fr': 'Urbain et bâti autre',
      'taxonomy_id': 2,
      'code': 'OTHU',
      'name_en': 'Other Urban or Built-up Land',
      'children': [{
        'id': 226,
        'name_fr': 'Parc, espace vert',
        'taxonomy_id': 2,
        'code': 'PARE',
        'name_en': 'Park, green space',
        'children': []
      }, {
        'id': 227,
        'name_fr': 'Terrain associé aux installations (traitement des eaux, traitement des déchets)',
        'taxonomy_id': 2,
        'code': 'TERI',
        'name_en': 'Ground related to installations (water treatment, waste treatment',
        'children': []
      }]
    }]
  }, {
    'id': 228,
    'name_fr': 'Terre agricole',
    'taxonomy_id': 2,
    'code': 'AGRU',
    'name_en': 'Agricultural Land',
    'children': [{
      'id': 229,
      'name_fr': 'Grande culture',
      'taxonomy_id': 2,
      'code': 'GRAN',
      'name_en': 'Cropland',
      'children': []
    }, {
      'id': 230,
      'name_fr': 'Maraîcher',
      'taxonomy_id': 2,
      'code': 'MARA',
      'name_en': 'Vegetable crop',
      'children': []
    }, {
      'id': 231,
      'name_fr': 'Pâturage',
      'taxonomy_id': 2,
      'code': 'PATU',
      'name_en': 'Pasture',
      'children': []
    }, {
      'id': 232,
      'name_fr': 'Ferme (terrain avec bâtiments)',
      'taxonomy_id': 2,
      'code': 'FERM',
      'name_en': 'Farmhouse and buildings / Farmstead',
      'children': []
    }, {
      'id': 233,
      'name_fr': 'Terre agricole autre',
      'taxonomy_id': 2,
      'code': 'OTHA',
      'name_en': 'Other Agricultural Land',
      'children': []
    }]
  }, {
    'id': 234,
    'name_fr': 'Pâturage',
    'taxonomy_id': 2,
    'code': 'RANG',
    'name_en': 'Rangeland',
    'children': [{
      'id': 235,
      'name_fr': 'Pâturage herbeux',
      'taxonomy_id': 2,
      'code': 'HERB',
      'name_en': 'Herbaceous Rangeland',
      'children': []
    }, {
      'id': 236,
      'name_fr': 'Pâturage arbuste et buisson',
      'taxonomy_id': 2,
      'code': 'SHRU',
      'name_en': 'Shrub and Brush Rangeland',
      'children': []
    }, {
      'id': 237,
      'name_fr': 'Pâturage mixte',
      'taxonomy_id': 2,
      'code': 'MIXE',
      'name_en': 'Mixed Rangeland',
      'children': []
    }]
  }, {
    'id': 238,
    'name_fr': 'Région forestière',
    'taxonomy_id': 2,
    'code': 'FORE',
    'name_en': 'Forest Land',
    'children': [{
      'id': 239,
      'name_fr': 'Forêt feuillue',
      'taxonomy_id': 2,
      'code': 'DECD',
      'name_en': 'Deciduous Forest Land',
      'children': []
    }, {
      'id': 240,
      'name_fr': 'Forêt conifère',
      'taxonomy_id': 2,
      'code': 'EVER',
      'name_en': 'Evergreen Forest Land',
      'children': []
    }, {
      'id': 241,
      'name_fr': 'Forêt mixte',
      'taxonomy_id': 2,
      'code': 'MIXD',
      'name_en': 'Mixed Forest Land',
      'children': []
    }, {
      'id': 242,
      'name_fr': 'Plantation',
      'taxonomy_id': 2,
      'code': 'PLAN',
      'name_en': 'Plantation',
      'children': []
    }, {
      'id': 243,
      'name_fr': 'Perturbation récente (feu, coupe)',
      'taxonomy_id': 2,
      'code': 'RECE',
      'name_en': 'Recent disturbance (fire, clear-cut)',
      'children': []
    }]
  }, {
    'id': 244,
    'name_fr': 'Région hydrique',
    'taxonomy_id': 2,
    'code': 'WAER',
    'name_en': 'Water',
    'children': [{
      'id': 245,
      'name_fr': 'Fleuve/ ruisseau',
      'taxonomy_id': 2,
      'code': 'STRA',
      'name_en': 'Stream',
      'children': []
    }, {
      'id': 246,
      'name_fr': 'Lac',
      'taxonomy_id': 2,
      'code': 'LAKE',
      'name_en': 'Lake',
      'children': []
    }, {
      'id': 247,
      'name_fr': 'Réservoir',
      'taxonomy_id': 2,
      'code': 'RESE',
      'name_en': 'Reservoir',
      'children': []
    }, {
      'id': 248,
      'name_fr': 'Baie et esturaire',
      'taxonomy_id': 2,
      'code': 'BAYS',
      'name_en': 'Bay and Estuarie',
      'children': []
    }, {
      'id': 249,
      'name_fr': 'Canal',
      'taxonomy_id': 2,
      'code': 'CANA',
      'name_en': 'Canal',
      'children': []
    }]
  }, {
    'id': 250,
    'name_fr': 'Milieu humide',
    'taxonomy_id': 2,
    'code': 'WETA',
    'name_en': 'Wetland',
    'children': [{
      'id': 251,
      'name_fr': 'Tourbière boisée',
      'taxonomy_id': 2,
      'code': 'FORS',
      'name_en': 'Forested peatland',
      'children': []
    }, {
      'id': 252,
      'name_fr': 'Bog (tourbière ombrotrophe)',
      'taxonomy_id': 2,
      'code': 'BOGG',
      'name_en': 'Bog',
      'children': []
    }, {
      'id': 253,
      'name_fr': 'Fen (tourbière minérotrophe)',
      'taxonomy_id': 2,
      'code': 'FNEN',
      'name_en': 'Fen',
      'children': []
    }, {
      'id': 254,
      'name_fr': 'Marécage',
      'taxonomy_id': 2,
      'code': 'SWAP',
      'name_en': 'Swamp',
      'children': []
    }, {
      'id': 255,
      'name_fr': 'Marais',
      'taxonomy_id': 2,
      'code': 'MARH',
      'name_en': 'Marsh',
      'children': []
    }, {
      'id': 279,
      'name_fr': 'Eau peu profonde',
      'taxonomy_id': 2,
      'code': 'SHAW',
      'name_en': 'Shallow water',
      'children': []
    }]
  }, {
    'id': 256,
    'name_fr': 'Sans végétation',
    'taxonomy_id': 2,
    'code': 'BARR',
    'name_en': 'Barren Land',
    'children': [{
      'id': 257,
      'name_fr': 'Salant sec',
      'taxonomy_id': 2,
      'code': 'DRYS',
      'name_en': 'Dry Salt Flat',
      'children': []
    }, {
      'id': 258,
      'name_fr': 'Plage',
      'taxonomy_id': 2,
      'code': 'BEAC',
      'name_en': 'Beach',
      'children': []
    }, {
      'id': 259,
      'name_fr': 'Zone sablonneuse (pas plage)',
      'taxonomy_id': 2,
      'code': 'SAND',
      'name_en': 'Sandy Area other than Beach',
      'children': []
    }, {
      'id': 260,
      'name_fr': 'Affleurement rocheux',
      'taxonomy_id': 2,
      'code': 'BARE',
      'name_en': 'Bare Exposed Rock',
      'children': []
    }, {
      'id': 261,
      'name_fr': 'Carrière à ciel ouvert et gravière',
      'taxonomy_id': 2,
      'code': 'STRI',
      'name_en': 'Strip Mine Quarrie, and Gravel Pit',
      'children': []
    }, {
      'id': 262,
      'name_fr': 'Zone de transistion',
      'taxonomy_id': 2,
      'code': 'TRAT',
      'name_en': 'Transitional Area',
      'children': []
    }, {
      'id': 263,
      'name_fr': 'Terrain sans végétation - mixte',
      'taxonomy_id': 2,
      'code': 'MIXB',
      'name_en': 'Mixed Barren Land',
      'children': []
    }]
  }, {
    'id': 264,
    'name_fr': 'Toundra',
    'taxonomy_id': 2,
    'code': 'TUND',
    'name_en': 'Tundra',
    'children': [{
      'id': 265,
      'name_fr': 'Toundra arbuste et buisson',
      'taxonomy_id': 2,
      'code': 'SHRB',
      'name_en': 'Shrub and Brush Tundra',
      'children': []
    }, {
      'id': 266,
      'name_fr': 'Toundra herbeuse',
      'taxonomy_id': 2,
      'code': 'HERA',
      'name_en': 'Herbaceous Tundra',
      'children': []
    }, {
      'id': 267,
      'name_fr': 'Toundra sol nu',
      'taxonomy_id': 2,
      'code': 'BARG',
      'name_en': 'Bare Ground Tundra',
      'children': []
    }, {
      'id': 268,
      'name_fr': 'Toundra humide',
      'taxonomy_id': 2,
      'code': 'WETT',
      'name_en': 'Wet Tundra',
      'children': []
    }, {
      'id': 269,
      'name_fr': 'Toundra mixte',
      'taxonomy_id': 2,
      'code': 'MIXT',
      'name_en': 'Mixed Tundra',
      'children': []
    }]
  }, {
    'id': 270,
    'name_fr': 'Neige et glace permanentes',
    'taxonomy_id': 2,
    'code': 'PERE',
    'name_en': 'Perennial Snow or Ice',
    'children': [{
      'id': 271,
      'name_fr': 'Neige permanente',
      'taxonomy_id': 2,
      'code': 'PERN',
      'name_en': 'Perennial Snowfield',
      'children': []
    }, {
      'id': 272,
      'name_fr': 'Glacier',
      'taxonomy_id': 2,
      'code': 'GLAI',
      'name_en': 'Glacier',
      'children': []
    }]
  }, {
    'id': 273,
    'name_fr': 'Forme terrestre',
    'taxonomy_id': 2,
    'code': 'FORM',
    'name_en': 'Glacial landform',
    'children': [{
      'id': 274,
      'name_fr': 'Esker',
      'taxonomy_id': 2,
      'code': 'ESKR',
      'name_en': 'Esker',
      'children': []
    }, {
      'id': 275,
      'name_fr': 'Moraine',
      'taxonomy_id': 2,
      'code': 'MORI',
      'name_en': 'Moraine',
      'children': []
    }, {
      'id': 276,
      'name_fr': 'Pingo',
      'taxonomy_id': 2,
      'code': 'PINO',
      'name_en': 'Pingo',
      'children': []
    }, {
      'id': 277,
      'name_fr': 'Drumlin',
      'taxonomy_id': 2,
      'code': 'DRUL',
      'name_en': 'Drumlin',
      'children': []
    }]
  }]
}, {
  'id': 1,
  'name_fr': 'Objets',
  'taxonomy_id': 1,
  'code': 'OBJE',
  'name_en': 'Objects',
  'children': [{
    'id': 2,
    'name_fr': 'Bâtiment résidentiel',
    'taxonomy_id': 1,
    'code': 'RESI',
    'name_en': 'Residential building',
    'children': [{
      'id': 3,
      'name_fr': 'Unifamilial',
      'taxonomy_id': 1,
      'code': 'SING',
      'name_en': 'Single-family',
      'children': []
    }, {
      'id': 4,
      'name_fr': 'Unifamilial détaché',
      'taxonomy_id': 1,
      'code': 'SINL',
      'name_en': 'Single-family detached',
      'children': []
    }, {
      'id': 5,
      'name_fr': 'Unifamilial jumelé',
      'taxonomy_id': 1,
      'code': 'SINE',
      'name_en': 'Single-family attached',
      'children': []
    }, {
      'id': 6,
      'name_fr': 'Multifamiliale',
      'taxonomy_id': 1,
      'code': 'MULT',
      'name_en': 'Multi-family',
      'children': []
    }, {
      'id': 7,
      'name_fr': 'Maison mobile',
      'taxonomy_id': 1,
      'code': 'MOBI',
      'name_en': 'Mobile home',
      'children': []
    }, {
      'id': 8,
      'name_fr': 'Autre bâtiment',
      'taxonomy_id': 1,
      'code': 'BUIL',
      'name_en': 'Building other',
      'children': []
    }]
  }, {
    'id': 9,
    'name_fr': 'Bâtiment commercial et service',
    'taxonomy_id': 1,
    'code': 'COMM',
    'name_en': 'Commercial building',
    'children': [{
      'id': 10,
      'name_fr': 'Centre commercial',
      'taxonomy_id': 1,
      'code': 'SHOP',
      'name_en': 'Shopping center',
      'children': []
    }, {
      'id': 11,
      'name_fr': 'Commerce indépendant (pharmacie, épicerie, …)',
      'taxonomy_id': 1,
      'code': 'COME',
      'name_en': 'Commercial store (drugstore, grocery store, …)',
      'children': []
    }, {
      'id': 12,
      'name_fr': 'Commerce de véhicules',
      'taxonomy_id': 1,
      'code': 'CARD',
      'name_en': 'Car dealership',
      'children': []
    }, {
      'id': 13,
      'name_fr': 'Station de service et garage',
      'taxonomy_id': 1,
      'code': 'GASS',
      'name_en': 'Gas station and automobile repair shop',
      'children': []
    }, {
      'id': 14,
      'name_fr': 'Hôtel',
      'taxonomy_id': 1,
      'code': 'HOTE',
      'name_en': 'Hotel',
      'children': []
    }, {
      'id': 15,
      'name_fr': 'Motel',
      'taxonomy_id': 1,
      'code': 'MOTE',
      'name_en': 'Motel',
      'children': []
    }, {
      'id': 16,
      'name_fr': 'Restaurant, brasserie',
      'taxonomy_id': 1,
      'code': 'REST',
      'name_en': 'Restaurant, bar',
      'children': []
    }, {
      'id': 17,
      'name_fr': 'Autre commerce/service',
      'taxonomy_id': 1,
      'code': 'OTHE',
      'name_en': 'Other retail or service',
      'children': []
    }]
  }, {
    'id': 18,
    'name_fr': 'Bâtiment de service et d\'utilité publique (équipements collectifs)',
    'taxonomy_id': 1,
    'code': 'PUBL',
    'name_en': 'Public utility and services building',
    'children': [{
      'id': 37,
      'name_fr': 'Château d\'eau',
      'taxonomy_id': 1,
      'code': 'WATE',
      'name_en': 'Water tower',
      'children': []
    }, {
      'id': 19,
      'name_fr': 'Édifice gouvernemental',
      'taxonomy_id': 1,
      'code': 'GOVE',
      'name_en': 'Government building',
      'children': []
    }, {
      'id': 20,
      'name_fr': 'Hôtel de ville',
      'taxonomy_id': 1,
      'code': 'CITY',
      'name_en': 'City hall',
      'children': []
    }, {
      'id': 21,
      'name_fr': 'Établissement d\'incarcération',
      'taxonomy_id': 1,
      'code': 'INCA',
      'name_en': 'Incarceration facility',
      'children': []
    }, {
      'id': 22,
      'name_fr': 'Poste de police',
      'taxonomy_id': 1,
      'code': 'POLI',
      'name_en': 'Police station',
      'children': []
    }, {
      'id': 23,
      'name_fr': 'Poste de pompiers',
      'taxonomy_id': 1,
      'code': 'FIRE',
      'name_en': 'Fire station',
      'children': []
    }, {
      'id': 24,
      'name_fr': 'Hôpital',
      'taxonomy_id': 1,
      'code': 'HOSP',
      'name_en': 'Hospital',
      'children': []
    }, {
      'id': 25,
      'name_fr': 'Église',
      'taxonomy_id': 1,
      'code': 'CHUR',
      'name_en': 'Church',
      'children': []
    }, {
      'id': 26,
      'name_fr': 'Maison de religieux',
      'taxonomy_id': 1,
      'code': 'OTHR',
      'name_en': 'Other religious building',
      'children': []
    }, {
      'id': 27,
      'name_fr': 'Université, collège',
      'taxonomy_id': 1,
      'code': 'UNIV',
      'name_en': 'University and college',
      'children': []
    }, {
      'id': 28,
      'name_fr': 'École primaire/secondaire',
      'taxonomy_id': 1,
      'code': 'SCHO',
      'name_en': 'School (elementary and high)',
      'children': []
    }, {
      'id': 29,
      'name_fr': 'Cinéma extérieur',
      'taxonomy_id': 1,
      'code': 'DRIV',
      'name_en': 'Drive-in cinema',
      'children': []
    }, {
      'id': 30,
      'name_fr': 'Aréna',
      'taxonomy_id': 1,
      'code': 'AREN',
      'name_en': 'Arena',
      'children': []
    }, {
      'id': 31,
      'name_fr': 'Stade',
      'taxonomy_id': 1,
      'code': 'STAD',
      'name_en': 'Stadium',
      'children': []
    }, {
      'id': 32,
      'name_fr': 'Centre sportif',
      'taxonomy_id': 1,
      'code': 'SPOR',
      'name_en': 'Sport facility',
      'children': []
    }, {
      'id': 33,
      'name_fr': 'Terrain de jeu, parc urbain',
      'taxonomy_id': 1,
      'code': 'PLAY',
      'name_en': 'Playground and park',
      'children': []
    }, {
      'id': 34,
      'name_fr': 'Cimetière',
      'taxonomy_id': 1,
      'code': 'CEME',
      'name_en': 'Cemetary',
      'children': []
    }, {
      'id': 35,
      'name_fr': 'Poste de douane',
      'taxonomy_id': 1,
      'code': 'CUST',
      'name_en': 'Customs checkpoint',
      'children': []
    }, {
      'id': 36,
      'name_fr': 'Observatoire',
      'taxonomy_id': 1,
      'code': 'OBSE',
      'name_en': 'Observatory',
      'children': []
    }, {
      'id': 38,
      'name_fr': 'Bassin de rétention',
      'taxonomy_id': 1,
      'code': 'RETE',
      'name_en': 'Retention basin',
      'children': []
    }]
  }, {
    'id': 39,
    'name_fr': 'Installations sportives extérieures',
    'taxonomy_id': 1,
    'code': 'OUTD',
    'name_en': 'Outdoor sport facility',
    'children': [{
      'id': 40,
      'name_fr': 'Terrain de baseball',
      'taxonomy_id': 1,
      'code': 'BASE',
      'name_en': 'Baseball field',
      'children': []
    }, {
      'id': 41,
      'name_fr': 'Terrain de soccer',
      'taxonomy_id': 1,
      'code': 'SOCC',
      'name_en': 'Soccer field',
      'children': []
    }, {
      'id': 42,
      'name_fr': 'Terrain de football',
      'taxonomy_id': 1,
      'code': 'FOOT',
      'name_en': 'Football field',
      'children': []
    }, {
      'id': 43,
      'name_fr': 'Piscine extérieure',
      'taxonomy_id': 1,
      'code': 'OUTO',
      'name_en': 'Outdoor pool',
      'children': []
    }, {
      'id': 44,
      'name_fr': 'Terrain de tennis',
      'taxonomy_id': 1,
      'code': 'TENN',
      'name_en': 'Tennis court',
      'children': []
    }, {
      'id': 45,
      'name_fr': 'Terrain de basketball',
      'taxonomy_id': 1,
      'code': 'BASK',
      'name_en': 'Basketball court',
      'children': []
    }, {
      'id': 46,
      'name_fr': 'Piste d\'athlétisme',
      'taxonomy_id': 1,
      'code': 'ATHL',
      'name_en': 'Athletics track',
      'children': []
    }, {
      'id': 47,
      'name_fr': 'Terrain à vocation multiple',
      'taxonomy_id': 1,
      'code': 'MULI',
      'name_en': 'Multiple-use sports field',
      'children': []
    }, {
      'id': 48,
      'name_fr': 'Terrain de volley-ball',
      'taxonomy_id': 1,
      'code': 'VOLL',
      'name_en': 'Volleyball court',
      'children': []
    }, {
      'id': 49,
      'name_fr': 'Terrain de golf',
      'taxonomy_id': 1,
      'code': 'GOLF',
      'name_en': 'Golf course',
      'children': []
    }, {
      'id': 50,
      'name_fr': 'Centre de ski',
      'taxonomy_id': 1,
      'code': 'SKIR',
      'name_en': 'Ski resort',
      'children': []
    }, {
      'id': 51,
      'name_fr': 'Piste de course',
      'taxonomy_id': 1,
      'code': 'RACE',
      'name_en': 'Racetrack',
      'children': []
    }, {
      'id': 52,
      'name_fr': 'Parc d\'attractions',
      'taxonomy_id': 1,
      'code': 'AMUS',
      'name_en': 'Amusement park',
      'children': []
    }, {
      'id': 53,
      'name_fr': 'Hippodrome',
      'taxonomy_id': 1,
      'code': 'HIPP',
      'name_en': 'Hippodrome',
      'children': []
    }]
  }, {
    'id': 54,
    'name_fr': 'Bâtiment ou infrastructure industriel',
    'taxonomy_id': 1,
    'code': 'INDU',
    'name_en': 'Industrial building and structure',
    'children': [{
      'id': 55,
      'name_fr': 'Usine d\'extraction (carrière, sablière, gravière)',
      'taxonomy_id': 1,
      'code': 'EXTR',
      'name_en': 'Extraction plant (quarry, gravel/sand pit)',
      'children': []
    }, {
      'id': 56,
      'name_fr': 'Usine de fabrication/transformation légère',
      'taxonomy_id': 1,
      'code': 'LIGH',
      'name_en': 'Light processing/manufacturing plant',
      'children': []
    }, {
      'id': 57,
      'name_fr': 'Usine de fabrication/transformation lourde',
      'taxonomy_id': 1,
      'code': 'HEAV',
      'name_en': 'Heavy processing/manufacturing plant',
      'children': []
    }, {
      'id': 58,
      'name_fr': 'Entrepôt de marchandise',
      'taxonomy_id': 1,
      'code': 'MERC',
      'name_en': 'Merchandise warehouse',
      'children': []
    }, {
      'id': 59,
      'name_fr': 'Entrepôt d\'hydrocarbures',
      'taxonomy_id': 1,
      'code': 'OILA',
      'name_en': 'Oil and gas storage facility',
      'children': []
    }, {
      'id': 60,
      'name_fr': 'Station d\'épuration des eaux',
      'taxonomy_id': 1,
      'code': 'WATR',
      'name_en': 'Water treatment plant',
      'children': []
    }, {
      'id': 61,
      'name_fr': 'Bassin de décantation',
      'taxonomy_id': 1,
      'code': 'DECA',
      'name_en': 'Decantation basin',
      'children': []
    }, {
      'id': 62,
      'name_fr': 'Site d\'enfouissement (dépôt de déchets)',
      'taxonomy_id': 1,
      'code': 'LAND',
      'name_en': 'Landfill site',
      'children': []
    }, {
      'id': 63,
      'name_fr': 'Réservoir',
      'taxonomy_id': 1,
      'code': 'TANK',
      'name_en': 'Tank',
      'children': []
    }, {
      'id': 64,
      'name_fr': 'Cheminée',
      'taxonomy_id': 1,
      'code': 'CHIM',
      'name_en': 'Chimney',
      'children': []
    }, {
      'id': 65,
      'name_fr': 'Usine autre',
      'taxonomy_id': 1,
      'code': 'OTHF',
      'name_en': 'Other factory',
      'children': []
    }]
  }, {
    'id': 66,
    'name_fr': 'Autres objets bâtis (mobilier urbain)',
    'taxonomy_id': 1,
    'code': 'STRE',
    'name_en': 'Street furniture',
    'children': [{
      'id': 67,
      'name_fr': 'Clôture',
      'taxonomy_id': 1,
      'code': 'FENC',
      'name_en': 'Fence',
      'children': []
    }, {
      'id': 68,
      'name_fr': 'Lampadaire',
      'taxonomy_id': 1,
      'code': 'LAMP',
      'name_en': 'Lamp post',
      'children': []
    }, {
      'id': 69,
      'name_fr': 'Trottoir',
      'taxonomy_id': 1,
      'code': 'SIDE',
      'name_en': 'Sidewalk',
      'children': []
    }, {
      'id': 70,
      'name_fr': 'Haie',
      'taxonomy_id': 1,
      'code': 'HEDG',
      'name_en': 'Hedgerow',
      'children': []
    }, {
      'id': 71,
      'name_fr': 'Poteau électrique',
      'taxonomy_id': 1,
      'code': 'UTIL',
      'name_en': 'Utility pole',
      'children': []
    }, {
      'id': 72,
      'name_fr': 'Abribus',
      'taxonomy_id': 1,
      'code': 'BUSS',
      'name_en': 'Bus shelter',
      'children': []
    }]
  }, {
    'id': 73,
    'name_fr': 'Infrastructure de transport routier',
    'taxonomy_id': 1,
    'code': 'ROAD',
    'name_en': 'Road infrastructure',
    'children': [{
      'id': 74,
      'name_fr': 'Autoroute',
      'taxonomy_id': 1,
      'code': 'HIGH',
      'name_en': 'Highway',
      'children': []
    }, {
      'id': 75,
      'name_fr': 'Échangeur',
      'taxonomy_id': 1,
      'code': 'INTE',
      'name_en': 'Interchange',
      'children': []
    }, {
      'id': 76,
      'name_fr': 'Route pavée',
      'taxonomy_id': 1,
      'code': 'PAVE',
      'name_en': 'Paved road',
      'children': []
    }, {
      'id': 77,
      'name_fr': 'Route non pavée',
      'taxonomy_id': 1,
      'code': 'UNPA',
      'name_en': 'Unpaved road',
      'children': []
    }, {
      'id': 78,
      'name_fr': 'Pont',
      'taxonomy_id': 1,
      'code': 'BRID',
      'name_en': 'Bridge',
      'children': []
    }, {
      'id': 79,
      'name_fr': 'Viaduc',
      'taxonomy_id': 1,
      'code': 'OVER',
      'name_en': 'Overpass',
      'children': []
    }, {
      'id': 80,
      'name_fr': 'Centre de services autoroutiers',
      'taxonomy_id': 1,
      'code': 'SERV',
      'name_en': 'Service and rest area',
      'children': []
    }, {
      'id': 81,
      'name_fr': 'Poste de péage',
      'taxonomy_id': 1,
      'code': 'TOLL',
      'name_en': 'Toll station',
      'children': []
    }, {
      'id': 82,
      'name_fr': 'Signalisation routière',
      'taxonomy_id': 1,
      'code': 'ROAS',
      'name_en': 'Road sign',
      'children': []
    }, {
      'id': 83,
      'name_fr': 'Stationnement',
      'taxonomy_id': 1,
      'code': 'PARK',
      'name_en': 'Parking lot',
      'children': []
    }, {
      'id': 84,
      'name_fr': 'Balance routière',
      'taxonomy_id': 1,
      'code': 'WEIG',
      'name_en': 'Weighing station',
      'children': []
    }, {
      'id': 85,
      'name_fr': 'Paraneige',
      'taxonomy_id': 1,
      'code': 'SNOW',
      'name_en': 'Snow fence',
      'children': []
    }, {
      'id': 86,
      'name_fr': 'Tunnel (entrée et sortie)',
      'taxonomy_id': 1,
      'code': 'TUNN',
      'name_en': 'Tunnel (entrance and exit)',
      'children': []
    }]
  }, {
    'id': 87,
    'name_fr': 'Infrastructure de transport ferroviaire',
    'taxonomy_id': 1,
    'code': 'TRAI',
    'name_en': 'Train infrastructure',
    'children': [{
      'id': 280,
      'name_fr': 'Passage à niveau',
      'taxonomy_id': 1,
      'code': 'RAIC',
      'name_en': 'Railway crossing',
      'children': []
    }, {
      'id': 88,
      'name_fr': 'Gare de train',
      'taxonomy_id': 1,
      'code': 'TRAN',
      'name_en': 'Train station',
      'children': []
    }, {
      'id': 89,
      'name_fr': 'Voie ferrée unique',
      'taxonomy_id': 1,
      'code': 'SINR',
      'name_en': 'Single railroad track',
      'children': []
    }, {
      'id': 90,
      'name_fr': 'Voie ferrée multiple',
      'taxonomy_id': 1,
      'code': 'MULP',
      'name_en': 'Multiple railroad tracks',
      'children': []
    }, {
      'id': 91,
      'name_fr': 'Voie de garage',
      'taxonomy_id': 1,
      'code': 'STOR',
      'name_en': 'Storage track',
      'children': []
    }, {
      'id': 92,
      'name_fr': 'Gare de triage',
      'taxonomy_id': 1,
      'code': 'TRAD',
      'name_en': 'Train depot',
      'children': []
    }, {
      'id': 93,
      'name_fr': 'Aiguillage ferroviaire',
      'taxonomy_id': 1,
      'code': 'RAIL',
      'name_en': 'Railway switch',
      'children': []
    }]
  }, {
    'id': 94,
    'name_fr': 'Infrastructure de transport maritime',
    'taxonomy_id': 1,
    'code': 'MARI',
    'name_en': 'Maritime infrastructure',
    'children': [{
      'id': 95,
      'name_fr': 'Port commercial',
      'taxonomy_id': 1,
      'code': 'COMR',
      'name_en': 'Commercial port',
      'children': []
    }, {
      'id': 96,
      'name_fr': 'Marina / Port de plaisance',
      'taxonomy_id': 1,
      'code': 'MARN',
      'name_en': 'Marina',
      'children': []
    }, {
      'id': 97,
      'name_fr': 'Port militaire',
      'taxonomy_id': 1,
      'code': 'MILI',
      'name_en': 'Military port',
      'children': []
    }, {
      'id': 98,
      'name_fr': 'Quai',
      'taxonomy_id': 1,
      'code': 'WARF',
      'name_en': 'Warf',
      'children': []
    }, {
      'id': 99,
      'name_fr': 'Rampe de mise à l\'eau',
      'taxonomy_id': 1,
      'code': 'BOAT',
      'name_en': 'Boat launching ramp',
      'children': []
    }, {
      'id': 100,
      'name_fr': 'Écluse',
      'taxonomy_id': 1,
      'code': 'BOAL',
      'name_en': 'Boat lock',
      'children': []
    }]
  }, {
    'id': 101,
    'name_fr': 'Infrastructure de transport aérien',
    'taxonomy_id': 1,
    'code': 'AIRT',
    'name_en': 'Air transport infastructure',
    'children': [{
      'id': 102,
      'name_fr': 'Aéroport',
      'taxonomy_id': 1,
      'code': 'AIRP',
      'name_en': 'Airport',
      'children': []
    }, {
      'id': 103,
      'name_fr': 'Piste de décollage',
      'taxonomy_id': 1,
      'code': 'RUNW',
      'name_en': 'Runway',
      'children': []
    }, {
      'id': 104,
      'name_fr': 'Hangar',
      'taxonomy_id': 1,
      'code': 'HANG',
      'name_en': 'Hangar',
      'children': []
    }]
  }, {
    'id': 105,
    'name_fr': 'Moyen de transport mobile',
    'taxonomy_id': 1,
    'code': 'MOBL',
    'name_en': 'Mobile transportation means',
    'children': [{
      'id': 106,
      'name_fr': 'Voiture',
      'taxonomy_id': 1,
      'code': 'CARR',
      'name_en': 'Car',
      'children': []
    }, {
      'id': 107,
      'name_fr': 'Fourgonnette',
      'taxonomy_id': 1,
      'code': 'VANN',
      'name_en': 'Van',
      'children': []
    }, {
      'id': 108,
      'name_fr': 'Camionnette',
      'taxonomy_id': 1,
      'code': 'PICK',
      'name_en': 'Pick-up truck',
      'children': []
    }, {
      'id': 109,
      'name_fr': 'Autocar/autobus',
      'taxonomy_id': 1,
      'code': 'AUTO',
      'name_en': 'Bus',
      'children': []
    }, {
      'id': 110,
      'name_fr': 'Train - locomotive',
      'taxonomy_id': 1,
      'code': 'TRAL',
      'name_en': 'Train - locomotive',
      'children': []
    }, {
      'id': 111,
      'name_fr': 'Train - wagon de passagers',
      'taxonomy_id': 1,
      'code': 'TRAP',
      'name_en': 'Train - passenger car',
      'children': []
    }, {
      'id': 112,
      'name_fr': 'Train - wagon de marchandise',
      'taxonomy_id': 1,
      'code': 'TRAF',
      'name_en': 'Train - freight car',
      'children': []
    }, {
      'id': 113,
      'name_fr': 'Bateau de plaisance, voilier',
      'taxonomy_id': 1,
      'code': 'PLEA',
      'name_en': 'Pleasure craft',
      'children': []
    }, {
      'id': 114,
      'name_fr': 'Bateau de marchandise',
      'taxonomy_id': 1,
      'code': 'FREI',
      'name_en': 'Freight vessel',
      'children': []
    }, {
      'id': 115,
      'name_fr': 'Porte-conteneurs',
      'taxonomy_id': 1,
      'code': 'CONT',
      'name_en': 'Container ship',
      'children': []
    }, {
      'id': 116,
      'name_fr': 'Pétrolier/méthanier',
      'taxonomy_id': 1,
      'code': 'TANE',
      'name_en': 'Tanker',
      'children': []
    }, {
      'id': 117,
      'name_fr': 'Avion type cessna',
      'taxonomy_id': 1,
      'code': 'SMAL',
      'name_en': 'Small plane',
      'children': []
    }, {
      'id': 118,
      'name_fr': 'Avion de ligne',
      'taxonomy_id': 1,
      'code': 'AIRL',
      'name_en': 'Airliner',
      'children': []
    }, {
      'id': 119,
      'name_fr': 'Avion militaire',
      'taxonomy_id': 1,
      'code': 'MILT',
      'name_en': 'Military aircraft',
      'children': []
    }, {
      'id': 120,
      'name_fr': 'Train routier',
      'taxonomy_id': 1,
      'code': 'ROAT',
      'name_en': 'Road train',
      'children': []
    }, {
      'id': 121,
      'name_fr': 'Paquebot',
      'taxonomy_id': 1,
      'code': 'CRUI',
      'name_en': 'Cruise ship',
      'children': []
    }, {
      'id': 122,
      'name_fr': 'Navire militaire',
      'taxonomy_id': 1,
      'code': 'MILA',
      'name_en': 'Military vessel',
      'children': []
    }]
  }, {
    'id': 123,
    'name_fr': 'Télécommunications',
    'taxonomy_id': 1,
    'code': 'TELE',
    'name_en': 'Telecommunication',
    'children': [{
      'id': 124,
      'name_fr': 'Tour (dédiée)',
      'taxonomy_id': 1,
      'code': 'TOWE',
      'name_en': 'Tower (dedicated)',
      'children': []
    }, {
      'id': 125,
      'name_fr': 'Antenne de communication (sur toit)',
      'taxonomy_id': 1,
      'code': 'COMU',
      'name_en': 'Communication antenna (roof)',
      'children': []
    }, {
      'id': 126,
      'name_fr': 'Station de réception satellite (grandes paraboles)',
      'taxonomy_id': 1,
      'code': 'SATE',
      'name_en': 'Satellite dish',
      'children': []
    }]
  }, {
    'id': 127,
    'name_fr': 'Énergie',
    'taxonomy_id': 1,
    'code': 'ENER',
    'name_en': 'Energy',
    'children': [{
      'id': 128,
      'name_fr': 'Ligne de haute tension',
      'taxonomy_id': 1,
      'code': 'HIGV',
      'name_en': 'High-voltage line',
      'children': []
    }, {
      'id': 129,
      'name_fr': 'Pipeline',
      'taxonomy_id': 1,
      'code': 'PIPE',
      'name_en': 'Pipeline',
      'children': []
    }, {
      'id': 130,
      'name_fr': 'Pylône',
      'taxonomy_id': 1,
      'code': 'PYLO',
      'name_en': 'Pylon',
      'children': []
    }, {
      'id': 131,
      'name_fr': 'Centrale thermique',
      'taxonomy_id': 1,
      'code': 'THER',
      'name_en': 'Thermal power plant',
      'children': []
    }, {
      'id': 132,
      'name_fr': 'Centrale hydro-électrique',
      'taxonomy_id': 1,
      'code': 'HYDR',
      'name_en': 'Hydroelectric power plant',
      'children': []
    }, {
      'id': 133,
      'name_fr': 'Centrale nucléaire',
      'taxonomy_id': 1,
      'code': 'NUCL',
      'name_en': 'Nuclear plant',
      'children': []
    }, {
      'id': 134,
      'name_fr': 'Éolienne',
      'taxonomy_id': 1,
      'code': 'WIND',
      'name_en': 'Wind turbine',
      'children': []
    }, {
      'id': 135,
      'name_fr': 'Panneau solaire',
      'taxonomy_id': 1,
      'code': 'SOLA',
      'name_en': 'Solar pannel',
      'children': []
    }, {
      'id': 136,
      'name_fr': 'Transformateur d\'électricité, poste électrique',
      'taxonomy_id': 1,
      'code': 'ELEC',
      'name_en': 'Electrical substation',
      'children': []
    }, {
      'id': 137,
      'name_fr': 'Puits de pétrole/gaz',
      'taxonomy_id': 1,
      'code': 'OILG',
      'name_en': 'Oil/ gas well',
      'children': []
    }, {
      'id': 138,
      'name_fr': 'Raffinerie',
      'taxonomy_id': 1,
      'code': 'REFI',
      'name_en': 'Refinery',
      'children': []
    }]
  }, {
    'id': 139,
    'name_fr': 'Structures anthropiques hydrographiques',
    'taxonomy_id': 1,
    'code': 'MANM',
    'name_en': 'Man-made hydrographic structure',
    'children': [{
      'id': 140,
      'name_fr': 'Digue',
      'taxonomy_id': 1,
      'code': 'DIKE',
      'name_en': 'Dike',
      'children': []
    }, {
      'id': 141,
      'name_fr': 'Brise-Lame',
      'taxonomy_id': 1,
      'code': 'BREA',
      'name_en': 'Breakwater',
      'children': []
    }, {
      'id': 142,
      'name_fr': 'Cale sèche',
      'taxonomy_id': 1,
      'code': 'DRYD',
      'name_en': 'Dry dock',
      'children': []
    }, {
      'id': 143,
      'name_fr': 'Entrave à la navigation',
      'taxonomy_id': 1,
      'code': 'NAVI',
      'name_en': 'Navigational obstacle',
      'children': []
    }, {
      'id': 144,
      'name_fr': 'Mur de protection (seawall)',
      'taxonomy_id': 1,
      'code': 'SEAW',
      'name_en': 'Seawall',
      'children': []
    }, {
      'id': 145,
      'name_fr': 'Repère de navigation',
      'taxonomy_id': 1,
      'code': 'NAVG',
      'name_en': 'Navigational landmark',
      'children': []
    }, {
      'id': 146,
      'name_fr': 'Vivier / pisciculture',
      'taxonomy_id': 1,
      'code': 'FISH',
      'name_en': 'Fish pool/ farm',
      'children': []
    }, {
      'id': 147,
      'name_fr': 'Échelle à poisson',
      'taxonomy_id': 1,
      'code': 'FISL',
      'name_en': 'Fish ladder',
      'children': []
    }]
  }, {
    'id': 148,
    'name_fr': 'Exploitation agricole',
    'taxonomy_id': 1,
    'code': 'FARM',
    'name_en': 'Farmland',
    'children': [{
      'id': 149,
      'name_fr': 'Champ - grandes cultures',
      'taxonomy_id': 1,
      'code': 'CROP',
      'name_en': 'Crop field',
      'children': []
    }, {
      'id': 150,
      'name_fr': 'Champ - cultures maraîchères',
      'taxonomy_id': 1,
      'code': 'FIEL',
      'name_en': 'Field - vegetable crop',
      'children': []
    }, {
      'id': 151,
      'name_fr': 'Champ - horticulture',
      'taxonomy_id': 1,
      'code': 'FIED',
      'name_en': 'Field - horticulture',
      'children': []
    }, {
      'id': 152,
      'name_fr': 'Champ - fourrager',
      'taxonomy_id': 1,
      'code': 'FIEH',
      'name_en': 'Field - hay',
      'children': []
    }, {
      'id': 153,
      'name_fr': 'Friche',
      'taxonomy_id': 1,
      'code': 'FALL',
      'name_en': 'Fallow',
      'children': []
    }, {
      'id': 154,
      'name_fr': 'Verger',
      'taxonomy_id': 1,
      'code': 'ORCH',
      'name_en': 'Orchard',
      'children': []
    }, {
      'id': 155,
      'name_fr': 'Vignoble',
      'taxonomy_id': 1,
      'code': 'VINE',
      'name_en': 'Vineyards',
      'children': []
    }, {
      'id': 156,
      'name_fr': 'Enclos',
      'taxonomy_id': 1,
      'code': 'PADD',
      'name_en': 'Paddock',
      'children': []
    }]
  }, {
    'id': 157,
    'name_fr': 'Bâtiments agricoles',
    'taxonomy_id': 1,
    'code': 'AGRI',
    'name_en': 'Agricultural buildings',
    'children': [{
      'id': 158,
      'name_fr': 'Grange, entrepôt, hangar',
      'taxonomy_id': 1,
      'code': 'BARN',
      'name_en': 'Barn, warehouse, shed',
      'children': []
    }, {
      'id': 159,
      'name_fr': 'Silo',
      'taxonomy_id': 1,
      'code': 'SILO',
      'name_en': 'Silo',
      'children': []
    }, {
      'id': 160,
      'name_fr': 'Ferme d\'élevage',
      'taxonomy_id': 1,
      'code': 'LIVE',
      'name_en': 'Livestock farm',
      'children': []
    }, {
      'id': 161,
      'name_fr': 'Fosse lisier',
      'taxonomy_id': 1,
      'code': 'MANU',
      'name_en': 'Manure pit',
      'children': []
    }, {
      'id': 162,
      'name_fr': 'Serre d\'exploitation agricole',
      'taxonomy_id': 1,
      'code': 'AGRC',
      'name_en': 'Agricultural greenhouse',
      'children': []
    }, {
      'id': 163,
      'name_fr': 'Serre commerciale',
      'taxonomy_id': 1,
      'code': 'SERR',
      'name_en': 'Commercial greenhouse',
      'children': []
    }, {
      'id': 164,
      'name_fr': 'Élévateur à grain',
      'taxonomy_id': 1,
      'code': 'GRAI',
      'name_en': 'Grain elevator',
      'children': []
    }]
  }, {
    'id': 165,
    'name_fr': 'Arbres (en divers milieux)',
    'taxonomy_id': 1,
    'code': 'TREE',
    'name_en': 'Trees',
    'children': [{
      'id': 166,
      'name_fr': 'Arbre feuillu (Deciduous tree)',
      'taxonomy_id': 1,
      'code': 'DECI',
      'name_en': 'Deciduous tree',
      'children': []
    }, {
      'id': 167,
      'name_fr': 'Arbre conifère (Evergreen Forest Land)',
      'taxonomy_id': 1,
      'code': 'CONI',
      'name_en': 'Coniferous tree',
      'children': []
    }]
  }, {
    'id': 168,
    'name_fr': 'Hydrographie linéaire',
    'taxonomy_id': 1,
    'code': 'LINE',
    'name_en': 'Linear hydrography',
    'children': [{
      'id': 169,
      'name_fr': 'Rivière (Streams)',
      'taxonomy_id': 1,
      'code': 'RIVE',
      'name_en': 'River and stream',
      'children': []
    }, {
      'id': 170,
      'name_fr': 'Ruisseau',
      'taxonomy_id': 1,
      'code': 'BROO',
      'name_en': 'Brook',
      'children': []
    }, {
      'id': 171,
      'name_fr': 'Fossé',
      'taxonomy_id': 1,
      'code': 'DITC',
      'name_en': 'Ditch',
      'children': []
    }, {
      'id': 172,
      'name_fr': 'Chute',
      'taxonomy_id': 1,
      'code': 'WATF',
      'name_en': 'Waterfall',
      'children': []
    }, {
      'id': 173,
      'name_fr': 'Rapide',
      'taxonomy_id': 1,
      'code': 'RAPI',
      'name_en': 'Rapid',
      'children': []
    }, {
      'id': 174,
      'name_fr': 'Cours d\'eau tari',
      'taxonomy_id': 1,
      'code': 'DRYW',
      'name_en': 'Dry watercourse',
      'children': []
    }]
  }, {
    'id': 175,
    'name_fr': 'Hydrographie surfacique',
    'taxonomy_id': 1,
    'code': 'SURF',
    'name_en': 'Surficial hydrography',
    'children': [{
      'id': 176,
      'name_fr': 'Eau',
      'taxonomy_id': 1,
      'code': 'WAET',
      'name_en': 'Water',
      'children': []
    }]
  }, {
    'id': 177,
    'name_fr': 'Milieux humides',
    'taxonomy_id': 1,
    'code': 'WETL',
    'name_en': 'Wetland',
    'children': [{
      'id': 178,
      'name_fr': 'Bog - arboré',
      'taxonomy_id': 1,
      'code': 'TRED',
      'name_en': 'Treed bog',
      'children': []
    }, {
      'id': 179,
      'name_fr': 'Bog - non arboré',
      'taxonomy_id': 1,
      'code': 'UNTR',
      'name_en': 'Untreed bog',
      'children': []
    }, {
      'id': 180,
      'name_fr': 'Fen',
      'taxonomy_id': 1,
      'code': 'FENN',
      'name_en': 'Fen',
      'children': []
    }, {
      'id': 181,
      'name_fr': 'Marécage',
      'taxonomy_id': 1,
      'code': 'SWAM',
      'name_en': 'Swamp',
      'children': []
    }, {
      'id': 182,
      'name_fr': 'Marais',
      'taxonomy_id': 1,
      'code': 'MARS',
      'name_en': 'Marsh',
      'children': []
    }, {
      'id': 183,
      'name_fr': 'Eau peu profonde',
      'taxonomy_id': 1,
      'code': 'SHAL',
      'name_en': 'Shallow water',
      'children': []
    }]
  }, {
    'id': 184,
    'name_fr': 'Mines',
    'taxonomy_id': 1,
    'code': 'MINE',
    'name_en': 'Mines',
    'children': [{
      'id': 185,
      'name_fr': 'Pit',
      'taxonomy_id': 1,
      'code': 'PITT',
      'name_en': 'Pit',
      'children': []
    }, {
      'id': 186,
      'name_fr': 'Mine shaft',
      'taxonomy_id': 1,
      'code': 'MINS',
      'name_en': 'Mine shaft',
      'children': []
    }, {
      'id': 187,
      'name_fr': 'Tailings',
      'taxonomy_id': 1,
      'code': 'TAIL',
      'name_en': 'Tailings',
      'children': []
    }, {
      'id': 188,
      'name_fr': 'Decantation basin',
      'taxonomy_id': 1,
      'code': 'DECN',
      'name_en': 'Decantation basin',
      'children': []
    }]
  }, {
    'id': 189,
    'name_fr': 'Formes terrestres',
    'taxonomy_id': 1,
    'code': 'GLAC',
    'name_en': 'Glacial landforms',
    'children': [{
      'id': 190,
      'name_fr': 'Esker',
      'taxonomy_id': 1,
      'code': 'ESKE',
      'name_en': 'Esker',
      'children': []
    }, {
      'id': 191,
      'name_fr': 'Moraine',
      'taxonomy_id': 1,
      'code': 'MORA',
      'name_en': 'Moraine',
      'children': []
    }, {
      'id': 192,
      'name_fr': 'Pingo',
      'taxonomy_id': 1,
      'code': 'PING',
      'name_en': 'Pingo',
      'children': []
    }, {
      'id': 193,
      'name_fr': 'Drumlin',
      'taxonomy_id': 1,
      'code': 'DRUM',
      'name_en': 'Drumlin',
      'children': []
    }]
  }]
}];
export const ANNOTATIONS_COUNTS_RESPONSE = {
  '14': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 1,
    'rejected': 0,
    'deleted': 0
  },
  '83': {
    'new': 3,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 8,
    'rejected': 0,
    'deleted': 9
  },
  '55': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 1,
    'rejected': 0,
    'deleted': 0
  },
  '100': {
    'new': 0,
    'pre_released': 0,
    'released': 26,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 2
  },
  '118': {
    'new': 2,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '107': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 4,
    'rejected': 0,
    'deleted': 0
  },
  '88': {
    'new': 0,
    'pre_released': 0,
    'released': 56,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 4
  },
  '99': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 1,
    'rejected': 0,
    'deleted': 0
  },
  '28': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 3,
    'rejected': 0,
    'deleted': 0
  },
  '91': {
    'new': 0,
    'pre_released': 0,
    'released': 3,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '151': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 2,
    'rejected': 0,
    'deleted': 0
  },
  '4': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 4,
    'rejected': 0,
    'deleted': 1
  },
  '89': {
    'new': 0,
    'pre_released': 0,
    'released': 85,
    'review': 0,
    'validated': 4,
    'rejected': 0,
    'deleted': 5
  },
  '30': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 1,
    'rejected': 0,
    'deleted': 0
  },
  '49': {
    'new': 80,
    'pre_released': 0,
    'released': 160,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 5
  },
  '95': {
    'new': 0,
    'pre_released': 0,
    'released': 11,
    'review': 0,
    'validated': 3,
    'rejected': 0,
    'deleted': 3
  },
  '113': {
    'new': 0,
    'pre_released': 0,
    'released': 5,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '121': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 1,
    'rejected': 0,
    'deleted': 0
  },
  '96': {
    'new': 0,
    'pre_released': 0,
    'released': 53,
    'review': 0,
    'validated': 2,
    'rejected': 0,
    'deleted': 5
  },
  '33': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 2,
    'rejected': 0,
    'deleted': 0
  },
  '74': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 4,
    'rejected': 0,
    'deleted': 0
  },
  '108': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 6,
    'rejected': 0,
    'deleted': 1
  },
  '40': {
    'new': 1,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 3,
    'rejected': 0,
    'deleted': 0
  },
  '182': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 2,
    'rejected': 0,
    'deleted': 0
  },
  '6': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 4,
    'rejected': 0,
    'deleted': 0
  },
  '56': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 1,
    'rejected': 0,
    'deleted': 0
  },
  '92': {
    'new': 0,
    'pre_released': 0,
    'released': 33,
    'review': 0,
    'validated': 1,
    'rejected': 0,
    'deleted': 2
  },
  '102': {
    'new': 0,
    'pre_released': 0,
    'released': 16,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 10
  },
  '149': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 2,
    'rejected': 0,
    'deleted': 0
  },
  '57': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 1,
    'rejected': 0,
    'deleted': 0
  },
  '159': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 1,
    'rejected': 0,
    'deleted': 0
  },
  '31': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 2,
    'rejected': 0,
    'deleted': 0
  },
  '65': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 2,
    'rejected': 0,
    'deleted': 0
  },
  '37': {
    'new': 2,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '69': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 2,
    'rejected': 0,
    'deleted': 0
  },
  '117': {
    'new': 0,
    'pre_released': 0,
    'released': 1,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '19': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 1,
    'deleted': 0
  },
  '76': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 1,
    'rejected': 0,
    'deleted': 0
  },
  '90': {
    'new': 0,
    'pre_released': 0,
    'released': 102,
    'review': 0,
    'validated': 11,
    'rejected': 0,
    'deleted': 7
  },
  '44': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 1,
    'rejected': 0,
    'deleted': 0
  },
  '106': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 1,
    'rejected': 0,
    'deleted': 0
  },
  '34': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 1,
    'rejected': 0,
    'deleted': 0
  },
  '43': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 1,
    'rejected': 0,
    'deleted': 0
  },
  '93': {
    'new': 0,
    'pre_released': 0,
    'released': 18,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '58': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 1,
    'rejected': 0,
    'deleted': 0
  },
  '8': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 2,
    'rejected': 0,
    'deleted': 0
  },
  '79': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 1,
    'rejected': 0,
    'deleted': 0
  },
  '10': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 1,
    'deleted': 0
  },
  '78': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 5,
    'rejected': 0,
    'deleted': 2
  },
  '164': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 1,
    'rejected': 0,
    'deleted': 0
  },
  '42': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 1,
    'rejected': 0,
    'deleted': 0
  },
  '166': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 8,
    'rejected': 0,
    'deleted': 0
  },
  '179': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 1,
    'rejected': 0,
    'deleted': 0
  },
  '98': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 2,
    'rejected': 0,
    'deleted': 0
  },
  '3': {
    'new': 1,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 2,
    'rejected': 1,
    'deleted': 0
  },
  '150': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 1,
    'rejected': 0,
    'deleted': 0
  },
  '131': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 1,
    'rejected': 0,
    'deleted': 0
  },
  '67': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 2
  },
  '158': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 3,
    'rejected': 0,
    'deleted': 0
  },
  '176': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 2,
    'rejected': 0,
    'deleted': 0
  },
  '167': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 4,
    'rejected': 0,
    'deleted': 0
  },
  '63': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 1,
    'rejected': 0,
    'deleted': 0
  },
  '169': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 2,
    'rejected': 0,
    'deleted': 0
  },
  '178': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 1,
    'rejected': 0,
    'deleted': 0
  },
  '183': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 1,
    'rejected': 0,
    'deleted': 0
  },
  '1': {
    'new': 89,
    'pre_released': 10,
    'released': 569,
    'review': 10,
    'validated': 124,
    'rejected': 3,
    'deleted': 58
  },
  '2': {
    'new': 1,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 12,
    'rejected': 1,
    'deleted': 1
  },
  '5': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '7': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '9': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 1,
    'rejected': 1,
    'deleted': 0
  },
  '11': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '12': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '13': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '15': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '16': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '17': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '18': {
    'new': 2,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 9,
    'rejected': 1,
    'deleted': 0
  },
  '20': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '21': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '22': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '23': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '24': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '25': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '26': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '27': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '29': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '32': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '35': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '36': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '38': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '39': {
    'new': 81,
    'pre_released': 0,
    'released': 160,
    'review': 0,
    'validated': 6,
    'rejected': 0,
    'deleted': 5
  },
  '41': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '45': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '46': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '47': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '48': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '50': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '51': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '52': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '53': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '54': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 7,
    'rejected': 0,
    'deleted': 0
  },
  '59': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '60': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '61': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '62': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '64': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '66': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 2,
    'rejected': 0,
    'deleted': 2
  },
  '68': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '70': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '71': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '72': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '73': {
    'new': 3,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 19,
    'rejected': 0,
    'deleted': 11
  },
  '75': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '77': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '80': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '81': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '82': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '84': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '85': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '86': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '87': {
    'new': 0,
    'pre_released': 0,
    'released': 297,
    'review': 0,
    'validated': 16,
    'rejected': 0,
    'deleted': 18
  },
  '280': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '94': {
    'new': 0,
    'pre_released': 0,
    'released': 90,
    'review': 0,
    'validated': 8,
    'rejected': 0,
    'deleted': 10
  },
  '97': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '101': {
    'new': 0,
    'pre_released': 0,
    'released': 16,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 10
  },
  '103': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '104': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '105': {
    'new': 2,
    'pre_released': 0,
    'released': 6,
    'review': 0,
    'validated': 12,
    'rejected': 0,
    'deleted': 1
  },
  '109': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '110': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '111': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '112': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '114': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '115': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '116': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '119': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '120': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '122': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '123': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '124': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '125': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '126': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '127': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 1,
    'rejected': 0,
    'deleted': 0
  },
  '128': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '129': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '130': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '132': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '133': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '134': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '135': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '136': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '137': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '138': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '139': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '140': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '141': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '142': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '143': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '144': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '145': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '146': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '147': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '148': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 5,
    'rejected': 0,
    'deleted': 0
  },
  '152': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '153': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '154': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '155': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '156': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '157': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 5,
    'rejected': 0,
    'deleted': 0
  },
  '160': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '161': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '162': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '163': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '165': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 12,
    'rejected': 0,
    'deleted': 0
  },
  '168': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 2,
    'rejected': 0,
    'deleted': 0
  },
  '170': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '171': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '172': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '173': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '174': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '175': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 2,
    'rejected': 0,
    'deleted': 0
  },
  '177': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 5,
    'rejected': 0,
    'deleted': 0
  },
  '180': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '181': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '184': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '185': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '186': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '187': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '188': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '189': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '190': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '191': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '192': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  },
  '193': {
    'new': 0,
    'pre_released': 0,
    'released': 0,
    'review': 0,
    'validated': 0,
    'rejected': 0,
    'deleted': 0
  }
};

test('Making api response file pass', () => {
  expect(true)
    .toBe(true);
});
