import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";

export const subscriptions = sqliteTable("subscriptions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  amount: real("amount").notNull(),
  currency: text("currency").notNull().default("KRW"),
  billingDay: integer("billing_day").notNull(),
  billingCycle: text("billing_cycle").notNull().default("monthly"),
  category: text("category").notNull().default("other"),
  status: text("status").notNull().default("active"),
  cancelUrl: text("cancel_url"),
  cancelGuide: text("cancel_guide"),
  iconUrl: text("icon_url"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  killedAt: text("killed_at"),
});

export const usageLogs = sqliteTable("usage_logs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  subscriptionId: text("subscription_id")
    .notNull()
    .references(() => subscriptions.id),
  month: text("month").notNull(),
  usageCount: integer("usage_count").notNull(),
  costPerUse: real("cost_per_use").notNull(),
  riskLevel: text("risk_level").notNull(),
  checkedAt: text("checked_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").unique(),
  notifyEmail: integer("notify_email").default(0),
  notifyPush: integer("notify_push").default(0),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const subscriptionsRelations = relations(subscriptions, ({ many }) => ({
  usageLogs: many(usageLogs),
}));

export const usageLogsRelations = relations(usageLogs, ({ one }) => ({
  subscription: one(subscriptions, {
    fields: [usageLogs.subscriptionId],
    references: [subscriptions.id],
  }),
}));

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type UsageLog = typeof usageLogs.$inferSelect;
export type NewUsageLog = typeof usageLogs.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
