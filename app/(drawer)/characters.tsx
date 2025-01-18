import { drizzle } from 'drizzle-orm/expo-sqlite';
import { router, Stack } from 'expo-router';
import { openDatabaseSync } from 'expo-sqlite';
import { atom, useAtom } from 'jotai';
import React, { useEffect } from 'react';
import { Pressable, ScrollView } from 'react-native';

import { Box } from '@/components/ui/box';
import { Button, ButtonIcon } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { AddIcon, Icon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { CharacterTable } from '@/db/schema';
import i18n from '@/languages/i18n';
import { ICharactersScreenCharacterLists } from '@/store/definition';

const db = drizzle(openDatabaseSync("trance.db"));

const characterListAtom = atom<ICharactersScreenCharacterLists[]>([]);

export default function CharactersScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => {
            return <HeaderMenu />;
          },
        }}
      />
      <ScrollView>
        <CharacterLists />
      </ScrollView>
    </>
  );
}

function HeaderMenu() {
  return (
    <Menu
      placement="bottom right"
      offset={5}
      disabledKeys={["Settings"]}
      trigger={({ ...triggerProps }) => {
        return (
          <Button className="mx-4" variant="link" {...triggerProps}>
            <ButtonIcon as={AddIcon} />
          </Button>
        );
      }}
    >
      <MenuItem
        onPress={() => router.push("/(characters)/importCharacter")}
        key="Add account"
        textValue="Add account"
      >
        <Icon as={AddIcon} size="sm" className="mr-2" />
        <MenuItemLabel size="sm">
          {i18n.t("Characters.import_character")}
        </MenuItemLabel>
      </MenuItem>
    </Menu>
  );
}

function initCharacterLists() {
  const [, setLists] = useAtom(characterListAtom);
  useEffect(() => {
    (async () => {
      try {
        const rows = await db
          .select({
            id: CharacterTable.id,
            character_uuid: CharacterTable.character_uuid,
            version: CharacterTable.version,
            name: CharacterTable.name,
            cover: CharacterTable.cover,
            creator: CharacterTable.creator,
            creator_notes: CharacterTable.creator_notes,
          })
          .from(CharacterTable);
        if (rows) {
          setLists(rows);
        }
      } catch (e) {
        throw e;
      }
    })();
  }, []);
}

function CharacterLists() {
  const [lists] = useAtom(characterListAtom);
  initCharacterLists();
  return (
    <Box>
      {lists ? (
        lists.map((list) => {
          return (
            <Pressable
              onPress={() =>
                router.push(`/(characters)/characterDetails/${list.id}`)
              }
              key={list.id}
              className="h-24 mx-4 mt-2 rounded-2xl overflow-hidden bg-white shadow-md border border-neutral-200"
            >
              <HStack className="flex-1" space="md">
                <Image
                  source={list.cover}
                  alt={list.name}
                  className="bg-gray-400 h-full w-24"
                />
                <VStack className="flex-1">
                  <Heading>{list.name}</Heading>
                  <Text>{list.creator}</Text>
                </VStack>
              </HStack>
            </Pressable>
          );
        })
      ) : (
        <Box className="mx-4 mt-2 rounded-2xl overflow-hidden">
          <Skeleton className="h-24" />
        </Box>
      )}
    </Box>
  );
}
