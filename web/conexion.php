<?php
$serverName = "localhost:8080";       // o IP del servidor (Reemplacen con su servidor)
$database = "learn_php";    // tu base de datos
$username = "root";           // tu usuario SQL Server
$password = "";        // tu contraseña

try {
    $conn = new PDO("mysql:host=$serverName;dbname=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Conexión exitosa";

} catch (PDOException $e) {
    echo "Error de conexión: " . $e->getMessage();
}
?>
