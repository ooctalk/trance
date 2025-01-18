import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { ArrowRightIcon, Icon } from '@/components/ui/icon';
import { VStack } from '@/components/ui/vstack';
import i18n from '@/languages/i18n';

export default function ModelsScreen() {
  return (
    <View>
      <VStack className="m-4">
        <Gemini />
      </VStack>
    </View>
  );
}

function Gemini() {
  return (
    <View>
      <Pressable onPress={()=> router.push('/(models)/gemini')}>
        <Card size="md" variant="elevated">
          <HStack className="justify-between items-center">
            <Heading size="md">
              {i18n.t("Models.gemini")}
            </Heading>
            <Icon as={ArrowRightIcon} />
          </HStack>
        </Card>
      </Pressable>
    </View>
  );
}
