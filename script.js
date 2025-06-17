// Cambiar entre pestañas
const tabInventario = document.getElementById("tab-inventario");
const tabRegistro = document.getElementById("tab-registro");
const seccionInventario = document.getElementById("seccion-inventario");
const seccionRegistro = document.getElementById("seccion-registro");

tabInventario.addEventListener("click", () => {
  tabInventario.classList.add("activo");
  tabRegistro.classList.remove("activo");
  seccionInventario.style.display = "block";
  seccionRegistro.style.display = "none";
});

tabRegistro.addEventListener("click", () => {
  tabRegistro.classList.add("activo");
  tabInventario.classList.remove("activo");
  seccionInventario.style.display = "none";
  seccionRegistro.style.display = "block";
});

// Añadir producto a la tabla
const form = document.getElementById("formulario-producto");
const tabla = document.getElementById("tabla-productos");

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const cantidad = document.getElementById("cantidad").value;
  const medida = document.getElementById("medida").value;
  const precio = document.getElementById("precio").value;

  const fila = document.createElement("tr");

  fila.innerHTML = `
    <td>${nombre}</td>
    <td>${cantidad}</td>
    <td>${medida}</td>
    <td>S/ ${parseFloat(precio).toFixed(2)}</td>
  `;

  tabla.appendChild(fila);
  form.reset();

  // Cambia a pestaña de inventario
  tabInventario.click();
});


// Cambiar panel por opción del menú lateral
const menuItems = document.querySelectorAll(".sidebar nav ul li");
const tabsHeader = document.getElementById("tabs-productos");
const seccionProductos = document.getElementById("seccion-inventario");
const seccionVentas = document.getElementById("seccion-ventas");
const seccionMetas = document.getElementById("seccion-metas");

menuItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    // Resetear visibilidad
    tabsHeader.style.display = "none";
    seccionProductos.style.display = "none";
    seccionRegistro.style.display = "none";
    seccionVentas.style.display = "none";
    seccionMetas.style.display = "none";

    if (index === 0) { // Productos
      tabsHeader.style.display = "flex";
      seccionProductos.style.display = "block";
    } else if (index === 1) { // Ventas
      seccionVentas.style.display = "block";
    } else if (index === 2) { // Metas
      seccionMetas.style.display = "block";
    }
  });
});