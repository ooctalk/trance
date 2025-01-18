import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { Stack, useLocalSearchParams } from 'expo-router';
import { openDatabaseSync } from 'expo-sqlite';
import { atom, useAtom } from 'jotai';
import React, { useEffect } from 'react';
import { Pressable, ScrollView } from 'react-native';

import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { CloseIcon, Icon } from '@/components/ui/icon';
import {
    Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader
} from '@/components/ui/modal';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { PromptTable } from '@/db/schema';
import i18n from '@/languages/i18n';
import { IPromptsContent } from '@/store/definition';

const db = drizzle(openDatabaseSync("trance.db"));

const promptListsAtom = atom<IPromptsContent[]>();

export default function PromptDetailsScreen() {
  initPrompt();
  return (
    <>
      <Stack.Screen
        options={{
          title: i18n.t("Prompts.prompt_details"),
        }}
      />
      <Box className="flex-1">
        <ScrollView>
          <PromptLists />
        </ScrollView>
      </Box>
    </>
  );
}

function initPrompt() {
  const [promptLists, setPromptListsAtom] = useAtom(promptListsAtom);
  const { id } = useLocalSearchParams();
  const fetchPrompt = async () => {
    try {
      const rows = await db
        .select({ content: PromptTable.content })
        .from(PromptTable)
        .where(eq(PromptTable.id, Number(id)));
      if (!rows) return;
      const prompt = rows[0].content;
      setPromptListsAtom(prompt);
    } catch (e) {
      throw e;
    }
  };
  useEffect(() => {
    fetchPrompt();
  }, []);
}

function PromptLists() {
  const { id } = useLocalSearchParams();
  const [promptLists, setPromptListsAtom] = useAtom(promptListsAtom);

  const handleChangeIsEnabled = async (identifier: string) => {
    try {
      if (!promptLists || typeof promptLists === "undefined") return;

      const targetItem = promptLists.find(
        (item) => item.identifier === identifier
      );
      if (!targetItem) return;

      const updatedItem = {
        ...targetItem,
        is_enabled: !targetItem.is_enabled,
      };
      const newContent = promptLists.map((item) =>
        item.identifier === identifier ? updatedItem : item
      );
      const rows = await db
        .update(PromptTable)
        .set({ content: newContent })
        .where(eq(PromptTable.id, Number(id)));
      if (rows) {
        setPromptListsAtom((prev = []) =>
          prev.map((item) =>
            item.identifier === identifier
              ? { ...item, is_enabled: !item.is_enabled }
              : item
          )
        );
      }
    } catch (e) {
      console.error("Failed to update prompt:", e);
      throw e;
    }
  };
  return (
    <>
      {promptLists ? (
        <VStack space="sm" className="m-4">
          {promptLists.map((list) => (
            <Box key={list.identifier}>
              {list.is_root === true ? (
                <Card className="bg-indigo-600">
                  <HStack className="justify-center">
                    <Heading className="text-white">{list.name}</Heading>
                  </HStack>
                </Card>
              ) : (
                <Card>
                  <HStack className="justify-between items-center">
                    <Text>{list.name}</Text>
                    <Switch
                      value={list.is_enabled}
                      onToggle={() => handleChangeIsEnabled(list.identifier)}
                    />
                  </HStack>
                </Card>
              )}
            </Box>
          ))}
        </VStack>
      ) : (
        <Box className="flex-1 justify-center items-center">
          <Heading>{i18n.t("Loading")}</Heading>
        </Box>
      )}
    </>
  );
}
