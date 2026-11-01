import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Screen, Title, SearchInput, Chip, SectionRow, StoryTile, Grid, PickerSheet } from '../components/ui';
import { colors, fonts } from '../theme';
import { useStore } from '../store';

const TAGS = ['ShippX', 'FakeData', 'Romance'];

export default function Discover({ navigation }) {
  const { state } = useStore();
  const [q, setQ] = useState('');
  const [mode, setMode] = useState('Todos');
  const [tag, setTag] = useState('ShippX');
  const [genre, setGenre] = useState('Todos os gêneros');
  const [sheet, setSheet] = useState(false);

  const all = state.stories.filter((s) => s.status === 'published');
  const genres = ['Todos os gêneros', ...Array.from(new Set(all.map((s) => s.genre)))];

  const match = (s) => {
    const t = q.trim().toLowerCase();
    const hay = mode === 'Shipp' ? s.ship : mode === 'Fandom' ? s.fandom : [s.title, s.ship, s.fandom, s.author].join(' ');
    const okQ = !t || (hay || '').toLowerCase().includes(t);
    const okT = !tag || s.tags.includes(tag);
    const okG = genre === 'Todos os gêneros' || s.genre === genre;
    return okQ && okT && okG;
  };
  const list = all.filter(match);
  const recommended = list.slice(0, 2);
  const news = list.filter((s) => s.novidade);
  const open = (s) => navigation.navigate('StoryDetail', { storyId: s.id });

  return (
    <Screen onRight={() => navigation.navigate('Updates')}>
      <Title sub="Encontre AUs por shipp, fandom, gênero e tags do universo.">Descobrir</Title>
      <SearchInput value={q} onChangeText={setQ} />
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10, alignItems: 'center' }}>
        {['Todos', 'Shipp', 'Fandom'].map((t) => <Chip key={t} label={t} active={mode === t} onPress={() => setMode(t)} />)}
        <View style={{ flex: 1 }} />
        <Chip label={genre === 'Todos os gêneros' ? 'Filtros' : genre} onPress={() => setSheet(true)} />
      </View>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14, alignItems: 'center' }}>
        {TAGS.map((t) => <Chip key={t} label={'#' + t} active={tag === t} onPress={() => setTag(tag === t ? null : t)} />)}
      </View>

      {list.length === 0 ? (
        <Text style={{ textAlign: 'center', color: colors.muted, fontFamily: fonts.body, marginVertical: 30 }}>Nenhuma AU encontrada com esses filtros.</Text>
      ) : (
        <>
          <SectionRow title="Recomendados para você" />
          <Grid items={recommended} render={(s) => <StoryTile story={s} onPress={() => open(s)} />} />
          {news.length > 0 && (
            <>
              <SectionRow title="Novidades" />
              <Grid items={news} render={(s) => <StoryTile story={s} onPress={() => open(s)} meta={`${s.author} · Cap. 0${(s.progress ?? 0) + 1}`} />} />
            </>
          )}
        </>
      )}
      <PickerSheet visible={sheet} title="Filtrar por gênero" options={genres} value={genre} onPick={setGenre} onClose={() => setSheet(false)} />
    </Screen>
  );
}
