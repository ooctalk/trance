import 'react-native-get-random-values';

import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { uuid } from 'drizzle-orm/pg-core';
import { router, Stack, useFocusEffect, useLocalSearchParams, usePathname } from 'expo-router';
import { openDatabaseSync } from 'expo-sqlite';
import { atom, useAtom } from 'jotai';
import { List, SendIcon } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { v7 as uuidv7 } from 'uuid';

import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { ThreeDotsIcon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { Input, InputField } from '@/components/ui/input';
import {
    Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader
} from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { CharacterTable, ChatRoomTable, MsgTable, PromptTable } from '@/db/schema';
import i18n from '@/languages/i18n';
import {
    IChatroomCharacterProfile, IChatroomMsgLists, IChatroomProfile, IPromptsContent,
    ITranceHiRequest
} from '@/store/definition';
import { tranceHi } from '@/utils/trance';

const db = drizzle(openDatabaseSync("trance.db"));

const chatroomProfileAtom = atom<IChatroomProfile>();
const characterProfileAtom = atom<IChatroomCharacterProfile>();
const msgListsAtom = atom<IChatroomMsgLists[]>([]);
const prompstAtom = atom<IPromptsContent[]>([]);
const tranceHiRequestAtom = atom<ITranceHiRequest>();
const userInputAtom = atom("");

export default function ChatroomScreen() {
  const { id, chatroom_uuid } = useLocalSearchParams();
  init();
  return (
    <>
      <Stack.Screen
        options={{
          title: i18n.t("Chat"),
          headerRight: () => {
            return (
              <HeaderMenu
                id={Number(id)}
                chatroom_uuid={chatroom_uuid as string}
              />
            );
          },
        }}
      />
      <MsgWindows />
      <SendBar />
    </>
  );
}
function HeaderMenu({
  id,
  chatroom_uuid,
}: {
  id: number;
  chatroom_uuid: string;
}) {
  return (
    <Button
      onPress={() =>
        router.push(
          `/(messages)/chatroomDetails/${id}?chatroom_uuid=${chatroom_uuid}`
        )
      }
      variant="link"
    >
      <ButtonIcon as={ThreeDotsIcon} />
    </Button>
  );
}

function init() {
  const { chatroom_uuid } = useLocalSearchParams();
  const [chatroomProfile, setChatroomProfile] = useAtom(chatroomProfileAtom);
  const [characterProfile, setCharacterProfile] = useAtom(characterProfileAtom);
  const [msgLists, setMsgLists] = useAtom(msgListsAtom);
  const [prompts, setPrompts] = useAtom(prompstAtom);
  const [tranceHiRequest, setTranceHiRequest] = useAtom(tranceHiRequestAtom);

  //check Chatroom Profile
  useFocusEffect(
    useCallback(() => {
      const fetchChatroomProfile = async () => {
        const rows = await db
          .select({
            model: ChatRoomTable.model,
            name: ChatRoomTable.name,
            personnel: ChatRoomTable.personnel,
            prompt_uuid: ChatRoomTable.prompt_uuid,
          })
          .from(ChatRoomTable)
          .where(eq(ChatRoomTable.chatroom_uuid, chatroom_uuid as string));
        setChatroomProfile(rows[0]);
      };
      fetchChatroomProfile();
    }, [])
  );

  //init CharacterProfile
  useEffect(() => {
    if (!chatroomProfile) return;
    const fetchCharacter = async () => {
      const rows = await db
        .select({
          id: CharacterTable.id,
          character_uuid: CharacterTable.character_uuid,
          cover: CharacterTable.cover,
          description: CharacterTable.description,
        })
        .from(CharacterTable)
        .where(eq(CharacterTable.character_uuid, chatroomProfile.personnel));
      if (rows) {
        setCharacterProfile(rows[0]);
      }
    };
    const fetchPrompt = async () => {
      const rows = await db
        .select({
          content: PromptTable.content,
        })
        .from(PromptTable)
        .where(
          eq(PromptTable.prompt_uuid, chatroomProfile.prompt_uuid as string)
        );
      if (rows) {
        setPrompts(rows[0].content);
      }
    };
    fetchPrompt();
    fetchCharacter();
  }, [chatroomProfile]);

  //Set MsgList
  useEffect(() => {
    const fetchMsglist = async () => {
      const rows = await db
        .select({
          id: MsgTable.id,
          msg_uuid: MsgTable.msg_uuid,
          content: MsgTable.content,
          type: MsgTable.type,
          is_sender: MsgTable.is_sender,
          role: MsgTable.role,
        })
        .from(MsgTable)
        .where(eq(MsgTable.chatroom_uuid, chatroom_uuid as string));
      if (rows) {
        setMsgLists(rows);
      }
    };
    fetchMsglist();
  }, []);

  useEffect(() => {
    const readyMessages = async () => {
      if (!msgLists || !prompts || !characterProfile || !chatroomProfile)
        return;
      const messages = prompts
        .filter((item) => item.is_enabled !== false)
        .flatMap((item): { role: string; content: string }[] => {
          if (item.identifier === "charDescription") {
            return [
              {
                role: item.role,
                content: characterProfile.description || "",
              },
            ];
          }
          if (item.identifier === "chatHistory") {
            return msgLists.map((msg) => ({
              role: msg.role,
              content: msg.content,
            }));
          }
          return [
            {
              role: item.role,
              content: item.content || "",
            },
          ];
        });
      if (messages && chatroomProfile.model) {
        const tranceHiRequest = {
          model: chatroomProfile.model,
          messages: messages,
        };
        setTranceHiRequest(tranceHiRequest as ITranceHiRequest);
      }
    };
    readyMessages();
  }, [msgLists, characterProfile]);
}

function MsgWindows() {
  const [characterProfile, setCharacterProfile] = useAtom(characterProfileAtom);
  const [msgLists, setMsgLists] = useAtom(msgListsAtom);
  const [showModal, setShowModal] = React.useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");
  const handleLongPressMessages = async ({
    msg_uuid,
  }: {
    msg_uuid: string;
  }) => {
    try {
      setSelectedMessage(msg_uuid);
      setShowModal(true);
    } catch (e) {
      throw e;
    }
  };
  const handleDeleteMessage = async () => {
    try {
      const rows = await db
        .delete(MsgTable)
        .where(eq(MsgTable.msg_uuid, selectedMessage));
      if (!rows) throw new Error("Failed Delete Message");
      setMsgLists((prevMsgLists) =>
        prevMsgLists.filter((msg) => msg.msg_uuid !== selectedMessage)
      );
      setShowModal(false);
    } catch (e) {}
  };

  return (
    <>
      <Box className="flex-1 m-4">
        {msgLists ? (
          <ScrollView>
            <VStack space="md">
              {msgLists.map((list) => (
                <Box key={list.id}>
                  {list.is_sender == 0 ? (
                    <HStack space="sm">
                      {!characterProfile || !characterProfile.cover ? (
                        <Skeleton className="w-16 h-16 rounded-full" />
                      ) : (
                        <Image
                          className="rounded-full w-16 h-16  border border-amber-200"
                          source={characterProfile.cover}
                          alt={list.role}
                        />
                      )}
                      <Pressable
                        className="flex-1 max-w-[70%]"
                        onLongPress={() =>
                          handleLongPressMessages({ msg_uuid: list.msg_uuid })
                        }
                      >
                        <Card className=" bg-amber-50 border border-amber-200 shadow-md">
                          <Text>{list.content}</Text>
                        </Card>
                      </Pressable>
                    </HStack>
                  ) : (
                    <Pressable
                      onLongPress={() =>
                        handleLongPressMessages({ msg_uuid: list.msg_uuid })
                      }
                      className="flex-1 items-end"
                    >
                      <Card className="max-w-[60%] bg-sky-50 border border-sky-200 shadow-md rounded-br-none">
                        <Text>{list.content}</Text>
                      </Card>
                    </Pressable>

                  )}
                </Box>
              ))}
            </VStack>
          </ScrollView>
        ) : (
          <Box></Box>
        )}
      </Box>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalFooter>
            <Button
              onPress={handleDeleteMessage}
              className="flex-1"
              action="negative"
            >
              <ButtonText>{i18n.t("Delete")}</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function SendBar() {
  const { chatroom_uuid } = useLocalSearchParams();
  const [userInput, setUserInput] = useAtom(userInputAtom);
  const [isLock, setIsLock] = useState(false);
  const [msgLists, setMsgLists] = useAtom(msgListsAtom);
  const [tranceHiRequest] = useAtom(tranceHiRequestAtom);
  const handleSend = async () => {
    try {
      setIsLock(true);
      const userInsertRows = await db.insert(MsgTable).values({
        msg_uuid: uuidv7(),
        role: "user",
        type: "text",
        content: userInput,
        is_sender: 1,
        chatroom_uuid: chatroom_uuid as string,
      });

      if (!userInsertRows) {
        setIsLock(false);
        return "!ERROR_INSERT_USER_INPUT";
      }
      const latestUserMsg = await db
        .select({
          id: MsgTable.id,
          msg_uuid: MsgTable.msg_uuid,
          content: MsgTable.content,
          type: MsgTable.type,
          is_sender: MsgTable.is_sender,
          role: MsgTable.role,
        })
        .from(MsgTable)
        .where(eq(MsgTable.id, userInsertRows.lastInsertRowId));
      if (!latestUserMsg) {
        setIsLock(false);
        return "!ERROR_GET_USER_LATEST_MESSAGE";
      }
      setMsgLists((prev) => [...prev, latestUserMsg[0]]);
      setUserInput("");
      if (tranceHiRequest) {
        const tranceHiResponse = await tranceHi({ tranceHiRequest });
        if (
          !tranceHiResponse ||
          tranceHiResponse === "!ERROR_TRANCE_HI_REQUEST_NOT_FOUND" ||
          tranceHiResponse === "!ERROR_API_GEMINI_KEY_NOT_FOUND" ||
          tranceHiResponse === "!ERROR_API_GEMINI_MODEL_NOT_FOUND" ||
          tranceHiResponse === "!ERROR_REMOTE_API_ERROR"
        ) {
          setIsLock(false);
          return
        }
        const assistantInsertRows = await db.insert(MsgTable).values({
          msg_uuid: uuidv7(),
          role: tranceHiResponse.role,
          type: "text",
          content: tranceHiResponse.content || "",
          is_sender: 0,
          chatroom_uuid: chatroom_uuid as string,
        });
        if (!assistantInsertRows) {
          setIsLock(false);
          return "!ERROR_INSERT_ASSISTANT_LATEST_MESSAGE";
        }
        const latestAssistantMsg = await db
          .select({
            id: MsgTable.id,
            msg_uuid: MsgTable.msg_uuid,
            content: MsgTable.content,
            type: MsgTable.type,
            is_sender: MsgTable.is_sender,
            role: MsgTable.role,
          })
          .from(MsgTable)
          .where(eq(MsgTable.id, assistantInsertRows.lastInsertRowId));
        if (!latestAssistantMsg) {
          setIsLock(false);
          return "!ERROR_GET_ASSISTANT_LATEST_MESSAGE";
        }
        setMsgLists((prev) => [...prev, latestAssistantMsg[0]]);
        setIsLock(false);
      } else {
        setIsLock(false);
        alert(i18n.t("Messages.no_ready"));
      }
    } catch (e) {
      throw e;
    }
  };
  return (
    <Box className="bg-white">
      <HStack className="m-2" space="sm">
        <Input className="flex-1 bg-neutral-50">
          <InputField
            value={userInput}
            onChangeText={(value) => setUserInput(value)}
          />
        </Input>
        {isLock ? (
          <Button isDisabled className="p-3">
            <ButtonSpinner className="text-neutral-200" />
          </Button>
        ) : (
          <Box>
            {userInput.length > 0 ? (
              <Button isDisabled={isLock} onPress={handleSend}>
                <ButtonIcon as={SendIcon} />
                <ButtonText>{i18n.t("Send")}</ButtonText>
              </Button>
            ) : (
              <Button isDisabled={true}>
                <ButtonIcon as={SendIcon} />
                <ButtonText>{i18n.t("Send")}</ButtonText>
              </Button>
            )}
          </Box>
        )}
      </HStack>
    </Box>
  );
}
