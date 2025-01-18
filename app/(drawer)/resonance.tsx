import { View } from 'react-native';

import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import i18n from '@/languages/i18n';

export default function ResonanceScreen() {
  return(
    <View>
      <VStack className="justify-center items-center h-full">
        <Heading>{i18n.t("Comming_Soon")}</Heading>
      </VStack>
    </View>
  )
}