import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const flashSalesTable = pgTable("flashSales", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  imageSrc: text("imageSrc").notNull(),
  price: integer("price").notNull(),
  offPrice: integer("offPrice").notNull(),
  offPercent: integer("offPercent").notNull(),
  name: text("name").notNull(),
});
