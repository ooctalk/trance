import { View } from 'react-native';

import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import i18n from '@/languages/i18n';

export default function AboutScreen() {
  return (
    <View>
      <VStack className="justify-center items-center h-full">
        <Heading size='2xl'>{i18n.t('trance')} | OoCTalk</Heading>
        <Heading>{i18n.t('Preview_Version')}</Heading>
        <Text>https://github.com/ooctalk/trance</Text>
      </VStack>
    </View>
  );
}
