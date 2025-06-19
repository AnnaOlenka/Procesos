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
    IN p_id_vendedor INT,
    IN p_total DECIMAL(10,2),
    OUT nueva_venta_id INT
)
BEGIN
    INSERT INTO Venta (id_vendedor, total)
    VALUES (p_id_vendedor, p_total);

    SET nueva_venta_id = LAST_INSERT_ID();
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE AgregarDetalleVenta (
    IN p_id_venta INT,
    IN p_id_producto INT,
    IN p_cantidad INT
)
BEGIN
    DECLARE precio_unitario DECIMAL(10,2);

    SELECT precio INTO precio_unitario
    FROM Producto
    WHERE id_producto = p_id_producto;

    INSERT INTO DetalleVenta (id_venta, id_producto, cantidad, precio_unitario)
    VALUES (p_id_venta, p_id_producto, p_cantidad, precio_unitario);

    -- Actualizar stock
    UPDATE Producto
    SET stock = stock - p_cantidad
    WHERE id_producto = p_id_producto;
END $$

DELIMITER ;



DELIMITER $$

CREATE PROCEDURE ObtenerDetalleVenta (IN p_id_venta INT)
BEGIN
    SELECT 
        v.fecha,
        p.nombre AS nombre_producto,
        dv.cantidad,
        dv.precio_unitario,
        (dv.cantidad * dv.precio_unitario) AS subtotal,
        v.total AS total_venta
    FROM Venta v
    JOIN DetalleVenta dv ON v.id_venta = dv.id_venta
    JOIN Producto p ON dv.id_producto = p.id_producto
    WHERE v.id_venta = p_id_venta;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE ObtenerTodasLasBoletas()
BEGIN
    SELECT 
        v.id_venta,
        v.fecha,
        v.total AS total_venta,
        p.nombre AS nombre_producto,
        dv.cantidad,
        dv.precio_unitario,
        (dv.cantidad * dv.precio_unitario) AS subtotal
    FROM Venta v
    JOIN DetalleVenta dv ON v.id_venta = dv.id_venta
    JOIN Producto p ON dv.id_producto = p.id_producto
    ORDER BY v.id_venta, p.nombre;
END $$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE ObtenerMetasConIngresos()
BEGIN
    -- Metas Diarias
    SELECT 
        id_meta,
        descripcion,
        fecha_inicio AS fecha,
        cantidad AS meta,
        (SELECT IFNULL(SUM(total), 0) 
         FROM Venta 
         WHERE DATE(fecha) = m.fecha_inicio) AS ingresos_actuales,
        CASE 
            WHEN (SELECT IFNULL(SUM(total), 0) FROM Venta WHERE DATE(fecha) = m.fecha_inicio) >= m.cantidad THEN 'Cumplida'
            ELSE 'Pendiente'
        END AS estado,
        'diaria' AS tipo
    FROM Meta m
    WHERE tipo = 'diaria';

    -- Metas Semanales
    SELECT 
        id_meta,
        descripcion,
        fecha_inicio,
        fecha_fin,
        cantidad AS meta,
        (SELECT IFNULL(SUM(total), 0)
         FROM Venta
         WHERE DATE(fecha) BETWEEN m.fecha_inicio AND m.fecha_fin) AS ingresos_actuales,
        CASE 
            WHEN (SELECT IFNULL(SUM(total), 0) FROM Venta WHERE DATE(fecha) BETWEEN m.fecha_inicio AND m.fecha_fin) >= m.cantidad THEN 'Cumplida'
            ELSE 'Pendiente'
        END AS estado,
        'semanal' AS tipo
    FROM Meta m
    WHERE tipo = 'semanal';
END $$

DELIMITER ;