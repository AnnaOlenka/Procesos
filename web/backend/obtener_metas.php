<?php
require_once("conexion.php");

try {
    $stmt = $conn->query("CALL ObtenerMetasConIngresos()");

    // Primera consulta: diarias
    $metas_diarias = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Avanzar a la siguiente consulta (semanales)
    $stmt->nextRowset();
    $metas_semanales = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "diarias" => $metas_diarias,
        "semanales" => $metas_semanales
    ]);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "mensaje" => $e->getMessage()
    ]);
}
?>
