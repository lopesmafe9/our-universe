import React from 'react';
import {
  View, Text, TouchableOpacity, TextInput, Image, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, Modal, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius } from '../theme';
import { img } from '../assets';

/* ---------- estrutura de tela ---------- */
export function AppBar({ right = 'notifications-outline', onRight }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.appbar, { paddingTop: insets.top + 10 }]}>
      <Ionicons name="planet-outline" size={24} color={colors.primary} />
      <Text style={s.logo}>our universe</Text>
      <View style={{ flex: 1 }} />
      {right ? (
        <TouchableOpacity style={s.bell} onPress={onRight}>
          <Ionicons name={right} size={18} color={colors.primary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export function Screen({ children, right = 'notifications-outline', onRight, bar = true, pad = 16 }) {
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {bar ? <AppBar right={right} onRight={onRight} /> : <AppBar right={null} />}
      <ScrollView contentContainerStyle={{ padding: pad, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export const Title = ({ children, sub, style }) => (
  <View style={[{ marginBottom: 14 }, style]}>
    <Text style={s.h1}>{children}</Text>
    {sub ? <Text style={s.sub}>{sub}</Text> : null}
  </View>
);

export const SectionRow = ({ title, action, onAction }) => (
  <View style={s.sectionRow}>
    <Text style={s.h3}>{title}</Text>
    {action ? (
      <TouchableOpacity onPress={onAction}>
        <Text style={s.link}>{action}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

export function BackBar({ label, onBack, right = 'Rascunho' }) {
  return (
    <View style={s.backbar}>
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={onBack}>
        <Ionicons name="chevron-back" size={16} color={colors.primary} />
        <Text style={[s.link, { fontSize: 13 }]}>{label}</Text>
      </TouchableOpacity>
      <Text style={s.muted}>{right}</Text>
    </View>
  );
}

/* ---------- elementos básicos ---------- */
export const Card = ({ children, style }) => <View style={[s.card, style]}>{children}</View>;

export function Chip({ label, active, onPress, style }) {
  return (
    <TouchableOpacity onPress={onPress} style={[s.chip, active && s.chipActive, style]}>
      <Text style={[s.chipText, active && { color: '#fff' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function Btn({ title, onPress, variant = 'primary', icon, style, disabled }) {
  const primary = variant === 'primary';
  const soft = variant === 'soft';
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[s.btn, primary && { backgroundColor: colors.primary }, soft && { backgroundColor: colors.primarySoft, borderColor: colors.primarySoft },
        variant === 'outline' && { backgroundColor: '#fff', borderColor: colors.border }, disabled && { opacity: 0.5 }, style]}
    >
      {icon ? <Ionicons name={icon} size={16} color={primary ? '#fff' : colors.primary} style={{ marginRight: 6 }} /> : null}
      <Text style={[s.btnText, { color: primary ? '#fff' : variant === 'outline' ? colors.text : colors.primary }]}>{title}</Text>
    </TouchableOpacity>
  );
}

export const Badge = ({ label, style, textStyle }) => (
  <View style={[s.badge, style]}>
    <Text style={[s.badgeText, textStyle]}>{label}</Text>
  </View>
);

export function Avatar({ name = '?', color = colors.primary, size = 28, uri }) {
  if (uri) return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#fff', fontFamily: fonts.semi, fontSize: size * 0.42 }}>{name.slice(0, 1).toUpperCase()}</Text>
    </View>
  );
}

export function Field({ label, icon, right, onRightPress, ...props }) {
  return (
    <View style={{ marginBottom: 14 }}>
      {label ? <Text style={s.label}>{label}</Text> : null}
      <View style={s.inputWrap}>
        {icon ? <Ionicons name={icon} size={16} color={colors.muted} style={{ marginRight: 8 }} /> : null}
        <TextInput placeholderTextColor={colors.muted} style={s.input} autoCapitalize="none" {...props} />
        {right ? (
          <TouchableOpacity onPress={onRightPress}>
            <Ionicons name={right} size={18} color={colors.muted} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

export const SearchInput = ({ value, onChangeText }) => (
  <View style={[s.inputWrap, { marginBottom: 12, backgroundColor: '#fff' }]}>
    <Ionicons name="search-outline" size={16} color={colors.muted} style={{ marginRight: 8 }} />
    <TextInput value={value} onChangeText={onChangeText} placeholder="Buscar AU, shipp ou fandom" placeholderTextColor={colors.muted} style={s.input} />
  </View>
);

export const PreviewLabel = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
    <Ionicons name="eye-outline" size={14} color={colors.primary} />
    <Text style={s.previewLabel}>ASSIM APARECE NO CAPÍTULO</Text>
  </View>
);

/* ---------- capas ---------- */
export function Mosaic({ images = [], style }) {
  const g = { flex: 1, backgroundColor: colors.track };
  const im = (src) => <Image source={img(src)} style={{ width: '100%', height: '100%' }} resizeMode="cover" />;
  const n = images.length;
  return (
    <View style={[{ overflow: 'hidden', backgroundColor: colors.track }, style]}>
      {n === 1 && im(images[0])}
      {n === 2 && (
        <View style={{ flex: 1, flexDirection: 'row', gap: 2 }}>
          <View style={g}>{im(images[0])}</View>
          <View style={g}>{im(images[1])}</View>
        </View>
      )}
      {n === 3 && (
        <View style={{ flex: 1, flexDirection: 'row', gap: 2 }}>
          <View style={g}>{im(images[0])}</View>
          <View style={{ flex: 1, gap: 2 }}>
            <View style={g}>{im(images[1])}</View>
            <View style={g}>{im(images[2])}</View>
          </View>
        </View>
      )}
      {n >= 4 && (
        <View style={{ flex: 1, gap: 2 }}>
          <View style={{ flex: 1, flexDirection: 'row', gap: 2 }}>
            <View style={g}>{im(images[0])}</View>
            <View style={g}>{im(images[1])}</View>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', gap: 2 }}>
            <View style={g}>{im(images[2])}</View>
            <View style={g}>{im(images[3])}</View>
          </View>
        </View>
      )}
    </View>
  );
}

// Capa da história: usa as imagens ou um degradê quando não houver nenhuma
export function Cover({ story, style, children }) {
  const hasImgs = story.images && story.images.length > 0;
  return (
    <View style={[{ overflow: 'hidden', borderRadius: radius.md, backgroundColor: colors.track }, style]}>
      {hasImgs ? (
        <Mosaic images={story.images} style={StyleSheet.absoluteFill} />
      ) : (
        <LinearGradient colors={['#B79BE0', '#7855B5']} style={StyleSheet.absoluteFill} />
      )}
      {children}
    </View>
  );
}

export function StoryTile({ story, onPress, meta }) {
  return (
    <TouchableOpacity style={{ flex: 1 }} onPress={onPress} activeOpacity={0.8}>
      <Cover story={story} style={{ aspectRatio: 1.25 }} />
      <Text style={s.tileTitle} numberOfLines={2}>{story.title}</Text>
      <Text style={s.tileMeta} numberOfLines={1}>{meta ?? `${story.author} · ${story.genre}`}</Text>
    </TouchableOpacity>
  );
}

// Grade de 2 colunas
export function Grid({ items, render }) {
  const rows = [];
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));
  return (
    <View>
      {rows.map((r, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
          {r.map((it) => <View key={it.id} style={{ flex: 1 }}>{render(it)}</View>)}
          {r.length === 1 ? <View style={{ flex: 1 }} /> : null}
        </View>
      ))}
    </View>
  );
}

/* ---------- seletor em folha (filtros) ---------- */
export function PickerSheet({ visible, title, options, value, onPick, onClose }) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={s.overlay} onPress={onClose}>
        <Pressable style={s.sheet}>
          <Text style={[s.h3, { marginBottom: 10 }]}>{title}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {options.map((o) => (
              <Chip key={o} label={o} active={value === o} onPress={() => { onPick(o); onClose(); }} />
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export const s = StyleSheet.create({
  appbar: { backgroundColor: '#fff', paddingHorizontal: 18, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  logo: { fontFamily: fonts.title, fontSize: 20, color: colors.text },
  bell: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  h1: { fontFamily: fonts.title, fontSize: 28, color: colors.text },
  h3: { fontFamily: fonts.semi, fontSize: 15, color: colors.text },
  sub: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, marginTop: 4, lineHeight: 19 },
  muted: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
  link: { fontFamily: fonts.semi, fontSize: 12, color: colors.primary },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 10 },
  backbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  card: { backgroundColor: '#fff', borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14, marginBottom: 14 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff' },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontFamily: fonts.medium, fontSize: 12, color: colors.text },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 13, paddingHorizontal: 16, borderRadius: radius.md, borderWidth: 1, borderColor: colors.primary },
  btnText: { fontFamily: fonts.semi, fontSize: 14 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, backgroundColor: colors.primarySoft },
  badgeText: { fontFamily: fonts.semi, fontSize: 11, color: colors.primary },
  label: { fontFamily: fonts.semi, fontSize: 12, color: colors.text, marginBottom: 6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, minHeight: 46 },
  input: { flex: 1, fontFamily: fonts.body, fontSize: 14, color: colors.text, paddingVertical: 10 },
  previewLabel: { fontFamily: fonts.semi, fontSize: 11, color: colors.primary, marginLeft: 6, letterSpacing: 0.3 },
  tileTitle: { fontFamily: fonts.title, fontSize: 15, color: colors.text, marginTop: 8 },
  tileMeta: { fontFamily: fonts.body, fontSize: 11, color: colors.muted, marginTop: 2 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', padding: 20, paddingBottom: 36, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
});
