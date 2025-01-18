import { Stack } from 'expo-router/stack';

export default function MessagesLayout() {
  return (
    <Stack>
      <Stack.Screen name="chatroom/[id]" />
      <Stack.Screen name="chatroomDetails/[id]" />
    </Stack>
  );
}
