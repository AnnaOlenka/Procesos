// ----------- PRODUCTOS: Cambio de pestañas -----------
const tabInventario = document.getElementById("tab-inventario");
const tabRegistro = document.getElementById("tab-registro");
const seccionInventario = document.getElementById("seccion-inventario");
const seccionRegistro = document.getElementById("seccion-registro");
let productoTabActivo = "inventario";

tabInventario.addEventListener("click", () => {
  tabInventario.classList.add("activo");
  tabRegistro.classList.remove("activo");
  seccionInventario.style.display = "block";
  seccionRegistro.style.display = "none";
  productoTabActivo = "inventario";

  cargarProductos();
});

tabRegistro.addEventListener("click", () => {
  tabRegistro.classList.add("activo");
  tabInventario.classList.remove("activo");
  seccionInventario.style.display = "none";
  seccionRegistro.style.display = "block";
  productoTabActivo = "registro";
});

// ----------- PRODUCTOS: Agregar producto -----------
const form = document.getElementById("formulario-producto");
const tabla = document.getElementById("tabla-productos");
const tabla_Secundaria = document.getElementById("tabla-productos_");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const stock = document.getElementById("stock").value;
  const precio = document.getElementById("precio").value;

  const datos = new FormData();
  datos.append("nombre", nombre);
  datos.append("precio", precio);
  datos.append("stock", stock);

  fetch("backend/agregar_producto.php", {
    method: "POST",
    body: datos,
  })
    .then(res => res.json())
    .then(res => {
      if (res.status === "success") {
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${nombre}</td>
    <td>${stock}</td>
    <td>S/ ${parseFloat(precio).toFixed(2)}</td>
  `;

  tabla.appendChild(fila);
  form.reset();

  tabInventario.click(); // Cambia automáticamente a inventario
}})
});

//----------------------Mostrar Productos----------------------
function cargarProductos() {
  fetch("backend/obtener_productos.php")
    .then(res => res.json())
    .then(res => {
      if (res.status === "success") {
        tabla.innerHTML = ""; // limpiar la tabla antes de mostrar
        res.data.forEach(producto => {
          const fila = document.createElement("tr");
          fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${producto.stock}</td>
            <td>S/ ${parseFloat(producto.precio).toFixed(2)}</td>
          `;
          tabla.appendChild(fila);
        });
      } 
    })
}

//----------------------Mostrar Productos----------------------
function cargarProductos_() {
  fetch("backend/obtener_productos.php")
    .then(res => res.json())
    .then(res => {
      if (res.status === "success") {
        tabla_Secundaria.innerHTML = ""; // limpiar la tabla antes de mostrar
        res.data.forEach(producto => {
          const fila = document.createElement("tr");
          fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${producto.stock}</td>
            <td>S/ ${parseFloat(producto.precio).toFixed(2)}</td>
          `;
          fila.addEventListener("dblclick", () => {
            agregarProductoAVenta(producto);
          });

          tabla_Secundaria.appendChild(fila);
        });
      } 
    })
}




// ----------- VENTAS: Cambio de pestañas -----------
const tabVentas = document.getElementById("tab-venta");
const tabVisualizarVenta = document.getElementById("tab-visualizar-venta");
const seccionVenta = document.getElementById("seccion-venta");
const seccionBoletas = document.getElementById("seccion-boletas");
let ventaTabActivo = "ventas";

tabVentas.addEventListener("click", () => {
  tabVentas.classList.add("activo");
  tabVisualizarVenta.classList.remove("activo");
  seccionVenta.style.display = "block";
  seccionBoletas.style.display = "none";
  ventaTabActivo = "ventas";
  cargarProductos_();
});

tabVisualizarVenta.addEventListener("click", () => {
  tabVisualizarVenta.classList.add("activo");
  tabVentas.classList.remove("activo");
  seccionVenta.style.display = "none";
  seccionBoletas.style.display = "block";
  ventaTabActivo = "boletas";
});

function agregarProductoAVenta(producto) {
  const tablaVenta = document.getElementById("tabla-venta");

  const fila = document.createElement("tr");
  fila.setAttribute("data-id", producto.id_producto); // <-- aquí

  fila.innerHTML = `
    <td><input type="text" name="nombre[]" value="${producto.nombre}" readonly></td>
    <td><input type="number" name="Cantidad[]" value="1" min="1" onchange="actualizarPrecioTotal(this)"></td>
    <td><input type="number" name="Precio_Uni[]" value="${parseFloat(producto.precio).toFixed(2)}" step="0.01" readonly></td>
    <td><input type="number" name="Precio_Total[]" value="${parseFloat(producto.precio).toFixed(2)}" step="0.01" readonly></td>
  `;

  tablaVenta.appendChild(fila);
}


function actualizarPrecioTotal(inputCantidad) {
  const fila = inputCantidad.closest("tr");
  const precioUnitario = parseFloat(fila.querySelector('input[name="Precio_Uni[]"]').value);
  const cantidad = parseInt(inputCantidad.value) || 0;
  const precioTotal = fila.querySelector('input[name="Precio_Total[]"]');
  precioTotal.value = (cantidad * precioUnitario).toFixed(2);
}

document.getElementById("formulario-venta").addEventListener("submit", function (e) {
  e.preventDefault();

  const filas = document.querySelectorAll("#tabla-venta tr");
  const productos = [];

  filas.forEach(fila => {
  const inputNombre = fila.querySelector('input[name="nombre[]"]');
  const inputCantidad = fila.querySelector('input[name="Cantidad[]"]');
  const inputPrecio = fila.querySelector('input[name="Precio_Uni[]"]');

  if (inputNombre && inputCantidad && inputPrecio) {
    const nombre = inputNombre.value;
    const cantidad = parseInt(inputCantidad.value);
    const precio = parseFloat(inputPrecio.value);
    const id_producto = fila.getAttribute("data-id");

    productos.push({ id_producto, nombre, cantidad, precio });
  }
});


  const datos = new FormData();
  datos.append("id_vendedor", 1); // <- puedes hacer esto dinámico
  datos.append("productos", JSON.stringify(productos));

  fetch("backend/registrar_venta.php", {
    method: "POST",
    body: datos
  })
    .then(res => res.json())
    .then(res => {
      if (res.status === "success") {
        alert("Venta registrada con éxito.");
        document.getElementById("tabla-venta").innerHTML = "";
      } else {
        alert("Error: " + res.mensaje);
      }
    });
});



// ----------- METAS: Cambio de pestañas -----------
const tabMetas = document.getElementById("tab-meta");
const tabEstadoMeta = document.getElementById("tab-estado-meta");
const seccionMeta = document.getElementById("seccion-meta");
const seccionEstadoMeta = document.getElementById("seccion-estado-meta");
let metaTabActivo = "metas";

tabMetas.addEventListener("click", () => {
  tabMetas.classList.add("activo");
  tabEstadoMeta.classList.remove("activo");
  seccionMeta.style.display = "block";
  seccionEstadoMeta.style.display = "none";
  metaTabActivo = "metas";
});

tabEstadoMeta.addEventListener("click", () => {
  tabEstadoMeta.classList.add("activo");
  tabMetas.classList.remove("activo");
  seccionMeta.style.display = "none";
  seccionEstadoMeta.style.display = "block";
  metaTabActivo = "estadoMetas";
});

// ----------- CAMBIO DE SECCIONES DESDE MENÚ -----------
const menuItems = document.querySelectorAll(".sidebar nav ul li");
const tabsHeader = document.getElementById("tabs-productos");
const seccionVentas = document.getElementById("seccion-ventas");
const seccionMetas = document.getElementById("seccion-metas");

menuItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    // Oculta todas las secciones
    tabsHeader.style.display = "none";
    seccionInventario.style.display = "none";
    seccionRegistro.style.display = "none";
    seccionVentas.style.display = "none";
    seccionMetas.style.display = "none";
    seccionMeta.style.display = "none";
    seccionEstadoMeta.style.display = "none";

    if (index === 0) { // Productos
      tabsHeader.style.display = "flex";

      if (productoTabActivo === "inventario") {
        tabInventario.classList.add("activo");
        tabRegistro.classList.remove("activo");
        seccionInventario.style.display = "block";
      } else {
        tabRegistro.classList.add("activo");
        tabInventario.classList.remove("activo");
        seccionRegistro.style.display = "block";
      }

    } else if (index === 1) { // Ventas
      seccionVentas.style.display = "block";

      if (ventaTabActivo === "ventas") {
        tabVentas.classList.add("activo");
        tabVisualizarVenta.classList.remove("activo");
        seccionVenta.style.display = "block";
      } else {
        tabVisualizarVenta.classList.add("activo");
        tabVentas.classList.remove("activo");
        seccionBoletas.style.display = "block";
      }

    } else if (index === 2) { // Metas
      seccionMetas.style.display = "block";

      if (metaTabActivo === "metas") {
        tabMetas.classList.add("activo");
        tabEstadoMeta.classList.remove("activo");
        seccionMeta.style.display = "block";
      } else {
        tabEstadoMeta.classList.add("activo");
        tabMetas.classList.remove("activo");
        seccionEstadoMeta.style.display = "block";
      }
    }
  });
});

// ----------- FORMULARIO DE METAS Y FECHAS -----------
const formMeta = document.getElementById("formulario-meta");
const periodoSelect = document.getElementById("periodo");
const campoFechaDia = document.getElementById("campo-fecha-dia");
const campoFechasSemanal = document.getElementById("campo-fechas-semanal");

periodoSelect.addEventListener("change", function () {
  campoFechaDia.style.display = "none";
  campoFechasSemanal.style.display = "none";

  if (this.value === "dias") {
    campoFechaDia.style.display = "block";
  } else if (this.value === "semanal") {
    campoFechasSemanal.style.display = "block";
  }
});

formMeta.addEventListener("submit", function (event) {
  event.preventDefault();

  const ingresos = document.getElementById("ingresos").value;
  const periodo = document.getElementById("periodo").value;
  let fechaDia = "", fechaInicio = "", fechaFin = "";

  if (periodo === "dias") {
    fechaDia = document.getElementById("fecha-dia").value;
  } else if (periodo === "semanal") {
    fechaInicio = document.getElementById("fecha-inicio").value;
    fechaFin = document.getElementById("fecha-fin").value;
  }

  console.log("Meta registrada:");
  console.log("Ingresos:", ingresos);
  console.log("Periodo:", periodo);
  if (fechaDia) console.log("Fecha:", fechaDia);
  if (fechaInicio && fechaFin) {
    console.log("Fecha Inicio:", fechaInicio);
    console.log("Fecha Fin:", fechaFin);
  }

  formMeta.reset();
  campoFechaDia.style.display = "none";
  campoFechasSemanal.style.display = "none";
});


window.addEventListener("DOMContentLoaded", cargarProductos);
window.addEventListener("DOMContentLoaded", cargarProductos_);