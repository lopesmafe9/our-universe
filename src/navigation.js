import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator } from 'react-native';
import { colors, fonts } from './theme';
import { useStore } from './store';

import { Login, Signup } from './screens/Auth';
import Library from './screens/Library';
import Discover from './screens/Discover';
import StoryDetail from './screens/StoryDetail';
import Reader from './screens/Reader';
import Updates from './screens/Updates';
import Profile from './screens/Profile';
import EditorHome from './screens/EditorHome';
import EditNarration from './screens/EditNarration';
import EditChat from './screens/EditChat';
import EditTweet from './screens/EditTweet';
import EditCover from './screens/EditCover';

const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.bg, primary: colors.primary } };
const opts = { headerShown: false, animation: 'slide_from_right' };

// telas que podem ser abertas a partir de qualquer aba
const shared = (S) => (
  <>
    <S.Screen name="StoryDetail" component={StoryDetail} />
    <S.Screen name="Reader" component={Reader} />
    <S.Screen name="Updates" component={Updates} />
    <S.Screen name="EditNarration" component={EditNarration} />
    <S.Screen name="EditChat" component={EditChat} />
    <S.Screen name="EditTweet" component={EditTweet} />
    <S.Screen name="EditCover" component={EditCover} />
  </>
);

const mkStack = (rootName, Root) => {
  const S = createNativeStackNavigator();
  return function StackNav() {
    return (
      <S.Navigator screenOptions={opts}>
        <S.Screen name={rootName} component={Root} />
        {shared(S)}
      </S.Navigator>
    );
  };
};

const LibraryStack = mkStack('Library', Library);
const DiscoverStack = mkStack('Discover', Discover);
const EditorStack = mkStack('EditorHome', EditorHome);
const ProfileStack = mkStack('Profile', Profile);

const Tabs = createBottomTabNavigator();
const icons = {
  LibraryTab: ['book', 'book-outline', 'Biblioteca'],
  DiscoverTab: ['sparkles', 'sparkles-outline', 'Descobrir'],
  EditorTab: ['chatbubbles', 'chatbubbles-outline', 'Editor'],
  ProfileTab: ['happy', 'happy-outline', 'Perfil'],
};

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11 },
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: colors.border },
        tabBarLabel: icons[route.name][2],
        tabBarIcon: ({ focused, color, size }) => <Ionicons name={icons[route.name][focused ? 0 : 1]} size={size} color={color} />,
      })}
    >
      <Tabs.Screen name="LibraryTab" component={LibraryStack} />
      <Tabs.Screen name="DiscoverTab" component={DiscoverStack} />
      <Tabs.Screen name="EditorTab" component={EditorStack} />
      <Tabs.Screen name="ProfileTab" component={ProfileStack} />
    </Tabs.Navigator>
  );
}

const AuthStack = createNativeStackNavigator();
function AuthNav() {
  return (
    <AuthStack.Navigator screenOptions={opts} initialRouteName="Login">
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Signup" component={Signup} />
    </AuthStack.Navigator>
  );
}

export default function Root() {
  const { state, ready } = useStore();
  if (!ready)
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  return <NavigationContainer theme={theme}>{state.auth.loggedIn ? <MainTabs /> : <AuthNav />}</NavigationContainer>;
}
