import { MigrationInterface, QueryRunner } from "typeorm";

export class Uno1740799869266 implements MigrationInterface {
    name = 'Uno1740799869266'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`neighborhoods\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(255) NOT NULL, \`direccion\` varchar(255) NOT NULL, \`colonia\` varchar(255) NOT NULL, \`estado\` varchar(255) NOT NULL, \`numeroCasas\` int NOT NULL, \`ownerEmail\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, PRIMARY KEY (\`email\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`neighborhoods\` ADD CONSTRAINT \`FK_92ffd08d3d6d593c9a5b9c25073\` FOREIGN KEY (\`ownerEmail\`) REFERENCES \`users\`(\`email\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`neighborhoods\` DROP FOREIGN KEY \`FK_92ffd08d3d6d593c9a5b9c25073\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`neighborhoods\``);
    }

}
