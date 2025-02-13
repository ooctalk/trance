// db/schema/character.ts
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const character = sqliteTable("character", {
  /**
   * trance 核心字段 不做对外兼容
   * 部分字段通用于 @TavernCardV2: https://github.com/malfoyslastname/character-card-spec-v2
   */

  // 角色卡 ID (主键，自增)
  id: integer("id").primaryKey({ autoIncrement: true }),

  // 角色卡全局唯一标识 uuidv7
  global_id: text("global_id").$type<string>().unique().notNull(),

  // 创建时间（毫秒级）— 使用整数类型存储时间戳
  created_at: integer("created_at")
    .default(sql`(unixepoch() * 1000)`)
    .notNull(),

  // 更新时间（毫秒级）— 使用整数类型存储时间戳
  updated_at: integer("updated_at")
    .default(sql`(unixepoch() * 1000)`)
    .notNull(),

  // 角色卡名字 @TavernCardV2:[name|data.name]
  name: text("name").$type<string>().notNull(),

  // 角色卡封面文件地址 持久层
  cover: text("cover").notNull(),

  // 角色卡描述 @TavernCardV2:[description|data.description]
  description: text("description").$type<string | null>(),

  // 开场白 @TavernCardV2:[first_mes + alternate_greetings]
  prologue: text("prologue").$type<string[]>().default([]).notNull(),

  // 角色卡作者 @TavernCardV2:[data.creator]
  creator: text("creator").$type<string | null>().default(null),

  // 角色卡使用说明 @TavernCardV2:[data.creator_notes]
  handbook: text("handbook").$type<string | null>().default(null),

  // 角色卡作者自定义版本 @TavernCardV2:[data.character_version]
  version: text("version").$type<string | null>().default(null),

  /**
   * trance 保留字段 用于兼容或者保留外部应用信息,基本不会使用
   * 部分字段通用于 @TavernCardV2: https://github.com/malfoyslastname/character-card-spec-v2
   */

  // 个性 @TavernCardV2:[personality|data.personality]
  personality: text("personality").$type<string | null>().default(null),

  // 情景 @TavernCardV2:[scenario|data.scenario]
  scenario: text("scenario").$type<string | null>().default(null),

  // 消息例子 @TavernCardV2:[mes_example|data.mes_example]
  mes_example: text("mes_example").$type<string | null>().default(null),

  // 系统提示  @TavernCardV2:[data.system_prompt]
  system_prompt: text("system_prompt").$type<string | null>().default(null),

  // 后期历史说明 @TavernCardV2:[data.post_history_instructions]
  post_history_instructions: text("post_history_instructions").$type<string | null>(),
});
