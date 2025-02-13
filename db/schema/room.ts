// db/schema/room.ts
import { sql } from "drizzle-orm";
import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const room = sqliteTable("room", {
  
  /**
   * trance 核心字段 不做对外兼容
   */

  // 房间 ID (主键，自增)
  id: integer("id").primaryKey({ autoIncrement: true }),

  // 房间全局唯一标识 uuidv7
  global_id: text("global_id").$type<string>().unique().notNull(),

  // 创建时间（毫秒级）— 使用整数类型存储时间戳
  created_at: integer("created_at")
    .default(sql`(unixepoch() * 1000)`)
    .notNull(),

  // 更新时间（毫秒级）— 使用整数类型存储时间戳
  updated_at: integer("updated_at")
    .default(sql`(unixepoch() * 1000)`)
    .notNull(),

  // 房间名称
  name: text("name").$type<string>().notNull(),

  // 房间显示封面文件地址 持久层
  cover: text("cover").notNull(),

  // 房间显示背景
  background: blob("background"),

  // 提示词 用于存储此房间使用的提示词id
  prompt: text("prompt").$type<string | null>().default(null),

  // model 用于存储房间使用的模型信息
  model: text("model", { mode: "json" }).$type<TModelList | null>().default(null),

  /**
   * 类型
   * dialog 对话
   * group 群组
   */
  type: text("type").$type<"dialog" | "group">().notNull(),

  // 房间人员
  personnel: text("personnel").$type<string[]>().default([]).notNull()
});
