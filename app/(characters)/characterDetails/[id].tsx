import 'react-native-get-random-values';

import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { openDatabaseSync } from 'expo-sqlite';
import { atom, useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { v7 as uuidv7 } from 'uuid';

import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { CircleIcon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { Input, InputField } from '@/components/ui/input';
import {
    Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader
} from '@/components/ui/modal';
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from '@/components/ui/radio';
import { Text } from '@/components/ui/text';
import { CharacterTable, ChatRoomTable, MsgTable } from '@/db/schema';
import i18n from '@/languages/i18n';
import { ICharacter } from '@/store/definition';

const db = drizzle(openDatabaseSync("trance.db"));

const characterAtom = atom<ICharacter>();

export default function CharacterDetailsScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: i18n.t("Characters.character_details"),
        }}
      />
      <Box className="m-4 gap-y-4 flex-1">
        <CharacterDetails />
        <NewChatButton />
        <DeleteButton />
      </Box>
    </>
  );
}

function initDetail() {
  const [lists, setLists] = useAtom(characterAtom);
  const { id } = useLocalSearchParams();
  useEffect(() => {
    (async () => {
      try {
        const rows = await db
          .select()
          .from(CharacterTable)
          .where(eq(CharacterTable.id, Number(id)));
        if (rows) {
          setLists(rows[0] as ICharacter);
        }
      } catch (e) {
        throw e;
      }
    })();
  }, []);
}

function CharacterDetails() {
  initDetail();
  const [lists] = useAtom(characterAtom);

  return (
    <>
      {lists ? (
        <Box className="flex-1">
          <HStack space="sm">
            <Image
              source={lists.cover}
              alt={lists.name}
              className="w-40 h-52"
            />
            <Heading>{lists.name}</Heading>
          </HStack>
        </Box>
      ) : (
        <Box></Box>
      )}
    </>
  );
}

function NewChatButton() {
  const [lists] = useAtom(characterAtom);
  const [showModal, setShowModal] = useState(false);
  const [prologueIndex, setPrologueIndex] = useState(0);
  const [chatRoomName, setChatRoomName] = useState("");
  const handleCreateNewChat = async () => {
    try {
      if (!lists) {
        alert("Lists are not ready yet");
        return;
      }
      if (!lists.prologue) {
        alert("No prologue is currently not supported");
        return;
      }
      const chatRoomRows = await db.insert(ChatRoomTable).values({
        chatroom_uuid: uuidv7(),
        name: chatRoomName,
        cover: lists.cover,
        personnel: lists.character_uuid,
        type: "dialogue",
        info: "",
      });
      const ruuid = await db
        .select({
          chatroom_uuid: ChatRoomTable.chatroom_uuid,
        })
        .from(ChatRoomTable)
        .where(eq(ChatRoomTable.id, chatRoomRows.lastInsertRowId));
      if (ruuid) {
        const msgRows = await db.insert(MsgTable).values({
          msg_uuid: uuidv7(),
          type: "text",
          content: lists.prologue[prologueIndex] || "",
          is_sender: 0,
          role: "assistant",
          chatroom_uuid: ruuid[0].chatroom_uuid,
        });
        if (msgRows) {
          setShowModal(false), router.push("/(drawer)/messages");
        }
      }
    } catch (e) {
      throw e;
    }
  };
  return (
    <Box>
      <Button onPress={() => setShowModal(true)}>
        <ButtonText>{i18n.t("Characters.new_chat")}</ButtonText>
      </Button>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalBody>
            {lists && lists.prologue && lists?.prologue?.length > 0 ? (
              <Box>
                <Heading size="md" className="text-typography-950">
                  {i18n.t("Characters.chatroom_name")}
                </Heading>
                <Input className="my-2">
                  <InputField
                    onChangeText={(value) => setChatRoomName(value)}
                    size="md"
                  />
                </Input>
                <Heading size="md" className="text-typography-950 mb-2">
                  {i18n.t("Characters.choose_prologue")}
                </Heading>
                <RadioGroup onChange={(value) => setPrologueIndex(value)}>
                  {lists.prologue.map((content, index) => (
                    <Radio key={index} value={String(index)} size="md">
                      <RadioIndicator>
                        <RadioIcon as={CircleIcon} />
                      </RadioIndicator>
                      <RadioLabel>
                        {content ? content.slice(0, 16) : ""}
                      </RadioLabel>
                    </Radio>
                  ))}
                </RadioGroup>
              </Box>
            ) : (
              <Box>
                <Text>{i18n.t("no_prologue")}</Text>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => {
                setShowModal(false);
              }}
            >
              <ButtonText>{i18n.t("Cancel")}</ButtonText>
            </Button>
            {chatRoomName && prologueIndex ? (
              <Button onPress={handleCreateNewChat}>
                <ButtonText>{i18n.t("Create")}</ButtonText>
              </Button>
            ) : (
              <Button isDisabled>
                <ButtonText>{i18n.t("Create")}</ButtonText>
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

function DeleteButton() {
  const { id } = useLocalSearchParams();
  const [showModal, setShowModal] = useState(false);
  const handleDeleteCharacter = async () => {
    try {
      const rows = await db
        .delete(CharacterTable)
        .where(eq(CharacterTable.id, Number(id)));
      if (rows) {
        setShowModal(false);
        router.push("/characters");
      } else {
        setShowModal(false);
        throw new Error("Delete Character Error");
      }
    } catch (e) {
      throw e;
    }
  };
  return (
    <Box>
      <Button action="negative" onPress={() => setShowModal(true)}>
        <ButtonText>{i18n.t("Delete")}</ButtonText>
      </Button>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="md" className="text-typography-950">
              {i18n.t("Are_You_Sure")}
            </Heading>
          </ModalHeader>
          <ModalBody>
            <Text size="sm" className="text-typography-500">
              {i18n.t("No_Rollback")}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => {
                setShowModal(false);
              }}
            >
              <ButtonText>{i18n.t("Cancel")}</ButtonText>
            </Button>
            <Button action="negative" onPress={handleDeleteCharacter}>
              <ButtonText>{i18n.t("Delete")}</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
