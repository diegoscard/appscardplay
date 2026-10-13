import { VodMovie, VodSeries } from '../types';

export const DEFAULT_SAMPLE_M3U = `#EXTM3U
#EXTINF:-1 tvg-id="nasa_tv" tvg-name="NASA TV HD" tvg-logo="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=160&auto=format&fit=crop&q=80" group-title="DOCUMENTÁRIOS",NASA TV Live (Espaço & Ciência)
https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8

#EXTINF:-1 tvg-id="bloomberg" tvg-name="Bloomberg TV" tvg-logo="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=160&auto=format&fit=crop&q=80" group-title="NOTÍCIAS",Bloomberg Global Markets HD
https://liveproduseast.akamaized.net/us/Channel-HD-AWS-virginia-1/live.m3u8

#EXTINF:-1 tvg-id="euronews_pt" tvg-name="Euronews Português" tvg-logo="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=160&auto=format&fit=crop&q=80" group-title="NOTÍCIAS",Euronews Português 24h
https://euronews-euronews-portuguese-1-pt.samsung.wurl.tv/playlist.m3u8

#EXTINF:-1 tvg-id="redbull_tv" tvg-name="Red Bull TV" tvg-logo="https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=160&auto=format&fit=crop&q=80" group-title="ESPORTES",Red Bull TV Radicais & Aventura
https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8

#EXTINF:-1 tvg-id="big_buck_bunny" tvg-name="Cinema Toon 4K" tvg-logo="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=160&auto=format&fit=crop&q=80" group-title="FILMES",Cine SCARD: Big Buck Bunny HD
https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8

#EXTINF:-1 tvg-id="tears_of_steel" tvg-name="Sci-Fi Prime" tvg-logo="https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=160&auto=format&fit=crop&q=80" group-title="FILMES",Cine SCARD: Tears of Steel (Sci-Fi)
https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8
`;

export const DEFAULT_SAMPLE_MOVIES: VodMovie[] = [
  {
    id: 'vod_308429',
    name: '(Des)controle (2026)',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    posterUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/scl6uVD0YZc46WZHgXbEcaH2zYw.jpg',
    category: 'Lançamentos (2026)',
    year: '2026',
    rating: 7.4,
    plot: 'Kátia Klein é uma escritora bem-sucedida que enfrenta uma crise criativa às vésperas da entrega do seu novo livro, ao mesmo tempo em que descobre a falência do seu casamento e administra o acúmulo das demandas dos filhos e dos pais. Sobrecarregada e em busca de alívio, ela passa de uma simples taça de vinho ao total descontrole, sendo gradualmente engolida pelos excessos do vício.',
    cast: 'Carolina Dieckmann, Caco Ciocler, Júlia Rabello',
    director: 'Rosane Svartman',
  },
  {
    id: 'vod_225331',
    name: '53 Domingos (2026)',
    streamUrl: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    posterUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/rL6GKuOAPUEGk0hqeY9sLRJTPWE.jpg',
    category: 'Lançamentos (2026)',
    year: '2026',
    rating: 7.3,
    plot: 'Três irmãos precisam se encontrar para discutir o futuro do pai, mas a reunião logo se transforma em caos, trazendo antigas mágoas e rixas à tona.',
    cast: 'Javier Cámara, Carmen Machi, Javier Gutiérrez',
    director: 'Cesc Gay',
  },
  {
    id: 'vod_223695',
    name: 'A Acusada (2026)',
    streamUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    posterUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/yRf0OrswYzoLnjXLpTLsmRUVtd.jpg',
    category: 'Lançamentos (2026)',
    year: '2026',
    rating: 9.5,
    plot: 'Geetika e Meera estão prestes a mudar de cidade e começar uma família. Mas essa vida perfeita vira de cabeça para baixo quando uma delas recebe uma acusação grave.',
    cast: 'Konkona Sen Sharma, Pratibha Ranta, Aditya Nanda',
    director: 'Anubhuti Kashyap',
  },
  {
    id: 'vod_308422',
    name: 'A Caixa Azul (2026)',
    streamUrl: 'https://playertest.longtailvideo.com/adaptive/elephants_dream/elephants_dream.m3u8',
    posterUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/Ao8YIks0or4845Z1lXbINz7tMh8.jpg',
    category: 'Lançamentos (2026)',
    year: '2026',
    rating: 7.0,
    plot: 'Pablo, um jovem recluso que vive na Patagônia, conhece Lara através da troca de um objeto misterioso conhecido como "a caixa azul", iniciando um tenso jogo psicológico.',
    cast: 'Gustavo Bassani, Luisana Lopilato',
    director: 'Martín Hodara',
  },
  {
    id: 'vod_222900',
    name: 'A Cela dos Milagres (2025)',
    streamUrl: 'https://cdn.jwplayer.com/manifests/pvh1238p.m3u8',
    posterUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/xaloioubOPQOFaERBPxLHnONyeJ.jpg',
    category: 'Lançamentos (2026)',
    year: '2025',
    rating: 6.8,
    plot: 'Preso por um crime que não cometeu, um pai dedicado luta para provar a própria inocência enquanto sua filha precisa se virar sozinha.',
    cast: 'Omar Chaparro, Jorge A. Jimenez, Mariana Calderón',
    director: 'Ana Lorena Pérez Ríos',
  },
  {
    id: 'vod_308424',
    name: 'A Colega Perfeita (2026)',
    streamUrl: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e88-8b40-76683be01b4e.m3u8',
    posterUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/36zoDJG52EkHnMm60M9BdLw8Siv.jpg',
    category: 'Lançamentos (2026)',
    year: '2026',
    rating: 6.5,
    plot: 'Devon acabou de entrar na faculdade. Celeste é popular e confiante. Quando as duas resolvem morar juntas, a amizade se transforma em uma verdadeira guerra.',
    cast: 'Sadie Sandler, Chloe East, Billy Bryk',
    director: 'Chandler Levack',
  },
];

export const DEFAULT_SAMPLE_SERIES: VodSeries[] = [
  {
    id: 'series_2796',
    name: 'Agatha Desde Sempre',
    posterUrl: 'https://shorturl.at/cay9l',
    category: 'Séries',
    plot: 'A infame Agatha Harkness encontra-se sem poderes depois de um jovem gótico suspeito ajudá-la a se libertar de um feitiço distorcido. Juntos, partem para o Caminho das Bruxas.',
    cast: 'Kathryn Hahn, Joe Locke, Sasheer Zamata, Ali Ahn',
    genre: 'Sci-Fi & Fantasy, Mistério, Ação',
    rating: 8.5,
    year: '2024',
  },
  {
    id: 'series_553',
    name: '1 Contra Todos (2016)',
    posterUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/3o7f2Xjwl5hcoiioR9eGdD9ezHt.jpg',
    category: 'Séries',
    plot: 'A história do honesto chefe de família Cadu que vê sua vida mudar drasticamente quando é preso após ser confundido com o maior traficante do país.',
    cast: 'Júlio Andrade, Julia Ianina, João Fernandes',
    genre: 'Drama, Crime',
    rating: 8.2,
    year: '2016',
  },
  {
    id: 'series_554',
    name: '11.22.63 (2016)',
    posterUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/1fH41ccMKvgDTbbcCxWWH6fznah.jpg',
    category: 'Séries',
    plot: 'Um modesto professor se depara com um portal do tempo e inicia uma jornada para tentar evitar o assassinato de John F. Kennedy.',
    cast: 'James Franco, Sarah Gadon, Chris Cooper',
    genre: 'Drama, Ficção Científica',
    rating: 8.4,
    year: '2016',
  },
  {
    id: 'series_555',
    name: 'Os 12 Macacos (2015)',
    posterUrl: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/lnLlxi9GcPNyLcmvt6uVipI73m5.jpg',
    category: 'Séries',
    plot: 'Em um mundo pós-apocalíptico, James Cole é enviado ao passado com o objetivo de reunir informações sobre um vírus mortal antes que a humanidade seja dizimada.',
    cast: 'Aaron Stanford, Amanda Schull, Barbara Sukowa',
    genre: 'Sci-Fi & Fantasy, Drama',
    rating: 8.0,
    year: '2015',
  },
];

export const SAMPLE_EPG_MAP: Record<string, { title: string; desc: string }> = {
  nasa_tv: {
    title: 'Missão Artemis & Estação Espacial Internacional',
    desc: 'Transmissão ao vivo de acoplamentos, caminhadas espaciais e pesquisas em microgravidade.',
  },
  bloomberg: {
    title: 'Fechamento de Mercados e Análise Econômica',
    desc: 'Cobertura em tempo real dos índices financeiros globais, commodities e câmbio.',
  },
  euronews_pt: {
    title: 'Jornal das 20h: Notícias do Mundo',
    desc: 'Destaques globais, geopolítica europeia e atualidades internacionais em língua portuguesa.',
  },
  redbull_tv: {
    title: 'X-Games & Downhill Mountain Bike World Cup',
    desc: 'Competições extremas com as melhores manobras e atletas mundiais.',
  },
  big_buck_bunny: {
    title: 'Sessão Cinema: Aventura na Floresta',
    desc: 'Animação clássica aclamada com áudio estéreo imersivo em alta definição.',
  },
  tears_of_steel: {
    title: 'Cine Ficção: Conexão Distópica',
    desc: 'Produção futurista de ficção científica com efeitos visuais de última geração.',
  },
};
