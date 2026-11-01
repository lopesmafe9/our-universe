export const uid = () => Math.random().toString(36).slice(2, 9);
export const pad = (n) => String(n).padStart(2, '0');
export const nowTime = () => {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const chars = [
  { id: 'north', name: 'North', mine: true, color: '#C98B6B', displayName: 'north & sohyunie 4ever', handle: '@wifeysohyun' },
  { id: 'teetee', name: 'Teetee', color: '#8A6B4A', displayName: 'tee', handle: '@teetee' },
  { id: 'wave', name: 'Wave', color: '#6B7FA8', displayName: 'wave', handle: '@wave' },
];

// Capítulos genéricos para as histórias que não são suas
const mkChapters = (n, kinds = ['Chat', 'Narração', 'Narração + Chat']) =>
  Array.from({ length: n }, (_, i) => ({
    id: 'c' + (i + 1),
    title: `Capítulo ${pad(i + 1)}`,
    kind: kinds[i % kinds.length],
    minutes: 10 + ((i * 5) % 15),
    blocks: [
      { id: uid(), type: 'narration', text: 'Este capítulo ainda não tem texto.', align: 'left' },
    ],
  }));

const webFriendsChapters = () => {
  const ch = mkChapters(6, ['Chat', 'Chat', 'Narração + Chat', 'Chat', 'Narração', 'Chat']);
  ch[0].minutes = 20;
  ch[1].minutes = 15;
  ch[2].minutes = 15;
  ch[1].blocks = [
    {
      id: 'b1',
      type: 'chat',
      messages: [
        { id: 'm1', charId: 'north', side: 'right', text: 'gente quando foi q vcs descobriram q não eram heteros?', time: '23:41' },
        { id: 'm2', charId: 'teetee', side: 'left', text: 'mds a pergunta do milhão', time: '23:41' },
      ],
    },
    {
      id: 'b2',
      type: 'narration',
      align: 'left',
      text:
        'Desde os seus 12 anos, quando seus pais se divorciaram, North tinha o costume de passear pelo bairro sempre que estava com a cabeça cheia, brigava com o pai ou se sentia cansado dos estudos. Foi em um desses passeios que acabou descobrindo a Tmilk’s, uma confeitaria de esquina aconchegante que exalava um aroma incrível de café.\nQuando percebeu, já estava lá dentro — e, em pouco tempo, aquele virou seu lugar seguro, assim como os donos do estabelecimento.',
    },
    {
      id: 'b3',
      type: 'chat',
      messages: [
        { id: 'm3', charId: 'wave', side: 'left', text: 'TEETEE VC ME ODEIA?', time: '23:41' },
        { id: 'm4', charId: 'north', side: 'right', text: 'ih vai começar o fight', time: '23:41' },
      ],
    },
    { id: 'b4', type: 'tweet', charId: 'north', text: 'meu lugar favorito', likes: 128, retweets: 24, time: '2h' },
  ];
  return ch;
};

export const initialState = {
  auth: { loggedIn: false },
  user: {
    name: 'mafê',
    username: 'koolkatphuted',
    email: 'koolkat@email.com',
    bio: 'Leitora e autora de AUs',
    extra: '☕ fashion girlie ~ triples4ever\nela/dela',
    followers: 128,
    following: 36,
  },
  prefs: { push: true, bookmark: true, night: false },
  favorites: [],
  editorTarget: { storyId: 's1', chapterId: 'c2' },
  stories: [
    {
      id: 's1', title: 'web... friends?', author: 'NorthOtto', ship: 'NorthOtto', fandom: 'BL',
      genre: 'Romance', universe: 'Universo original', tags: ['ShippX', 'FakeData', 'Romance'],
      about: 'onde north e otto são amigos que se conheceram no fandom do tripleS\nou\nem um selca day, north que até então achava que era hétero, se surpreende com a beleza de otto e começa a sentir coisas.',
      subtitle: 'NorthOtto · Capítulos sequenciais com chat, narração e mídia.',
      images: ['asset:wf1', 'asset:wf2', 'asset:wf3', 'asset:wf4'],
      format: 'AU', status: 'published', mine: true, featured: true, updatedToday: true,
      reads: '1,2 mil', progress: 1, characters: chars, chapters: webFriendsChapters(),
    },
    {
      id: 's2', title: 'umbrella', author: 'LatteKim', genre: 'SpinOff', ship: 'LatteKim', fandom: 'Original',
      tags: ['SpinOff', 'Romance'], about: 'Dias de chuva, um guarda-chuva só e duas pessoas que não sabiam o que sentiam.',
      images: ['asset:umbrella'], format: 'AU', status: 'published', featured: true, progress: 4,
      characters: chars, chapters: mkChapters(8),
    },
    {
      id: 's3', title: 'from rescue to parenting?', author: 'PhuphaTeddy', genre: 'Romance', ship: 'PhuphaTeddy', fandom: 'BL',
      tags: ['ShippX', 'Romance'], about: 'Um resgate inesperado que vira uma família.',
      images: ['asset:rescue'], format: 'AU', status: 'published', novidade: true, progress: 1,
      characters: chars, chapters: mkChapters(5),
    },
    {
      id: 's4', title: 'rainy days', author: 'JayHoon', genre: 'Fanfic', ship: 'JayHoon', fandom: 'Kpop',
      tags: ['FakeData', 'Fanfic'], about: 'Uma fanfic em narração sobre dias de chuva e lembranças.',
      images: ['asset:rainy'], format: 'fanfic', status: 'published', novidade: true, progress: 0,
      fanficText: '— naquela época eu amava chuva\n— naquela época eu odiava chuva\ndaí eu conheci ele.\n— daquele dia em diante eu passei a odiar dias chuvosos\n— daquele dia em diante eu passei a amar dias chuvosos\nporque me lembravam ele.',
      characters: chars, chapters: mkChapters(3, ['Narração']),
    },
    {
      id: 's5', title: 'transparent soul', author: 'NorthOtto', genre: 'Viagem no tempo', ship: 'NorthOtto', fandom: 'BL',
      tags: ['Romance'], about: 'Rascunho de uma história sobre viagem no tempo.',
      images: [], format: 'AU', status: 'draft', mine: true, editedAgo: 'Editado há 2 h',
      characters: chars, chapters: mkChapters(2, ['Narração', 'Chat']),
    },
    {
      id: 's6', title: 'soulmates', author: 'AnaLu', genre: 'Romance', ship: 'AnaLu', fandom: 'Original',
      tags: ['Romance'], about: 'Almas gêmeas e um destino complicado.',
      images: [], format: 'AU', status: 'published', progress: 5,
      characters: chars, chapters: mkChapters(6),
    },
  ],
  updates: [
    { id: 'u1', storyId: 's1', text: 'Capítulo 03 publicado · 4 min de leitura', badge: 'Novo' },
    { id: 'u2', storyId: 's6', text: 'Capítulo 06 publicado · 6 min de leitura', badge: 'Novo' },
    { id: 'u3', storyId: 's3', text: 'Capítulo 02 atualizado · leitura contínua pronta', badge: 'Atualizado' },
  ],
};
