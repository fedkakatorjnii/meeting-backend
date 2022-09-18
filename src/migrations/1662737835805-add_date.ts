import { MigrationInterface, QueryRunner } from 'typeorm';

export class addDate1662737835805 implements MigrationInterface {
  name = 'addDate1662737835805';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "geolocations" DROP COLUMN "date"`);
    await queryRunner.query(
      `ALTER TABLE "messages" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "messages" ADD "updatedAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "rooms" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "rooms" ADD "updatedAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "geolocations" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "geolocations" ADD "updatedAt" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "geolocations" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "geolocations" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "geolocations" ADD "date" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }
}
