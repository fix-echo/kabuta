import { sql } from "drizzle-orm";
import {
  text,
  varchar,
  timestamp,
  integer,
  pgTable,
  decimal,
} from "drizzle-orm/pg-core";
import { z } from "zod";

import { nanoid } from "@/lib/utils";

export const unicorns = pgTable("unicorns", {
  id: varchar("id", {
    length: 191,
  })
    .primaryKey()
    .$defaultFn(() => nanoid()),

  company: varchar("company", { length: 255 }).notNull(),
  valuation: decimal("valuation", { precision: 10, scale: 2 }).notNull(),
  dateJoined: timestamp("date_joined").notNull(),
  country: varchar("country", { length: 255 }).notNull(),
  city: varchar("city", { length: 255 }),
  industry: varchar("industry", { length: 255 }).notNull(),
  selectInvestors: text("select_investors").notNull(),

  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

// Schema for resources - used to validate API requests
export const insertUnicornSchema = z.object({
  company: z.string(),
  valuation: z.number(),
  dateJoined: z.string(),
  country: z.string(),
  city: z.string(),
  industry: z.string(),
  selectInvestors: z.string(),
});

// Type for resources - used to type API request params and within Components
export type NewUnicornParams = z.infer<typeof insertUnicornSchema>;
