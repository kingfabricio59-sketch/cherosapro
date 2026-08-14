import { integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sku: varchar("sku", { length: 64 }).notNull().unique(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  family: varchar("family", { length: 80 }).notNull(),
  sizeMl: integer("size_ml").notNull().default(100),
  price: integer("price").notNull(),
  cost: integer("cost").notNull().default(0),
  stock: integer("stock").notNull().default(0),
  minStock: integer("min_stock").notNull().default(5),
  status: varchar("status", { length: 24 }).notNull().default("ACTIVO"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 48 }).notNull().default(""),
  email: text("email").notNull().default(""),
  tier: varchar("tier", { length: 24 }).notNull().default("Rosa"),
  points: integer("points").notNull().default(0),
  totalSpent: integer("total_spent").notNull().default(0),
  lastPurchase: timestamp("last_purchase", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id),
  customerName: text("customer_name").notNull().default("Cliente ocasional"),
  subtotal: integer("subtotal").notNull(),
  discount: integer("discount").notNull().default(0),
  total: integer("total").notNull(),
  paymentMethod: varchar("payment_method", { length: 40 }).notNull(),
  itemCount: integer("item_count").notNull(),
  operator: text("operator").notNull().default("Equipo Cherosa"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const saleItems = pgTable("sale_items", {
  id: serial("id").primaryKey(),
  saleId: integer("sale_id").notNull().references(() => sales.id),
  productId: integer("product_id").notNull().references(() => products.id),
  productName: text("product_name").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: integer("unit_price").notNull(),
  total: integer("total").notNull(),
});

export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contact: text("contact").notNull().default(""),
  phone: varchar("phone", { length: 48 }).notNull().default(""),
  brands: text("brands").notNull().default(""),
  leadDays: integer("lead_days").notNull().default(7),
  status: varchar("status", { length: 24 }).notNull().default("ACTIVO"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 48 }).notNull().default(""),
  email: text("email").notNull().default(""),
  benefit: text("benefit").notNull().default("15% en compras"),
  referralCode: varchar("referral_code", { length: 64 }).notNull().unique(),
  status: varchar("status", { length: 24 }).notNull().default("ACTIVO"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  concept: text("concept").notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  amount: integer("amount").notNull(),
  paymentMethod: varchar("payment_method", { length: 40 }).notNull().default("Transferencia"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
