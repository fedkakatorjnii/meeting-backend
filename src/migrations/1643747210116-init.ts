import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1643747210116 implements MigrationInterface {
  name = 'init1643747210116';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "resource_group" ("id" SERIAL NOT NULL, "domain" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "lastName" character varying NOT NULL, "permission_flags" character varying NOT NULL, CONSTRAINT "PK_d8440aff1eaed6d14f22328534d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT false, "isSuperuser" boolean NOT NULL DEFAULT false, "password" text NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_categories_user" ("userId_1" integer NOT NULL, "userId_2" integer NOT NULL, CONSTRAINT "PK_7ab900f1bf91fefb3fcda38005c" PRIMARY KEY ("userId_1", "userId_2"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6e6a4be1aa2d5e52c44366dc66" ON "user_categories_user" ("userId_1") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9a432bd03fb650be0840c2e6ad" ON "user_categories_user" ("userId_2") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user_categories_user" ADD CONSTRAINT "FK_6e6a4be1aa2d5e52c44366dc66b" FOREIGN KEY ("userId_1") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_categories_user" ADD CONSTRAINT "FK_9a432bd03fb650be0840c2e6ad6" FOREIGN KEY ("userId_2") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_categories_user" DROP CONSTRAINT "FK_9a432bd03fb650be0840c2e6ad6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_categories_user" DROP CONSTRAINT "FK_6e6a4be1aa2d5e52c44366dc66b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9a432bd03fb650be0840c2e6ad"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6e6a4be1aa2d5e52c44366dc66"`,
    );
    await queryRunner.query(`DROP TABLE "user_categories_user"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "resource_group"`);
  }
}
