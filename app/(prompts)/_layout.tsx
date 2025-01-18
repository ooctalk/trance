import { Stack } from 'expo-router/stack';

export default function PromptsLayout() {
  return (
    <Stack>
      <Stack.Screen name="promptDetails/[id]" />
      <Stack.Screen name="importPrompt" />
    </Stack>
  );
}
