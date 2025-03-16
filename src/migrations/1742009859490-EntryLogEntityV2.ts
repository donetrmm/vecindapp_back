import { MigrationInterface, QueryRunner } from "typeorm";

export class EntryLogEntityV21742009859490 implements MigrationInterface {
    name = 'EntryLogEntityV21742009859490'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`entry_logs\` ADD \`vecindarioId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`entry_logs\` ADD CONSTRAINT \`FK_6b5dc4a0738e108d3e4bfcfc9aa\` FOREIGN KEY (\`vecindarioId\`) REFERENCES \`neighborhoods\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`entry_logs\` DROP FOREIGN KEY \`FK_6b5dc4a0738e108d3e4bfcfc9aa\``);
        await queryRunner.query(`ALTER TABLE \`entry_logs\` DROP COLUMN \`vecindarioId\``);
    }

}
