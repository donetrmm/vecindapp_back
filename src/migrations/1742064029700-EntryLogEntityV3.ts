import { MigrationInterface, QueryRunner } from "typeorm";

export class EntryLogEntityV31742064029700 implements MigrationInterface {
    name = 'EntryLogEntityV31742064029700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`entry_logs\` DROP FOREIGN KEY \`FK_ee12c378659e973337af363a0f6\``);
        await queryRunner.query(`ALTER TABLE \`entry_logs\` CHANGE \`residenciaId\` \`residencia\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`entry_logs\` DROP COLUMN \`residencia\``);
        await queryRunner.query(`ALTER TABLE \`entry_logs\` ADD \`residencia\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`entry_logs\` DROP COLUMN \`residencia\``);
        await queryRunner.query(`ALTER TABLE \`entry_logs\` ADD \`residencia\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`entry_logs\` CHANGE \`residencia\` \`residenciaId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`entry_logs\` ADD CONSTRAINT \`FK_ee12c378659e973337af363a0f6\` FOREIGN KEY (\`residenciaId\`) REFERENCES \`residents\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
