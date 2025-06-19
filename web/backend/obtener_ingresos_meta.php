<?php
include "conexion.php";

$sql = "
  SELECT 
    DATE(v.fecha) AS fecha, 
    SUM(v.total) AS ingresos,
    COALESCE(m.cantidad, 0) AS meta
  FROM venta v
  LEFT JOIN meta m 
    ON DATE(v.fecha) = m.fecha_inicio AND m.tipo = 'diaria'
  WHERE v.total > 0
  GROUP BY DATE(v.fecha)
  ORDER BY fecha ASC
";

$stmt = $conn->prepare($sql);
$stmt->execute();

$data = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
  $data[] = [
    "fecha" => $row["fecha"],
    "ingresos" => (float)$row["ingresos"],
    "meta" => (float)$row["meta"]
  ];
}

echo json_encode($data);
?>
