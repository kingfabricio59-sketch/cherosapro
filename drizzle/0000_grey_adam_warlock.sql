CREATE TABLE "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" varchar(48) DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"tier" varchar(24) DEFAULT 'Rosa' NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"total_spent" integer DEFAULT 0 NOT NULL,
	"last_purchase" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"concept" text NOT NULL,
	"category" varchar(80) NOT NULL,
	"amount" integer NOT NULL,
	"payment_method" varchar(40) DEFAULT 'Transferencia' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partners" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" varchar(48) DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"benefit" text DEFAULT '15% en compras' NOT NULL,
	"referral_code" varchar(64) NOT NULL,
	"status" varchar(24) DEFAULT 'ACTIVO' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "partners_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"sku" varchar(64) NOT NULL,
	"name" text NOT NULL,
	"brand" text NOT NULL,
	"family" varchar(80) NOT NULL,
	"size_ml" integer DEFAULT 100 NOT NULL,
	"price" integer NOT NULL,
	"cost" integer DEFAULT 0 NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"min_stock" integer DEFAULT 5 NOT NULL,
	"status" varchar(24) DEFAULT 'ACTIVO' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "sale_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"sale_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"product_name" text NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" integer NOT NULL,
	"total" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer,
	"customer_name" text DEFAULT 'Cliente ocasional' NOT NULL,
	"subtotal" integer NOT NULL,
	"discount" integer DEFAULT 0 NOT NULL,
	"total" integer NOT NULL,
	"payment_method" varchar(40) NOT NULL,
	"item_count" integer NOT NULL,
	"operator" text DEFAULT 'Equipo Cherosa' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "suppliers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"contact" text DEFAULT '' NOT NULL,
	"phone" varchar(48) DEFAULT '' NOT NULL,
	"brands" text DEFAULT '' NOT NULL,
	"lead_days" integer DEFAULT 7 NOT NULL,
	"status" varchar(24) DEFAULT 'ACTIVO' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_sale_id_sales_id_fk" FOREIGN KEY ("sale_id") REFERENCES "public"."sales"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
INSERT INTO "products" ("sku","name","brand","family","size_ml","price","cost","stock","min_stock") VALUES
('CH-001','Velvet Rose','Maison Éclat','Floral',100,520000,310000,4,6),
('CH-002','Nuit Dorée','Atelier Lumière','Oriental',80,680000,405000,7,5),
('CH-003','Pure Neroli','Casa Botanica','Cítrica',100,455000,260000,3,6),
('CH-004','Musc Blanc','L''Essence','Almizclada',100,590000,350000,5,7),
('CH-005','Jardin Secret','Maison Éclat','Floral',75,485000,285000,16,5),
('CH-006','Ambre Santal','Atelier Lumière','Amaderada',100,720000,430000,11,4),
('CH-007','Fleur de Coton','Belle Maison','Floral',100,410000,235000,19,6),
('CH-008','Citrus Bloom','Casa Botanica','Cítrica',50,345000,190000,13,5),
('CH-009','Oud Précieux','L''Essence','Oriental',75,890000,535000,8,4),
('CH-010','Vanille Poudrée','Belle Maison','Gourmand',100,540000,320000,14,5)
ON CONFLICT ("sku") DO NOTHING;
--> statement-breakpoint
INSERT INTO "customers" ("name","phone","email","tier","points","total_spent","last_purchase") VALUES
('Valentina Rojas','0981 440 221','valentina@example.com','Diamante',2480,12600000,'2026-08-14T10:42:00-03:00'),
('Sofía Martínez','0972 115 820','sofia@example.com','Oro',1860,8940000,'2026-08-14T09:58:00-03:00'),
('Camila Ferreira','0984 308 716','camila@example.com','Oro',1420,7520000,'2026-08-12T17:35:00-03:00'),
('María José Duarte','0986 992 041','mariajose@example.com','Rosa',760,3680000,'2026-08-10T11:00:00-03:00'),
('Ana Paula Benítez','0971 552 319','anapaula@example.com','Rosa',540,2410000,'2026-08-08T14:00:00-03:00'),
('Isabella Moreira','0983 721 550','isabella@example.com','Rosa',310,1390000,'2026-08-05T15:30:00-03:00');
--> statement-breakpoint
INSERT INTO "sales" ("customer_id","customer_name","subtotal","discount","total","payment_method","item_count","operator","created_at") VALUES
(1,'Valentina Rojas',1040000,0,1040000,'Tarjeta',2,'Lucía Méndez','2026-08-14T10:42:00-03:00'),
(2,'Sofía Martínez',680000,30000,650000,'Transferencia',1,'Lucía Méndez','2026-08-14T09:58:00-03:00'),
(NULL,'Cliente ocasional',455000,0,455000,'Efectivo',1,'Lucía Méndez','2026-08-14T09:21:00-03:00'),
(3,'Camila Ferreira',890000,50000,840000,'Tarjeta',1,'Lucía Méndez','2026-08-13T17:35:00-03:00');
--> statement-breakpoint
INSERT INTO "suppliers" ("name","contact","phone","brands","lead_days") VALUES
('Distribuidora Éclat','Gabriela Acosta','0981 224 901','Maison Éclat, Belle Maison',4),
('Importadora Lumière','Renato Silva','0972 882 610','Atelier Lumière',7),
('Botanica Trading','Paola Núñez','0984 415 700','Casa Botanica',5),
('Essence Select','Marcelo Díaz','0986 177 040','L''Essence',9);
--> statement-breakpoint
INSERT INTO "partners" ("name","phone","email","benefit","referral_code") VALUES
('Andrea Benítez','0981 662 410','andrea@example.com','15% en compras','ANDREA15'),
('Micaela Franco','0972 319 808','micaela@example.com','10% + obsequio','MICA10'),
('José Villalba','0984 227 105','jose@example.com','Precio preferencial','JOSEVIP')
ON CONFLICT ("referral_code") DO NOTHING;
--> statement-breakpoint
INSERT INTO "expenses" ("concept","category","amount","payment_method","created_at") VALUES
('Campaña Día de la Madre','Marketing',1250000,'Transferencia','2026-08-13T15:20:00-03:00'),
('Empaques premium','Insumos',680000,'Tarjeta','2026-08-12T11:15:00-03:00'),
('Servicio de delivery','Logística',420000,'Transferencia','2026-08-10T18:00:00-03:00'),
('Aromatización de tienda','Operación',350000,'Efectivo','2026-08-08T10:10:00-03:00');
