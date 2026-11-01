import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialState, uid, pad } from './data';

const KEY = 'our-universe-state-v1';
const Ctx = createContext(null);

export function StoreProvider({ children }) {
  const [state, setState] = useState(initialState);
  const [ready, setReady] = useState(false);

  // carrega o que foi salvo no aparelho
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setState({ ...initialState, ...JSON.parse(raw) });
      } catch (e) {}
      setReady(true);
    })();
  }, []);

  // salva a cada mudança
  useEffect(() => {
    if (ready) AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
  }, [state, ready]);

  const api = useMemo(() => {
    const mapStory = (id, fn) =>
      setState((s) => ({ ...s, stories: s.stories.map((st) => (st.id === id ? fn(st) : st)) }));
    const mapChapter = (sid, cid, fn) =>
      mapStory(sid, (st) => ({ ...st, chapters: st.chapters.map((c) => (c.id === cid ? fn(c) : c)) }));

    return {
      state,
      ready,
      getStory: (id) => state.stories.find((s) => s.id === id),
      getChapter: (sid, cid) => state.stories.find((s) => s.id === sid)?.chapters.find((c) => c.id === cid),
      getBlock: (sid, cid, bid) =>
        state.stories.find((s) => s.id === sid)?.chapters.find((c) => c.id === cid)?.blocks.find((b) => b.id === bid),

      login: (data) => setState((s) => ({ ...s, auth: { loggedIn: true }, user: { ...s.user, ...data } })),
      logout: () => setState((s) => ({ ...s, auth: { loggedIn: false } })),
      setUser: (patch) => setState((s) => ({ ...s, user: { ...s.user, ...patch } })),
      setPref: (k, v) => setState((s) => ({ ...s, prefs: { ...s.prefs, [k]: v } })),
      toggleFav: (id) =>
        setState((s) => ({
          ...s,
          favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id],
        })),

      setProgress: (id, idx) => mapStory(id, (st) => ({ ...st, progress: idx })),
      patchStory: (id, patch) => mapStory(id, (st) => ({ ...st, ...patch })),
      setEditorTarget: (storyId, chapterId) =>
        setState((s) => {
          const st = s.stories.find((x) => x.id === storyId);
          return { ...s, editorTarget: { storyId, chapterId: chapterId || st?.chapters[0]?.id } };
        }),

      patchBlock: (sid, cid, bid, patch) =>
        mapChapter(sid, cid, (c) => ({ ...c, blocks: c.blocks.map((b) => (b.id === bid ? { ...b, ...patch } : b)) })),
      addBlock: (sid, cid, block) => mapChapter(sid, cid, (c) => ({ ...c, blocks: [...c.blocks, block] })),
      removeBlock: (sid, cid, bid) => mapChapter(sid, cid, (c) => ({ ...c, blocks: c.blocks.filter((b) => b.id !== bid) })),
      moveBlock: (sid, cid, bid, dir) =>
        mapChapter(sid, cid, (c) => {
          const i = c.blocks.findIndex((b) => b.id === bid);
          const j = i + dir;
          if (i < 0 || j < 0 || j >= c.blocks.length) return c;
          const blocks = [...c.blocks];
          [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
          return { ...c, blocks };
        }),
      addChapter: (sid) =>
        mapStory(sid, (st) => {
          const n = st.chapters.length + 1;
          return {
            ...st,
            chapters: [
              ...st.chapters,
              { id: 'c' + uid(), title: `Capítulo ${pad(n)}`, kind: 'Narração', minutes: 5, blocks: [{ id: uid(), type: 'narration', text: '', align: 'left' }] },
            ],
          };
        }),

      newStory: () => {
        const id = 's' + uid();
        setState((s) => ({
          ...s,
          stories: [
            ...s.stories,
            {
              id, title: 'Nova história', author: s.user.username, genre: 'Romance', ship: '', fandom: '',
              tags: [], about: '', images: [], format: 'AU', status: 'draft', mine: true, editedAgo: 'Editado agora',
              characters: [{ id: 'me', name: s.user.name, mine: true, color: '#7855B5', displayName: s.user.name, handle: '@' + s.user.username }],
              chapters: [{ id: 'c1', title: 'Capítulo 01', kind: 'Narração', minutes: 5, blocks: [{ id: uid(), type: 'narration', text: '', align: 'left' }] }],
            },
          ],
          editorTarget: { storyId: id, chapterId: 'c1' },
        }));
        return id;
      },
    };
  }, [state, ready]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);
