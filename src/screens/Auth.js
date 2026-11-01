import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Title, Field, Btn } from '../components/ui';
import { colors, fonts } from '../theme';
import { useStore } from '../store';

export function Signup({ navigation }) {
  const { login } = useStore();
  const [f, setF] = useState({ name: '', username: '', email: '', password: '' });
  const [show, setShow] = useState(false);
  const [ok, setOk] = useState(true);
  const set = (k) => (v) => setF({ ...f, [k]: v });

  const submit = () => {
    if (!f.name || !f.username || !/^\S+@\S+\.\S+$/.test(f.email)) return Alert.alert('Confira os dados', 'Preencha nome, usuário e um e-mail válido.');
    if (f.password.length < 8) return Alert.alert('Senha curta', 'Use pelo menos 8 caracteres.');
    if (!ok) return Alert.alert('Termos', 'Aceite os termos de uso para continuar.');
    login({ name: f.name, username: f.username, email: f.email });
  };

  return (
    <Screen bar={false}>
      <Title sub="Toda história começa com uma conexão. Encontre seu lugar entre universos." style={{ marginTop: 10 }}>Crie sua conta</Title>
      <Field label="Nome" icon="person-outline" value={f.name} onChangeText={set('name')} placeholder="Seu nome" />
      <Field label="Nome de usuário" icon="at" value={f.username} onChangeText={set('username')} placeholder="usuario" />
      <Field label="E-mail" icon="mail-outline" value={f.email} onChangeText={set('email')} placeholder="voce@email.com" keyboardType="email-address" />
      <Field label="Senha" icon="lock-closed-outline" value={f.password} onChangeText={set('password')} secureTextEntry={!show}
        right={show ? 'eye-outline' : 'eye-off-outline'} onRightPress={() => setShow(!show)} placeholder="••••••••" />
      <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.muted, marginTop: -8, marginBottom: 14 }}>Use pelo menos 8 caracteres.</Text>
      <TouchableOpacity style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }} onPress={() => setOk(!ok)}>
        <View style={{ width: 20, height: 20, borderRadius: 5, backgroundColor: ok ? colors.primary : '#fff', borderWidth: 1, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
          {ok ? <Ionicons name="checkmark" size={14} color="#fff" /> : null}
        </View>
        <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 12, color: colors.muted }}>
          Li e aceito os <Text style={{ fontFamily: fonts.bold, color: colors.primary }}>Termos de uso</Text> e a <Text style={{ fontFamily: fonts.bold, color: colors.primary }}>Política de privacidade.</Text>
        </Text>
      </TouchableOpacity>
      <Btn title="Criar minha conta" onPress={submit} />
      <Text style={{ textAlign: 'center', marginTop: 16, fontFamily: fonts.body, fontSize: 13, color: colors.muted }}>
        Já tem uma conta? <Text style={{ fontFamily: fonts.bold, color: colors.primary }} onPress={() => navigation.navigate('Login')}>Entrar</Text>
      </Text>
      <Text style={{ textAlign: 'center', marginTop: 60, fontFamily: fonts.body, fontSize: 12, color: colors.muted }}>✦ Para quem lê, imagina e escreve.</Text>
    </Screen>
  );
}

export function Login({ navigation }) {
  const { login, state } = useStore();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);

  const submit = () => {
    if (!id.trim() || !pw) return Alert.alert('Faltou algo', 'Informe e-mail/usuário e senha.');
    // Protótipo: qualquer login válido entra
    login(id.includes('@') ? { email: id } : { username: id });
  };

  return (
    <Screen bar={false}>
      <Title sub="Seus universos e suas próximas leituras estão esperando por você." style={{ marginTop: 10 }}>Bom ter você de volta</Title>
      <Field label="E-mail ou nome de usuário" icon="mail-outline" value={id} onChangeText={setId} placeholder="mariana@email.com" />
      <Field label="Senha" icon="lock-closed-outline" value={pw} onChangeText={setPw} secureTextEntry={!show}
        right={show ? 'eye-outline' : 'eye-off-outline'} onRightPress={() => setShow(!show)} placeholder="••••••••" />
      <Text style={{ textAlign: 'right', fontFamily: fonts.semi, fontSize: 12, color: colors.primary, marginBottom: 16 }}
        onPress={() => Alert.alert('Recuperar senha', 'No protótipo, a recuperação ainda não está conectada.')}>Esqueci minha senha</Text>
      <Btn title="Entrar" onPress={submit} />
      <Text style={{ textAlign: 'center', marginVertical: 16, fontFamily: fonts.body, fontSize: 13, color: colors.muted }}>
        Ainda não tem uma conta? <Text style={{ fontFamily: fonts.bold, color: colors.primary }} onPress={() => navigation.navigate('Signup')}>Criar conta</Text>
      </Text>
      <View style={{ backgroundColor: colors.primarySoft, borderRadius: 16, padding: 16 }}>
        <Text style={{ fontFamily: fonts.semi, fontSize: 12, color: colors.primary, marginBottom: 6 }}>💬 Um lugar para suas histórias</Text>
        <Text style={{ fontFamily: fonts.title, fontSize: 18, color: colors.text, marginBottom: 6 }}>Entre uma mensagem e outra, um universo inteiro.</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.muted }}>Leia e escreva AUs com chat, narração e posts que dão vida a cada capítulo.</Text>
      </View>
      <Text style={{ textAlign: 'center', marginTop: 50, fontFamily: fonts.body, fontSize: 12, color: colors.muted }}>Sua próxima história começa aqui.</Text>
    </Screen>
  );
}
