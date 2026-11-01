import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Title, Card, Chip, Btn, Cover, SectionRow, PickerSheet } from '../components/ui';
import { BlockView, RichEditor, RichText } from '../components/blocks';
import { colors, fonts } from '../theme';
import { useStore } from '../store';
import { uid, nowTime, pad } from '../data';

const LABEL = { chat: 'Bloco de chat', narration: 'Bloco de narração', tweet: 'Bloco de tweet' };
const ROUTE = { chat: 'EditChat', narration: 'EditNarration', tweet: 'EditTweet' };

export default function EditorHome({ navigation }) {
  const { state, getStory, patchStory, setEditorTarget, addBlock, removeBlock, moveBlock, addChapter, patchBlock } = useStore();
  const [sheet, setSheet] = useState(false);
  const [preview, setPreview] = useState(false);

  const mine = state.stories.filter((s) => s.mine);
  const story = getStory(state.editorTarget.storyId) || mine[0];
  if (!story) return <Screen><Title sub="Crie uma história no seu perfil.">Editor de narrativa</Title></Screen>;
  const chapter = story.chapters.find((c) => c.id === state.editorTarget.chapterId) || story.chapters[0];
  const cIdx = story.chapters.findIndex((c) => c.id === chapter.id);
  const fanfic = story.format === 'fanfic';

  const params = (b) => ({ storyId: story.id, chapterId: chapter.id, blockId: b.id });
  const add = (type) => {
    const block =
      type === 'chat'
        ? { id: uid(), type, messages: [{ id: uid(), charId: story.characters[0].id, side: 'right', text: '', time: nowTime() }] }
        : type === 'tweet'
        ? { id: uid(), type, charId: story.characters[0].id, text: '', likes: 0, retweets: 0, time: '1h' }
        : { id: uid(), type: 'narration', text: '', align: 'left' };
    addBlock(story.id, chapter.id, block);
    navigation.navigate(ROUTE[type], params(block));
  };
  const confirmDelete = (b) =>
    Alert.alert('Remover bloco?', 'Essa ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => removeBlock(story.id, chapter.id, b.id) },
    ]);
  const summary = (b) => (b.type === 'chat' ? `${b.messages.length} mensagens` : b.type === 'tweet' ? '1 post' : `${(b.text || '').split(/\s+/).filter(Boolean).length} palavras`);

  return (
    <Screen onRight={() => navigation.navigate('Updates')}>
      <Title sub={fanfic ? `Editando fanfic · ${story.title}` : 'Alterne entre chat, narração e mídia sem sair do fluxo.'}>Editor de narrativa</Title>

      {mine.length > 1 && (
        <TouchableOpacity onPress={() => setSheet(true)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Ionicons name="swap-horizontal" size={14} color={colors.primary} />
          <Text style={{ fontFamily: fonts.semi, fontSize: 12, color: colors.primary, marginLeft: 6 }}>Trocar de história: {story.title}</Text>
        </TouchableOpacity>
      )}

      <Cover story={story} style={{ height: fanfic ? 260 : 130, borderRadius: 14, marginBottom: 8 }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
        <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.muted }}>{story.author}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditCover', { storyId: story.id })}>
          <Text style={{ fontFamily: fonts.semi, fontSize: 12, color: colors.primary }}>✎ Editar capa</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ fontFamily: fonts.semi, fontSize: 14, color: colors.text, marginBottom: 8 }}>Formato</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 6 }}>
        <Chip label="AU" active={!fanfic} onPress={() => patchStory(story.id, { format: 'AU' })} />
        <Chip label="Fanfic" active={fanfic} onPress={() => patchStory(story.id, { format: 'fanfic' })} />
      </View>
      <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.muted, marginBottom: 14 }}>
        {fanfic ? 'Na fanfic, sua história é contada apenas por narração.' : 'Fanfic usa apenas Narração. AU combina Chat, Mídia e Narração.'}
      </Text>

      {fanfic ? (
        <>
          <Card>
            <View style={{ backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 10, alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontFamily: fonts.semi, color: '#fff', fontSize: 13 }}>Narração</Text>
            </View>
            <Text style={{ fontFamily: fonts.semi, fontSize: 13, marginBottom: 8, color: colors.text }}>{chapter.title}</Text>
            <RichEditor
              value={story.fanficText || ''}
              onChange={(t) => patchStory(story.id, { fanficText: t })}
              align={story.fanficAlign || 'left'}
              onAlign={(a) => patchStory(story.id, { fanficAlign: a })}
            />
          </Card>
          {preview && (
            <Card>
              <RichText text={story.fanficText} align={story.fanficAlign || 'left'} />
            </Card>
          )}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Btn title={preview ? 'Fechar prévia' : 'Prévia'} icon="eye-outline" variant="outline" style={{ flex: 1 }} onPress={() => setPreview(!preview)} />
            <Btn title="Salvar fanfic" icon="checkmark" style={{ flex: 1 }} onPress={() => Alert.alert('Salvo', 'Sua fanfic continua como rascunho.')} />
          </View>
          <Text style={{ textAlign: 'center', fontFamily: fonts.body, fontSize: 11, color: colors.muted, marginTop: 8 }}>Sua história continua como rascunho.</Text>
        </>
      ) : (
        <>
          <Text style={{ fontFamily: fonts.semi, fontSize: 14, color: colors.text, marginBottom: 8 }}>Capítulo</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {story.chapters.map((c, i) => (
                <Chip key={c.id} label={pad(i + 1)} active={c.id === chapter.id} onPress={() => setEditorTarget(story.id, c.id)} />
              ))}
              <Chip label="+ novo" onPress={() => addChapter(story.id)} />
            </View>
          </ScrollView>

          <Text style={{ fontFamily: fonts.semi, fontSize: 14, color: colors.text, marginBottom: 8 }}>Adicionar bloco</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            <Chip label="Chat" active onPress={() => add('chat')} />
            <Chip label="Narração" onPress={() => add('narration')} />
            <Chip label="Tweet" onPress={() => add('tweet')} />
            <Chip label="Mídia" onPress={() => Alert.alert('Mídia', 'Blocos de mídia entram na próxima versão.')} />
          </View>

          {chapter.blocks.map((b, i) => (
            <Card key={b.id}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate(ROUTE[b.type], params(b))}>
                  <Text style={{ fontFamily: fonts.semi, fontSize: 14, color: colors.text }}>{LABEL[b.type]}</Text>
                </TouchableOpacity>
                <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginRight: 10 }}>{summary(b)}</Text>
                <TouchableOpacity onPress={() => moveBlock(story.id, chapter.id, b.id, -1)} style={{ padding: 4 }}><Ionicons name="chevron-up" size={16} color={colors.muted} /></TouchableOpacity>
                <TouchableOpacity onPress={() => moveBlock(story.id, chapter.id, b.id, 1)} style={{ padding: 4 }}><Ionicons name="chevron-down" size={16} color={colors.muted} /></TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDelete(b)} style={{ padding: 4 }}><Ionicons name="trash-outline" size={16} color={colors.danger} /></TouchableOpacity>
              </View>
              <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate(ROUTE[b.type], params(b))}>
                <BlockView block={b} story={story} />
              </TouchableOpacity>
            </Card>
          ))}
        </>
      )}

      <PickerSheet visible={sheet} title="Escolha a história" options={mine.map((s) => s.title)} value={story.title}
        onPick={(t) => setEditorTarget(mine.find((s) => s.title === t).id)} onClose={() => setSheet(false)} />
    </Screen>
  );
}
