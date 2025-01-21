import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age"),
});

export const user = sqliteTable("user", {
  email: text("email").primaryKey(),
  user_id: text("user_id").unique(),
  role: integer("role"),
  nickname: text("nickname"),
  updated: integer("updated", { mode: "number" }),
  created: integer("created", { mode: "number" }),
});

export const roomData = sqliteTable("roomData", {
  id: text("id").primaryKey(),
  room: text("room").unique(),
  roomId: text("roomId").unique(),
  data: text("data"),
  updated: integer("updated", { mode: "number" }),
  created: integer("created", { mode: "number" }),
});

export const device = sqliteTable("device", {
  device_id: text("device_id").primaryKey(),
  email: text("email").notNull(),
  pubkey: text("pubkey").notNull(),
  agent: text("agent").notNull(),
  updated: integer("updated", { mode: "number" }),
  created: integer("created", { mode: "number" }),
});

export const room = sqliteTable("room", {
  room_id: text("room_id").primaryKey(),
  email: text("email").notNull(),
  participants: text("participants"),
  room: text("room").notNull(),
  title: text("title").notNull(),
  agenda: text("agenda").notNull(),
  prompt: text("prompt").notNull(),
  network: integer("network").notNull(),
  turn: text("turn").notNull(),
  start: integer("start", { mode: "number" }).notNull(),
  end: integer("end", { mode: "number" }),
  data: text("data"),
  token: text("token"),
  persistence: integer("persistence"),
  updated: integer("updated", { mode: "number" }),
  created: integer("created", { mode: "number" }),
});

export const report = sqliteTable("report", {
  report_id: text("report_id").primaryKey(),
  email: text("email").notNull(),
  action: text("action").notNull(),
  created: integer("created", { mode: "number" }),
});

export interface SfuData {
  id: string;
  room: string;
  roomId: string;
  data: any;
  updated: number;
  created: number;
}

export interface RoomData {
  id: string;
  room: string;
  email: string;
  participants: string[];
  links: [{ id: string; url: string; title: string }];
  files: [{ id: string; url: string; title: string }];
  notes: [{ id: string; content: string; title: string }];
}
