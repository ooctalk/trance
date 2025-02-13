import { Stack } from 'expo-router/stack';

export default function CharacterLayout() {
  return (
    <Stack>
      <Stack.Screen name="details/[id]" />
    </Stack>
  );
}
