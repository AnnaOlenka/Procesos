<?php
require_once("conexion.php"); // asegúrate que esté tu conexión PDO aquí

try {
    $id_vendedor = $_POST['id_vendedor'];
    $productos = json_decode($_POST['productos'], true);

    // Calculamos el total
    $total = 0;
    foreach ($productos as $producto) {
        $total += floatval($producto['precio']) * intval($producto['cantidad']);
    }

    // 1. Registrar la venta
    $stmt = $conn->prepare("CALL RegistrarVenta(:id_vendedor, :total, @nueva_venta_id)");
    $stmt->bindParam(":id_vendedor", $id_vendedor);
    $stmt->bindParam(":total", $total);
    $stmt->execute();

    // Obtener el ID de la nueva venta
    $result = $conn->query("SELECT @nueva_venta_id as nueva_venta_id");
    $row = $result->fetch(PDO::FETCH_ASSOC);
    $id_venta = $row['nueva_venta_id'];

    // 2. Agregar detalles de venta
    $stmtDetalle = $conn->prepare("CALL AgregarDetalleVenta(:id_venta, :id_producto, :cantidad)");
    foreach ($productos as $producto) {
        $stmtDetalle->bindParam(":id_venta", $id_venta);
        $stmtDetalle->bindParam(":id_producto", $producto['id_producto']);
        $stmtDetalle->bindParam(":cantidad", $producto['cantidad']);
        $stmtDetalle->execute();
    }

    echo json_encode(["status" => "success", "mensaje" => "Venta registrada correctamente"]);

} catch (Exception $e) {
    echo json_encode(["status" => "error", "mensaje" => $e->getMessage()]);
}
