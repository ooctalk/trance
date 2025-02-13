// db/schema/prompt.ts
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const prompt = sqliteTable("prompt", {
  
  /**
   * trance 核心字段 不做对外兼容
   */

  // 提示词 ID (主键，自增)
  id: integer("id").primaryKey({ autoIncrement: true }),

  // 提示词全局唯一标识 uuidv7
  global_id: text("global_id").$type<string>().unique().notNull(),

  // 创建时间（毫秒级）— 使用整数类型存储时间戳
  created_at: integer("created_at")
    .default(sql`(unixepoch() * 1000)`)
    .notNull(),

  // 更新时间（毫秒级）— 使用整数类型存储时间戳
  updated_at: integer("updated_at")
    .default(sql`(unixepoch() * 1000)`)
    .notNull(),

  // 提示词名称
  name: text("name").$type<string>().notNull(),

  // 提示词作者
  ceator: text("creator").$type<string | null>().default(null),

  // 提示词版本
  version: text("version").$type<string | null>().default(null),

  // 提示词使用说明
  handbook:text("handbook").$type<string | null>().default(null),

  // 提示词内容
  content: text("content", { mode: "json" }).$type()

});
