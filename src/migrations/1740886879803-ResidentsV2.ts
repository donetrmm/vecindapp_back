import { MigrationInterface, QueryRunner } from "typeorm";

export class ResidentsV21740886879803 implements MigrationInterface {
    name = 'ResidentsV21740886879803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`residents\` DROP COLUMN \`firebaseCMId\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`residents\` ADD \`firebaseCMId\` varchar(255) NULL`);
    }

}
