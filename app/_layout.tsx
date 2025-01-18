import '@/global.css';

import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { Stack } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';

const db = SQLite.openDatabaseSync("trance.db");
export default function RootLayout() {
  useDrizzleStudio(db);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider mode="light">
        <StatusBar translucent />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          <Stack.Screen name='(models)' options={{ headerShown: false }} />
          <Stack.Screen name='(messages)' options={{ headerShown: false }} />
          <Stack.Screen name='(prompts)' options={{ headerShown: false }} />
          <Stack.Screen name='(characters)' options={{ headerShown: false }} />
        </Stack>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
