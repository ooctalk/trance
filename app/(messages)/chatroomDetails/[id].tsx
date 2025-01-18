import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { router, Stack, useLocalSearchParams, usePathname } from 'expo-router';
import { openDatabaseSync } from 'expo-sqlite';
import { atom, useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';

import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { ArrowRightIcon, CircleIcon, Icon } from '@/components/ui/icon';
import {
    Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter, ModalHeader
} from '@/components/ui/modal';
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from '@/components/ui/radio';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { ChatRoomTable, MsgTable, PromptTable } from '@/db/schema';
import i18n from '@/languages/i18n';

const db = drizzle(openDatabaseSync("trance.db"));

const chatroomDetailLists = atom();

export default function ChatroomDetailsScreen() {
  initChatroomDetails();
  return (
    <>
      <Stack.Screen
        options={{
          title: i18n.t("Messages.chatroom_details"),
        }}
      />
      <Box className=" m-4 flex-1">
        <ChatroomDetails />
        <DeleteButton />
      </Box>
    </>
  );
}

function initChatroomDetails() {
  const { id } = useLocalSearchParams();
  const [detailLists, setDetailLists] = useAtom(chatroomDetailLists);
  useEffect(() => {
    (async () => {
      try {
        const rows = await db
          .select({
            id: ChatRoomTable.id,
            chatroom_uuid: ChatRoomTable.chatroom_uuid,
            name: ChatRoomTable.name,
            prompt_group_uuid: ChatRoomTable.prompt_uuid,
          })
          .from(ChatRoomTable)
          .where(eq(ChatRoomTable.id, Number(id)));
        if (rows) {
          setDetailLists(rows[0]);
        }
      } catch (e) {
        throw e;
      }
    })();
  }, []);
}

function ChatroomDetails() {
  return (
    <>
      <VStack className="flex-1" space="sm">
        <ChatroomPrompt />
        <ChatroomModel />
      </VStack>
    </>
  );
}

function ChatroomPrompt() {
  const { id } = useLocalSearchParams();
  const [detailLists, setDetailLists] = useAtom(chatroomDetailLists);
  const [showModal, setShowModal] = React.useState(false);
  const [promptUUID, setPromptUUID] = useState<string>();
  const [promptLists, setPromptLists] = useState<
    { id: number; prompt_uuid: string; name: string }[]
  >([]);
  const handleOpenModal = async () => {
    try {
      setShowModal(true);
      const chatroomRows = await db
        .select({
          prompt_uuid: ChatRoomTable.prompt_uuid,
        })
        .from(ChatRoomTable)
        .where(eq(ChatRoomTable.id, Number(id)));
      if (chatroomRows[0].prompt_uuid) {
        setPromptUUID(chatroomRows[0].prompt_uuid);
      }
      const promptRows = await db
        .select({
          id: PromptTable.id,
          prompt_uuid: PromptTable.prompt_uuid,
          name: PromptTable.name,
        })
        .from(PromptTable);

      if (promptRows) {
        setPromptLists(promptRows);
      }
    } catch (e) {
      throw e;
    }
  };
  const handleSave = async () => {
    try {
      const result = await db
        .update(ChatRoomTable)
        .set({
          prompt_uuid: promptUUID,
        })
        .where(eq(ChatRoomTable.id, Number(id)));
      if (result) {
        setShowModal(false);
      }
    } catch (e) {
      throw e;
    }
  };
  return (
    <>
      <Pressable onPress={handleOpenModal}>
        <Card>
          <HStack className="justify-between items-center">
            <Heading>{i18n.t("Messages.chatroom_prompt")}</Heading>
            <Icon as={ArrowRightIcon} />
          </HStack>
        </Card>
      </Pressable>
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
              {i18n.t("Messages.chatroom_prompt")}
            </Heading>
          </ModalHeader>
          {promptLists ? (
            <>
              <ModalBody>
                <RadioGroup
                  value={promptUUID}
                  onChange={(value) => setPromptUUID(value)}
                >
                  {promptLists.map((list) => (
                    <Radio key={list.id} value={list.prompt_uuid} size="md">
                      <RadioIndicator>
                        <RadioIcon as={CircleIcon} />
                      </RadioIndicator>
                      <RadioLabel>{list.name}</RadioLabel>
                    </Radio>
                  ))}
                </RadioGroup>
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
                <Button onPress={handleSave}>
                  <ButtonText>{i18n.t("Save")}</ButtonText>
                </Button>
              </ModalFooter>
            </>
          ) : (
            <>
              <ModalBody></ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

function ChatroomModel() {
  const { id } = useLocalSearchParams();
  const [showModal, setShowModal] = React.useState(false);
  const [chatroomModel, setChatroomModel] = useState<string>("");
  const handleOpenModal = async () => {
    try {
      setShowModal(true);
      const rows = await db
        .select({
          model: ChatRoomTable.model,
        })
        .from(ChatRoomTable)
        .where(eq(ChatRoomTable.id, Number(id)));
      if (rows) {
        setChatroomModel(rows[0].model || "");
      }
    } catch (e) {
      throw e;
    }
  };
  const handleSave = async () => {
    try {
      const result = await db
        .update(ChatRoomTable)
        .set({
          model: chatroomModel,
        })
        .where(eq(ChatRoomTable.id, Number(id)));
      if (result) {
        setShowModal(false);
      }
    } catch (e) {
      throw e;
    }
  };
  return (
    <>
      <Pressable onPress={handleOpenModal}>
        <Card>
          <HStack className="justify-between items-center">
            <Heading>{i18n.t("Messages.chatroom_model")}</Heading>
            <Icon as={ArrowRightIcon} />
          </HStack>
        </Card>
      </Pressable>

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
              {i18n.t("Messages.chatroom_model")}
            </Heading>
          </ModalHeader>
          <ModalBody>
            <RadioGroup
              value={chatroomModel}
              onChange={(value) => setChatroomModel(value)}
            >
              <Radio value="Gemini" size="md">
                <RadioIndicator>
                  <RadioIcon as={CircleIcon} />
                </RadioIndicator>
                <RadioLabel>Gemini</RadioLabel>
              </Radio>
            </RadioGroup>
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
            <Button onPress={handleSave}>
              <ButtonText>{i18n.t("Save")}</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function DeleteButton() {
  const { chatroom_uuid } = useLocalSearchParams();
  const [showModal, setShowModal] = useState(false);
  const handleDeleteCharacter = async () => {
    try {
      const chatroomRows = await db
        .delete(ChatRoomTable)
        .where(eq(ChatRoomTable.chatroom_uuid, chatroom_uuid as string));
      const msgRows = await db
        .delete(MsgTable)
        .where(eq(MsgTable.chatroom_uuid, chatroom_uuid as string));
      if (!chatroomRows) return "!ERROR_DELETE_CHATROOM";
      if (!msgRows) return "!ERROR_DELETE_MESSAGES";
      router.push("/messages");
      setShowModal(false)
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
