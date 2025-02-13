import { Drawer } from 'expo-router/drawer';
import { BookUserIcon, BotIcon, InfoIcon, MessageCircleIcon, UserIcon } from 'lucide-react-native';

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        swipeEdgeWidth: 768,
        drawerStyle: {
          width: 300,
          backgroundColor: '#fafafa',
          borderTopEndRadius: 0,
          borderBottomEndRadius: 0,
        },
      }}
    >
      <Drawer.Screen
        name="my"
        options={{
          title: '我的',
          drawerIcon: ({ color }) => <UserIcon color={color} size={24} />,
        }}
      />
      <Drawer.Screen
        name="message"
        options={{
          title: '消息',
          drawerIcon: ({ color }) => <MessageCircleIcon color={color} size={24} />,
        }}
      />
      <Drawer.Screen
        name="character"
        options={{
          title: '角色卡',
          drawerIcon: ({ color }) => <BookUserIcon color={color} size={24} />,
        }}
      />
      <Drawer.Screen
        name="model"
        options={{
          title: '模型',
          drawerIcon: ({ color }) => <BotIcon color={color} size={24} />,
        }}
      />
      <Drawer.Screen
        name="about"
        options={{
          title: '关于 trance',
          drawerIcon: ({ color }) => <InfoIcon color={color} size={24} />,
        }}
      />
    </Drawer>
  );
}
