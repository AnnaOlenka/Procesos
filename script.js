// Cambiar entre pestañas de la seccion de PRODUCTOS
const tabInventario = document.getElementById("tab-inventario");
const tabRegistro = document.getElementById("tab-registro");
const seccionInventario = document.getElementById("seccion-inventario");
const seccionRegistro = document.getElementById("seccion-registro");

let productoTabActivo = "inventario"; // <- se guarda qué pestaña está activa

tabInventario.addEventListener("click", () => {
  tabInventario.classList.add("activo");
  tabRegistro.classList.remove("activo");
  seccionInventario.style.display = "block";
  seccionRegistro.style.display = "none";
  productoTabActivo = "inventario";
});

tabRegistro.addEventListener("click", () => {
  tabRegistro.classList.add("activo");
  tabInventario.classList.remove("activo");
  seccionInventario.style.display = "none";
  seccionRegistro.style.display = "block";
  productoTabActivo = "registro";
});

// Añadir producto a la tabla
const form = document.getElementById("formulario-producto");
const tabla = document.getElementById("tabla-productos");

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const stock = document.getElementById("stock").value;
  const precio = document.getElementById("precio").value;
  const fila = document.createElement("tr");

  fila.innerHTML = `
    <td>${nombre}</td>
    <td>${stock}</td>
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
const seccionVentas = document.getElementById("seccion-ventas");
const seccionMetas = document.getElementById("seccion-metas");

menuItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    // Ocultar todas las secciones
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
    } else if (index === 2) { // Metas
      seccionMetas.style.display = "block"; 

      if (metaTabActivo === "metas") {
        tabMetas.classList.add("activo");
        tabEstadoMeta.classList.remove("activo");
        seccionMeta.style.display = "block";
        seccionEstadoMeta.style.display = "none"; 
      } else {
        tabEstadoMeta.classList.add("activo");
        tabMetas.classList.remove("activo");
        seccionEstadoMeta.style.display = "block";
        seccionMeta.style.display = "none"; 
      }
    }
  });
});

// Cambiar entre pestañas de la seccion de METAS
const tabMetas = document.getElementById("tab-meta");
const tabEstadoMeta = document.getElementById("tab-estado-meta");
const seccionMeta = document.getElementById("seccion-meta");
const seccionEstadoMeta = document.getElementById("seccion-estado-meta")
let metaTabActivo = "metas";

tabMetas.addEventListener("click", ()=>{
  tabMetas.classList.add("activo");
  tabEstadoMeta.classList.remove("activo");
  seccionMeta.style.display = "block";
  seccionEstadoMeta.style.display = "none";
  metaTabActivo = "metas";
})

tabEstadoMeta.addEventListener("click",()=>{
  tabEstadoMeta.classList.add("activo");
  tabMetas.classList.remove("activo");
  seccionMeta.style.display = "none";
  seccionEstadoMeta.style.display = "block";
  metaTabActivo = "EstadoMetas";

})

//Agregar Meta
const formMeta = document.getElementById("formulario-meta");

formMeta.addEventListener("submit", function(event) {
  event.preventDefault(); 

  const ingresos = document.getElementById("ingresos").value;
  const periodo = document.getElementById("periodo").value;

  console.log("Meta registrada:");
  console.log("Ingresos:", ingresos);
  console.log("Periodo:", periodo);
  
  formMeta.reset();
});