import { character } from '@/db/schema/character';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useLocalSearchParams } from 'expo-router';
import { useDB } from './db';

// 初始化数据库
const db = useDB()

/**
 * 实时查询全部角色卡
 */
export function useCharacter() {
  return useLiveQuery(db.select().from(character));
}

/**
 * 根据ID 实时查询角色卡
 * @param id
 * @returns
 */
export function useCharacterById(id: number) {
  return useLiveQuery(db.select().from(character).where(eq(character.id, id)));
}

/**
 * 实时查询角色卡列表
 */
export function useCharacterList() {
  return useLiveQuery(
    db
      .select({
        id: character.id,
        global_id: character.global_id,
        cover: character.cover,
        name: character.name,
        creator: character.creator,
        version: character.version,
      })
      .from(character),
  );
}

/**
 * 根据/details/[id] 获取角色卡数据
 * @returns 
 */
export function useCharacterDetailsById() {
  const { id } = useLocalSearchParams();
  const rows = useCharacterById(Number(id))
  return rows.data
}
