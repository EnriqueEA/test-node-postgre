create database "db-clientes";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table clientes (
   id uuid primary key,
   fname text,
   lname text,
   address text,
   status smallint NOT NULL DEFAULT 1 CHECK (status IN (0, 1)),
   birthdate date CHECK (birthdate < '2100-01-01'),
   created TIMESTAMP DEFAULT NOW(),
   updated TIMESTAMP DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON clientes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE OR REPLACE FUNCTION insertar_cliente(fname text, lname text, address text, status integer, birthdate date)
RETURNS clientes AS $$
DECLARE
   registro clientes;
BEGIN
   INSERT INTO clientes
   VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5) RETURNING * INTO registro;
   RETURN registro;
END
$$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE actualizar_cliente(uuid uuid, fname text, lname text, address text, status integer, birthdate date)
AS $$
BEGIN
   UPDATE clientes SET
   fname = $2,
   lname = $3,
   address = $4,
   status = $5,
   birthdate = $6
   WHERE id = $1;
END
$$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE eliminar_cliente(uuid)
AS $$
BEGIN
   DELETE FROM clientes
   WHERE id = $1;
END
$$
LANGUAGE plpgsql;
