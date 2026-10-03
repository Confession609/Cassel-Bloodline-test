import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const archiveRecords = sqliteTable("archive_records", {
  id: text("id").primaryKey(),
  archiveKey: text("archive_key").notNull().unique(),
  name: text("name").notNull(),
  birthDate: text("birth_date").notNull(),
  location: text("location").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  grade: text("grade").notNull(),
  gradeLabel: text("grade_label").notNull(),
  score: integer("score").notNull(),
  compositeScore: integer("composite_score").notNull(),
  performancePercent: real("performance_percent"),
  dominant: text("dominant").notNull(),
  spell: text("spell").notNull(),
  character: text("character").notNull(),
  hiddenTriggered: integer("hidden_triggered", { mode: "boolean" }).notNull().default(false),
  specialName: text("special_name"),
  specialQuote: text("special_quote"),
});

export type ArchiveRecord = typeof archiveRecords.$inferSelect;
