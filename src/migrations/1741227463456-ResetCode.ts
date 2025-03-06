import { MigrationInterface, QueryRunner } from "typeorm";

export class ResetCode1741227463456 implements MigrationInterface {
    name = 'ResetCode1741227463456'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_8e2563f27c2ad1503064051aa9\` ON \`residents\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_8e2563f27c2ad1503064051aa9\` ON \`residents\` (\`codigoInvitado\`)`);
    }

}
