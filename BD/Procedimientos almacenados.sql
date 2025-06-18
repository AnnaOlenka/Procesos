USE Tienda;
GO

-- 1. Se crea un procedimiento para registrar varias ventas
CREATE OR ALTER PROCEDURE RegistrarVentaMultiple
    @id_vendedor INT,
    @productos TipoDetalleVenta READONLY
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        DECLARE @total DECIMAL(10,2) = 0,
                @precio_unitario DECIMAL(10,2),
                @id_producto INT,
                @cantidad INT;

        -- Calcular total
        DECLARE cur1 CURSOR FOR SELECT id_producto, cantidad FROM @productos;
        OPEN cur1;
        FETCH NEXT FROM cur1 INTO @id_producto, @cantidad;
        WHILE @@FETCH_STATUS = 0
        BEGIN
            SELECT @precio_unitario = precio FROM Producto WHERE id_producto = @id_producto;
            SET @total += @precio_unitario * @cantidad;
            FETCH NEXT FROM cur1 INTO @id_producto, @cantidad;
        END
        CLOSE cur1; DEALLOCATE cur1;

        -- Insertar venta
        INSERT INTO Venta (id_vendedor, total)
        VALUES (@id_vendedor, @total);
        DECLARE @id_venta INT = SCOPE_IDENTITY();

        -- Insertar detalle y actualizar stock
        DECLARE cur2 CURSOR FOR SELECT id_producto, cantidad FROM @productos;
        OPEN cur2;
        FETCH NEXT FROM cur2 INTO @id_producto, @cantidad;
        WHILE @@FETCH_STATUS = 0
        BEGIN
            SELECT @precio_unitario = precio FROM Producto WHERE id_producto = @id_producto;

            INSERT INTO DetalleVenta (id_venta, id_producto, cantidad, precio_unitario)
            VALUES (@id_venta, @id_producto, @cantidad, @precio_unitario);

            UPDATE Producto
            SET stock = stock - @cantidad
            WHERE id_producto = @id_producto;

            FETCH NEXT FROM cur2 INTO @id_producto, @cantidad;
        END
        CLOSE cur2; DEALLOCATE cur2;

        COMMIT TRANSACTION;
        PRINT '✅ Venta con múltiples productos registrada correctamente.';
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        PRINT '❌ Error al registrar la venta: ' + ERROR_MESSAGE();
    END CATCH
END;
GO

-- 2. Procedimiento para añadir vendedores.
CREATE OR ALTER PROCEDURE AgregarVendedor
    @nombre NVARCHAR(100),
    @dni VARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO Vendedor (nombre, dni)
        VALUES (@nombre, @dni);

        PRINT '✅ Vendedor registrado correctamente.';
    END TRY
    BEGIN CATCH
        PRINT '❌ Error al registrar vendedor: ' + ERROR_MESSAGE();
    END CATCH
END;
GO

-- 3. Procedimiento para añadir productos.
CREATE OR ALTER PROCEDURE AgregarProducto
    @nombre NVARCHAR(100),
    @precio DECIMAL(10,2),
    @stock INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO Producto (nombre, precio, stock)
        VALUES (@nombre, @precio, @stock);

        PRINT '✅ Producto registrado correctamente.';
    END TRY
    BEGIN CATCH
        PRINT '❌ Error al registrar producto: ' + ERROR_MESSAGE();
    END CATCH
END;
GO

-- 4. Procedimiento para registrar una meta
CREATE OR ALTER PROCEDURE AgregarMeta
    @descripcion NVARCHAR(255),
    @periodo NVARCHAR(50),
    @fecha_inicio DATE,
    @fecha_fin DATE,
    @tipo NVARCHAR(20), -- 'ingreso' o 'ventas'
    @cantidad DECIMAL(10,2)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        INSERT INTO Meta (descripcion, periodo, fecha_inicio, fecha_fin, tipo, cantidad)
        VALUES (@descripcion, @periodo, @fecha_inicio, @fecha_fin, @tipo, @cantidad);

        PRINT '✅ Meta registrada correctamente.';
    END TRY
    BEGIN CATCH
        PRINT '❌ Error al registrar la meta: ' + ERROR_MESSAGE();
    END CATCH
END;
GO
