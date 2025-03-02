import { MigrationInterface, QueryRunner } from "typeorm";

export class FCM1740891436913 implements MigrationInterface {
    name = 'FCM1740891436913'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`fcm_tokens\` (\`id\` int NOT NULL AUTO_INCREMENT, \`token\` varchar(255) NOT NULL, \`userEmail\` varchar(255) NULL, UNIQUE INDEX \`IDX_639c0f1d38d97d778122d4f299\` (\`token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`fcm_tokens\` ADD CONSTRAINT \`FK_4d2c667761410ee332d0895698d\` FOREIGN KEY (\`userEmail\`) REFERENCES \`users\`(\`email\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`fcm_tokens\` DROP FOREIGN KEY \`FK_4d2c667761410ee332d0895698d\``);
        await queryRunner.query(`DROP INDEX \`IDX_639c0f1d38d97d778122d4f299\` ON \`fcm_tokens\``);
        await queryRunner.query(`DROP TABLE \`fcm_tokens\``);
    }

}
