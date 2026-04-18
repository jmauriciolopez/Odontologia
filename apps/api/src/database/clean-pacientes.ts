import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import * as path from 'path';

async function cleanPacientes() {
  console.log('🧹 Limpiando datos de pacientes...');

  const dataSource = new DataSource({
    ...typeOrmConfig as any,
    entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
  });

  try {
    await dataSource.initialize();
    console.log('📡 Conexión establecida.');

    // TRUNCATE CASCADE elimina en cascada sin importar el orden de FK
    await dataSource.query(`TRUNCATE TABLE pacientes CASCADE`);
    console.log('🗑️  pacientes y todas las tablas relacionadas limpiadas.');

    console.log('✅ Limpieza completada.');
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

cleanPacientes();
