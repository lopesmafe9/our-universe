# our universe — protótipo em Expo (React Native)

Feito a partir das telas do Figma "app fic au". Tudo em JavaScript, sem backend:
os dados ficam no aparelho (AsyncStorage) e começam com histórias de exemplo.

## Como rodar (5 passos)

1. Instale o Node.js (versão LTS): https://nodejs.org
2. No terminal, crie um projeto Expo em branco:

       npx create-expo-app@latest our-universe --template blank
       cd our-universe

3. Copie para dentro dessa pasta (substituindo o que existir):
   `App.js`, a pasta `src/` e a pasta `assets/` deste zip.
4. Instale as dependências (o `expo install` escolhe as versões certas):

       npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage expo-linear-gradient expo-image-picker expo-font @expo-google-fonts/lora @expo-google-fonts/inter @expo/vector-icons

5. Rode:

       npx expo start

   Abra o app **Expo Go** no celular e leia o QR code (celular e PC na mesma rede Wi-Fi).
   Também funciona com `a` (emulador Android) ou `i` (simulador iOS, só no Mac).

## O que já funciona

- Login e cadastro (com validação; qualquer login válido entra — é protótipo)
- Biblioteca: busca, abas Todos/Lendo/Favoritos, filtro por gênero, destaque e "Lendo agora"
- Descobrir: busca, Shipp/Fandom, tags, filtro por gênero
- Detalhe da AU: sobre, índice de capítulos (Lido/Atual/Próximo), favoritar
- Leitura contínua: chat, narração e tweet do capítulo, barra de progresso, botão Continuar
- Atualizações: lista e preferências (salvas)
- Perfil: editar perfil, publicadas e rascunhos, nova história, sair da conta
- Editor: formato AU/Fanfic, capítulos, adicionar/ordenar/remover blocos
- Editar narração (negrito/itálico/sublinhado/alinhar/lista/desfazer + prévia)
- Editar chat (quem fala, lado, mensagens), editar tweet (autor, métricas, prévia)
- Editar capa: mosaico de 1 a 4 imagens, escolher da galeria do celular, substituir, reordenar
- Editor de fanfic (só narração)

## Formatação de texto

Na narração, o texto usa marcas simples: `**negrito**`, `_itálico_`, `++sublinhado++`.
Os botões B / I / U inserem essas marcas no trecho selecionado, e a prévia mostra formatado.

## Ainda não incluído (próximos passos)

- Blocos de mídia, imagem/áudio/reação nas mensagens do chat
- Login de verdade e publicar para outros usuários (precisa de backend, ex.: Supabase/Firebase)
- Arrastar para reordenar (hoje usa setas)
