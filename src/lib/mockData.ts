export interface MockCard {
  id: string
  name: string
  set: string
  year: string
  rarity: string
  conditionNotes: string
  imageUrl: string
  fallbackGradient: string
  borderColor: string
  accentColor: string
  game: 'pokemon' | 'mtg' | 'yugioh'
}

export const MOCK_CARDS: MockCard[] = [
  {
    id: 'charizard-base',
    name: 'Charizard',
    set: 'Base Set',
    year: '1999',
    rarity: 'Holo Rare',
    conditionNotes:
      'Minor edge wear on top-left corner, centering 60/40 front, faint scratch marks on holo surface under direct light',
    imageUrl: 'https://images.pokemontcg.io/base1/4_hires.png',
    fallbackGradient: 'linear-gradient(145deg, #1a0800 0%, #7a2e00 35%, #e85d04 65%, #ffba08 100%)',
    borderColor: '#e85d04',
    accentColor: '#ffba08',
    game: 'pokemon',
  },
  {
    id: 'black-lotus',
    name: 'Black Lotus',
    set: 'Alpha Edition',
    year: '1993',
    rarity: 'Rare',
    conditionNotes:
      'Moderate play wear, corners show rounding, slight ink fading on text, original card gloss 70% intact, minor creasing on back',
    imageUrl: 'https://cards.scryfall.io/large/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg',
    fallbackGradient: 'linear-gradient(145deg, #050510 0%, #0a0a2e 35%, #1a0633 65%, #2d1b69 100%)',
    borderColor: '#7c3aed',
    accentColor: '#c4b5fd',
    game: 'mtg',
  },
  {
    id: 'blue-eyes',
    name: 'Blue-Eyes White Dragon',
    set: 'Legend of Blue Eyes',
    year: '2002',
    rarity: '1st Ed. Ultra Rare',
    conditionNotes:
      'Near mint condition, excellent centering 55/45, crisp original edges, minimal handling marks visible only under 10× loupe',
    imageUrl: 'https://images.ygoprodeck.com/images/cards/89631139.jpg',
    fallbackGradient: 'linear-gradient(145deg, #001d3d 0%, #003566 35%, #0077b6 65%, #90e0ef 100%)',
    borderColor: '#0077b6',
    accentColor: '#90e0ef',
    game: 'yugioh',
  },
  {
    id: 'mewtwo-base',
    name: 'Mewtwo',
    set: 'Base Set',
    year: '1999',
    rarity: 'Holo Rare',
    conditionNotes:
      'Heavy play wear — significant scratching on holo surface, bottom-right crease, light staining on reverse, card remains structurally intact',
    imageUrl: 'https://images.pokemontcg.io/base1/10_hires.png',
    fallbackGradient: 'linear-gradient(145deg, #1a0030 0%, #4a0070 35%, #9b30d0 65%, #e040fb 100%)',
    borderColor: '#9b30d0',
    accentColor: '#e040fb',
    game: 'pokemon',
  },
]
