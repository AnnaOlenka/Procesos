/*Agregar vendedor*/
DELIMITER $$

CREATE PROCEDURE AgregarVendedor (
    IN nombre VARCHAR(100),
    IN dni VARCHAR(20)
)
BEGIN
    INSERT INTO Vendedor (nombre, dni)
    VALUES (nombre, dni);
END $$

DELIMITER ;



DELIMITER $$

CREATE PROCEDURE AgregarProducto (
    IN nombre VARCHAR(100),
    IN precio DECIMAL(10,2),
    IN stock INT
)
BEGIN
    INSERT INTO Producto (nombre, precio, stock)
    VALUES (nombre, precio, stock);
END $$

DELIMITER ;



DELIMITER $$

CREATE PROCEDURE AgregarMeta (
    IN descripcion VARCHAR(255),
    IN periodo VARCHAR(50),
    IN fecha_inicio DATE,
    IN fecha_fin DATE,
    IN tipo VARCHAR(20),
    IN cantidad DECIMAL(10,2)
)
BEGIN
    INSERT INTO Meta (descripcion, periodo, fecha_inicio, fecha_fin, tipo, cantidad)
    VALUES (descripcion, periodo, fecha_inicio, fecha_fin, tipo, cantidad);
END $$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE RegistrarVenta (
    IN id_vendedor INT,
    IN total DECIMAL(10,2),
    OUT nueva_venta_id INT
)
BEGIN
    INSERT INTO Venta (id_vendedor, total)
    VALUES (id_vendedor, total);

    SET nueva_venta_id = LAST_INSERT_ID();
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE AgregarDetalleVenta (
    IN id_venta INT,
    IN id_producto INT,
    IN cantidad INT
)
BEGIN
    DECLARE precio_unitario DECIMAL(10,2);

    SELECT precio INTO precio_unitario
    FROM Producto
    WHERE id_producto = id_producto;

    INSERT INTO DetalleVenta (id_venta, id_producto, cantidad, precio_unitario)
    VALUES (id_venta, id_producto, cantidad, precio_unitario);

    -- Actualizar stock
    UPDATE Producto
    SET stock = stock - cantidad
    WHERE id_producto = id_producto;
END $$

DELIMITER ;