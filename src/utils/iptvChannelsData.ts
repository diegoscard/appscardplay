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

// High-reliability live HLS video streams with CORS support
const STREAM_POOL = [
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
  'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
  'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8',
  'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
  'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
  'https://moctobpltc-i.akamaihd.net/hls/live/571329/eight/playlist.m3u8',
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
    { name: 'Lançamentos (2026)', count: 150 },
    { name: 'Ação & Aventura', count: 300 },
    { name: 'Comédia', count: 200 },
    { name: 'Ficção Científica', count: 150 },
    { name: 'Documentários', count: 100 },
    { name: 'Drama', count: 100 },
  ];

  const posterUrls = [
    'https://image.tmdb.org/t/p/w600_and_h900_bestv2/scl6uVD0YZc46WZHgXbEcaH2zYw.jpg',
    'https://image.tmdb.org/t/p/w600_and_h900_bestv2/rL6GKuOAPUEGk0hqeY9sLRJTPWE.jpg',
    'https://image.tmdb.org/t/p/w600_and_h900_bestv2/yRf0OrswYzoLnjXLpTLsmRUVtd.jpg',
    'https://image.tmdb.org/t/p/w600_and_h900_bestv2/Ao8YIks0or4845Z1lXbINz7tMh8.jpg',
    'https://image.tmdb.org/t/p/w600_and_h900_bestv2/xaloioubOPQOFaERBPxLHnONyeJ.jpg',
    'https://image.tmdb.org/t/p/w600_and_h900_bestv2/36zoDJG52EkHnMm60M9BdLw8Siv.jpg',
  ];

  const plots = [
    'Uma história emocionante cheia de suspense, reviravoltas e momentos marcantes.',
    'Aventura épica de tirar o fôlego, com efeitos especiais de última geração.',
    'Uma comédia leve e divertida para rir com toda a família.',
    'Exploração do desconhecido em um futuro distante repleto de ficção científica de ponta.',
    'A análise profunda de fatos reais que mudaram o curso da humanidade.',
    'Drama envolvendo com atuações brilhantes sobre superação e coragem.',
  ];

  let globalId = 1;
  movieCategories.forEach((catSpec) => {
    for (let i = 0; i < catSpec.count; i++) {
      const idx = (globalId - 1) % posterUrls.length;
      result.push({
        id: `vod_m_${globalId}`,
        name: `${catSpec.name} - Filme #${i + 1}`,
        streamUrl: STREAM_POOL[globalId % STREAM_POOL.length],
        posterUrl: posterUrls[idx],
        category: catSpec.name,
        year: String(2020 + (globalId % 7)),
        rating: Number((7.0 + (globalId % 30) / 10).toFixed(1)),
        plot: plots[idx],
        cast: 'Atores renomados e convidados especiais',
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
    { name: 'Séries', count: 500 },
    { name: 'Animes & Desenhos', count: 2000 },
    { name: 'Documentários & Natureza', count: 1500 },
    { name: 'Ficção Científica', count: 1258 },
  ];

  const posterUrls = [
    'https://image.tmdb.org/t/p/w600_and_h900_bestv2/3o7f2Xjwl5hcoiioR9eGdD9ezHt.jpg',
    'https://image.tmdb.org/t/p/w600_and_h900_bestv2/1fH41ccMKvgDTbbcCxWWH6fznah.jpg',
    'https://image.tmdb.org/t/p/w600_and_h900_bestv2/lnLlxi9GcPNyLcmvt6uVipI73m5.jpg',
  ];

  let globalId = 1;
  seriesCategories.forEach((catSpec) => {
    for (let i = 0; i < catSpec.count; i++) {
      const idx = (globalId - 1) % posterUrls.length;
      result.push({
        id: `series_${globalId}`,
        name: `${catSpec.name} - Série #${i + 1}`,
        posterUrl: posterUrls[idx],
        category: catSpec.name,
        plot: 'Uma série aclamada pela crítica com múltiplos episódios e temporadas completas.',
        cast: 'Elenco principal e estrelas convidadas',
        genre: 'Ação, Drama, Suspense',
        rating: Number((7.5 + (globalId % 20) / 10).toFixed(1)),
        year: String(2018 + (globalId % 9)),
      });
      globalId++;
    }
  });

  return result;
}
