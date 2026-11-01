import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius } from '../theme';
import { Avatar } from './ui';

/* ---------- texto rico simples ----------
   **negrito**   _itálico_   ++sublinhado++                           */
export function RichText({ text, style, align = 'left' }) {
  const parts = (text || '').split(/(\*\*[^*]+\*\*|_[^_]+_|\+\+[^+]+\+\+)/g).filter((p) => p !== '');
  return (
    <Text style={[{ fontFamily: fonts.body, fontSize: 14, lineHeight: 22, color: colors.text, textAlign: align }, style]}>
      {parts.map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**') && p.length > 4) return <Text key={i} style={{ fontFamily: fonts.bold }}>{p.slice(2, -2)}</Text>;
        if (p.startsWith('++') && p.endsWith('++') && p.length > 4) return <Text key={i} style={{ textDecorationLine: 'underline' }}>{p.slice(2, -2)}</Text>;
        if (p.startsWith('_') && p.endsWith('_') && p.length > 2) return <Text key={i} style={{ fontStyle: 'italic' }}>{p.slice(1, -1)}</Text>;
        return <Text key={i}>{p}</Text>;
      })}
    </Text>
  );
}

/* ---------- editor com barra de formatação ---------- */
export function RichEditor({ value, onChange, align, onAlign, minHeight = 200 }) {
  const sel = useRef({ start: 0, end: 0 });
  const history = useRef([]);

  const change = (t) => {
    history.current.push(value);
    onChange(t);
  };

  const wrap = (m) => {
    const { start, end } = sel.current;
    if (start === end) return;
    const before = value.slice(0, start);
    const mid = value.slice(start, end);
    const after = value.slice(end);
    if (before.endsWith(m) && after.startsWith(m)) change(before.slice(0, -m.length) + mid + after.slice(m.length));
    else change(before + m + mid + m + after);
  };

  const toggleList = () => {
    const { start, end } = sel.current;
    const ls = value.lastIndexOf('\n', start - 1) + 1;
    let le = value.indexOf('\n', end);
    if (le === -1) le = value.length;
    const lines = value.slice(ls, le).split('\n');
    const all = lines.every((l) => l.startsWith('• '));
    const next = lines.map((l) => (all ? l.slice(2) : l.startsWith('• ') ? l : '• ' + l)).join('\n');
    change(value.slice(0, ls) + next + value.slice(le));
  };

  const undo = () => {
    if (history.current.length) onChange(history.current.pop());
  };

  const Tool = ({ icon, label, style, onPress, active }) => (
    <TouchableOpacity onPress={onPress} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, backgroundColor: active ? colors.primarySoft : 'transparent' }}>
      {label ? <Text style={[{ fontSize: 16, color: colors.text, fontFamily: fonts.semi }, style]}>{label}</Text> : <Ionicons name={icon} size={18} color={colors.text} />}
    </TouchableOpacity>
  );

  const words = value.split(/\s+/).filter(Boolean).length;

  return (
    <View style={{ borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, overflow: 'hidden', backgroundColor: '#fff' }}>
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.primaryFaint }}>
        <Tool label="B" style={{ fontFamily: fonts.bold }} onPress={() => wrap('**')} />
        <Tool label="I" style={{ fontStyle: 'italic' }} onPress={() => wrap('_')} />
        <Tool label="U" style={{ textDecorationLine: 'underline' }} onPress={() => wrap('++')} />
        <Tool icon={align === 'center' ? 'reorder-two-outline' : 'reorder-three-outline'} onPress={() => onAlign(align === 'center' ? 'left' : 'center')} active={align === 'center'} />
        <Tool icon="list-outline" onPress={toggleList} />
        <Tool icon="arrow-undo-outline" onPress={undo} />
      </View>
      <TextInput
        multiline
        value={value}
        onChangeText={change}
        onSelectionChange={(e) => (sel.current = e.nativeEvent.selection)}
        textAlignVertical="top"
        style={{ minHeight, padding: 12, fontFamily: fonts.body, fontSize: 14, lineHeight: 22, color: colors.text, textAlign: align }}
        placeholder="Escreva aqui..."
        placeholderTextColor={colors.muted}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
        <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.muted }}>Selecione um trecho para formatar o texto.</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.muted }}>{words} palavras</Text>
      </View>
    </View>
  );
}

/* ---------- balões de chat ---------- */
export function Bubble({ msg, story, selected, onPress }) {
  const ch = story.characters.find((c) => c.id === msg.charId) || { name: '?', color: colors.muted };
  const right = msg.side === 'right';
  return (
    <Pressable onPress={onPress} style={{ alignSelf: right ? 'flex-end' : 'flex-start', maxWidth: '90%', marginBottom: 10 }}>
      <View style={{ flexDirection: right ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 6 }}>
        <Avatar name={ch.name} color={ch.color} size={26} />
        <View style={{ flexShrink: 1 }}>
          <View style={{
            backgroundColor: right ? '#EBE2F6' : colors.primaryFaint, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 9,
            borderWidth: selected ? 1 : 0, borderColor: colors.primary,
          }}>
            <Text style={{ fontFamily: fonts.body, fontSize: 14, color: colors.text, lineHeight: 20 }}>{msg.text || '…'}</Text>
          </View>
          <Text style={{ fontFamily: fonts.body, fontSize: 10, color: colors.muted, marginTop: 3, textAlign: right ? 'right' : 'left' }}>
            {ch.name}{ch.mine ? ' (eu)' : ''} · {msg.time}{selected ? ' · Em edição' : ''}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export function ChatPreview({ story, messages, selectedId, onSelect }) {
  return (
    <View>
      {messages.map((m) => (
        <Bubble key={m.id} msg={m} story={story} selected={m.id === selectedId} onPress={onSelect ? () => onSelect(m.id) : undefined} />
      ))}
    </View>
  );
}

/* ---------- tweet ---------- */
export function TweetCard({ block, story }) {
  const ch = story.characters.find((c) => c.id === block.charId) || story.characters[0];
  return (
    <View style={{ backgroundColor: '#fff', borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Avatar name={ch.name} color={ch.color} size={34} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: colors.text }}>{ch.displayName}</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.muted }}>{ch.handle}</Text>
        </View>
        <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.muted }}>{block.time}</Text>
      </View>
      <Text style={{ fontFamily: fonts.body, fontSize: 14, color: colors.text, marginVertical: 10 }}>{block.text}</Text>
      <View style={{ flexDirection: 'row', gap: 18 }}>
        <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.muted }}>♡ {block.likes} curtidas</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.muted }}>⟲ {block.retweets} retuítes</Text>
      </View>
    </View>
  );
}

// Renderiza qualquer bloco do capítulo
export function BlockView({ block, story }) {
  if (block.type === 'chat') return <ChatPreview story={story} messages={block.messages} />;
  if (block.type === 'tweet') return <TweetCard block={block} story={story} />;
  return <RichText text={block.text} align={block.align} />;
}
