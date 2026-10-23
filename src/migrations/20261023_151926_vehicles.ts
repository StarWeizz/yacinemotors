import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_vehicles_category" AS ENUM('Citadine', 'Compacte', 'SUV', 'Sportive');
  CREATE TABLE "vehicles_equipment" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "vehicles_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"path" varchar NOT NULL
  );
  
  CREATE TABLE "vehicles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"source_id" numeric,
  	"brand" varchar NOT NULL,
  	"model" varchar NOT NULL,
  	"version" varchar NOT NULL,
  	"year" numeric NOT NULL,
  	"category" "enum_vehicles_category" NOT NULL,
  	"fuel" varchar NOT NULL,
  	"gearbox" varchar NOT NULL,
  	"power_hp" numeric NOT NULL,
  	"drivetrain" varchar NOT NULL,
  	"mileage" numeric NOT NULL,
  	"seats" numeric NOT NULL,
  	"doors" numeric NOT NULL,
  	"color" varchar NOT NULL,
  	"crit_air" numeric NOT NULL,
  	"price_per_day" numeric NOT NULL,
  	"deposit" numeric NOT NULL,
  	"included_km_per_day" numeric NOT NULL,
  	"available" boolean DEFAULT true,
  	"unavailable_until" timestamp(3) with time zone,
  	"minimum_age" numeric,
  	"minimum_license_years" numeric,
  	"description" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "agency" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"city" varchar NOT NULL,
  	"currency" varchar DEFAULT 'EUR' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "vehicles_id" integer;
  ALTER TABLE "vehicles_equipment" ADD CONSTRAINT "vehicles_equipment_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vehicles_images" ADD CONSTRAINT "vehicles_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "vehicles_equipment_order_idx" ON "vehicles_equipment" USING btree ("_order");
  CREATE INDEX "vehicles_equipment_parent_id_idx" ON "vehicles_equipment" USING btree ("_parent_id");
  CREATE INDEX "vehicles_images_order_idx" ON "vehicles_images" USING btree ("_order");
  CREATE INDEX "vehicles_images_parent_id_idx" ON "vehicles_images" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "vehicles_slug_idx" ON "vehicles" USING btree ("slug");
  CREATE UNIQUE INDEX "vehicles_source_id_idx" ON "vehicles" USING btree ("source_id");
  CREATE INDEX "vehicles_updated_at_idx" ON "vehicles" USING btree ("updated_at");
  CREATE INDEX "vehicles_created_at_idx" ON "vehicles" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vehicles_fk" FOREIGN KEY ("vehicles_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_vehicles_id_idx" ON "payload_locked_documents_rels" USING btree ("vehicles_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "vehicles_equipment" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "vehicles_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "vehicles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "agency" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "vehicles_equipment" CASCADE;
  DROP TABLE "vehicles_images" CASCADE;
  DROP TABLE "vehicles" CASCADE;
  DROP TABLE "agency" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_vehicles_fk";
  
  DROP INDEX "payload_locked_documents_rels_vehicles_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "vehicles_id";
  DROP TYPE "public"."enum_vehicles_category";`)
}
