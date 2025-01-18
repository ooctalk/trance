CREATE TABLE `Character` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`character_uuid` text NOT NULL,
	`create_at` text DEFAULT (unixepoch() * 1000) NOT NULL,
	`update_at` text DEFAULT (unixepoch() * 1000) NOT NULL,
	`specification` text NOT NULL,
	`version` text,
	`name` text NOT NULL,
	`cover` text NOT NULL,
	`creator` text,
	`creator_notes` text,
	`description` text,
	`prologue` text
);
--> statement-breakpoint
CREATE TABLE `ChatRoom` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`chatroom_uuid` text NOT NULL,
	`create_at` text DEFAULT (unixepoch() * 1000) NOT NULL,
	`update_at` text DEFAULT (unixepoch() * 1000) NOT NULL,
	`name` text NOT NULL,
	`cover` text NOT NULL,
	`prompt_uuid` text,
	`model` text,
	`personnel` text NOT NULL,
	`type` text NOT NULL,
	`info` text
);
--> statement-breakpoint
CREATE TABLE `Msg` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`msg_uuid` text NOT NULL,
	`create_at` text DEFAULT (unixepoch() * 1000) NOT NULL,
	`update_at` text DEFAULT (unixepoch() * 1000) NOT NULL,
	`type` text NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`is_sender` integer NOT NULL,
	`role` text NOT NULL,
	`chatroom_uuid` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Prompt` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`prompt_uuid` text NOT NULL,
	`create_at` text DEFAULT (unixepoch() * 1000) NOT NULL,
	`update_at` text DEFAULT (unixepoch() * 1000) NOT NULL,
	`name` text NOT NULL,
	`creator` text,
	`version` text,
	`handbook` text,
	`content` text NOT NULL
);
