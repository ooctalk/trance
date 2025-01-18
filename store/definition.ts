export interface ICharacter {
  id: number;
  character_uuid: string;
  name: string;
  create_at: string;
  update_at: string;
  specification: string;
  version: string | null;
  cover: string;
  creator: string | null;
  creator_notes: string | null;
  description: string | null;
  prologue: Array<string | null> | null;
}

export interface ICharactersScreenCharacterLists {
  id: number;
  character_uuid: string;
  version: string | null;
  name: string;
  cover: string;
  creator: string | null;
  creator_notes: string | null;
}

export interface IMessagesScreenChatroomLists {
  id: number;
  chatroom_uuid:string,
  name: string;
  cover: string;
}

export interface IChatroomScreenMsgLists {
  id: number;
  msg_uuid: string;
  type: string;
  content: string;
  is_sender: number;
  role: string;
}

export interface IImportPromptScreenImportData {
  name: string;
  prompts: Array<{
    identifier: string;
    name: string;
    system_prompt: boolean;
    marker?: boolean;
    enabled?: boolean;
    role?: string;
    content?: string;
    injection_position?: number;
    injection_depth?: number;
    forbid_overrides?: boolean;
  }>;
  prompt_order: Array<{
    identifier: string;
    enabled: boolean;
  }>;
}

export interface IImportPromptScreenPrompt {
  name: string;
  prompt_content: Array<{
    identifier: string;
    name: string;
    is_enabled: boolean;
    is_root: boolean;
    role: string;
    content: string;
  }>;
}

export interface IPromptsScreenLists {
  id:number,
  prompt_uuid:string,
  name:string
}

export interface IPromptsContent{
  identifier:string,
  name:string,
  is_enabled:boolean,
  is_root:boolean,
  role:string,
  content:string
}

export interface IChatroomProfile {
  model: string | null;
  name: string;
  personnel: string;
  prompt_uuid: string | null;
}

export interface IChatroomMsgLists{
  id:number
  msg_uuid:string
  content:string
  type:string
  is_sender:number
  role:string
}

export interface IChatroomCharacterProfile{
  id: number
  character_uuid: string
  cover: string
  description: string | null
}

export interface ITranceHiRequest{
  model:string,
  messages:Array<{
    role: "user" | "system" | "assistant"
    content:string,
  }>
}