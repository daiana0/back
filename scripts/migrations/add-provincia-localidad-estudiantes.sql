ALTER TABLE estudiantes
  ADD COLUMN provincia VARCHAR(100) NULL AFTER domicilio,
  ADD COLUMN localidad VARCHAR(100) NULL AFTER provincia;
