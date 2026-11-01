import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Title, Card, BackBar, Btn, Mosaic, Badge } from '../components/ui';
import { colors, fonts, radius } from '../theme';
import { useStore } from '../store';
import { img } from '../assets';

export default function EditCover({ route, navigation }) {
  const { storyId } = route.params;
  const { getStory, patchStory } = useStore();
  const story = getStory(storyId);
  const [imgs, setImgs] = useState(story.images || []);

  const pick = async (index) => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (r.canceled) return;
    const uri = r.assets[0].uri;
    setImgs((l) => (index == null ? [...l, uri] : l.map((x, i) => (i === index ? uri : x))));
  };
  const remove = (i) => setImgs((l) => l.filter((_, k) => k !== i));
  const move = (i, d) =>
    setImgs((l) => {
      const j = i + d;
      if (j < 0 || j >= l.length) return l;
      const n = [...l];
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
  const save = () => { patchStory(storyId, { images: imgs }); navigation.goBack(); };

  return (
    <Screen onRight={() => navigation.navigate('Updates')}>
      <BackBar label="Voltar ao editor" onBack={() => navigation.goBack()} />
      <Title sub={`${story.title} · ${story.author}`}>Editar capa e estética</Title>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text style={{ fontFamily: fonts.semi, fontSize: 15, color: colors.text }}>Prévia da capa</Text>
        <Text style={{ fontFamily: fonts.semi, fontSize: 12, color: colors.primary }}>{imgs.length} de 4 imagens</Text>
      </View>
      <Mosaic images={imgs} style={{ height: 170, borderRadius: 14, marginBottom: 8 }} />
      <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginBottom: 16 }}>Escolha de 1 a 4 imagens para traduzir a estética da história. Não precisa de texto sobre as fotos.</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <Text style={{ fontFamily: fonts.title, fontSize: 18, color: colors.text }}>Galeria</Text>
        {imgs.length >= 4 ? <Badge label="Limite atingido" /> : <Badge label="Adicionar imagem" />}
      </View>
      <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginBottom: 10 }}>Use as setas para reordenar as imagens.</Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
        {imgs.map((src, i) => (
          <View key={i} style={{ width: '47.5%', backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: colors.primary, overflow: 'hidden' }}>
            <View style={{ height: 90 }}>
              <Image source={img(src)} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              <View style={{ position: 'absolute', top: 6, left: 6, width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontFamily: fonts.bold, fontSize: 11 }}>{i + 1}</Text>
              </View>
              <TouchableOpacity onPress={() => remove(i)} style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="close" size={14} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 8 }}>
              <TouchableOpacity onPress={() => pick(i)}><Text style={{ fontFamily: fonts.semi, fontSize: 11, color: colors.primary }}>⇄ Substituir</Text></TouchableOpacity>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <TouchableOpacity onPress={() => move(i, -1)}><Ionicons name="chevron-back" size={14} color={colors.muted} /></TouchableOpacity>
                <TouchableOpacity onPress={() => move(i, 1)}><Ionicons name="chevron-forward" size={14} color={colors.muted} /></TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        {imgs.length < 4 && (
          <TouchableOpacity onPress={() => pick(null)} style={{ width: '47.5%', minHeight: 130, borderRadius: 14, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="add" size={26} color={colors.primary} />
            <Text style={{ fontFamily: fonts.semi, fontSize: 12, color: colors.primary }}>Adicionar</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginBottom: 12 }}>Toque no × para remover.</Text>

      <View style={{ backgroundColor: colors.primarySoft, borderRadius: radius.md, padding: 12, marginBottom: 14 }}>
        <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.text }}>▦ Pode usar menos imagens: o mosaico se adapta automaticamente a 1, 2, 3 ou 4 fotos.</Text>
      </View>
      <Btn title="Salvar capa e voltar ao editor" icon="checkmark" onPress={save} />
    </Screen>
  );
}
