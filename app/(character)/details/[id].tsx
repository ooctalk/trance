import { Card } from '@/components/ui/card';
import { useCharacterDetailsById } from '@/hook/character';

export default function DetailsScreen() {
  return (
    <>
      <IDCard />
    </>
  );
}

/**
 * 角色卡基本信息
 * @returns
 */
function IDCard() {
  const character = useCharacterDetailsById();
  return <Card></Card>;
}
