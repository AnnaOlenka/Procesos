// ----------- PRODUCTOS: Cambio de pestañas -----------
const tabInventario = document.getElementById("tab-inventario");
const tabRegistro = document.getElementById("tab-registro");
const seccionInventario = document.getElementById("seccion-inventario");
const seccionRegistro = document.getElementById("seccion-registro");
let productoTabActivo = "inventario";
document.body.style.backgroundColor = "white";

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

  mostrarBoletas();
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


function crearBoleta(venta) {
  const boleta = document.createElement("div");
  boleta.classList.add("venta-boleta");

  const filasHTML = venta.productos.map(producto => `
    <tr>
      <td>${producto.nombre_producto}</td>
      <td>${producto.cantidad}</td>
      <td>S/. ${parseFloat(producto.precio_unitario).toFixed(2)}</td>
      <td>S/. ${(producto.cantidad * producto.precio_unitario).toFixed(2)}</td>
    </tr>
  `).join("");

  boleta.innerHTML = `
  <div class="venta-boleta">  
  <header>
      <div class="head-boleta">
        <div id="id-venta-boleta">Venta #${venta.id_venta}</div>
        <div id="name-venta-boleta">Cliente: ${venta.cliente || "S/N"}</div> 
      </div>
      <div>
        <br>
        <label>Fecha:</label> ${venta.fecha}
      </div>
    </header>
    <hr>
    <div>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Uni</th>
            <th>Precio Total</th>
          </tr>
        </thead>
        <tbody>
          ${filasHTML}
        </tbody>
      </table>
    </div>
    <hr>
    <div>
      <label>Monto de Compra:</label>
      <label><strong>S/. ${parseFloat(venta.total_venta).toFixed(2)}</strong></label>
    </div>
   </div> 
  `;

  return boleta;
}

function mostrarBoletas() {
  const contenedor = document.getElementById("contenedor-boletas");
  contenedor.innerHTML = ""; // Limpia boletas previas

  fetch("backend/obtener_multiples_boletas.php")
    .then(res => res.json())
    .then(ventas => {
      ventas.forEach(venta => {
        const boletaDOM = crearBoleta(venta);
        contenedor.appendChild(boletaDOM);
      });
    });
}


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

  cargarEstadoMetas();
});

// ----------- CAMBIO DE SECCIONES DESDE MENÚ -----------
const menuItems = document.querySelectorAll(".sidebar nav ul li");
const tabsHeader = document.getElementById("tabs-productos");
const seccionVentas = document.getElementById("seccion-ventas");
const seccionMetas = document.getElementById("seccion-metas");
const seccionGraficas = document.getElementById("seccion-graficos");

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
    seccionGraficas.style.display = "none";

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
    } else if (index===3){  //Graficas
      console.log("Entró a gráficas"); 
      seccionGraficas.style.display = "block";
      mostrarGraficas();

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

  // Declaramos todas las variables necesarias
  let tipo = "";
  let fecha = "";
  let fecha_inicio = "";
  let fecha_fin = "";

  const datos = new FormData();
  datos.append("cantidad", ingresos);
  datos.append("periodo", periodo);

  if (periodo === "dias") {
    tipo="diaria";
    fecha = document.getElementById("fecha-dia").value;
    datos.append("tipo", tipo);
    datos.append("fecha", fecha);

  } else if (periodo === "semanal") {
    tipo="semanal";
    fecha_inicio = document.getElementById("fecha-inicio").value;
    fecha_fin = document.getElementById("fecha-fin").value;
    datos.append("tipo", tipo);
    datos.append("fecha_inicio", fecha_inicio);
    datos.append("fecha_fin", fecha_fin);
  }

   fetch("backend/agregar_meta.php", {
    method: "POST",
    body: datos
  })
    .then(res => res.json())
    .then(res => {
      if (res.status === "success") {
        alert("Meta registrada correctamente");
        formMeta.reset();
        campoFechaDia.style.display = "none";
        campoFechasSemanal.style.display = "none";
      } else {
        alert("Error: " + res.mensaje);
      }
    });
});


function cargarEstadoMetas() {
  
  fetch("backend/obtener_metas.php")
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        const tablaDiarias = document.getElementById("tabla-metas-diarias");
        const tablaSemanales = document.getElementById("tabla-metas-semanales");

        // Limpiar
        tablaDiarias.innerHTML = "";
        tablaSemanales.innerHTML = "";

        // Metas Diarias
        data.diarias.forEach(meta => {
          const class_estado = meta.estado == "Cumplida" ? "estado-cumplido" : "estado-pendiente";
          const fila = document.createElement("tr");
          fila.innerHTML = `
            <td>${meta.descripcion}</td>
            <td>${meta.fecha}</td>
            <td>S/. ${parseFloat(meta.meta).toFixed(2)}</td>
            <td>S/. ${parseFloat(meta.ingresos_actuales).toFixed(2)}</td>
            <td class="${class_estado}">${meta.estado}</td>
          `;
          tablaDiarias.appendChild(fila);
        });

        // Metas Semanales
        data.semanales.forEach(meta => {
          const class_estado = meta.estado == "Cumplida" ? "estado-cumplido" : "estado-pendiente";
          const fila = document.createElement("tr");
          fila.innerHTML = `
            <td>${meta.descripcion}</td>
            <td>${meta.fecha_inicio}</td>
            <td>${meta.fecha_fin}</td>
            <td>S/. ${parseFloat(meta.meta).toFixed(2)}</td>
            <td>S/. ${parseFloat(meta.ingresos_actuales).toFixed(2)}</td>
            <td class="${class_estado}">${meta.estado}</td>
          `;
          tablaSemanales.appendChild(fila);
        });
      } else {
        console.error("Error cargando metas:", data.mensaje);
      }
    });
}


//GRAFICAS
//GRAFICAS

let chartDia    = null;
let chartSemana = null;

function mostrarGraficas() {
  Promise.all([
    fetch("backend/obtener_ingresos_por_dia.php").then(r => r.json()),
    fetch("backend/obtener_ingresos_por_semana.php").then(r => r.json())
  ]).then(([datosDia, datosSemana]) => {
    renderGraficoDia(datosDia);
    renderGraficoSemana(datosSemana);
  });
}

function renderGraficoDia(datos) {
  // const ctx = document.getElementById("grafico-dia").getContext("2d");
  const labels  = datos.map(d => d.fecha);
  const ingresos= datos.map(d => d.ingresos);
  const metas   = datos.map(d => d.meta);
  
  const canvas = document.getElementById("grafico-diario");
  if (!canvas) {
    console.warn("No se encontró el canvas #grafico-diario");
    return;
  }
  const ctx = canvas.getContext("2d");          // ← ahora sí, después de validar

  if (chartDia) chartDia.destroy();

  chartDia = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Ingresos', data: ingresos, backgroundColor: 'rgba(54, 232, 235, 0.7)' },
        { label: 'Meta',     data: metas,    backgroundColor: 'rgba(255,99,132,0.7)' }
      ]
    },
    options: {
      responsive: true,
      plugins: { title: { display: true, text: 'Ingresos vs Meta por Día' } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

function renderGraficoSemana(datos) {
  const canvas = document.getElementById("grafico-semanal");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  if (!datos || datos.length === 0) {
    console.warn("No hay datos semanales disponibles aún.");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  const labels = datos.map(d => `Sem ${String(d.semana).slice(-2)}`);
  const ingresos = datos.map(d => d.ingresos);
  const metas = datos.map(d => d.meta);

  if (chartSemana) chartSemana.destroy();

  chartSemana = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Ingresos', data: ingresos, backgroundColor: 'rgba(129, 73, 249, 0.9)' },
        { label: 'Meta',     data: metas,    backgroundColor: 'rgba(34, 207, 135, 0.7)' }
      ]
    },
    options: {
      responsive: true,
      plugins: { title: { display: true, text: 'Ingresos vs Meta por Semana' } },
      scales: { y: { beginAtZero: true } }
    }
  });
}



window.addEventListener("DOMContentLoaded", cargarProductos);
window.addEventListener("DOMContentLoaded", cargarProductos_);
