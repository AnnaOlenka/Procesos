<?php
require_once("conexion.php"); // Asegúrate que este archivo tenga tu conexión PDO

try {
    // Ejecutar el procedimiento almacenado
    $stmt = $conn->prepare("CALL ObtenerTodasLasBoletas()");
    $stmt->execute();

    $boletas_raw = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Agrupar productos por venta
    $boletas = [];

    foreach ($boletas_raw as $fila) {
        $id = $fila["id_venta"];

        if (!isset($boletas[$id])) {
            $boletas[$id] = [
                "id_venta" => $fila["id_venta"],
                "fecha" => $fila["fecha"],
                "total_venta" => $fila["total_venta"],
                "productos" => []
            ];
        }

        $boletas[$id]["productos"][] = [
            "nombre_producto" => $fila["nombre_producto"],
            "cantidad" => $fila["cantidad"],
            "precio_unitario" => $fila["precio_unitario"],
            "subtotal" => $fila["subtotal"]
        ];
    }

    // Reindexar para obtener array simple (no asociativo por id_venta)
    $boletas = array_values($boletas);

    echo json_encode($boletas);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "mensaje" => $e->getMessage()
    ]);
}
