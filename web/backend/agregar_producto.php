<?php
include 'conexion.php';

$nombre = $_POST['nombre'] ?? '';
$precio = $_POST['precio'] ?? 0;
$stock = $_POST['stock'] ?? 0;

try {
    $stmt = $conn->prepare("CALL AgregarProducto(:nombre, :precio, :stock)");
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':precio', $precio);
    $stmt->bindParam(':stock', $stock);
    $stmt->execute();

    echo json_encode(["mensaje" => "Producto registrado correctamente"]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
