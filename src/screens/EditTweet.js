import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Title, Card, BackBar, Btn, PreviewLabel, Badge, Avatar } from '../components/ui';
import { TweetCard } from '../components/blocks';
import { colors, fonts, radius } from '../theme';
import { useStore } from '../store';
import { pad } from '../data';

export default function EditTweet({ route, navigation }) {
  const { storyId, chapterId, blockId } = route.params;
  const { getStory, getBlock, patchBlock } = useStore();
  const story = getStory(storyId);
  const cIdx = story.chapters.findIndex((c) => c.id === chapterId);
  const bIdx = story.chapters[cIdx].blocks.findIndex((b) => b.id === blockId);
  const block = getBlock(storyId, chapterId, blockId);

  const [t, setT] = useState({ ...block, likes: String(block.likes), retweets: String(block.retweets) });
  const [open, setOpen] = useState(false);
  const author = story.characters.find((c) => c.id === t.charId) || story.characters[0];
  const num = (v) => parseInt(String(v).replace(/\D/g, ''), 10) || 0;
  const live = { ...t, likes: num(t.likes), retweets: num(t.retweets) };

  const save = () => { patchBlock(storyId, chapterId, blockId, live); navigation.goBack(); };
  const box = { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, backgroundColor: '#fff' };
  const lab = { fontFamily: fonts.semi, fontSize: 12, color: colors.text, marginBottom: 6 };

  return (
    <Screen onRight={() => navigation.navigate('Updates')}>
      <BackBar label={`Voltar ao capítulo ${pad(cIdx + 1)}`} onBack={() => navigation.goBack()} />
      <Title sub="Um post fictício para dar voz ao seu universo.">Editar tweet</Title>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.muted }}>Cap. {pad(cIdx + 1)} ·</Text>
        <Badge label={`Bloco ${pad(bIdx + 1)} · Tweet`} />
      </View>

      <Card>
        <Text style={lab}>Autor do post</Text>
        <TouchableOpacity onPress={() => setOpen(!open)} style={[box, { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, marginBottom: open ? 6 : 14 }]}>
          <Avatar name={author.name} color={author.color} size={34} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: colors.text }}>{author.displayName}</Text>
            <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.muted }}>{author.handle}</Text>
          </View>
          <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={colors.muted} />
        </TouchableOpacity>
        {open && (
          <View style={[box, { marginBottom: 14 }]}>
            {story.characters.map((c) => (
              <TouchableOpacity key={c.id} onPress={() => { setT({ ...t, charId: c.id }); setOpen(false); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10 }}>
                <Avatar name={c.name} color={c.color} size={26} />
                <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.text }}>{c.displayName} <Text style={{ color: colors.muted }}>{c.handle}</Text></Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={lab}>Conteúdo do post</Text>
        <View style={[box, { borderColor: colors.primary, padding: 10, marginBottom: 14 }]}>
          <TextInput multiline maxLength={280} value={t.text} onChangeText={(v) => setT({ ...t, text: v })} placeholder="O que está acontecendo?" placeholderTextColor={colors.muted}
            style={{ fontFamily: fonts.body, fontSize: 14, color: colors.text, minHeight: 40 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: colors.primary }}>▣ Adicionar imagem</Text>
            <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.muted }}>{t.text.length} / 280</Text>
          </View>
        </View>

        <Text style={lab}>Métricas fictícias</Text>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 6 }}>
          {[['Curtidas', 'likes', 'heart-outline'], ['Retuítes', 'retweets', 'repeat-outline']].map(([l, k, ic]) => (
            <View key={k} style={{ flex: 1 }}>
              <Text style={[lab, { fontFamily: fonts.medium, color: colors.muted }]}>{l}</Text>
              <View style={[box, { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }]}>
                <TextInput keyboardType="numeric" value={t[k]} onChangeText={(v) => setT({ ...t, [k]: v })} style={{ flex: 1, fontFamily: fonts.body, fontSize: 15, color: colors.text, paddingVertical: 10 }} />
                <Ionicons name={ic} size={16} color={colors.primary} />
              </View>
            </View>
          ))}
        </View>
        <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.muted, marginBottom: 14 }}>Os números fazem parte da história. Não representam interações reais.</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={lab}>Tempo exibido</Text>
          <View style={[box, { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, width: 90 }]}>
            <TextInput value={t.time} onChangeText={(v) => setT({ ...t, time: v })} style={{ flex: 1, fontFamily: fonts.body, fontSize: 14, color: colors.text, paddingVertical: 8 }} />
            <Ionicons name="pencil" size={13} color={colors.primary} />
          </View>
        </View>
      </Card>

      <Card>
        <PreviewLabel />
        <TweetCard block={live} story={story} />
      </Card>

      <Btn title="Salvar e voltar ao capítulo" icon="checkmark" onPress={save} />
      <Text style={{ textAlign: 'center', fontFamily: fonts.body, fontSize: 11, color: colors.muted, marginTop: 8 }}>As alterações serão aplicadas somente a este bloco.</Text>
    </Screen>
  );
}
