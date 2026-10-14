import { Channel, VodMovie, VodSeries } from '../types';

export interface CategorySpec {
  name: string;
  count: number;
}

export const USER_REQUESTED_CATEGORIES: CategorySpec[] = [
  { name: 'CANAIS I JOGOS DO DIA', count: 9 },
  { name: 'INFORMATIVOS', count: 2 },
  { name: 'A FAZENDA', count: 14 },
  { name: 'GLOBO SUDESTE', count: 129 },
  { name: 'GLOBO CENTRO OESTE', count: 48 },
  { name: 'GLOBO NORTE', count: 30 },
  { name: 'GLOBO NORDESTE', count: 64 },
  { name: 'RECORD', count: 77 },
  { name: 'SBT', count: 64 },
  { name: 'EXCLUSIVO SBT', count: 5 },
  { name: 'BAND', count: 45 },
  { name: 'ABERTOS', count: 67 },
  { name: 'PREMIERE', count: 61 },
  { name: 'ESPORTES', count: 81 },
  { name: 'ESPN', count: 51 },
  { name: 'CAMPEONATOS REGIONAIS', count: 106 },
  { name: 'PPV PRIME VIDEO', count: 11 },
  { name: 'PPV World Sports', count: 6 },
  { name: 'PPV HBO MAX', count: 29 },
  { name: 'PPV PARAMOUNT+', count: 8 },
  { name: 'PPV NBA', count: 23 },
  { name: 'PPV SPORTS', count: 197 },
  { name: 'PPV LUTAS', count: 9 },
  { name: 'PPV DISNEY+', count: 15 },
  { name: 'FILMES E SERIES', count: 153 },
  { name: 'TELECINE', count: 48 },
  { name: 'HBO', count: 64 },
  { name: 'DOCUMENTARIOS', count: 78 },
  { name: 'NOTICIAS', count: 81 },
  { name: 'MUSICAS', count: 58 },
  { name: 'INFANTIS', count: 74 },
  { name: 'RELIGIOSOS', count: 63 },
  { name: 'VARIEDADES', count: 145 },
  { name: '4K*', count: 15 },
  { name: 'LEGENDADOS', count: 26 },
  { name: 'Pluto Tv', count: 15 },
  { name: '24H | REELS SHORTS', count: 31 },
  { name: '24H | Cine Premium', count: 6 },
  { name: '24H | CLIPES', count: 4 },
  { name: '24H | BABY', count: 14 },
  { name: '24H | DESENHOS', count: 581 },
  { name: '24H | FILMES', count: 24 },
  { name: '24H | MUSICAS', count: 10 },
  { name: '24H | Programas', count: 57 },
  { name: '24H SERIES', count: 245 },
  { name: 'Rádio', count: 23 },
  { name: 'XXX: CANAIS ADULTOS', count: 111 },
];

export const CATEGORY_COUNTS_MAP: Record<string, number> = USER_REQUESTED_CATEGORIES.reduce(
  (acc, item) => {
    acc[item.name.toLowerCase()] = item.count;
    return acc;
  },
  {} as Record<string, number>
);

export const TOTAL_REQUESTED_CHANNELS = USER_REQUESTED_CATEGORIES.reduce(
  (acc, item) => acc + item.count,
  0
);

// High-reliability live HLS video streams with direct CDN playback (Fast Origin Transfer = 0)
const STREAM_POOL = [
  'http://wordbus.top/live/demo_user/demo_password/204741.m3u8',
  'http://wordbus.top/live/demo_user/demo_password/143926.m3u8',
  'http://wordbus.top/live/demo_user/demo_password/169152.m3u8',
  'http://wordbus.top/live/demo_user/demo_password/143927.m3u8',
  'http://wordbus.top/live/demo_user/demo_password/169153.m3u8',
  'http://wordbus.top/live/demo_user/demo_password/143928.m3u8',
  'http://wordbus.top/live/demo_user/demo_password/169154.m3u8',
  'http://wordbus.top/live/demo_user/demo_password/143929.m3u8',
  'http://wordbus.top/live/demo_user/demo_password/169155.m3u8',
  'http://wordbus.top/live/demo_user/demo_password/143930.m3u8',
];

// Specific realistic channel names per category
const CATEGORY_SAMPLE_NAMES: Record<string, string[]> = {
  'CANAIS I JOGOS DO DIA': [
    'Jogos do Dia 1 (Brasileirão Série A) FHD',
    'Jogos do Dia 2 (Copa Libertadores) FHD',
    'Jogos do Dia 3 (Copa Sul-Americana) HD',
    'Jogos do Dia 4 (Champions League) 4K',
    'Jogos do Dia 5 (Premier League) HD',
    'Jogos do Dia 6 (La Liga) HD',
    'Jogos do Dia 7 (Copa do Brasil) FHD',
    'Jogos do Dia 8 (Brasileirão Série B) HD',
    'Jogos do Dia 9 (Futebol Internacional) HD',
  ],
  INFORMATIVOS: [
    'Canal Informativo SCARD PLAY HD',
    'Status do Servidor & Novidades 24h',
  ],
  'A FAZENDA': [
    'A Fazenda 16 - Câmera Principal FHD',
    'A Fazenda 16 - Câmera 1 (Sede) HD',
    'A Fazenda 16 - Câmera 2 (Baia) HD',
    'A Fazenda 16 - Câmera 3 (Casa da Árvore) HD',
    'A Fazenda 16 - Câmera 4 (Oficina) HD',
    'A Fazenda 16 - Câmera 5 (Piscina) HD',
    'A Fazenda 16 - Câmera 6 (Cozinha) HD',
    'A Fazenda 16 - Câmera 7 (Quarto Principal) HD',
    'A Fazenda 16 - Câmera 8 (Área dos Animais) HD',
    'A Fazenda 16 - Câmera 9 (Espelho Dágua) HD',
    'A Fazenda 16 - Câmera 10 (Varanda) HD',
    'A Fazenda 16 - Transmissão Completa 24h',
    'A Fazenda 16 - Melhores Momentos & Provas',
    'A Fazenda 16 - Cabine de Descompressão',
  ],
  'GLOBO SUDESTE': [
    'Globo São Paulo FHD',
    'Globo Rio de Janeiro FHD',
    'Globo Minas Gerais FHD',
    'Globo Campinas HD',
    'Globo Santos (Tribuna) HD',
    'Globo Vale do Paraíba HD',
    'Globo Ribeirão Preto HD',
    'Globo Sorocaba HD',
    'Globo Bauru HD',
    'Globo São José do Rio Preto HD',
    'Globo Juiz de Fora HD',
    'Globo Sul de Minas HD',
    'Globo Triângulo Mineiro HD',
    'Globo Leste de Minas HD',
    'Globo Zona da Mata HD',
  ],
  'GLOBO CENTRO OESTE': [
    'Globo Brasília FHD',
    'Globo Goiânia FHD',
    'TV Centro América Cuiabá HD',
    'TV Morena Campo Grande HD',
    'Globo Anápolis HD',
    'Globo Rio Verde HD',
    'TV Centro América Rondonópolis HD',
    'TV Morena Dourados HD',
  ],
  'GLOBO NORTE': [
    'Rede Amazônica Manaus FHD',
    'TV Liberal Belém FHD',
    'Rede Amazônica Porto Velho HD',
    'Rede Amazônica Boa Vista HD',
    'Rede Amazônica Rio Branco HD',
    'Rede Amazônica Macapá HD',
    'TV Tapajós Santarém HD',
  ],
  'GLOBO NORDESTE': [
    'Globo Nordeste Recife FHD',
    'TV Bahia Salvador FHD',
    'TV Verdes Mares Fortaleza FHD',
    'TV Clube Teresina HD',
    'TV Mirante São Luís HD',
    'TV Cabo Branco João Pessoa HD',
    'TV Gazeta Maceió HD',
    'InterTV Cabugi Natal HD',
    'TV Sergipe Aracaju HD',
  ],
  RECORD: [
    'Record TV Nacional FHD',
    'Record TV São Paulo FHD',
    'Record TV Rio de Janeiro FHD',
    'Record TV Minas FHD',
    'Record TV Brasília HD',
    'Record TV Bahia HD',
    'Record TV RS Porto Alegre HD',
    'Record TV Interior SP HD',
    'Record TV Litoral HD',
  ],
  SBT: [
    'SBT Nacional FHD',
    'SBT São Paulo FHD',
    'SBT Rio de Janeiro FHD',
    'SBT Brasília FHD',
    'SBT RS Porto Alegre HD',
    'TV Alterosa Belo Horizonte HD',
    'TV Jangadeiro Fortaleza HD',
    'TV Aratu Salvador HD',
  ],
  'EXCLUSIVO SBT': [
    'SBT Novelas 24h HD',
    'SBT Pop & Entretenimento HD',
    'SBT Sports Ao Vivo HD',
    'SBT Kids Desenhos HD',
    'SBT Séries Clássicas HD',
  ],
  BAND: [
    'Band Nacional FHD',
    'Band São Paulo FHD',
    'Band Rio de Janeiro FHD',
    'Band Minas HD',
    'Band Vale do Paraíba HD',
    'Band Campinas HD',
    'Band RS Porto Alegre HD',
    'Band Bahia Salvador HD',
  ],
  ABERTOS: [
    'RedeTV! Nacional FHD',
    'TV Cultura São Paulo FHD',
    'TV Gazeta São Paulo HD',
    'TV Brasil HD',
    'Rede Vida HD',
    'TV Aparecida HD',
    'RIT TV HD',
    'CNT Nacional HD',
    'TV Senado HD',
    'TV Câmara HD',
  ],
  PREMIERE: [
    'Premiere Clubes FHD',
    'Premiere 2 FHD',
    'Premiere 3 FHD',
    'Premiere 4 FHD',
    'Premiere 5 HD',
    'Premiere 6 HD',
    'Premiere 7 HD',
    'Premiere 8 HD',
    'Premiere 9 HD',
    'Premiere Mosaico 4 Telas',
  ],
  ESPORTES: [
    'SporTV 1 FHD',
    'SporTV 2 FHD',
    'SporTV 3 FHD',
    'BandSports HD',
    'CazéTV Esportes Ao Vivo FHD',
    'GOAT Esportes Ao Vivo HD',
    'Red Bull TV Radicais FHD',
    'Woohoo TV Radicais HD',
  ],
  ESPN: [
    'ESPN Brasil Principal FHD',
    'ESPN 2 FHD',
    'ESPN 3 FHD',
    'ESPN 4 FHD',
    'ESPN 5 HD',
    'ESPN 6 HD',
    'ESPN Extra HD',
  ],
  'CAMPEONATOS REGIONAIS': [
    'Paulistão Play 1 FHD',
    'Paulistão Play 2 HD',
    'Cariocão Play 1 FHD',
    'Cariocão Play 2 HD',
    'Mineiro Play HD',
    'Gaúcho Play HD',
    'Copa do Nordeste Play HD',
    'Paranaense Play HD',
    'Catarinense Play HD',
  ],
  'PPV PRIME VIDEO': [
    'Prime Video Copa do Brasil 1 FHD',
    'Prime Video Copa do Brasil 2 HD',
    'Prime Video NBA League Pass HD',
    'Prime Video Combate HD',
  ],
  'PPV World Sports': [
    'World Sports 1 Ultra 4K',
    'World Sports 2 HD',
    'World Sports 3 HD',
    'World Sports 4 HD',
  ],
  'PPV HBO MAX': [
    'HBO Max Champions League 1 FHD',
    'HBO Max Champions League 2 FHD',
    'HBO Max Champions League 3 HD',
    'HBO Max Paulistão Play HD',
  ],
  'PPV PARAMOUNT+': [
    'Paramount+ Copa Libertadores 1 FHD',
    'Paramount+ Copa Libertadores 2 HD',
    'Paramount+ Copa Sul-Americana 1 HD',
    'Paramount+ Copa Sul-Americana 2 HD',
  ],
  'PPV NBA': [
    'NBA League Pass 1 FHD',
    'NBA League Pass 2 FHD',
    'NBA League Pass 3 HD',
    'NBA League Pass 4 HD',
    'NBA TV HD',
  ],
  'PPV SPORTS': [
    'PPV Sports 1 HD',
    'PPV Sports 2 HD',
    'PPV Sports 3 HD',
    'PPV Sports 4 HD',
    'NFL Sunday Ticket Ao Vivo FHD',
    'MLB Extra Innings HD',
  ],
  'PPV LUTAS': [
    'UFC Fight Pass Brasil FHD',
    'Combate TV FHD',
    'Boxe Internacional Ao Vivo HD',
    'Bellator MMA Play HD',
  ],
  'PPV DISNEY+': [
    'Disney+ Premier Sports 1 FHD',
    'Disney+ Premier Sports 2 HD',
    'Disney+ Europa League HD',
  ],
  'FILMES E SERIES': [
    'Warner Channel FHD',
    'Sony Channel FHD',
    'Universal TV FHD',
    'AXN Brasil FHD',
    'Paramount Network FHD',
    'A&E Brasil HD',
    'TNT Novelas HD',
    'Studio Universal HD',
  ],
  TELECINE: [
    'Telecine Premium FHD',
    'Telecine Action FHD',
    'Telecine Touch FHD',
    'Telecine Pipoca FHD',
    'Telecine Cult FHD',
    'Telecine Fun FHD',
  ],
  HBO: [
    'HBO Principal FHD',
    'HBO 2 FHD',
    'HBO Plus FHD',
    'HBO Family FHD',
    'HBO Signature FHD',
    'HBO Mundi HD',
    'HBO Pop HD',
    'HBO Xtreme HD',
  ],
  DOCUMENTARIOS: [
    'Discovery Channel FHD',
    'National Geographic FHD',
    'History Channel FHD',
    'Animal Planet HD',
    'Discovery Science HD',
    'Discovery Turbo HD',
    'Discovery Theater 4K',
    'Curiosity Stream HD',
    'NASA TV HD',
  ],
  NOTICIAS: [
    'GloboNews FHD',
    'CNN Brasil FHD',
    'Jovem Pan News HD',
    'BandNews TV HD',
    'Record News HD',
    'Bloomberg Markets HD',
    'Euronews Português HD',
    'BBC News Brasil HD',
  ],
  MUSICAS: [
    'Multishow FHD',
    'Bis Música FHD',
    'MTV Brasil HD',
    'Trace Brazuca HD',
    'VH1 Classic HD',
    'Music Box Brazil HD',
  ],
  INFANTIS: [
    'Cartoon Network FHD',
    'Discovery Kids FHD',
    'Gloob FHD',
    'Gloobinho HD',
    'Nickelodeon FHD',
    'Nick Jr. HD',
    'Disney Channel HD',
    'Disney Jr. HD',
    'Boomerang / Cartoonito HD',
    'TV Rá-Tim-Bum HD',
  ],
  RELIGIOSOS: [
    'TV Aparecida HD',
    'Canção Nova HD',
    'Rede Século 21 HD',
    'TV Novo Tempo HD',
    'Boas Novas HD',
    'Rede Gospel HD',
    'TV Pai Eterno HD',
  ],
  VARIEDADES: [
    'GNT Brasil FHD',
    'Viva Novelas FHD',
    'HGTV Decoração HD',
    'Food Network Gastronomia HD',
    'TLC Brasil HD',
    'Arte 1 Cultura HD',
    'E! Entertainment HD',
    'Moda & Estilo 24h HD',
  ],
  '4K*': [
    'SporTV 4K Ultra HD',
    'Premiere 4K Ultra HD',
    'Cine Ultra 4K Premium',
    'NASA TV UHD 4K',
    'Natureza & Planeta 4K',
  ],
  LEGENDADOS: [
    'HBO Legendado FHD',
    'Telecine Premium Legendado FHD',
    'Warner Channel Legendado HD',
    'Sony Channel Legendado HD',
  ],
  'Pluto Tv': [
    'Pluto TV Cine Sucessos HD',
    'Pluto TV Séries Pop HD',
    'Pluto TV Comédia HD',
    'Pluto TV Anime Brasil HD',
    'Pluto TV Natureza HD',
  ],
  '24H | REELS SHORTS': [
    '24H | Reels Brasil Viral HD',
    '24H | Shorts Memes HD',
    '24H | TikTok Trends HD',
  ],
  '24H | Cine Premium': [
    '24H | Cine Premium 1 FHD',
    '24H | Cine Premium 2 FHD',
    '24H | Cine Ação Sem Parar HD',
  ],
  '24H | CLIPES': [
    '24H | Clipes Pop Internacional HD',
    '24H | Clipes Sertanejo Universitário HD',
    '24H | Clipes Funk & Trap Brasil HD',
    '24H | Clipes Rock Clássico HD',
  ],
  '24H | BABY': [
    '24H | Galinha Pintadinha HD',
    '24H | Mundo Bita HD',
    '24H | Cocomelon Brasil HD',
    '24H | Bob Zoom HD',
    '24H | Bebê Mais Canções HD',
  ],
  '24H | DESENHOS': [
    '24H | Chaves HD',
    '24H | Chapolin Colorado HD',
    '24H | Tom & Jerry HD',
    '24H | Pica-Pau Clássico HD',
    '24H | Scooby-Doo HD',
    '24H | Os Simpsons HD',
    '24H | Dragon Ball Z HD',
    '24H | Naruto Shippuden HD',
    '24H | One Piece HD',
    '24H | Bob Esponja HD',
    '24H | Liga da Justiça HD',
    '24H | Ben 10 HD',
    '24H | As Meninas Superpoderosas HD',
    '24H | O Laboratório de Dexter HD',
    '24H | Looney Tunes HD',
  ],
  '24H | FILMES': [
    '24H | Harry Potter Saga Completa HD',
    '24H | Velozes e Furiosos HD',
    '24H | Marvel Vingadores HD',
    '24H | Star Wars Universo HD',
    '24H | John Wick Ação HD',
    '24H | O Senhor dos Anéis HD',
  ],
  '24H | MUSICAS': [
    '24H | Sertanejo Raiz HD',
    '24H | Pagode Anos 90 HD',
    '24H | Rock Nacional Anos 80 HD',
    '24H | MPB Grandes Mestres HD',
  ],
  '24H | Programas': [
    '24H | MasterChef Brasil HD',
    '24H | Shark Tank Brasil HD',
    '24H | Pânico na TV Melhores Momentos HD',
    '24H | Pesadelo na Cozinha HD',
    '24H | CQC Custe o Que Custar HD',
  ],
  '24H SERIES': [
    '24H | Friends HD',
    '24H | The Big Bang Theory HD',
    '24H | Grey\'s Anatomy HD',
    '24H | Supernatural HD',
    '24H | The Walking Dead HD',
    '24H | Game of Thrones HD',
    '24H | Breaking Bad HD',
    '24H | Todo Mundo Odeia o Chris HD',
    '24H | Um Maluco no Pedaço HD',
  ],
  Rádio: [
    'Rádio Jovem Pan FM SP 100.9',
    'Rádio BandNews FM 96.9',
    'Rádio Alpha FM 101.7',
    'Rádio Nativa FM 95.3',
    'Rádio Antena 1 FM 94.7',
    'Rádio CBN São Paulo 90.5',
    'Rádio Mix FM 106.3',
  ],
  'XXX: CANAIS ADULTOS': [
    'Playboy TV HD (18+)',
    'Venus TV HD (18+)',
    'Sextreme HD (18+)',
    'Sexy Hot HD (18+)',
    'Private TV Gold HD (18+)',
  ],
};

function getInitials(name: string): string {
  const clean = name.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase() || 'TV';
}

/**
 * Builds the comprehensive list of channels respecting the user's categories.
 * For categories with high channel count (e.g. 581, 245, 129), generates named channels
 * and numbered variations so users can browse full authentic IPTV catalogues.
 */
export function generateUserRequestedChannels(): Channel[] {
  const result: Channel[] = [];
  let globalOrder = 0;

  for (const catSpec of USER_REQUESTED_CATEGORIES) {
    const catName = catSpec.name;
    const targetCount = catSpec.count;
    const specificNames = CATEGORY_SAMPLE_NAMES[catName] || [];

    for (let i = 0; i < targetCount; i++) {
      let channelName: string;

      if (i < specificNames.length) {
        channelName = specificNames[i];
      } else {
        // Generate systematic IPTV channels matching the category
        const suffixNum = i + 1;
        if (catName.startsWith('24H | DESENHOS')) {
          const desenhoList = [
            'Desenhos Clássicos', 'Pokemon', 'Cavaleiros do Zodíaco', 'InuYasha',
            'Digimon', 'Yu-Gi-Oh', 'X-Men Evolution', 'Homem-Aranha', 'Batman',
            'Popeye', 'Corrida Maluca', 'Super Choque', 'Avatar A Lenda de Aang',
            'Hora de Aventura', 'Apenas um Show', 'O Incrível Mundo de Gumball',
          ];
          const base = desenhoList[i % desenhoList.length];
          channelName = `24H | ${base} #${Math.floor(i / desenhoList.length) + 1} HD`;
        } else if (catName.startsWith('24H SERIES')) {
          const seriesList = [
            'Lost', 'Prison Break', 'Vikings', 'The Boys', 'Stranger Things',
            'House M.D.', 'Dexter', 'Peaky Blinders', 'CSI Las Vegas', 'Two and a Half Men',
            'Modern Family', 'The Office', 'Brooklyn Nine-Nine', 'Suits', 'Arrow',
          ];
          const base = seriesList[i % seriesList.length];
          channelName = `24H | ${base} #${Math.floor(i / seriesList.length) + 1} HD`;
        } else if (catName.startsWith('PPV SPORTS')) {
          channelName = `PPV Sports Evento #${suffixNum} HD`;
        } else if (catName.startsWith('CAMPEONATOS REGIONAIS')) {
          channelName = `Campeonatos Regionais Canal #${suffixNum} HD`;
        } else if (catName.startsWith('VARIEDADES')) {
          channelName = `Variedades & Estilo #${suffixNum} HD`;
        } else if (catName.startsWith('GLOBO')) {
          channelName = `${catName} Transmissão #${suffixNum} HD`;
        } else if (catName.startsWith('FILMES E SERIES')) {
          channelName = `Cinema & Séries Premium #${suffixNum} HD`;
        } else if (catName.startsWith('XXX')) {
          channelName = `Adulto Premium #${suffixNum} (18+)`;
        } else {
          channelName = `${catName} #${suffixNum} HD`;
        }
      }

      const streamUrl = STREAM_POOL[globalOrder % STREAM_POOL.length];
      const initials = getInitials(channelName);
      const safeId = `ch_${catName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_${i + 1}`;

      result.push({
        id: safeId,
        name: channelName,
        streamUrl,
        category: catName,
        orderIndex: globalOrder,
        initials,
      });

      globalOrder++;
    }
  }

  return result;
}

export function generateUserRequestedMovies(): VodMovie[] {
  const result: VodMovie[] = [];
  const movieCategories = [
    { name: 'Lançamentos (2026)', count: 20 },
    { name: 'Ação & Aventura', count: 20 },
    { name: 'Comédia', count: 15 },
    { name: 'Ficção Científica', count: 15 },
    { name: 'Documentários', count: 12 },
    { name: 'Drama', count: 12 },
  ];

  const REAL_MOVIES_CATALOG = [
    {
      name: 'Explorer: Lago de Fogo (2026)',
      streamId: 315759,
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/dPvrybP5kiLrKAuymDkfI6LlaSo.jpg',
      plot: 'Em uma expedição histórica aos confins da Terra, cientistas e exploradores tentam desvendar os segredos de uma misteriosa anomalia vulcânica.',
      year: '2026',
      rating: 8.8,
    },
    {
      name: 'Eu Sou Vanessa Guillen (2026)',
      streamId: 315770,
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/idRnGEvyYN44wlp39WYVz4lpLK8.jpg',
      plot: 'A inspiradora e emocionante história de luta por justiça e superação de uma família determinada a provocar mudanças históricas.',
      year: '2026',
      rating: 8.6,
    },
    {
      name: 'As Pegadas de Jesus em Roma (2026)',
      streamId: 315776,
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/3l8WLZjetMhes6PELEZxwHsK2fj.jpg',
      plot: 'Uma profunda investigação histórica sobre os vestígios, relíquias e a trajetória milenar preservada nos monumentos de Roma.',
      year: '2026',
      rating: 8.9,
    },
    {
      name: 'Difícil Decisão (2026)',
      streamId: 315783,
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/6qzTj2QEZ6IY3di92sSjpCyaQ89.jpg',
      plot: 'Inspirado na vivência real de jovens que encaram o desafio de reescrever suas histórias com coragem, disciplina e superação.',
      year: '2026',
      rating: 8.4,
    },
    {
      name: 'Fuga de Alcatraz: A Pista Perdida (2026)',
      streamId: 315788,
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/rdl7F6maBY2nCYuNZZ5J0v3X1YE.jpg',
      plot: 'Novas revelações e arquivos confidenciais abrem caminho para desvendar o que realmente aconteceu no enigma mais famoso de Alcatraz.',
      year: '2026',
      rating: 8.5,
    },
    {
      name: 'Yaõkwa - Imagem e Memória (2026)',
      streamId: 315800,
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/hrsODYUpQWZ0TmJuzTQl9xvTefT.jpg',
      plot: 'Uma obra cinematográfica que resgata cantos sagrados, tradições e a riqueza cultural dos povos originários do Brasil.',
      year: '2026',
      rating: 9.1,
    },
    {
      name: 'Feitos de Plástico (2026)',
      streamId: 315811,
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/c4g82ZjkSJXAUnzxfU7yRW8V3dl.jpg',
      plot: 'Cientistas e repórteres investigam de forma reveladora o impacto dos microplásticos no planeta e no corpo humano.',
      year: '2026',
      rating: 8.7,
    },
    {
      name: 'The Velvet Underground (2026)',
      streamId: 316003,
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/9uRF6vERWfhlSZKc1sAJTTdG2Ix.jpg',
      plot: 'O legado vanguardista de uma das bandas mais influentes da história da música em uma produção caleidoscópica e inovadora.',
      year: '2026',
      rating: 8.9,
    },
    {
      name: 'Duna: Parte 2',
      streamId: 315816,
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
      plot: 'Paul Atreides se une a Chani e aos Fremen em busca de vingança contra os conspiradores que destruíram sua família.',
      year: '2024',
      rating: 8.7,
    },
    {
      name: 'Oppenheimer',
      streamId: 315803,
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      plot: 'A trajetória do físico J. Robert Oppenheimer durante o Projeto Manhattan e o desenvolvimento da bomba atômica.',
      year: '2023',
      rating: 8.9,
    },
    {
      name: 'Top Gun: Maverick',
      streamId: 315759,
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/jeGvNOVMs5QZvUniPtBibTz7y5a.jpg',
      plot: 'Depois de mais de 30 anos de serviço como um dos melhores aviadores da Marinha, Pete Mitchell continua no limite.',
      year: '2022',
      rating: 8.6,
    },
    {
      name: 'Avatar: O Caminho da Água',
      streamId: 315770,
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/mbYQLLduugj95v0vJq6QoeyyVw8.jpg',
      plot: 'Jake Sully vive com sua nova família no planeta Pandora quando uma antiga ameaça retorna para terminar o que começou.',
      year: '2022',
      rating: 8.4,
    },
  ];

  let globalId = 1;
  movieCategories.forEach((catSpec) => {
    for (let i = 0; i < catSpec.count; i++) {
      const movieTemplate = REAL_MOVIES_CATALOG[(globalId - 1) % REAL_MOVIES_CATALOG.length];
      const isClone = i >= REAL_MOVIES_CATALOG.length;
      const movieName = isClone ? `${movieTemplate.name} Vol. ${Math.floor(i / REAL_MOVIES_CATALOG.length) + 1}` : movieTemplate.name;

      result.push({
        id: `vod_m_${globalId}`,
        name: movieName,
        streamUrl: `http://wordbus.top/movie/demo_user/demo_password/${movieTemplate.streamId}.mp4`,
        posterUrl: movieTemplate.poster,
        category: catSpec.name,
        year: movieTemplate.year,
        rating: movieTemplate.rating,
        plot: movieTemplate.plot,
        cast: 'Elenco consagrado internacionalmente',
        director: 'Diretor Premiado',
      });
      globalId++;
    }
  });

  return result;
}

export function generateUserRequestedSeries(): VodSeries[] {
  const result: VodSeries[] = [];
  const seriesCategories = [
    { name: 'Séries', count: 20 },
    { name: 'Animes & Desenhos', count: 20 },
    { name: 'Documentários & Natureza', count: 15 },
    { name: 'Ficção Científica', count: 15 },
  ];

  const REAL_SERIES_CATALOG = [
    {
      name: 'Agatha Desde Sempre',
      epId: 204829,
      poster: 'https://shorturl.at/cay9l',
      plot: 'A infame Agatha Harkness parte para o lendário Caminho das Bruxas, repleto de mistérios, provações e magias surpreendentes.',
      genre: 'Sci-Fi & Fantasy, Mistério, Ação',
      rating: 8.5,
      year: '2024',
    },
    {
      name: '1 Contra Todos',
      epId: 204830,
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/3o7f2Xjwl5hcoiioR9eGdD9ezHt.jpg',
      plot: 'A emocionante história de um chefe de família íntegro que precisa lutar pela sua liberdade e sobrevivência.',
      genre: 'Drama, Crime',
      rating: 8.8,
      year: '2022',
    },
    {
      name: '11.22.63',
      epId: 204831,
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/1fH41ccMKvgDTbbcCxWWH6fznah.jpg',
      plot: 'Uma viagem no tempo vertiginosa onde cada ação no passado gera consequências imprevisíveis no futuro.',
      genre: 'Drama, Ficção Científica',
      rating: 8.6,
      year: '2020',
    },
    {
      name: 'Os 12 Macacos',
      epId: 204832,
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/lnLlxi9GcPNyLcmvt6uVipI73m5.jpg',
      plot: 'Em um mundo pós-apocalíptico, viajantes temporais arriscam tudo para conter um vírus e salvar a humanidade.',
      genre: 'Sci-Fi & Fantasy, Drama',
      rating: 8.5,
      year: '2019',
    },
    {
      name: 'The Last of Us',
      epId: 204829,
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/uKvVjK19uQyt2vbt1n7q549kY58.jpg',
      plot: 'Joel e Ellie precisam navegar pelos Estados Unidos pós-apocalíptico enfrentando infectados e sobreviventes implacáveis.',
      genre: 'Drama, Sci-Fi & Fantasy, Ação',
      rating: 8.9,
      year: '2023',
    },
    {
      name: 'Stranger Things',
      epId: 204830,
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
      plot: 'Quando um garoto desaparece, sua mãe, seus amigos e um policial precisam confrontar forças aterrorizantes para resgatá-lo.',
      genre: 'Sci-Fi & Fantasy, Drama, Mistério',
      rating: 8.7,
      year: '2022',
    },
    {
      name: 'Breaking Bad',
      epId: 204831,
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg',
      plot: 'Um professor de química diagnosticado com câncer terminal se une a um ex-aluno para assegurar o futuro de sua família.',
      genre: 'Drama, Crime',
      rating: 9.5,
      year: '2013',
    },
    {
      name: 'Game of Thrones',
      epId: 204832,
      poster: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
      plot: 'Famílias nobres travam uma guerra pelo Trono de Ferro de Westeros enquanto uma antiga ameaça desperta no norte.',
      genre: 'Sci-Fi & Fantasy, Drama, Ação',
      rating: 9.3,
      year: '2019',
    },
  ];

  let globalId = 1;
  seriesCategories.forEach((catSpec) => {
    for (let i = 0; i < catSpec.count; i++) {
      const template = REAL_SERIES_CATALOG[(globalId - 1) % REAL_SERIES_CATALOG.length];
      const isClone = i >= REAL_SERIES_CATALOG.length;
      const seriesTitle = isClone ? `${template.name} - Temp. ${Math.floor(i / REAL_SERIES_CATALOG.length) + 1}` : template.name;

      result.push({
        id: `series_${globalId}`,
        name: seriesTitle,
        streamUrl: `http://wordbus.top/series/demo_user/demo_password/${template.epId}.mp4`,
        posterUrl: template.poster,
        category: catSpec.name,
        plot: template.plot,
        cast: 'Elenco principal e estrelas convidadas',
        genre: template.genre,
        rating: template.rating,
        year: template.year,
      });
      globalId++;
    }
  });

  return result;
}
