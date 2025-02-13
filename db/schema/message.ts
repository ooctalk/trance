// db/schema/message.ts
import { sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const message = sqliteTable("message",{

  /**
   * trance 核心字段 不做对外兼容
   */

  // 消息 ID (主键，自增)
  id: integer("id").primaryKey({ autoIncrement: true }),

  // 消息全局唯一标识 uuidv7
  global_id: text("global_id").$type<string>().unique().notNull(),

  // 创建时间（毫秒级）— 使用整数类型存储时间戳
  created_at: integer("created_at")
    .default(sql`(unixepoch() * 1000)`)
    .notNull(),

  // 更新时间（毫秒级）— 使用整数类型存储时间戳
  updated_at: integer("updated_at")
    .default(sql`(unixepoch() * 1000)`)
    .notNull(),

  // 消息所属房间
  room_id: integer("room_id").notNull(),

  /**
   * 消息类型
   * text:string
   */
  type: text("type").$type<"text">().notNull(),

  /**
   * 是否为发送者，一般用于区分消息显示位置
   */
  is_Sender: integer("is_Sender").notNull(),

  // 内容
  content: text("content").$type<string>().default("").notNull(),

  /**
   * 消息所属角色
   * assistant | user | system
   */
  role:text("role").$type<"assistant"|"user"|"system">().notNull()
})

