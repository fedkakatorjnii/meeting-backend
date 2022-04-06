import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1649240356942 implements MigrationInterface {
  name = 'init1649240356942';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "messages" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "ownerId" integer, "roomId" integer, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rooms" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "ownerId" integer, CONSTRAINT "UQ_48b79438f8707f3d9ca83d85ea0" UNIQUE ("name"), CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "email" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT false, "isSuperuser" boolean NOT NULL DEFAULT false, "password" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "geolocations" ("id" SERIAL NOT NULL, "point" geometry(Point,4326) NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "REL_ef002e16f5814d6ff44655bac9" UNIQUE ("userId"), CONSTRAINT "PK_371073cff743747b0e8269d3932" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "room_permission" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "permission" integer NOT NULL DEFAULT '1', "userId" integer, "roomId" integer, CONSTRAINT "UQ_79b82ecb20b7a1afd4919fb11e8" UNIQUE ("name"), CONSTRAINT "REL_d1de36345ac73962c50540e6f4" UNIQUE ("userId"), CONSTRAINT "REL_95d536a5c4eefc413744e2de9a" UNIQUE ("roomId"), CONSTRAINT "PK_b3f262771d1ca6b16b5d8b25250" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users_consists_rooms_rooms" ("usersId" integer NOT NULL, "roomsId" integer NOT NULL, CONSTRAINT "PK_13e72f9976c07b261facfa2d1bb" PRIMARY KEY ("usersId", "roomsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_51dc0cf787d88358684bfe25d3" ON "users_consists_rooms_rooms" ("usersId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dcf9b8b7ad08a623921d176641" ON "users_consists_rooms_rooms" ("roomsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_cf803e7bc9c4823b6ab03de6c13" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_aaa8a6effc7bd20a1172d3a3bc8" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" ADD CONSTRAINT "FK_383ac461c63dd52c22ba73a6624" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "geolocations" ADD CONSTRAINT "FK_ef002e16f5814d6ff44655bac91" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_permission" ADD CONSTRAINT "FK_d1de36345ac73962c50540e6f48" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_permission" ADD CONSTRAINT "FK_95d536a5c4eefc413744e2de9aa" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_consists_rooms_rooms" ADD CONSTRAINT "FK_51dc0cf787d88358684bfe25d3c" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_consists_rooms_rooms" ADD CONSTRAINT "FK_dcf9b8b7ad08a623921d1766410" FOREIGN KEY ("roomsId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_consists_rooms_rooms" DROP CONSTRAINT "FK_dcf9b8b7ad08a623921d1766410"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_consists_rooms_rooms" DROP CONSTRAINT "FK_51dc0cf787d88358684bfe25d3c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_permission" DROP CONSTRAINT "FK_95d536a5c4eefc413744e2de9aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_permission" DROP CONSTRAINT "FK_d1de36345ac73962c50540e6f48"`,
    );
    await queryRunner.query(
      `ALTER TABLE "geolocations" DROP CONSTRAINT "FK_ef002e16f5814d6ff44655bac91"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" DROP CONSTRAINT "FK_383ac461c63dd52c22ba73a6624"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_aaa8a6effc7bd20a1172d3a3bc8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_cf803e7bc9c4823b6ab03de6c13"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dcf9b8b7ad08a623921d176641"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_51dc0cf787d88358684bfe25d3"`,
    );
    await queryRunner.query(`DROP TABLE "users_consists_rooms_rooms"`);
    await queryRunner.query(`DROP TABLE "room_permission"`);
    await queryRunner.query(`DROP TABLE "geolocations"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "rooms"`);
    await queryRunner.query(`DROP TABLE "messages"`);
  }
}
