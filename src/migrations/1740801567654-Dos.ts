import { MigrationInterface, QueryRunner } from "typeorm";

export class Dos1740801567654 implements MigrationInterface {
    name = 'Dos1740801567654'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`neighborhoods\` DROP FOREIGN KEY \`FK_92ffd08d3d6d593c9a5b9c25073\``);
        await queryRunner.query(`ALTER TABLE \`neighborhoods\` ADD \`codigo\` varchar(5) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`neighborhoods\` ADD UNIQUE INDEX \`IDX_42a230cfca6a760bc7d41553f0\` (\`codigo\`)`);
        await queryRunner.query(`ALTER TABLE \`neighborhoods\` ADD \`numeroCasasRegistradas\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`neighborhoods\` ADD CONSTRAINT \`FK_92ffd08d3d6d593c9a5b9c25073\` FOREIGN KEY (\`ownerEmail\`) REFERENCES \`users\`(\`email\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`neighborhoods\` DROP FOREIGN KEY \`FK_92ffd08d3d6d593c9a5b9c25073\``);
        await queryRunner.query(`ALTER TABLE \`neighborhoods\` DROP COLUMN \`numeroCasasRegistradas\``);
        await queryRunner.query(`ALTER TABLE \`neighborhoods\` DROP INDEX \`IDX_42a230cfca6a760bc7d41553f0\``);
        await queryRunner.query(`ALTER TABLE \`neighborhoods\` DROP COLUMN \`codigo\``);
        await queryRunner.query(`ALTER TABLE \`neighborhoods\` ADD CONSTRAINT \`FK_92ffd08d3d6d593c9a5b9c25073\` FOREIGN KEY (\`ownerEmail\`) REFERENCES \`users\`(\`email\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
