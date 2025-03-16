import { MigrationInterface, QueryRunner } from "typeorm";

export class SecurityGuardLog1742103283220 implements MigrationInterface {
    name = 'SecurityGuardLog1742103283220'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`security_guard_logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`entrada\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`salida\` timestamp NULL, \`vecindarioId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`security_guard_logs\` ADD CONSTRAINT \`FK_d86cc7512a87d15da94b88ed13c\` FOREIGN KEY (\`vecindarioId\`) REFERENCES \`neighborhoods\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`security_guard_logs\` DROP FOREIGN KEY \`FK_d86cc7512a87d15da94b88ed13c\``);
        await queryRunner.query(`DROP TABLE \`security_guard_logs\``);
    }

}
