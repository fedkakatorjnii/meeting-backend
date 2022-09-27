import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPhoto1664303506621 implements MigrationInterface {
  name = 'addPhoto1664303506621';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rooms" ADD "photo" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "photo" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "photo"`);
    await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "photo"`);
  }
}
