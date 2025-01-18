import { Stack } from 'expo-router/stack';

export default function CharactersLayout() {
  return (
    <Stack>
      <Stack.Screen name="characterDetails/[id]" />
      <Stack.Screen name="importCharacter" />
    </Stack>
  );
}
