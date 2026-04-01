-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Esquema Base (Tenancy / Sucursal)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(255) NOT NULL,
    subdominio VARCHAR(100) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE sucursales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id),
    nombre VARCHAR(255) NOT NULL,
    direccion TEXT,
    telefono VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Usuarios y Roles
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(50) UNIQUE NOT NULL, -- admin, odontologo, recepcionista, asistente
    descripcion TEXT
);

CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE usuario_roles (
    usuario_id UUID REFERENCES usuarios(id),
    rol_id UUID REFERENCES roles(id),
    PRIMARY KEY (usuario_id, rol_id)
);

-- Profesionales y Consultorios
CREATE TABLE profesionales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) UNIQUE,
    especialidad VARCHAR(100),
    matricula VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE consultorios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sucursal_id UUID REFERENCES sucursales(id),
    nombre VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

-- Pacientes y Fichas Clínicas
CREATE TABLE pacientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    documento VARCHAR(50),
    fecha_nacimiento DATE,
    genero VARCHAR(20),
    telefono VARCHAR(50),
    email VARCHAR(255),
    direccion TEXT,
    obra_social VARCHAR(100),
    nro_afiliado VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE fichas_clinicas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID REFERENCES pacientes(id) UNIQUE,
    observaciones_generales TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE antecedentes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ficha_id UUID REFERENCES fichas_clinicas(id),
    tipo VARCHAR(100), -- medico, dental, familiar
    descripcion TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE evoluciones_clinicas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ficha_id UUID REFERENCES fichas_clinicas(id),
    profesional_id UUID REFERENCES profesionales(id),
    descripcion TEXT NOT NULL,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Archivos y Radiologías
CREATE TABLE documentos_adjuntos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID REFERENCES pacientes(id),
    nombre_archivo VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100),
    size_bytes BIGINT,
    path TEXT NOT NULL,
    uploaded_by UUID REFERENCES usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE radiografias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID REFERENCES pacientes(id),
    tipo VARCHAR(100), -- periapical, panoramica, etc
    nombre_archivo VARCHAR(255) NOT NULL,
    path TEXT NOT NULL,
    fecha_toma DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Odontograma y Tratamientos
-- Un tratamiento definido (ej: Limpieza, Extracción, etc)
CREATE TABLE tratamientos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(255) NOT NULL,
    codigo VARCHAR(50),
    precio_base DECIMAL(12, 2),
    descripcion TEXT
);

CREATE TABLE odontogramas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID REFERENCES pacientes(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE piezas_dentales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    odontograma_id UUID REFERENCES odontogramas(id),
    nro_pieza INTEGER NOT NULL, -- 11-18, 21-28, 31-38, 41-48
    estado VARCHAR(100), -- sano, caries, extraccion_indicada, ausente, etc
    observaciones TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(odontograma_id, nro_pieza)
);

-- Planes de Tratamiento y Presupuestos
CREATE TABLE planes_tratamiento (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID REFERENCES pacientes(id),
    profesional_id UUID REFERENCES profesionales(id),
    nombre VARCHAR(255) NOT NULL, -- Ej: "Plan Restauración Superior"
    estado VARCHAR(50) DEFAULT 'borrador', -- borrador, aceptado, rechazado, finalizado
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE plan_tratamiento_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID REFERENCES planes_tratamiento(id),
    tratamiento_id UUID REFERENCES tratamientos(id),
    nro_pieza INTEGER, -- Opcional, si es específico a una pieza
    precio_final DECIMAL(12, 2),
    completado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE presupuestos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID REFERENCES planes_tratamiento(id),
    paciente_id UUID REFERENCES pacientes(id),
    total DECIMAL(12, 2) NOT NULL,
    total_pagado DECIMAL(12, 2) DEFAULT 0,
    estado VARCHAR(50) DEFAULT 'pendiente', -- pendiente, parcial, pagado, cancelado
    fecha_emision DATE DEFAULT CURRENT_DATE,
    validez DATE
);

CREATE TABLE pagos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    presupuesto_id UUID REFERENCES presupuestos(id),
    monto DECIMAL(12, 2) NOT NULL,
    metodo_pago VARCHAR(50), -- efectivo, tarjeta, transferencia
    referencia VARCHAR(100),
    fecha_pago TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Agenda y Turnos
CREATE TABLE turnos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sucursal_id UUID REFERENCES sucursales(id),
    paciente_id UUID REFERENCES pacientes(id),
    profesional_id UUID REFERENCES profesionales(id),
    consultorio_id UUID REFERENCES consultorios(id),
    fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    fecha_fin TIMESTAMP WITH TIME ZONE NOT NULL,
    estado VARCHAR(50) DEFAULT 'programado', -- programado, confirmado, atendido, cancelado, ausente
    motivo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recordatorios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    turno_id UUID REFERENCES turnos(id),
    tipo_canal VARCHAR(20), -- whatsapp, email, sms
    fecha_envio_programada TIMESTAMP WITH TIME ZONE,
    estado VARCHAR(20) DEFAULT 'pendiente', -- pendiente, enviado, fallido
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_pacientes_documento ON pacientes(documento);
CREATE INDEX idx_pacientes_nombre ON pacientes(nombre, apellido);
CREATE INDEX idx_turnos_fecha ON turnos(fecha_inicio);
CREATE INDEX idx_turnos_profesional ON turnos(profesional_id, fecha_inicio);
CREATE INDEX idx_turnos_consultorio ON turnos(consultorio_id, fecha_inicio);
