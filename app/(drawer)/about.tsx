import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

export default function AboutScreen() {
  return (
    <Box className="m-4">
      <Heading>喘息(trance) By OoC 萌</Heading>
      <Text>存储库: github.com/oocmoe/trance</Text>
      <Text>联络: contact@ooc.moe</Text>
      <Text>滥用投诉: abuse@ooc.moe</Text>
    </Box>
  );
}
