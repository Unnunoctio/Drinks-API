export enum ErrorCode {
  // Errores de cliente (4xx)
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED',

  // Errores de servidor (5xx)
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR'
}

export enum DrinkPackage {
  BOTELLA = 'Botella',
  LATA = 'Lata',
  BARRIL = 'Barril',
  TETRAPACK = 'Tetrapack'
}

export enum DrinkCategory {
  CERVEZAS = 'Cervezas',
  VINOS = 'Vinos',
  DESTILADOS = 'Destilados'
}

export enum DrinkSubCategory {
  // Beers
  CERVEZAS_ARTESANALES = 'Cervezas Artesanales',
  CERVEZAS_TRADICIONALES = 'Cervezas Tradicionales',
  CERVEZAS_IMPORTADAS = 'Cervezas Importadas',
  CERVEZAS_SIN_ALCOHOL = 'Cervezas Sin Alcohol',
  // Wines
  VINOS_TINTOS = 'Vinos Tintos',
  VINOS_BLANCOS = 'Vinos Blancos',
  VINOS_ROSE = 'Vinos Rosé',
  VINOS_CERO = 'Vinos Cero',
  // Spirits
  PISCO = 'Pisco',
  RON = 'Ron',
  TEQUILA = 'Tequila',
  VODKA = 'Vodka',
  WHISKEY = 'Whisky',
  GIN = 'Gin'
}

export enum BeerVariety {
  // Sin Escuela
  ALE = 'Ale',
  NEGRA = 'Negra',
  IPA = 'IPA',
  TRIGO = 'Trigo',
  FRUIT = 'Fruit',
  // Escuela Alemana
  LAGER = 'Lager',
  PALE_LAGER = 'Pale Lager',
  AMBER_LAGER = 'Amber Lager',
  GERMAN_PILS = 'German Pils',
  GERMAN_LAGER = 'German Lager',
  STRONG_LAGER = 'Strong Lager',
  MUNICH = 'Munich',
  DARK_MUNICH = 'Dark Munich',
  DUNKEL = 'Dunkel',
  OKTOBERFEST = 'Oktoberfest',
  BOCK = 'Bock',
  HELLER_BOCK = 'Heller Bock',
  DUNKLER_BOCK = 'Dunkler Bock',
  DOPPELBOCK = 'Doppelbock',
  EISBOCK = 'Eisbock',
  SCHWARZBIER = 'Schwarzbier',
  KELLERBIER = 'Kellerbier',
  RAUCHBIER = 'Rauchbier',
  WEIZEN = 'Weizen',
  HEFEWEIZEN = 'Hefeweizen',
  KRISTALLWEIZEN = 'Kristallweizen',
  DUNKELWEIZEN = 'Dunkelweizen',
  WEIZENBOCK = 'Weizenbock',
  KOLSCH = 'Kölsch',
  ALTBIER = 'Altbier',
  BERLINER_WEISSE = 'Berliner Weisse',
  GOSE = 'Gose',
  // Escuela Britanica
  CASK_ALE = 'Cask Ale',
  ORDINARY_BITTER = 'Ordinary Bitter',
  BEST_BITTER = 'Best Bitter',
  STRONG_BITTER = 'Strong Bitter',
  BRITISH_PALE_ALE = 'British Pale Ale',
  PORTER = 'Porter',
  STOUT = 'Stout',
  IMPERIAL_STOUT = 'Imperial Stout',
  CREAM_STOUT = 'Cream Stout',
  BROWN_ALE = 'Brown Ale',
  SCOTCH_ALE = 'Scotch Ale',
  STRONG_SCOTCH_ALE = 'Strong Scotch Ale',
  IRISH_RED_ALE = 'Irish Red Ale',
  // Escuela Belga
  ABBEY_ALES = 'Abbey Ales',
  SINGLE = 'Single',
  DUBBEL = 'Dubbel',
  TRIPEL = 'Triple',
  QUADRUPEL = 'Quadrupel',
  BELGIAN_GOLDEN_STRONG_ALE = 'Belgian Golden Strong Ale',
  BELGIAN_STRONG_DARK_ALE = 'Belgian Strong Dark Ale',
  BELGIAN_STRONG_PALE_ALE = 'Belgian Strong Pale Ale',
  FARMHOUSE_ALE = 'Farmhouse Ale',
  SAISON = 'Saison',
  BIERE_DE_GARDE = 'Bière de Garde',
  BELGIAN_BLONDE_ALE = 'Belgian Blonde Ale',
  WITBIER = 'Witbier',
  DARK_ALE = 'Dark Ale',
  PALE_ALE = 'Pale Ale',
  GOLDEN_ALE = 'Golden Ale',
  LAMBIC = 'Lambic',
  FLANDERS_RED_ALE = 'Flanders Red Ale',
  FLANDERS_BROWN_ALE = 'Flanders Brown Ale',
  // Escuela EEUU
  AMERICAN_LAGER = 'American Lager',
  AMERICAN_PALE_ALE = 'American Pale Ale',
  INDIAN_PALE_ALE = 'Indian Pale Ale',
  HAZY_IPA = 'Hazy IPA',
  DOUBLE_HAZY_IPA = 'Double Hazy IPA',
  HAZY_LAGER = 'Hazy Lager',
  HAZY_APA = 'Hazy APA',
  AMERICAN_PORTER = 'American Porter',
  AMERICAN_IMPERIAL_STOUT = 'American Imperial Stout',
  AMERICAN_SCOTCH_ALE = 'American Scotch Ale',
  // Otros
  KROSS_ROSE_ALE = 'Kross Rose Ale',
  BLEND = 'Blend',
  HOPPY_ALE = 'Hoppy Ale',
  MARZENBIER = 'Märzenbier',
  GLUTEN_FREE_LAGER = 'Gluten Free Lager',
  GLUTEN_FREE_DOUBLE_MALT = 'Gluten Free Double Malt',
  ALSATIAN = 'Alsatian',
  AMBER_ALE = 'Amber Ale',
  STRONG_ALE = 'Strong Ale',
  ROBUST_PORTER = 'Robust Porter',
  SUMMER_ALE = 'Summer Ale',
  INEDIT = 'Inedit'
}

export enum WineStrain {
  CABERNET_SAUVIGNON = 'Cabernet Sauvignon',
  PINOT_NOIR = 'Pinot Noir',
  MERLOT = 'Merlot',
  SYRAH = 'Syrah',
  CARMENERE = 'Carmenere',
  MALBEC = 'Malbec',
  SAUVIGNON_BLANC = 'Sauvignon Blanc',
  CHARDONNAY = 'Chardonnay',
  PINOT_GRIGIO = 'Pinot Grigio',
  PINOT_GRIS = 'Pinot Gris',
  ALBARINO = 'Albariño',
  MOSCATO = 'Moscato',
  MOSCATEL = 'Moscatel',
  VERDEJO = 'Verdejo',
  RIESLING = 'Riesling',
  SEMILLON = 'Semillón',
  GEWURZTRAMINER = 'Gewürztraminer',
  GARNACHA = 'Garnacha',
  TEMPERANILLO = 'Temperanillo',
  SANGIOVESE = 'Sangiovese',
  ZINFANDEL = 'Zinfandel'
}
