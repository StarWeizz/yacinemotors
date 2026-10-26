import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "agency" ADD COLUMN "address" varchar;
  ALTER TABLE "agency" ADD COLUMN "phone" varchar;
  ALTER TABLE "agency" ADD COLUMN "email" varchar;
  ALTER TABLE "agency" ADD COLUMN "opening_hours" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "agency" DROP COLUMN "address";
  ALTER TABLE "agency" DROP COLUMN "phone";
  ALTER TABLE "agency" DROP COLUMN "email";
  ALTER TABLE "agency" DROP COLUMN "opening_hours";`)
}
