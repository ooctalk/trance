import { Drawer } from 'expo-router/drawer';
import {
    AudioLinesIcon, BookUserIcon, BotIcon, InfoIcon, LibraryIcon, MessageCircleIcon, RegexIcon,
    SettingsIcon, UserIcon, WandIcon
} from 'lucide-react-native';

import i18n from '@/languages/i18n';

export default function RootDrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        swipeEdgeWidth: 768,
        drawerStyle: {
          width: 240,
          backgroundColor: "#fafafa",
          borderTopEndRadius: 0,
          borderBottomEndRadius: 0,
        },
      }}
    >
      <Drawer.Screen
        name="my"
        options={{
          title: i18n.t("RootDrawer.my"),
          drawerIcon: ({ color }) => <UserIcon color={color} size={24} />,
        }}
      />
      <Drawer.Screen
        name="resonance"
        options={{
          title: i18n.t("RootDrawer.resonance"),
          drawerIcon: ({ color }) => <AudioLinesIcon color={color} size={24} />,
        }}
      />
      <Drawer.Screen
        name="messages"
        options={{
          title: i18n.t("RootDrawer.messages"),
          drawerIcon: ({ color }) => (
            <MessageCircleIcon color={color} size={24} />
          ),
        }}
      />
      <Drawer.Screen
        name="characters"
        options={{
          title: i18n.t("RootDrawer.characters"),
          drawerIcon: ({ color }) => <BookUserIcon color={color} size={24} />,
        }}
      />
      <Drawer.Screen
        name="library"
        options={{
          title: i18n.t("RootDrawer.library"),
          drawerIcon: ({ color }) => <LibraryIcon color={color} size={24} />,
        }}
      />
      <Drawer.Screen
        name="prompts"
        options={{
          title: i18n.t("RootDrawer.prompts"),
          drawerIcon: ({ color }) => <WandIcon color={color} size={24} />,
        }}
      />
      <Drawer.Screen
        name="regex"
        options={{
          title: i18n.t("RootDrawer.regex"),
          drawerIcon: ({ color }) => <RegexIcon color={color} size={24} />,
        }}
      />
      <Drawer.Screen
        name="models"
        options={{
          title: i18n.t("RootDrawer.models"),
          drawerIcon: ({ color }) => <BotIcon color={color} size={24} />,
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: i18n.t("RootDrawer.settings"),
          drawerIcon: ({ color }) => <SettingsIcon color={color} size={24} />,
        }}
      />
      <Drawer.Screen
        name="about"
        options={{
          title: i18n.t("RootDrawer.about"),
          drawerIcon: ({ color }) => <InfoIcon color={color} size={24} />,
        }}
      />
    </Drawer>
  );
}
