import { MigrationInterface, QueryRunner } from "typeorm";

export class Residents1740879908879 implements MigrationInterface {
    name = 'Residents1740879908879'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`residents\` (\`id\` int NOT NULL AUTO_INCREMENT, \`calle\` varchar(255) NOT NULL, \`numeroCasa\` varchar(255) NOT NULL, \`modoVisita\` tinyint NOT NULL DEFAULT 0, \`firebaseCMId\` varchar(255) NULL, \`codigoInvitado\` varchar(6) NULL, \`userEmail\` varchar(255) NULL, \`neighborhoodId\` int NULL, UNIQUE INDEX \`IDX_8e2563f27c2ad1503064051aa9\` (\`codigoInvitado\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`neighborhoods\` ADD \`numeroVigilantes\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`neighborhoods\` ADD \`numeroVigilantesRegistados\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`residents\` ADD CONSTRAINT \`FK_0db41faf51ef75766e0d29ada10\` FOREIGN KEY (\`userEmail\`) REFERENCES \`users\`(\`email\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`residents\` ADD CONSTRAINT \`FK_25c196153263dd24c3f8dd39701\` FOREIGN KEY (\`neighborhoodId\`) REFERENCES \`neighborhoods\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`residents\` DROP FOREIGN KEY \`FK_25c196153263dd24c3f8dd39701\``);
        await queryRunner.query(`ALTER TABLE \`residents\` DROP FOREIGN KEY \`FK_0db41faf51ef75766e0d29ada10\``);
        await queryRunner.query(`ALTER TABLE \`neighborhoods\` DROP COLUMN \`numeroVigilantesRegistados\``);
        await queryRunner.query(`ALTER TABLE \`neighborhoods\` DROP COLUMN \`numeroVigilantes\``);
        await queryRunner.query(`DROP INDEX \`IDX_8e2563f27c2ad1503064051aa9\` ON \`residents\``);
        await queryRunner.query(`DROP TABLE \`residents\``);
    }

}
