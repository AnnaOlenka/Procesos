-- 1. Crear la base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS Tienda;

-- 2. Usar la base de datos
USE Tienda;

-- 3. Crear tabla Producto
CREATE TABLE IF NOT EXISTS Producto (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL
);

-- 4. Crear tabla Vendedor
CREATE TABLE IF NOT EXISTS Vendedor (
    id_vendedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    dni VARCHAR(20) UNIQUE
);

-- 5. Crear tabla Venta
CREATE TABLE IF NOT EXISTS Venta (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME NOT NULL DEFAULT NOW(),
    id_vendedor INT,
    total DECIMAL(10,2),
    FOREIGN KEY (id_vendedor) REFERENCES Vendedor(id_vendedor)
);

-- 6. Crear tabla DetalleVenta
CREATE TABLE IF NOT EXISTS DetalleVenta (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT,
    id_producto INT,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    FOREIGN KEY (id_venta) REFERENCES Venta(id_venta),
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);

-- 7. No se crea el tipo de tabla como en SQL Server (MySQL no tiene tipos de tabla definidos por el usuario).
-- Si necesitas este tipo de estructura en MySQL, lo manejarías desde el código del backend o una tabla temporal.

-- 8. Crear tabla Meta
CREATE TABLE IF NOT EXISTS Meta (
    id_meta INT AUTO_INCREMENT PRIMARY KEY,
    fecha_creacion DATETIME NOT NULL DEFAULT NOW(),
    descripcion VARCHAR(255),
    periodo VARCHAR(50), -- Por ejemplo: 'Mensual', 'Trimestral', etc.
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    cantidad DECIMAL(10,2) NOT NULL
);
