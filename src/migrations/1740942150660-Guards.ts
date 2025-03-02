import { MigrationInterface, QueryRunner } from "typeorm";

export class Guards1740942150660 implements MigrationInterface {
    name = 'Guards1740942150660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`security_guards\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userEmail\` varchar(255) NULL, \`neighborhoodId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`security_guards\` ADD CONSTRAINT \`FK_f89903ae033bedc0cbccf62793a\` FOREIGN KEY (\`userEmail\`) REFERENCES \`users\`(\`email\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`security_guards\` ADD CONSTRAINT \`FK_c315f14aed7a59bd7975d102fee\` FOREIGN KEY (\`neighborhoodId\`) REFERENCES \`neighborhoods\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`security_guards\` DROP FOREIGN KEY \`FK_c315f14aed7a59bd7975d102fee\``);
        await queryRunner.query(`ALTER TABLE \`security_guards\` DROP FOREIGN KEY \`FK_f89903ae033bedc0cbccf62793a\``);
        await queryRunner.query(`DROP TABLE \`security_guards\``);
    }

}
