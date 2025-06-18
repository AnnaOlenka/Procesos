<?php
include 'conexion.php';

$descripcion = $_POST['descripcion'] ?? '';
$periodo = $_POST['periodo'] ?? '';
$fecha_inicio = $_POST['fecha_inicio'] ?? '';
$fecha_fin = $_POST['fecha_fin'] ?? '';
$tipo = $_POST['tipo'] ?? '';
$cantidad = $_POST['cantidad'] ?? 0;

try {
    $stmt = $conn->prepare("CALL AgregarMeta(:descripcion, :periodo, :fecha_inicio, :fecha_fin, :tipo, :cantidad)");
    $stmt->bindParam(':descripcion', $descripcion);
    $stmt->bindParam(':periodo', $periodo);
    $stmt->bindParam(':fecha_inicio', $fecha_inicio);
    $stmt->bindParam(':fecha_fin', $fecha_fin);
    $stmt->bindParam(':tipo', $tipo);
    $stmt->bindParam(':cantidad', $cantidad);
    $stmt->execute();

    echo json_encode(["mensaje" => "✅ Meta registrada correctamente"]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
