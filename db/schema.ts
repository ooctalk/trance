// schema.ts
import { IPromptsContent } from '@/store/definition';
import { sql } from 'drizzle-orm';
import { sqliteTable, int , text } from "drizzle-orm/sqlite-core"

export const CharacterTable = sqliteTable("Character", {
  id: int().primaryKey({ autoIncrement: true }),
  character_uuid: text().notNull(),
  create_at: text().default(sql`(unixepoch() * 1000)`).notNull(),
  update_at: text().default(sql`(unixepoch() * 1000)`).notNull(),
  specification: text().notNull(),
  version: text(),
  name: text().notNull(),
  cover: text().notNull(),
  creator: text(),
  creator_notes: text(),
  description: text(),
  prologue: text({ mode:'json' }).$type<string[]>()
});

export const ChatRoomTable = sqliteTable("ChatRoom", {
  id: int().primaryKey({ autoIncrement: true }),
  chatroom_uuid: text().notNull(),
  create_at: text().default(sql`(unixepoch() * 1000)`).notNull(),
  update_at: text().default(sql`(unixepoch() * 1000)`).notNull(),
  name: text().notNull(),
  cover: text().notNull(),
  prompt_uuid: text(),
  model:text(),
  personnel: text().notNull(),
  type: text().notNull(),
  info: text(),
})

export const MsgTable = sqliteTable("Msg", {
  id: int().primaryKey({ autoIncrement: true }),
  msg_uuid: text().notNull(),
  create_at: text().default(sql`(unixepoch() * 1000)`).notNull(),
  update_at: text().default(sql`(unixepoch() * 1000)`).notNull(),
  type: text().notNull(),
  content: text().default('').notNull(),
  is_sender: int().notNull(),
  role: text().notNull(),
  chatroom_uuid: text().notNull(),
})

export const PromptTable = sqliteTable("Prompt", {
  id: int().primaryKey({ autoIncrement: true }),
  prompt_uuid: text().notNull(),
  create_at: text().default(sql`(unixepoch() * 1000)`).notNull(),
  update_at: text().default(sql`(unixepoch() * 1000)`).notNull(),
  name: text().notNull(),
  creator:text(),
  version: text(),
  handbook:text(),
  content: text({ mode:'json' }).$type<IPromptsContent[]>().notNull()
})