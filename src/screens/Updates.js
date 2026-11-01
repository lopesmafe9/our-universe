import React from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { Screen, Title, Card, Badge, Cover, BackBar, Btn } from '../components/ui';
import { colors, fonts } from '../theme';
import { useStore } from '../store';

export default function Updates({ navigation }) {
  const { state, getStory, setPref } = useStore();
  const Row = ({ label, k }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
      <Text style={{ fontFamily: fonts.body, fontSize: 14, color: colors.text }}>{label}</Text>
      <Switch value={state.prefs[k]} onValueChange={(v) => setPref(k, v)} trackColor={{ true: colors.primary, false: colors.track }} thumbColor="#fff" />
    </View>
  );
  const firstReading = state.stories.find((s) => s.progress != null);

  return (
    <Screen right={null}>
      <BackBar label="Voltar" onBack={() => navigation.goBack()} right="" />
      <Title sub="Novos capítulos, lembretes e atualizações das AUs favoritas.">Atualizações</Title>
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text style={{ fontFamily: fonts.semi, fontSize: 14, color: colors.text }}>Hoje</Text>
          <Text style={{ fontFamily: fonts.semi, fontSize: 12, color: colors.primary }}>{state.updates.length} novidades</Text>
        </View>
        {state.updates.map((u) => {
          const st = getStory(u.storyId);
          return (
            <TouchableOpacity key={u.id} onPress={() => navigation.navigate('StoryDetail', { storyId: u.storyId })}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}>
              <Cover story={st} style={{ width: 40, height: 40, borderRadius: 20 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.semi, fontSize: 14, color: colors.text }}>{st.title}</Text>
                <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.muted }}>{u.text}</Text>
              </View>
              <Badge label={u.badge} />
            </TouchableOpacity>
          );
        })}
      </Card>
      <Card>
        <Text style={{ fontFamily: fonts.semi, fontSize: 14, color: colors.text }}>Preferências</Text>
        <Row label="Notificações por push" k="push" />
        <Row label="Marca-página automática" k="bookmark" />
        <Row label="Modo noturno" k="night" />
      </Card>
      <Btn title="Abrir leitura contínua" onPress={() => navigation.navigate('Reader', { storyId: firstReading?.id })} />
    </Screen>
  );
}
