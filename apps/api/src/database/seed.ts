import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { Usuario } from '../modules/usuarios/entities/usuario.entity';
import { Rol } from '../modules/usuarios/entities/rol.entity';
import { UsuarioRol } from '../modules/usuarios/entities/usuario-rol.entity';
import { Paciente } from '../modules/pacientes/entities/paciente.entity';
import { Profesional } from '../modules/profesionales/entities/profesional.entity';
import { Consultorio } from '../modules/consultorios/entities/consultorio.entity';
import * as bcrypt from 'bcryptjs';
import * as path from 'path';

async function seed() {
  console.log('🌱 Starting database seed...');
  
  const dataSource = new DataSource({
    ...typeOrmConfig as any,
    entities: [path.join(__dirname, '../**/*.entity.ts')]
  });

  try {
    await dataSource.initialize();
    console.log('📡 Database connection established.');

    const rolRepository = dataSource.getRepository(Rol);
    const usuarioRepository = dataSource.getRepository(Usuario);
    const usuarioRolRepository = dataSource.getRepository(UsuarioRol);
    const pacienteRepository = dataSource.getRepository(Paciente);
    const profesionalRepository = dataSource.getRepository(Profesional);
    const consultorioRepository = dataSource.getRepository(Consultorio);

    // 1. Seed Roles
    console.log('🔑 Seeding roles...');
    const rolesData = [
      { nombre: 'ADMIN', descripcion: 'Administrador del sistema' },
      { nombre: 'PROFESIONAL', descripcion: 'Odontólogo / Profesional de salud' },
      { nombre: 'RECEPCIONISTA', descripcion: 'Personal de recepción' },
      { nombre: 'PACIENTE', descripcion: 'Paciente con acceso al portal' },
    ];

    for (const roleData of rolesData) {
      const existing = await rolRepository.findOneBy({ nombre: roleData.nombre });
      if (!existing) {
        await rolRepository.save(roleData);
        console.log(`✅ Role ${roleData.nombre} created.`);
      }
    }

    const roles = await rolRepository.find();
    const adminRole = roles.find(r => r.nombre.toUpperCase() === 'ADMIN')!;
    const profRole = roles.find(r => r.nombre.toUpperCase() === 'PROFESIONAL')!;

    // 2. Seed Admin User
    console.log('👤 Seeding admin user...');
    const adminEmail = 'admin@odontologia.com';
    let adminUser = await usuarioRepository.findOneBy({ email: adminEmail });
    
    if (!adminUser) {
      const passwordHash = await bcrypt.hash('Admin123!', 10);
      adminUser = await usuarioRepository.save({
        email: adminEmail,
        passwordHash,
        nombre: 'Admin',
        apellido: 'System',
        activo: true,
      });

      await usuarioRolRepository.save({
        usuarioId: adminUser.id,
        rolId: adminRole.id
      });
      console.log('✅ Admin user created.');
    }

    // 3. Seed Professional
    console.log('👨‍⚕️ Seeding professional...');
    const profEmail = 'doctor@odontologia.com';
    let profUser = await usuarioRepository.findOneBy({ email: profEmail });

    if (!profUser) {
      const passwordHash = await bcrypt.hash('Doctor123!', 10);
      profUser = await usuarioRepository.save({
        email: profEmail,
        passwordHash,
        nombre: 'Mauricio',
        apellido: 'Lopez',
        activo: true,
      });

      await usuarioRolRepository.save({
        usuarioId: profUser.id,
        rolId: profRole.id
      });

      await profesionalRepository.save({
        usuarioId: profUser.id,
        especialidad: 'Odontología General',
        matricula: 'MP 12345'
      });
      console.log('✅ Professional created.');
    }

    // 4. Seed Consultorios
    console.log('🏢 Seeding consultorios...');
    const consultoriosData = [
      { nombre: 'Consultorio A' },
      { nombre: 'Consultorio B' },
    ];

    for (const consData of consultoriosData) {
      const existing = await consultorioRepository.findOneBy({ nombre: consData.nombre });
      if (!existing) {
        await consultorioRepository.save(consData);
        console.log(`✅ Consultorio ${consData.nombre} created.`);
      }
    }

    // 5. Seed Patients
    console.log('👥 Seeding patients...');
    const patientsData = [
      { nombre: 'Juan', apellido: 'Perez', documento: '12345678', email: 'juan.perez@example.com', telefono: '555-0101' },
      { nombre: 'Maria', apellido: 'García', documento: '23456789', email: 'maria.garcia@example.com', telefono: '555-0202' },
      { nombre: 'Carlos', apellido: 'Ramirez', documento: '34567890', email: 'carlos.ramirez@example.com', telefono: '555-0303' },
    ];

    for (const patData of patientsData) {
      const existing = await pacienteRepository.findOneBy({ documento: patData.documento });
      if (!existing) {
        await pacienteRepository.save(patData);
        console.log(`✅ Patient ${patData.nombre} ${patData.apellido} created.`);
      }
    }

    console.log('✨ Seeding completed successfully.');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await dataSource.destroy();
  }
}

seed();
