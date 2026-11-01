import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Title, Card, BackBar, Btn, PreviewLabel, Badge, Avatar } from '../components/ui';
import { ChatPreview } from '../components/blocks';
import { colors, fonts, radius } from '../theme';
import { useStore } from '../store';
import { uid, nowTime, pad } from '../data';

export default function EditChat({ route, navigation }) {
  const { storyId, chapterId, blockId } = route.params;
  const { getStory, getBlock, patchBlock } = useStore();
  const story = getStory(storyId);
  const cIdx = story.chapters.findIndex((c) => c.id === chapterId);
  const bIdx = story.chapters[cIdx].blocks.findIndex((b) => b.id === blockId);
  const block = getBlock(storyId, chapterId, blockId);

  const [messages, setMessages] = useState(block.messages);
  const [sel, setSel] = useState(block.messages[block.messages.length - 1]?.id);
  const current = messages.find((m) => m.id === sel);
  const [draft, setDraft] = useState(current ? { charId: current.charId, side: current.side, text: current.text } : null);

  useEffect(() => {
    const m = messages.find((x) => x.id === sel);
    setDraft(m ? { charId: m.charId, side: m.side, text: m.text } : null);
  }, [sel]);

  const commit = (list = messages) => (draft && sel ? list.map((m) => (m.id === sel ? { ...m, ...draft } : m)) : list);
  const update = () => setMessages(commit());
  const addMsg = () => {
    const list = commit();
    const m = { id: uid(), charId: story.characters[0].id, side: 'left', text: '', time: nowTime() };
    setMessages([...list, m]);
    setSel(m.id);
  };
  const del = () => {
    const rest = messages.filter((m) => m.id !== sel);
    setMessages(rest);
    setSel(rest[rest.length - 1]?.id);
  };
  const save = () => { patchBlock(storyId, chapterId, blockId, { messages: commit() }); navigation.goBack(); };
  const names = story.characters.map((c) => c.name).join(', ');
  const shown = draft && sel ? messages.map((m) => (m.id === sel ? { ...m, ...draft } : m)) : messages;

  return (
    <Screen onRight={() => navigation.navigate('Updates')}>
      <BackBar label={`Voltar ao capítulo ${pad(cIdx + 1)}`} onBack={() => navigation.goBack()} />
      <Title sub="Escolha quem fala e construa a conversa.">Editar chat</Title>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.muted }}>Cap. {pad(cIdx + 1)} ·</Text>
        <Badge label={`Bloco ${pad(bIdx + 1)} · Chat`} />
      </View>

      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontFamily: fonts.semi, fontSize: 12, color: colors.text }} numberOfLines={1}>Conversa · Grupo {names}</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.muted }}>{messages.length} mensagens</Text>
        </View>
        <PreviewLabel />
        <ChatPreview story={story} messages={shown} selectedId={sel} onSelect={setSel} />
        <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.muted }}>Toque em uma mensagem para editá-la.</Text>
      </Card>

      {draft ? (
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ fontFamily: fonts.semi, fontSize: 13, color: colors.text }}>
              Editar mensagem de {story.characters.find((c) => c.id === draft.charId)?.name}
            </Text>
            <TouchableOpacity onPress={del}><Ionicons name="trash-outline" size={18} color={colors.muted} /></TouchableOpacity>
          </View>

          <Text style={{ fontFamily: fonts.semi, fontSize: 12, marginBottom: 8, color: colors.text }}>Quem está falando?</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            {story.characters.map((c) => {
              const on = draft.charId === c.id;
              return (
                <TouchableOpacity key={c.id} onPress={() => setDraft({ ...draft, charId: c.id })}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, borderRadius: radius.md, borderWidth: 1, borderColor: on ? colors.primary : colors.border, backgroundColor: on ? colors.primarySoft : '#fff' }}>
                  <Avatar name={c.name} color={c.color} size={22} />
                  <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.text }}>{c.name}{on ? ' ✓' : ''}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={{ fontFamily: fonts.semi, fontSize: 12, marginBottom: 8, color: colors.text }}>Lado da fala</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
            <Btn title="← Esquerda" variant={draft.side === 'left' ? 'primary' : 'outline'} style={{ flex: 1, paddingVertical: 10 }} onPress={() => setDraft({ ...draft, side: 'left' })} />
            <Btn title="Direita →" variant={draft.side === 'right' ? 'primary' : 'outline'} style={{ flex: 1, paddingVertical: 10 }} onPress={() => setDraft({ ...draft, side: 'right' })} />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: fonts.semi, fontSize: 12, marginBottom: 8, color: colors.text }}>Mensagem</Text>
            <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.primary }}>{current?.time}</Text>
          </View>
          <View style={{ borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, padding: 10 }}>
            <TextInput multiline value={draft.text} onChangeText={(t) => setDraft({ ...draft, text: t })} placeholder="Digite a mensagem" placeholderTextColor={colors.muted}
              style={{ fontFamily: fonts.body, fontSize: 14, color: colors.text, minHeight: 36 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
              {[['image-outline', 'Imagem'], ['mic-outline', 'Áudio'], ['happy-outline', 'Reação']].map(([i, l]) => (
                <TouchableOpacity key={l} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }} onPress={() => Alert.alert(l, 'Disponível na próxima versão.')}>
                  <Ionicons name={i} size={14} color={colors.primary} />
                  <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: colors.primary }}>{l}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
            <TouchableOpacity onPress={addMsg}><Text style={{ fontFamily: fonts.semi, fontSize: 12, color: colors.primary }}>+ Nova mensagem</Text></TouchableOpacity>
            <Btn title="Atualizar mensagem" variant="soft" style={{ paddingVertical: 10 }} onPress={update} />
          </View>
        </Card>
      ) : (
        <Btn title="+ Nova mensagem" variant="soft" onPress={addMsg} style={{ marginBottom: 14 }} />
      )}

      <Btn title="Salvar e voltar ao capítulo" icon="checkmark" onPress={save} />
      <Text style={{ textAlign: 'center', fontFamily: fonts.body, fontSize: 11, color: colors.muted, marginTop: 8 }}>As alterações serão aplicadas somente a este bloco.</Text>
    </Screen>
  );
}
