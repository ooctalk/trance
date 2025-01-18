import 'react-native-get-random-values';

import { Buffer } from 'buffer';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { Asset } from 'expo-asset';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { router, Stack } from 'expo-router';
import { openDatabaseSync } from 'expo-sqlite';
import { atom, useAtom } from 'jotai';
import { atomWithReset, useResetAtom } from 'jotai/utils';
import { ImportIcon } from 'lucide-react-native';
import text from 'png-chunk-text';
import extract from 'png-chunks-extract';
import React, { useEffect } from 'react';
import { v7 as uuidv7 } from 'uuid';

import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { CharacterTable } from '@/db/schema';
import i18n from '@/languages/i18n';

const db = drizzle(openDatabaseSync("trance.db"));

const specificationAtom = atomWithReset("trance_character_card_v1");
const versionAtom = atomWithReset("");
const nameAtom = atomWithReset("trance | OoCTalk");
const coverAtom = atomWithReset("");
const creatorAtom = atomWithReset("");
const creatorNotesAtom = atomWithReset("");
const descriptionAtom = atomWithReset("");
const prologueAtom = atomWithReset<string[]>([]);

const tranceCharacterAtom = atom((get) => ({
  specification: get(specificationAtom),
  name: get(nameAtom),
  cover: get(coverAtom),
  creator: get(creatorAtom),
  creatorNotes: get(creatorNotesAtom),
  description: get(descriptionAtom),
  prologue: get(prologueAtom),
}));

export default function ImportCharacterScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: i18n.t("Characters.import_character"),
          headerRight: () => {
            return <ImportCharacter />;
          },
        }}
      />
      <Box>
        <Card className="p-6 rounded-lg m-3 gap-y-4">
          <Box className="flex-row">
            <CharacterCover />
            <VStack className="flex-1 mx-4">
              <CharacterName />
              <CharacterCreator />
              <CharacterVersion />
              <CharacterCreatorNotes />
            </VStack>
          </Box>
          <SaveButton />
        </Card>
      </Box>
    </>
  );
}

function ImportCharacter() {
  const [, setVersion] = useAtom(versionAtom);
  const [, setCover] = useAtom(coverAtom);
  const [, setName] = useAtom(nameAtom);
  const [, setCreator] = useAtom(creatorAtom);
  const [, setCreatorNotes] = useAtom(creatorNotesAtom);
  const [, setDescription] = useAtom(descriptionAtom);
  const [, setPrologue] = useAtom(prologueAtom);

  const handleImportCharacterPng = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/png",
      });

      if (!result.canceled && result.assets?.length > 0) {
        const uri = result.assets[0].uri;
        const { exists } = await FileSystem.getInfoAsync(uri);
        if (!exists) throw new Error("File does not exist");
        const coverBase64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setCover(`data:image/png;base64,${coverBase64}`);
        const uint8 = new Uint8Array(
          Buffer.from(
            await FileSystem.readAsStringAsync(uri, {
              encoding: FileSystem.EncodingType.Base64,
            }),
            "base64"
          )
        );
        const charaText = extract(uint8)
          .filter((chunk: { name: string }) => chunk.name === "tEXt")
          .map((chunk: any) => text.decode(chunk))
          .find((chara: any) => chara)?.text;
        const charaData = charaText
          ? new TextDecoder("utf-8").decode(
              Uint8Array.from(atob(charaText), (c) => c.charCodeAt(0))
            )
          : null;
        if (!charaData) {
          throw new Error("No Character Data");
        }
        const charaJson = JSON.parse(charaData);

        if (
          charaJson?.spec &&
          (charaJson.spec === "chara_card_v2" ||
            charaJson.spec === "chara_card_v3")
        ) {
          setVersion(charaJson.data.character_version);
          setName(charaJson.data.name);
          setDescription(charaJson.data.description);
          setCreator(charaJson.data.creator),
            setCreatorNotes(charaJson.data.creator_notes);
          let tempPrologue: string[] = [charaJson.data.first_mes];
          if (charaJson.data.alternate_greetings.length > 0) {
            tempPrologue = [
              ...tempPrologue,
              ...charaJson.data.alternate_greetings,
            ];
            setPrologue(tempPrologue);
          }
        } else {
          console.log("Invalid or missing spec:", charaJson?.spec);
        }
      }
    } catch (e) {
      throw e
    }
  };

  return (
    <Button onPress={handleImportCharacterPng} variant="link">
      <ButtonIcon as={ImportIcon} />
    </Button>
  );
}

function CharacterName() {
  const [name] = useAtom(nameAtom);
  return <Heading>{name}</Heading>;
}

function CharacterCover() {
  const [cover, setCover] = useAtom(coverAtom);

  useEffect(() => {
    const loadCoverAsBase64 = async () => {
      try {
        const asset = Asset.fromModule(
          require("@/assets/images/tranceCharacter.png")
        );
        await asset.downloadAsync();
        const base64Image = await FileSystem.readAsStringAsync(
          asset.localUri || asset.uri,
          {
            encoding: FileSystem.EncodingType.Base64,
          }
        );
        setCover(`data:image/png;base64,${base64Image}`);
      } catch (e) {
        throw e
      }
    };
    loadCoverAsBase64();
  }, []);

  return (
    <>
      {cover ? (
        <Image className="w-40 h-64" source={cover} alt="Character Cover" />
      ) : (
        <Skeleton className="w-40 h-64" />
      )}
    </>
  );
}

function CharacterCreator() {
  const [creator] = useAtom(creatorAtom);
  return <Text>{creator}</Text>;
}

function CharacterVersion() {
  const [version] = useAtom(versionAtom);
  return <Text>{version}</Text>;
}

function CharacterCreatorNotes() {
  const [creatorNotes] = useAtom(creatorNotesAtom);
  return <Text className="text-wrap">{creatorNotes}</Text>;
}

function SaveButton() {
  const [tranceCharacter] = useAtom(tranceCharacterAtom);
  const resetVersionAtom = useResetAtom(versionAtom);
  const resetNameAtom = useResetAtom(nameAtom);
  const resetCoverAtom = useResetAtom(coverAtom);
  const resetCreatorAtom = useResetAtom(creatorAtom);
  const resetCreatorNotesAtom = useResetAtom(creatorNotesAtom);
  const resetDescriptionAtom = useResetAtom(descriptionAtom);
  const resetPrologueAtom = useResetAtom(prologueAtom);
  const handleSave = async () => {
    try {
      const result = await db.insert(CharacterTable).values({
        character_uuid: uuidv7(),
        specification: tranceCharacter.specification,
        name: tranceCharacter.name,
        cover: tranceCharacter.cover,
        creator: tranceCharacter.creator,
        creator_notes: tranceCharacter.creatorNotes,
        description:tranceCharacter.description,
        prologue: tranceCharacter.prologue,
      });
      if ((result.lastInsertRowId, result.changes)) {
        router.push("/(drawer)/characters");
        resetVersionAtom();
        resetNameAtom();
        resetCoverAtom();
        resetCreatorAtom();
        resetCreatorNotesAtom();
        resetDescriptionAtom();
        resetPrologueAtom();
      } else {
        alert("Error");
        return;
      }
    } catch (e) {
      throw e
    }
  };
  return (
    <Button onPress={handleSave} variant="solid">
      <ButtonText>{i18n.t("Save")}</ButtonText>
    </Button>
  );
}
