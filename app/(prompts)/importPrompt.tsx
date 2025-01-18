import 'react-native-get-random-values';

import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { router, Stack } from 'expo-router';
import { openDatabaseSync } from 'expo-sqlite';
import { atom, useAtom } from 'jotai';
import { ImportIcon } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { v7 as uuidv7 } from 'uuid';

import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { PromptTable } from '@/db/schema';
import i18n from '@/languages/i18n';
import { IImportPromptScreenImportData, IImportPromptScreenPrompt } from '@/store/definition';

const db = drizzle(openDatabaseSync("trance.db"));

const promptAtom = atom<IImportPromptScreenPrompt | null>();

export default function ImportPromptScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: i18n.t("Prompts.import_prompt"),
          headerRight: () => {
            return <ImportPrompt />;
          },
        }}
      />
      <PromptPreview />
    </>
  );
}

function ImportPrompt() {
  const [, setPrompt] = useAtom(promptAtom);
  const handleImportPrompt = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
      });
      if (result.canceled) {
        return;
      }
      const uri = result.assets[0].uri;
      const { exists } = await FileSystem.getInfoAsync(uri);
      if (!exists) throw new Error("File does not exist");
      const fileName =
        result.assets[0].name?.replace(/\.json$/, "") || "New Prompts";
      const file = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      const json = JSON.parse(file);

      const data: IImportPromptScreenImportData = {
        name: fileName,
        prompts: json.prompts,
        prompt_order: json.prompt_order.at(-1).order
      };
      if (
        !data.name ||
        !Array.isArray(data.prompts) ||
        !Array.isArray(data.prompt_order) ||
        data.prompts.length === 0
      ) {
        throw new Error("Incorrect file type or empty data");
      }
      const prompt: IImportPromptScreenPrompt = {
        name: data.name,
        prompt_content: data.prompt_order.map((orderItem) => {
          const promptItem = data.prompts.find(
            (p) => p.identifier === orderItem.identifier
          );
          if (!promptItem)
            throw new Error(
              `Cannot find prompt for identifier: ${orderItem.identifier}`
            );

          return {
            identifier: promptItem.identifier,
            name: promptItem.name,
            is_enabled: orderItem.enabled,
            is_root:
                promptItem.identifier === "main"
              || promptItem.identifier === "worldInfoBefore"
              || promptItem.identifier === "charDescription"
              || promptItem.identifier === "charPersonality"
              || promptItem.identifier === "scenario"
              || promptItem.identifier === "enhanceDefinitions"
              || promptItem.identifier === "worldInfoAfter"
              || promptItem.identifier === "dialogueExamples"
              || promptItem.identifier === "chatHistory"
              || promptItem.identifier === "jailbreak",
              
            role: promptItem.role || "system",
            content: promptItem.content || "",
          };
        }),
      };
      setPrompt(prompt);
    } catch (e) {
      console.error("Error:", e);
      throw e;
    }
  };
  return (
    <Button onPress={handleImportPrompt} variant="link">
      <ButtonIcon as={ImportIcon} />
    </Button>
  );
}

function PromptPreview() {
  const [prompt, setPrompt] = useAtom(promptAtom);
  const handleSave = async () => {
    if (!prompt) throw new Error("Prompt no ready");
    try {
      const rows = await db.insert(PromptTable).values({
        prompt_uuid: uuidv7(),
        name: prompt.name,
        content: prompt.prompt_content,
      });
      if (rows) {
        setPrompt(null);
        router.push("/(drawer)/prompts");
      }
    } catch (e) {
      throw e;
    }
  };
  return (
    <>
      {prompt ? (
        <Box className="m-4 flex-1">
          <Heading className="mb-4">{prompt.name}</Heading>
          <Box className="flex-1">
            <ScrollView>
              <Card>
                {prompt.prompt_content.map((list, index) => (
                  <Text key={index}>{list.name}</Text>
                ))}
              </Card>
            </ScrollView>

            <Button onPress={handleSave} className="mt-4">
              <ButtonText>{i18n.t("Save")}</ButtonText>
            </Button>
          </Box>
        </Box>
      ) : (
        <Box className="justify-center items-center h-full">
          <Heading>{i18n.t("No_Data")}</Heading>
        </Box>
      )}
    </>
  );
}
