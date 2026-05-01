-- Migración de DocumentosAdjuntos y Radiografías a la tabla unificada Archivos

-- 1. Crear la tabla archivos si no existe (basada en la entidad Archivo)
CREATE TABLE IF NOT EXISTS "archivos" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "tenant_id" uuid,
    "pacienteId" uuid NOT NULL,
    "nombre" character varying NOT NULL,
    "mimeType" character varying,
    "sizeBytes" integer,
    "path" character varying NOT NULL,
    "uploadedById" uuid,
    "categoria" character varying NOT NULL,
    "metadata" jsonb DEFAULT '{}',
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
    "deletedAt" TIMESTAMP,
    CONSTRAINT "PK_archivos_id" PRIMARY KEY ("id")
);

-- 2. Migrar Documentos Adjuntos
INSERT INTO "archivos" (
    "id", 
    "pacienteId", 
    "nombre", 
    "mimeType", 
    "sizeBytes", 
    "path", 
    "uploadedById", 
    "categoria",
    "createdAt",
    "updatedAt",
    "deletedAt"
)
SELECT 
    "id", 
    "pacienteId", 
    "nombreArchivo", 
    "mimeType", 
    "sizeBytes", 
    "path", 
    "uploadedById", 
    'DOCUMENTO',
    "createdAt",
    "updatedAt",
    "deletedAt"
FROM "documentos_adjuntos"
ON CONFLICT (id) DO NOTHING;

-- 3. Migrar Radiografías
INSERT INTO "archivos" (
    "id", 
    "pacienteId", 
    "nombre", 
    "path", 
    "categoria",
    "metadata",
    "createdAt",
    "updatedAt",
    "deletedAt"
)
SELECT 
    "id", 
    "pacienteId", 
    "nombreArchivo", 
    "path", 
    'RADIOGRAFIA',
    jsonb_build_object('tipo', "tipo", 'fechaToma', "fechaToma"),
    "createdAt",
    "updatedAt",
    "deletedAt"
FROM "radiografias"
ON CONFLICT (id) DO NOTHING;

-- NOTA: No borramos las tablas originales todavía para seguridad. 
-- Una vez verificado, se pueden ejecutar:
-- DROP TABLE "documentos_adjuntos";
-- DROP TABLE "radiografias";
