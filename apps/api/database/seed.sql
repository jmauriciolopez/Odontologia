-- Roles
INSERT INTO roles (nombre, descripcion) VALUES
('ADMIN', 'Administrador total del sistema'),
('ODONTOLOGO', 'Profesional de salud dental'),
('RECEPCIONISTA', 'Personal administrativo de turnos y recepción'),
('ASISTENTE', 'Asistente dental');

-- Tenant y Sucursal
INSERT INTO tenants (id, nombre, subdominio) VALUES
('d1111111-1111-1111-1111-111111111111', 'Clínica Dental Maipu', 'clinicamaipu');

INSERT INTO sucursales (id, tenant_id, nombre, direccion, telefono) VALUES
('s1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'Sede Central', 'Av. Maipú 123', '+54-11-4444-5555');

-- Usuarios (password: 'admin123' hash mockeado - bcrypt $2a$10$...)
-- Nota: En producción esto se hashea dinámicamente.
INSERT INTO usuarios (id, tenant_id, email, password_hash, nombre, apellido) VALUES
('u1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'admin@clinicamaipu.com', '$2a$10$7vM7p6196/q26t.G/XU5E.Z6z6L6P/j80T3v6vG6vG6vG6vG6vG6v', 'Mauricio', 'Lopez'),
('u2222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111', 'drlopez@clinicamaipu.com', '$2a$10$7vM7p6196/q26t.G/XU5E.Z6z6L6P/j80T3v6vG6vG6vG6vG6vG6v', 'Juan', 'Perez'),
('u3333333-3333-3333-3333-333333333333', 'd1111111-1111-1111-1111-111111111111', 'draortíz@clinicamaipu.com', '$2a$10$7vM7p6196/q26t.G/XU5E.Z6z6L6P/j80T3v6vG6vG6vG6vG6vG6v', 'Ana', 'Ortíz');

-- Asignación de Roles
INSERT INTO usuario_roles (usuario_id, rol_id) VALUES
('u1111111-1111-1111-1111-111111111111', (SELECT id FROM roles WHERE nombre = 'ADMIN')),
('u2222222-2222-2222-2222-222222222222', (SELECT id FROM roles WHERE nombre = 'ODONTOLOGO')),
('u3333333-3333-3333-3333-333333333333', (SELECT id FROM roles WHERE nombre = 'ODONTOLOGO'));

-- Profesionales
INSERT INTO profesionales (id, usuario_id, especialidad, matricula) VALUES
('p1111111-1111-1111-1111-111111111111', 'u2222222-2222-2222-2222-222222222222', 'Implantes', 'MN-12345'),
('p2222222-2222-2222-2222-222222222222', 'u3333333-3333-3333-3333-333333333333', 'Ortodoncia', 'MN-67890');

-- Consultorios
INSERT INTO consultorios (id, sucursal_id, nombre) VALUES
('c1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'Consultorio 1 (Gral)'),
('c2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'Consultorio 2 (Rayos)');

-- Pacientes
INSERT INTO pacientes (id, tenant_id, nombre, apellido, documento, fecha_nacimiento, genero) VALUES
('pa111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'Carlos', 'Gomez', '11222333', '1985-05-20', 'Masculino'),
('pa222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111', 'Elena', 'Torres', '20333444', '1990-10-12', 'Femenino'),
('pa333333-3333-3333-3333-333333333333', 'd1111111-1111-1111-1111-111111111111', 'Marta', 'Rodriguez', '15666777', '1975-03-05', 'Femenino');

-- Fichas Clínicas
INSERT INTO fichas_clinicas (paciente_id) VALUES
('pa111111-1111-1111-1111-111111111111'),
('pa222222-2222-2222-2222-222222222222'),
('pa333333-3333-3333-3333-333333333333');

-- Odontograma Demo
INSERT INTO odontogramas (id, paciente_id) VALUES
('od111111-1111-1111-1111-111111111111', 'pa111111-1111-1111-1111-111111111111');

-- Piezas Base para el Odontograma (Ejemplo de algunas piezas)
INSERT INTO piezas_dentales (odontograma_id, nro_pieza, estado, observaciones) VALUES
('od111111-1111-1111-1111-111111111111', 11, 'SANO', 'Ninguna'),
('od111111-1111-1111-1111-111111111111', 12, 'CARIES', 'Caries en cara oclusal'),
('od111111-1111-1111-1111-111111111111', 13, 'OBTURADO', 'Resina mesial'),
('od111111-1111-1111-1111-111111111111', 14, 'AUSENTE', 'Extracción previa');

-- Tratamientos Base
INSERT INTO tratamientos (nombre, codigo, precio_base) VALUES
('Limpieza y Profilaxis', 'PR01', 5000.00),
('Resina Compuesta (Caries)', 'RE01', 12000.00),
('Endodoncia (Trat. Conducto)', 'EN01', 45000.00),
('Implante Dental', 'IM01', 150000.00),
('Corona Porcelana', 'CO01', 80000.00);
