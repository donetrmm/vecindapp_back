import { MigrationInterface, QueryRunner } from "typeorm";

export class EntryLogEntity1742008582866 implements MigrationInterface {
    name = 'EntryLogEntity1742008582866'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`entry_logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(255) NOT NULL, \`fechaEntrada\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`placaCarro\` varchar(255) NULL, \`vigilante\` varchar(255) NOT NULL, \`residenciaId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`entry_logs\` ADD CONSTRAINT \`FK_ee12c378659e973337af363a0f6\` FOREIGN KEY (\`residenciaId\`) REFERENCES \`residents\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`entry_logs\` DROP FOREIGN KEY \`FK_ee12c378659e973337af363a0f6\``);
        await queryRunner.query(`DROP TABLE \`entry_logs\``);
    }

}
