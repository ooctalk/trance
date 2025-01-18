import { drizzle } from 'drizzle-orm/expo-sqlite';
import { router } from 'expo-router';
import { openDatabaseSync } from 'expo-sqlite';
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';
import { Pressable, ScrollView } from 'react-native';

import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Image } from '@/components/ui/image';
import { Skeleton } from '@/components/ui/skeleton';
import { VStack } from '@/components/ui/vstack';
import { ChatRoomTable } from '@/db/schema';
import { IMessagesScreenChatroomLists } from '@/store/definition';

const db = drizzle(openDatabaseSync("trance.db"));

const chatroomListAtom = atom<IMessagesScreenChatroomLists[]>([]);

export default function MessagesScreen() {
  return (
    <ScrollView>
      <ChatroomLists />
    </ScrollView>
  );
}

function ChatroomLists() {
  const [lists, setLists] = useAtom(chatroomListAtom);
  useEffect(() => {
    (async () => {
      try {
        const rows = await db
          .select({
            id: ChatRoomTable.id,
            chatroom_uuid:ChatRoomTable.chatroom_uuid,
            name: ChatRoomTable.name,
            cover: ChatRoomTable.cover,
          })
          .from(ChatRoomTable);
        setLists(rows);
      } catch (e) {
        throw e
      }
    })();
  }, []);

  return (
    <Box>
      {lists ? (
        lists.map((list) => {
          return (
            <Pressable
              onPress={()=> router.push(`/(messages)/chatroom/${list.id}?chatroom_uuid=${list.chatroom_uuid}`)}
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
