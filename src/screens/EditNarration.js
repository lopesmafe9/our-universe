import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Screen, Title, Card, BackBar, Btn, PreviewLabel, Badge } from '../components/ui';
import { RichEditor, RichText } from '../components/blocks';
import { colors, fonts } from '../theme';
import { useStore } from '../store';
import { pad } from '../data';

export default function EditNarration({ route, navigation }) {
  const { storyId, chapterId, blockId } = route.params;
  const { getStory, getBlock, patchBlock } = useStore();
  const story = getStory(storyId);
  const cIdx = story.chapters.findIndex((c) => c.id === chapterId);
  const bIdx = story.chapters[cIdx].blocks.findIndex((b) => b.id === blockId);
  const block = getBlock(storyId, chapterId, blockId);
  const [text, setText] = useState(block.text || '');
  const [align, setAlign] = useState(block.align || 'left');

  const save = () => { patchBlock(storyId, chapterId, blockId, { text, align }); navigation.goBack(); };

  return (
    <Screen onRight={() => navigation.navigate('Updates')}>
      <BackBar label={`Voltar ao capítulo ${pad(cIdx + 1)}`} onBack={() => navigation.goBack()} />
      <Title sub="Dê ritmo à história, uma palavra de cada vez.">Editar narração</Title>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.muted }}>Cap. {pad(cIdx + 1)} ·</Text>
        <Badge label={`Bloco ${pad(bIdx + 1)} · Narração`} />
      </View>

      <Card>
        <View style={{ backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 10, alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontFamily: fonts.semi, color: '#fff', fontSize: 13 }}>Narração</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontFamily: fonts.semi, fontSize: 12, color: colors.text }}>Texto do bloco</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.primary }}>Editando</Text>
        </View>
        <RichEditor value={text} onChange={setText} align={align} onAlign={setAlign} minHeight={240} />
        <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.muted, marginTop: 8 }}>
          Dica: **negrito**, _itálico_ e ++sublinhado++ aparecem formatados na prévia.
        </Text>
      </Card>

      <Card>
        <PreviewLabel />
        <RichText text={text} align={align} />
      </Card>

      <Btn title="Salvar e voltar ao capítulo" icon="checkmark" onPress={save} />
      <Text style={{ textAlign: 'center', fontFamily: fonts.body, fontSize: 11, color: colors.muted, marginTop: 8 }}>As alterações serão aplicadas somente a este bloco.</Text>
    </Screen>
  );
}
