import { MigrationInterface, QueryRunner } from 'typeorm';

export class addReadersToMessage1668353414719 implements MigrationInterface {
  name = 'addReadersToMessage1668353414719';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "messages_readers_users" ("messagesId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_9f8109514c4d886ce31ac878a26" PRIMARY KEY ("messagesId", "usersId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_380d9f081b2d831e720fe27aca" ON "messages_readers_users" ("messagesId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_56f15dac4c466a1df3cf1e1112" ON "messages_readers_users" ("usersId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "messages_readers_users" ADD CONSTRAINT "FK_380d9f081b2d831e720fe27aca1" FOREIGN KEY ("messagesId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages_readers_users" ADD CONSTRAINT "FK_56f15dac4c466a1df3cf1e11129" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "messages_readers_users" DROP CONSTRAINT "FK_56f15dac4c466a1df3cf1e11129"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages_readers_users" DROP CONSTRAINT "FK_380d9f081b2d831e720fe27aca1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_56f15dac4c466a1df3cf1e1112"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_380d9f081b2d831e720fe27aca"`,
    );
    await queryRunner.query(`DROP TABLE "messages_readers_users"`);
  }
}
