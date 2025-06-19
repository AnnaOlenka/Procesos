<?php
require_once("conexion.php");

try {
    $stmt = $conn->prepare("CALL ObtenerBoletasConDetalle()");
    $stmt->execute();

    $ventas = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $id = $row["id_venta"];

        if (!isset($ventas[$id])) {
            $ventas[$id] = [
                "id_venta" => $row["id_venta"],
                "fecha" => $row["fecha"],
                "total_venta" => $row["total_venta"],
                "productos" => []
            ];
        }

        $ventas[$id]["productos"][] = [
            "nombre_producto" => $row["nombre_producto"],
            "cantidad" => $row["cantidad"],
            "precio_unitario" => $row["precio_unitario"]
        ];
    }

    echo json_encode(array_values($ventas));

} catch (Exception $e) {
    echo json_encode(["status" => "error", "mensaje" => $e->getMessage()]);
}
