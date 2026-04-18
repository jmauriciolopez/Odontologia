-- Agrega FK obra_social_id a pacientes (nullable, no rompe datos existentes)
ALTER TABLE pacientes
  ADD COLUMN IF NOT EXISTS obra_social_id UUID REFERENCES obras_sociales(id) ON DELETE SET NULL;
