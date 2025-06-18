-- 1. Crear la base de datos
IF DB_ID('Tienda') IS NULL
    CREATE DATABASE Tienda;
GO

-- 2. Usar la base de datos
USE Tienda;
GO

-- 3. Crear tabla Producto
IF OBJECT_ID('Producto') IS NULL
CREATE TABLE Producto (
    id_producto INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL
);
GO

-- 4. Crear tabla Vendedor
IF OBJECT_ID('Vendedor') IS NULL
CREATE TABLE Vendedor (
    id_vendedor INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    dni VARCHAR(20) UNIQUE
);
GO

-- 5. Crear tabla Venta
IF OBJECT_ID('Venta') IS NULL
CREATE TABLE Venta (
    id_venta INT IDENTITY(1,1) PRIMARY KEY,
    fecha DATETIME NOT NULL DEFAULT GETDATE(),
    id_vendedor INT,
    total DECIMAL(10,2),
    FOREIGN KEY (id_vendedor) REFERENCES Vendedor(id_vendedor)
);
GO

-- 6. Crear tabla DetalleVenta
IF OBJECT_ID('DetalleVenta') IS NULL
CREATE TABLE DetalleVenta (
    id_detalle INT IDENTITY(1,1) PRIMARY KEY,
    id_venta INT,
    id_producto INT,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal AS (cantidad * precio_unitario) PERSISTED,
    FOREIGN KEY (id_venta) REFERENCES Venta(id_venta),
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);
GO

-- 7. Crear tipo de dato tabla
IF NOT EXISTS (
    SELECT 1 FROM sys.types WHERE is_table_type = 1 AND name = 'TipoDetalleVenta'
)
    CREATE TYPE TipoDetalleVenta AS TABLE (
        id_producto INT,
        cantidad INT
    );
GO

-- 8. Crear tabla Meta
IF OBJECT_ID('Meta') IS NULL
CREATE TABLE Meta (
    id_meta INT IDENTITY(1,1) PRIMARY KEY,
    fecha_creacion DATETIME NOT NULL DEFAULT GETDATE(),
    descripcion NVARCHAR(255),
    periodo NVARCHAR(50), -- Por ejemplo: 'Mensual', 'Trimestral', etc.
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    tipo NVARCHAR(20) CHECK (tipo IN ('ingreso', 'ventas')) NOT NULL,
    cantidad DECIMAL(10,2) NOT NULL
);
GO