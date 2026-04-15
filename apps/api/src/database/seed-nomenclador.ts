import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { Prestacion } from '../modules/configuracion/entities/prestacion.entity';
import * as path from 'path';
import * as fs from 'fs';

async function seedNomenclador() {
  console.log('🦷 Seeding nomenclador odontológico...');

  const dataSource = new DataSource({
    ...typeOrmConfig as any,
    entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
  });

  try {
    await dataSource.initialize();
    const repo = dataSource.getRepository(Prestacion);

    const jsonPath = path.join(__dirname, '../../../nomenclador_odontologico_pro.json');
    const items = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    let created = 0;
    let skipped = 0;

    for (const item of items) {
      const existing = await repo.findOneBy({ codigo: item.codigo, esSistema: true });
      if (existing) { skipped++; continue; }

      await repo.save({
        codigo:       item.codigo,
        nombre:       item.nombre,
        categoria:    item.categoria,
        subcategoria: item.subcategoria,
        origen:       item.origen,
        activo:       item.activo ?? true,
        honorarios:   0,
        esSistema:    true,
      });
      created++;
    }

    console.log(`✅ Nomenclador cargado: ${created} creadas, ${skipped} ya existían.`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await dataSource.destroy();
  }
}

seedNomenclador();
