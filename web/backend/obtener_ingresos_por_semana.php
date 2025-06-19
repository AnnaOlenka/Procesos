<?php
include "conexion.php";

/*
  Esta versión:
  - Toma como base la tabla `meta` (solo metas semanales reales)
  - Agrupa ingresos por semana ISO (solo si coinciden con fecha de la meta)
  - Evita duplicar metas semanales si hay múltiples ventas en la semana
*/

$sql = "
  SELECT 
    YEARWEEK(m.fecha_inicio, 3) AS semana_iso,
    COALESCE(SUM(v.total), 0)   AS ingresos,
    m.cantidad                  AS meta
  FROM meta m
  LEFT JOIN venta v
    ON v.total > 0
   AND YEARWEEK(v.fecha, 3) = YEARWEEK(m.fecha_inicio, 3)
  WHERE m.tipo = 'semanal'
  GROUP BY semana_iso, m.cantidad
  ORDER BY semana_iso;
";

$stmt = $conn->prepare($sql);
$stmt->execute();

$data = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
  $data[] = [
    "semana"   => $row["semana_iso"],
    "ingresos" => (float)$row["ingresos"],
    "meta"     => (float)$row["meta"]
  ];
}

echo json_encode($data);
?>
