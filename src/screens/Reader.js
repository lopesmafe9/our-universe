import React from 'react';
import { View, Text } from 'react-native';
import { Screen, Title, Card, Cover, Btn } from '../components/ui';
import { BlockView } from '../components/blocks';
import { colors, fonts } from '../theme';
import { useStore } from '../store';
import { pad } from '../data';

export default function Reader({ route, navigation }) {
  const { state, getStory, setProgress } = useStore();
  const storyId = route.params?.storyId || state.stories.find((s) => s.progress != null)?.id;
  const story = getStory(storyId);
  if (!story) return null;
  const idx = Math.min(story.progress ?? 0, story.chapters.length - 1);
  const chapter = story.chapters[idx];
  const total = story.chapters.length;
  const last = idx >= total - 1;

  return (
    <Screen onRight={() => navigation.navigate('Updates')}>
      <Cover story={story} style={{ height: 130, borderRadius: 14, marginBottom: 14 }} />
      <Title sub="Continue exatamente de onde parou. Sem anúncios, sem interrupções.">Leitura contínua</Title>

      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={{ fontFamily: fonts.semi, fontSize: 14, color: colors.text }}>{chapter.title} · {story.title}</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.muted }}>{chapter.minutes} min</Text>
        </View>
        {chapter.blocks.map((b) => (
          <View key={b.id} style={{ marginBottom: 12 }}>
            <BlockView block={b} story={story} />
          </View>
        ))}
      </Card>

      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontFamily: fonts.semi, fontSize: 14, color: colors.text }}>Progresso</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.muted }}>Cap. {pad(idx + 1)} de {pad(total)}</Text>
        </View>
        <View style={{ height: 8, backgroundColor: colors.track, borderRadius: 4, overflow: 'hidden' }}>
          <View style={{ width: `${((idx + 1) / total) * 100}%`, height: '100%', backgroundColor: colors.primary }} />
        </View>
        <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.muted, marginTop: 8 }}>Você parou no {chapter.title}.</Text>
      </Card>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Btn title="Índice" variant="outline" style={{ flex: 1 }} onPress={() => navigation.navigate('StoryDetail', { storyId })} />
        <Btn title={last ? 'Fim' : 'Continuar'} disabled={last} style={{ flex: 1.2 }} onPress={() => setProgress(storyId, idx + 1)} />
      </View>
    </Screen>
  );
}
