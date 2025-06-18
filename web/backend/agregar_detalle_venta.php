<?php
include 'conexion.php';

$id_venta = $_POST['id_venta'] ?? 0;
$id_producto = $_POST['id_producto'] ?? 0;
$cantidad = $_POST['cantidad'] ?? 0;

try {
    $stmt = $conn->prepare("CALL AgregarDetalleVenta(:id_venta, :id_producto, :cantidad)");
    $stmt->bindParam(':id_venta', $id_venta);
    $stmt->bindParam(':id_producto', $id_producto);
    $stmt->bindParam(':cantidad', $cantidad);
    $stmt->execute();

    echo json_encode(["mensaje" => "✅ Detalle de venta agregado correctamente"]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
