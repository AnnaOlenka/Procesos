USE Tienda;
-- Insertar productos
INSERT INTO Producto (nombre, precio, stock) VALUES
('Laptop', 2500.00, 10),
('Mouse', 50.00, 100),
('Teclado', 120.00, 50);

-- Insertar vendedores
INSERT INTO Vendedor (nombre, dni) VALUES
('Carlos Pérez', '12345678'),
('María López', '87654321');

-- Insertar venta
INSERT INTO Venta (id_vendedor, total) VALUES (1, 2600.00);

-- Insertar detalle de venta
INSERT INTO DetalleVenta (id_venta, id_producto, cantidad, precio_unitario)
VALUES
(1, 1, 1, 2500.00),  -- 1 Laptop
(1, 2, 2, 50.00);    -- 2 Mouse
GO

------- Ejemplo como insertar un producto con procedimientos almacenados ------
EXEC AgregarProducto
    @nombre = 'Laptop Lenovo Ideapad',
    @precio = 2500.00,
    @stock = 15;
GO

------- Ejemplo como insertar un vendedor con procedimientos almacenados ------
EXEC AgregarVendedor
    @nombre = 'Juan Pérez',
    @dni = '12345678';
GO

------- Ejemplo como insertar una venta con procedimientos almacenados ------
-- Venta 1
DECLARE @venta1 TipoDetalleVenta;
INSERT INTO @venta1 (id_producto, cantidad)
VALUES (1, 2), (2, 1);

EXEC RegistrarVentaMultiple
    @id_vendedor = 1,
    @productos = @venta1;

-- Venta 2
DECLARE @venta2 TipoDetalleVenta;
INSERT INTO @venta2 (id_producto, cantidad)
VALUES (2, 3), (3, 2);

EXEC RegistrarVentaMultiple
    @id_vendedor = 2,
    @productos = @venta2;
GO

------- Ejemplo como insertar una meta con procedimientos almacenados ------
EXEC AgregarMeta
    @descripcion = 'Meta de ventas para julio',
    @periodo = 'Mensual',
    @fecha_inicio = '2025-07-01',
    @fecha_fin = '2025-07-31',
    @tipo = 'ventas',
    @cantidad = 10000;
GO