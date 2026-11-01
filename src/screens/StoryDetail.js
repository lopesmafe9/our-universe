import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen, Cover, Badge, SectionRow, BackBar, Btn } from '../components/ui';
import { colors, fonts, radius } from '../theme';
import { useStore } from '../store';
import { pad } from '../data';

export default function StoryDetail({ route, navigation }) {
  const { storyId } = route.params;
  const { getStory, state, toggleFav, setProgress } = useStore();
  const story = getStory(storyId);
  const fav = state.favorites.includes(storyId);
  const idx = story.progress ?? -1;

  const status = (i) => (i < idx ? 'Lido' : i === idx ? 'Atual' : i === idx + 1 ? 'Próximo' : null);
  const openChapter = (i) => {
    setProgress(storyId, i);
    navigation.navigate('Reader', { storyId });
  };

  return (
    <Screen onRight={() => navigation.navigate('Updates')}>
      <BackBar label="Voltar" onBack={() => navigation.goBack()} right={story.status === 'draft' ? 'Rascunho' : ''} />
      <Cover story={story} style={{ height: 160, borderRadius: 18, marginBottom: 18 }}>
        <LinearGradient colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.6)']} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} />
        <View style={{ position: 'absolute', top: 12, left: 12, right: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Badge label={`${story.genre} · ${story.universe || 'Universo original'}`} style={{ backgroundColor: 'rgba(255,255,255,0.3)' }} textStyle={{ color: '#fff' }} />
          <Badge label={`${story.chapters.length} capítulos`} style={{ backgroundColor: colors.primary }} textStyle={{ color: '#fff' }} />
        </View>
        <View style={{ position: 'absolute', bottom: 12, left: 14, right: 14 }}>
          <Text style={{ fontFamily: fonts.title, fontSize: 22, color: '#fff' }}>{story.title}</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 12, color: '#fff' }}>{story.subtitle || `${story.author} · ${story.genre}`}</Text>
        </View>
      </Cover>

      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
        <Btn title={idx >= 0 ? 'Continuar lendo' : 'Começar a ler'} style={{ flex: 1 }} onPress={() => openChapter(Math.max(idx, 0))} />
        <TouchableOpacity onPress={() => toggleFav(storyId)} style={{ width: 48, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={fav ? 'heart' : 'heart-outline'} size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <Text style={[{ fontFamily: fonts.semi, fontSize: 15, color: colors.text, marginBottom: 8 }]}>Sobre a AU</Text>
      <View style={{ flexDirection: 'row', marginBottom: 18 }}>
        <View style={{ width: 3, backgroundColor: colors.border, borderRadius: 2, marginRight: 10 }} />
        <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 13, color: colors.muted, lineHeight: 20 }}>{story.about}</Text>
      </View>

      <SectionRow title="Índice de capítulos" action={`${story.chapters.length} capítulos`} />
      {story.chapters.map((c, i) => {
        const st = status(i);
        const current = st === 'Atual';
        return (
          <TouchableOpacity key={c.id} onPress={() => openChapter(i)} activeOpacity={0.8}
            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: current ? colors.primary : colors.border, padding: 12, marginBottom: 8 }}>
            <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: current ? colors.primary : colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Text style={{ fontFamily: fonts.semi, fontSize: 12, color: current ? '#fff' : colors.primary }}>{pad(i + 1)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.semi, fontSize: 14, color: colors.text }}>{c.title}</Text>
              <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.muted }}>{c.kind} · {c.minutes} min</Text>
            </View>
            {st ? <Badge label={st} style={current ? { backgroundColor: colors.primary } : { backgroundColor: '#F1EDE6' }} textStyle={{ color: current ? '#fff' : colors.muted }} /> : null}
          </TouchableOpacity>
        );
      })}
    </Screen>
  );
}
