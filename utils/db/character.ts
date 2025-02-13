import { character } from '@/db/schema/character';
import { useDB } from '@/hook/db';
import 'react-native-get-random-values';
import { v7 as uuidv7 } from 'uuid';

const db = useDB();

/**
 * 新增角色卡
 * @param name
 * @param cover
 * @returns
 */
export async function createCharacter(name: string, cover: string) {
  try {
    const rows = await db.insert(character).values({
      global_id: uuidv7(),
      name: name,
      cover: cover,
    });
    if (!rows) return;
    return rows.lastInsertRowId;
  } catch (e) {
    console.log(e);
  }
}
