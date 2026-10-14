import { VodMovie, VodSeries } from '../types';

export const DEFAULT_SAMPLE_M3U = `#EXTM3U
#EXTINF:-1 tvg-id="fazenda_principal" tvg-name="A Fazenda Principal" tvg-logo="http://logo.universo.wiki/FAZENDA.jpg" group-title="A FAZENDA",A Fazenda Principal FHD
http://wordbus.top/live/rachelalcantara2/18787429/204741.m3u8

#EXTINF:-1 tvg-id="fazenda_cam1" tvg-name="A Fazenda Cam 1" tvg-logo="http://logo.universo.wiki/FAZENDA.jpg" group-title="A FAZENDA",A Fazenda Cam 1 FHD
http://wordbus.top/live/rachelalcantara2/18787429/143926.m3u8

#EXTINF:-1 tvg-id="fazenda_cam2" tvg-name="A Fazenda Cam 2" tvg-logo="http://logo.universo.wiki/FAZENDA.jpg" group-title="A FAZENDA",A Fazenda Cam 2 FHD
http://wordbus.top/live/rachelalcantara2/18787429/143927.m3u8

#EXTINF:-1 tvg-id="fazenda_cam3" tvg-name="A Fazenda Cam 3" tvg-logo="http://logo.universo.wiki/FAZENDA.jpg" group-title="A FAZENDA",A Fazenda Cam 3 FHD
http://wordbus.top/live/rachelalcantara2/18787429/143928.m3u8

#EXTINF:-1 tvg-id="fazenda_cam4" tvg-name="A Fazenda Cam 4" tvg-logo="http://logo.universo.wiki/FAZENDA.jpg" group-title="A FAZENDA",A Fazenda Cam 4 FHD
http://wordbus.top/live/rachelalcantara2/18787429/143929.m3u8
`;

export const DEFAULT_SAMPLE_MOVIES: VodMovie[] = [
  {
    id: 'vod_315759',
    name: 'Explorer: Lago de Fogo (2026)',
    streamUrl: 'http://wordbus.top/movie/rachelalcantara2/18787429/315759.mp4',
    posterUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/dPvrybP5kiLrKAuymDkfI6LlaSo.jpg',
    category: 'Lançamentos (2026)',
    year: '2026',
    rating: 8.8,
    plot: 'Em uma expedição histórica aos confins da Terra, cientistas e exploradores tentam desvendar os segredos de uma misteriosa anomalia vulcânica em condições extremas.',
    cast: 'Dwayne Johnson, Exploradores Globais',
    director: 'National Geographic Films',
  },
  {
    id: 'vod_315770',
    name: 'Eu Sou Vanessa Guillen (2026)',
    streamUrl: 'http://wordbus.top/movie/rachelalcantara2/18787429/315770.mp4',
    posterUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/idRnGEvyYN44wlp39WYVz4lpLK8.jpg',
    category: 'Lançamentos (2026)',
    year: '2026',
    rating: 8.6,
    plot: 'A inspiradora e emocionante história de luta por justiça e superação de uma família determinada a provocar mudanças históricas.',
    cast: 'Familiares, Juristas e Ativistas',
    director: 'Christy Wegener',
  },
  {
    id: 'vod_315776',
    name: 'As Pegadas de Jesus em Roma (2026)',
    streamUrl: 'http://wordbus.top/movie/rachelalcantara2/18787429/315776.mp4',
    posterUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/3l8WLZjetMhes6PELEZxwHsK2fj.jpg',
    category: 'Lançamentos (2026)',
    year: '2026',
    rating: 8.9,
    plot: 'Uma profunda investigação histórica sobre os vestígios, relíquias e a trajetória milenar preservada nos monumentos de Roma.',
    cast: 'Historiadores e Arqueólogos Internacionais',
    director: 'História & Fé Produções',
  },
  {
    id: 'vod_315783',
    name: 'Difícil Decisão (2026)',
    streamUrl: 'http://wordbus.top/movie/rachelalcantara2/18787429/315783.mp4',
    posterUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/6qzTj2QEZ6IY3di92sSjpCyaQ89.jpg',
    category: 'Lançamentos (2026)',
    year: '2026',
    rating: 8.4,
    plot: 'Inspirado na vivência real de jovens que encaram o desafio de reescrever suas histórias com coragem, disciplina e superação.',
    cast: 'Dwayne Johnson, Instrutores e Jovens',
    director: 'Marcus Vance',
  },
  {
    id: 'vod_315788',
    name: 'Fuga de Alcatraz: A Pista Perdida (2026)',
    streamUrl: 'http://wordbus.top/movie/rachelalcantara2/18787429/315788.mp4',
    posterUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/rdl7F6maBY2nCYuNZZ5J0v3X1YE.jpg',
    category: 'Lançamentos (2026)',
    year: '2026',
    rating: 8.5,
    plot: 'Novas revelações e arquivos confidenciais abrem caminho para desvendar o que realmente aconteceu no enigma mais famoso da prisão de Alcatraz.',
    cast: 'Investigadores Forenses',
    director: 'David Hoffman',
  },
  {
    id: 'vod_315800',
    name: 'Yaõkwa - Imagem e Memória (2026)',
    streamUrl: 'http://wordbus.top/movie/rachelalcantara2/18787429/315800.mp4',
    posterUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/hrsODYUpQWZ0TmJuzTQl9xvTefT.jpg',
    category: 'Lançamentos (2026)',
    year: '2026',
    rating: 9.1,
    plot: 'Uma obra-prima cinematográfica documental que resgata cantos sagrados, tradições e a riqueza cultural dos povos originários do Brasil.',
    cast: 'Mestres Tradicionais Enawenê Nawê',
    director: 'Vincent Carelli',
  },
  {
    id: 'vod_315811',
    name: 'Feitos de Plástico (2026)',
    streamUrl: 'http://wordbus.top/movie/rachelalcantara2/18787429/315811.mp4',
    posterUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/c4g82ZjkSJXAUnzxfU7yRW8V3dl.jpg',
    category: 'Lançamentos (2026)',
    year: '2026',
    rating: 8.7,
    plot: 'Cientistas e repórteres investigam de forma reveladora o impacto dos microplásticos no planeta e no corpo humano.',
    cast: 'Especialistas Ambientais e Médicos',
    director: 'Sara Nason',
  },
  {
    id: 'vod_316003',
    name: 'The Velvet Underground (2026)',
    streamUrl: 'http://wordbus.top/movie/rachelalcantara2/18787429/316003.mp4',
    posterUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/9uRF6vERWfhlSZKc1sAJTTdG2Ix.jpg',
    category: 'Lançamentos (2026)',
    year: '2026',
    rating: 8.9,
    plot: 'O legado vanguardista de uma das bandas mais influentes da história da música em uma produção caleidoscópica e inovadora.',
    cast: 'Lou Reed, John Cale, Andy Warhol',
    director: 'Todd Haynes',
  },
];

export const DEFAULT_SAMPLE_SERIES: VodSeries[] = [
  {
    id: 'series_2796',
    name: 'Agatha Desde Sempre',
    posterUrl: 'https://shorturl.at/cay9l',
    streamUrl: 'http://wordbus.top/series/rachelalcantara2/18787429/204829.mp4',
    category: 'Séries',
    plot: 'A infame Agatha Harkness parte para o lendário Caminho das Bruxas, um percurso repleto de mistérios, provações e magias surpreendentes.',
    cast: 'Kathryn Hahn, Joe Locke, Sasheer Zamata, Ali Ahn',
    genre: 'Sci-Fi & Fantasy, Mistério, Ação',
    rating: 8.5,
    year: '2024',
  },
  {
    id: 'series_553',
    name: '1 Contra Todos',
    posterUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/3o7f2Xjwl5hcoiioR9eGdD9ezHt.jpg',
    streamUrl: 'http://wordbus.top/series/rachelalcantara2/18787429/204830.mp4',
    category: 'Séries',
    plot: 'A emocionante história de um chefe de família íntegro que precisa lutar pela sua liberdade e sobrevivência.',
    cast: 'Júlio Andrade, Julia Ianina, João Fernandes',
    genre: 'Drama, Crime',
    rating: 8.8,
    year: '2022',
  },
  {
    id: 'series_554',
    name: '11.22.63',
    posterUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/1fH41ccMKvgDTbbcCxWWH6fznah.jpg',
    streamUrl: 'http://wordbus.top/series/rachelalcantara2/18787429/204831.mp4',
    category: 'Séries',
    plot: 'Uma viagem no tempo vertiginosa onde cada ação no passado gera consequências imprevisíveis no futuro.',
    cast: 'James Franco, Sarah Gadon, Chris Cooper',
    genre: 'Drama, Ficção Científica',
    rating: 8.6,
    year: '2020',
  },
  {
    id: 'series_555',
    name: 'Os 12 Macacos',
    posterUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/lnLlxi9GcPNyLcmvt6uVipI73m5.jpg',
    streamUrl: 'http://wordbus.top/series/rachelalcantara2/18787429/204832.mp4',
    category: 'Séries',
    plot: 'Em um mundo pós-apocalíptico, viajantes temporais arriscam tudo para conter um vírus e salvar a humanidade.',
    cast: 'Aaron Stanford, Amanda Schull, Barbara Sukowa',
    genre: 'Sci-Fi & Fantasy, Drama',
    rating: 8.5,
    year: '2019',
  },
];

export const SAMPLE_EPG_MAP: Record<string, { title: string; desc: string }> = {
  fazenda_principal: {
    title: 'A Fazenda 16: Transmissão Ao Vivo 24 Horas',
    desc: 'Câmera principal acompanhando todas as emoções, dinâmicas e convivência dos peões.',
  },
  fazenda_cam1: {
    title: 'A Fazenda: Câmera da Sede',
    desc: 'Acontecimentos em tempo real no interior da sede e conversas da sala.',
  },
  fazenda_cam2: {
    title: 'A Fazenda: Câmera da Área Externa',
    desc: 'Atividades dos peões nos cuidados com os animais e na área externa.',
  },
  euronews_pt: {
    title: 'Jornal das 20h: Notícias do Mundo',
    desc: 'Destaques globais, geopolítica europeia e atualidades internacionais em língua portuguesa.',
  },
  nasa_tv: {
    title: 'Missão Artemis & Estação Espacial Internacional',
    desc: 'Transmissão ao vivo de acoplamentos, caminhadas espaciais e pesquisas em microgravidade.',
  },
};
