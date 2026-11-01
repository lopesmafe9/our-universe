// Imagens que vieram do protótipo. Troque pelos seus arquivos quando quiser.
export const ASSETS = {
  'asset:wf1': require('../assets/wf1.png'),
  'asset:wf2': require('../assets/wf2.png'),
  'asset:wf3': require('../assets/wf3.png'),
  'asset:wf4': require('../assets/wf4.png'),
  'asset:rainy': require('../assets/rainy.png'),
  'asset:umbrella': require('../assets/umbrella.png'),
  'asset:rescue': require('../assets/rescue.png'),
};

// Aceita "asset:..." (imagem do app) ou uma URI (foto escolhida na galeria).
export const img = (s) => (typeof s === 'string' && s.startsWith('asset:') ? ASSETS[s] : { uri: s });
