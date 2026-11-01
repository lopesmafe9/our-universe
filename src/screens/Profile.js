import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Avatar, Btn, Field, Cover } from '../components/ui';
import { colors, fonts } from '../theme';
import { useStore } from '../store';

export default function Profile({ navigation }) {
  const { state, setUser, logout, newStory, setEditorTarget } = useStore();
  const u = state.user;
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState(u);

  const mine = state.stories.filter((s) => s.mine);
  const published = mine.filter((s) => s.status === 'published');
  const drafts = mine.filter((s) => s.status === 'draft');

  const settings = () =>
    Alert.alert('Configurações', 'O que você quer fazer?', [
      { text: 'Sair da conta', style: 'destructive', onPress: logout },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  const save = () => { setUser(draft); setEdit(false); };
  const toEditor = (s) => { setEditorTarget(s.id); navigation.navigate('EditorTab'); };
  const create = () => { newStory(); navigation.navigate('EditorTab'); };

  const StoryRow = ({ s, draft: isDraft }) => (
    <TouchableOpacity onPress={() => (isDraft ? toEditor(s) : navigation.navigate('StoryDetail', { storyId: s.id }))}
      style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 10, marginBottom: 10, gap: 12 }}>
      <Cover story={s} style={{ width: 62, height: 70, borderRadius: 10 }} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonts.title, fontSize: 16, color: colors.text }}>{s.title}</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.muted, marginTop: 2 }}>
          {s.author} · {s.genre}{s.status === 'published' ? ' · Chat e narração' : ` · ${s.chapters.length} capítulos`}
        </Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.muted }}>
          {s.status === 'published' ? `${s.chapters.length} capítulos · ${s.reads || '0'} leituras` : s.editedAgo || ''}
        </Text>
      </View>
      <Ionicons name={isDraft ? 'pencil' : 'chevron-forward'} size={16} color={colors.primary} />
    </TouchableOpacity>
  );

  return (
    <Screen right="settings-outline" onRight={settings}>
      <Card style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center', marginBottom: 12 }}>
          <Avatar name={u.name} size={64} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.title, fontSize: 22, color: colors.text }}>{u.name}</Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.primary }}>@{u.username}</Text>
            <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.muted }}>{u.bio}</Text>
          </View>
        </View>
        {edit ? (
          <View>
            <Field label="Nome" value={draft.name} onChangeText={(v) => setDraft({ ...draft, name: v })} />
            <Field label="Usuário" value={draft.username} onChangeText={(v) => setDraft({ ...draft, username: v })} />
            <Field label="Bio" value={draft.bio} onChangeText={(v) => setDraft({ ...draft, bio: v })} />
            <Field label="Sobre você" multiline value={draft.extra} onChangeText={(v) => setDraft({ ...draft, extra: v })} />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Btn title="Cancelar" variant="outline" style={{ flex: 1 }} onPress={() => { setDraft(u); setEdit(false); }} />
              <Btn title="Salvar" style={{ flex: 1 }} onPress={save} />
            </View>
          </View>
        ) : (
          <>
            <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginBottom: 12 }}>{u.extra}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 }}>
              {[[mine.length, 'histórias'], [u.followers, 'seguidores'], [u.following, 'seguindo']].map(([n, l]) => (
                <View key={l} style={{ alignItems: 'center' }}>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 17, color: colors.text }}>{n}</Text>
                  <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.muted }}>{l}</Text>
                </View>
              ))}
            </View>
            <Btn title="Editar perfil" icon="pencil" variant="outline" onPress={() => { setDraft(u); setEdit(true); }} />
          </>
        )}
      </Card>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 }}>
        <Text style={{ fontFamily: fonts.title, fontSize: 18, color: colors.text }}>Meus universos</Text>
        <TouchableOpacity onPress={create}><Text style={{ fontFamily: fonts.semi, fontSize: 12, color: colors.primary }}>+ Nova história</Text></TouchableOpacity>
      </View>
      <Text style={{ fontFamily: fonts.semi, fontSize: 11, color: colors.text, marginBottom: 8 }}>Publicadas · {published.length}</Text>
      {published.map((s) => <StoryRow key={s.id} s={s} />)}
      <Text style={{ fontFamily: fonts.semi, fontSize: 11, color: colors.text, marginVertical: 8 }}>Rascunhos · {drafts.length}  <Text style={{ color: colors.muted }}>🔒 Só você</Text></Text>
      {drafts.map((s) => <StoryRow key={s.id} s={s} draft />)}
    </Screen>
  );
}
