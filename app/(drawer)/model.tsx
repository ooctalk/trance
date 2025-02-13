import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { ArrowRightIcon, Icon } from '@/components/ui/icon';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { SvgUri } from 'react-native-svg';

export default function ModelScreen() {
  return (
    <Box className="m-4">
      <ModelList />
    </Box>
  );
}

// 模型列表
const items = [
  // {
  //   name: 'Deepseek',
  //   path: '/(model)/gemini/',
  //   icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/deepseek-color.svg',
  // },
  // {
  //   name: 'OpenAI(ChatGPT)',
  //   path: '/(model)/gemini/',
  //   icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/openai.svg',
  // },
  {
    name: 'Gemini',
    path: '/(model)/gemini/',
    icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/gemini-color.svg',
  },
  // {
  //   name: 'Claude',
  //   path: '/(model)/gemini/',
  //   icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/claude-color.svg',
  // },
  // {
  //   name: 'Grok',
  //   path: '/(model)/gemini/',
  //   icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/grok.svg',
  // },
];

function ModelList() {
  return (
    <Box>
      {items.map((item, index) => (
        <Pressable onPress={() => router.push(item.path as any)} key={index} className="h-24">
          <Card>
            <HStack className="justify-between items-center">
              <HStack space="md" className="items-center">
                <SvgUri uri={item.icon} height={24} width={24} color="black" />
                <Heading>{item.name}</Heading>
              </HStack>
              <Icon as={ArrowRightIcon} />
            </HStack>
          </Card>
        </Pressable>
      ))}
    </Box>
  );
}
