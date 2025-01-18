import { drizzle } from 'drizzle-orm/expo-sqlite';
import { router, Stack } from 'expo-router';
import { openDatabaseSync } from 'expo-sqlite';
import { atom, useAtom } from 'jotai';
import React, { useEffect } from 'react';
import { Pressable } from 'react-native';

import { Box } from '@/components/ui/box';
import { Button, ButtonIcon } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { AddIcon, ArrowRightIcon, Icon } from '@/components/ui/icon';
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';
import { Skeleton } from '@/components/ui/skeleton';
import { VStack } from '@/components/ui/vstack';
import { PromptTable } from '@/db/schema';
import i18n from '@/languages/i18n';
import { IPromptsScreenLists } from '@/store/definition';

const db = drizzle(openDatabaseSync("trance.db"));

const promptListsAtom = atom<IPromptsScreenLists[]>([]);

export default function PromptsScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => {
            return <HeaderMenu />;
          },
        }}
      />
      <Box className="m-4">
      <PromptGrpupLists />
      </Box>

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
        onPress={() => router.push("/(prompts)/importPrompt")}
        key="Add account"
        textValue="Add account"
      >
        <Icon as={AddIcon} size="sm" className="mr-2" />
        <MenuItemLabel size="sm">
          {i18n.t("Prompts.import_prompt")}
        </MenuItemLabel>
      </MenuItem>
    </Menu>
  );
}

function PromptGrpupLists() {
  const [promptLists, setPromptLists] = useAtom(promptListsAtom);
  useEffect(() => {
    (async () => {
      try {
        const rows = await db
          .select({
            id: PromptTable.id,
            prompt_uuid: PromptTable.prompt_uuid,
            name: PromptTable.name,
          })
          .from(PromptTable);
        if (rows) {
          setPromptLists(rows);
        }
      } catch (e) {
        throw e;
      }
    })();
  }, []);
  return (
    <Box>
      {promptLists ? (
        <Box className="gap-y-4">
          {promptLists.map((list) => (
            <Pressable key={list.id} onPress={()=> router.push(`/(prompts)/promptDetails/${list.id}`)}>
              <Card size="md" variant="elevated">
                <HStack className="justify-between items-center">
                <Heading>{list.name}</Heading>
                <Icon as={ArrowRightIcon} />
                </HStack>
        
              </Card>
            </Pressable>
          ))}
        </Box>
      ) : (
        <Box>
          <Skeleton className="h-24" />
        </Box>
      )}
    </Box>
  );
}
