import { MigrationInterface, QueryRunner } from "typeorm";

export class CodeUses1742490514348 implements MigrationInterface {
    name = 'CodeUses1742490514348'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`residents\` ADD \`usosCodigo\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`residents\` DROP COLUMN \`usosCodigo\``);
    }

}
