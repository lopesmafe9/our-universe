import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen, Title, SearchInput, Chip, SectionRow, Cover, Badge, StoryTile, Grid, PickerSheet } from '../components/ui';
import { colors, fonts } from '../theme';
import { useStore } from '../store';
import { pad } from '../data';

export default function Library({ navigation }) {
  const { state } = useStore();
  const [q, setQ] = useState('');
  const [tab, setTab] = useState('Todos');
  const [genre, setGenre] = useState('Todos os gêneros');
  const [sheet, setSheet] = useState(false);

  const published = state.stories.filter((s) => s.status === 'published');
  const genres = ['Todos os gêneros', ...Array.from(new Set(published.map((s) => s.genre)))];

  const match = (s) => {
    const t = q.trim().toLowerCase();
    const okQ = !t || [s.title, s.ship, s.fandom, s.author].join(' ').toLowerCase().includes(t);
    const okTab = tab === 'Todos' || (tab === 'Lendo' && s.progress != null) || (tab === 'Favoritos' && state.favorites.includes(s.id));
    const okG = genre === 'Todos os gêneros' || s.genre === genre;
    return okQ && okTab && okG;
  };

  const list = published.filter(match);
  const hero = list.find((s) => s.featured) || list[0];
  const featured = list.filter((s) => s.featured && s.id !== hero?.id);
  const reading = list.filter((s) => s.progress != null);
  const open = (s) => navigation.navigate('StoryDetail', { storyId: s.id });
  const cap = (s) => `${s.author} · Cap. ${pad((s.progress ?? 0) + 1)}`;

  return (
    <Screen onRight={() => navigation.navigate('Updates')}>
      <Title sub="Organize seus universos, leia sem interrupções e continue exatamente de onde parou.">Boas-vindas</Title>
      <SearchInput value={q} onChangeText={setQ} />
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14, alignItems: 'center' }}>
        {['Todos', 'Lendo', 'Favoritos'].map((t) => <Chip key={t} label={t} active={tab === t} onPress={() => setTab(t)} />)}
        <View style={{ flex: 1 }} />
        <Chip label={genre === 'Todos os gêneros' ? 'Filtros' : genre} onPress={() => setSheet(true)} />
      </View>

      {hero ? (
        <TouchableOpacity activeOpacity={0.85} onPress={() => open(hero)}>
          <Cover story={hero} style={{ height: 150, borderRadius: 18, marginBottom: 18 }}>
            <LinearGradient colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.6)']} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} />
            <View style={{ position: 'absolute', top: 12, left: 12, right: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Badge label="Destaque" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }} textStyle={{ color: '#fff' }} />
              {hero.updatedToday ? <Badge label="Atualizado hoje" style={{ backgroundColor: colors.primary }} textStyle={{ color: '#fff' }} /> : null}
            </View>
            <View style={{ position: 'absolute', bottom: 14, left: 14 }}>
              <Text style={{ fontFamily: fonts.title, fontSize: 20, color: '#fff' }}>{hero.title}</Text>
              <Text style={{ fontFamily: fonts.body, fontSize: 12, color: '#fff', marginTop: 2 }}>{hero.author} · {hero.genre} · {hero.format === 'AU' ? 'AU' : 'Fanfic'}</Text>
            </View>
          </Cover>
        </TouchableOpacity>
      ) : (
        <Text style={{ textAlign: 'center', color: colors.muted, fontFamily: fonts.body, marginVertical: 30 }}>Nenhuma história encontrada.</Text>
      )}

      {featured.length > 0 && (
        <>
          <SectionRow title="Em destaque" action="Ver todos" onAction={() => navigation.getParent()?.navigate('DiscoverTab')} />
          <Grid items={featured} render={(s) => <StoryTile story={s} onPress={() => open(s)} meta={cap(s)} />} />
        </>
      )}
      {reading.length > 0 && (
        <>
          <SectionRow title="Lendo agora" action="Ver todos" onAction={() => setTab('Lendo')} />
          <Grid items={reading} render={(s) => <StoryTile story={s} onPress={() => open(s)} meta={cap(s)} />} />
        </>
      )}
      <PickerSheet visible={sheet} title="Filtrar por gênero" options={genres} value={genre} onPick={setGenre} onClose={() => setSheet(false)} />
    </Screen>
  );
}
