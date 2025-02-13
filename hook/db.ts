// hook/db.ts

import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

/**
 * 初始化数据库 并添加 Live Queries
 * @returns
 */
export function useDB(){
  const expo = openDatabaseSync('trance.db', { enableChangeListener: true });
  const db = drizzle(expo);
  return db;
}