<?php
include 'conexion.php';

try {
    $stmt = $conn->query("CALL ObtenerProductos()");
    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["status" => "success", "data" => $productos]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>