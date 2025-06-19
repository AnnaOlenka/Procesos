<?php
require_once("conexion.php"); // Asegúrate de tener tu conexión PDO

try {
    $descripcion = "Meta registrada desde frontend"; // Puedes ajustar si necesitas
    $periodo = $_POST['periodo'];
    $tipo = $_POST['tipo']; // 'diaria' o 'semanal'
    $cantidad = $_POST['cantidad'];

    // Valores de fechas
    $fecha_inicio = $_POST['fecha_inicio'] ?? null;
    $fecha_fin = $_POST['fecha_fin'] ?? null;

    // Para metas diarias, asignamos ambas fechas iguales
    if ($tipo === "diaria") {
        $fecha_inicio = $_POST['fecha'] ?? null;
        $fecha_fin = $fecha_inicio;
    }

    $stmt = $conn->prepare("CALL AgregarMeta(:descripcion, :periodo, :fecha_inicio, :fecha_fin, :tipo, :cantidad)");
    $stmt->bindParam(":descripcion", $descripcion);
    $stmt->bindParam(":periodo", $periodo);
    $stmt->bindParam(":fecha_inicio", $fecha_inicio);
    $stmt->bindParam(":fecha_fin", $fecha_fin);
    $stmt->bindParam(":tipo", $tipo);
    $stmt->bindParam(":cantidad", $cantidad);

    $stmt->execute();

    echo json_encode(["status" => "success"]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "mensaje" => $e->getMessage()]);
}
