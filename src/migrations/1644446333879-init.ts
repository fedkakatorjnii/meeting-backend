import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1644446333879 implements MigrationInterface {
  name = 'init1644446333879';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "room" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, CONSTRAINT "UQ_535c742a3606d2e3122f441b26c" UNIQUE ("name"), CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "email" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT false, "isSuperuser" boolean NOT NULL DEFAULT false, "password" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "roomsId" integer, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "geolocation" ("id" SERIAL NOT NULL, "point" geometry(Point,4326) NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "REL_930737eb862be8d0b280559362" UNIQUE ("userId"), CONSTRAINT "PK_36aa5f8d0de597a21a725ee1cc2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "room_permission" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "permission" integer NOT NULL DEFAULT '1', "userId" integer, "roomId" integer, CONSTRAINT "UQ_79b82ecb20b7a1afd4919fb11e8" UNIQUE ("name"), CONSTRAINT "REL_d1de36345ac73962c50540e6f4" UNIQUE ("userId"), CONSTRAINT "REL_95d536a5c4eefc413744e2de9a" UNIQUE ("roomId"), CONSTRAINT "PK_b3f262771d1ca6b16b5d8b25250" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_61c6dfcd7aade4f490eee74613f" FOREIGN KEY ("roomsId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "geolocation" ADD CONSTRAINT "FK_930737eb862be8d0b2805593629" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_permission" ADD CONSTRAINT "FK_d1de36345ac73962c50540e6f48" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_permission" ADD CONSTRAINT "FK_95d536a5c4eefc413744e2de9aa" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "room_permission" DROP CONSTRAINT "FK_95d536a5c4eefc413744e2de9aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_permission" DROP CONSTRAINT "FK_d1de36345ac73962c50540e6f48"`,
    );
    await queryRunner.query(
      `ALTER TABLE "geolocation" DROP CONSTRAINT "FK_930737eb862be8d0b2805593629"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_61c6dfcd7aade4f490eee74613f"`,
    );
    await queryRunner.query(`DROP TABLE "room_permission"`);
    await queryRunner.query(`DROP TABLE "geolocation"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "room"`);
  }
}
