// inputs
//botonesMenu
const btnRegistro = document.querySelector("#btnRegistro");
const btnLogin = document.querySelector("#btnLogin");
const btnProductos = document.querySelector("#btnProductos");
const btnAgregarComida = document.querySelector("#btnAgregarComida");
const btnMapa = document.querySelector("#btnMapa");
const btnCerrarSesion = document.querySelector("#btnCerrarSesion");
const registro_to_Login = document.querySelector("#btnRegistroLogin");
//otros
const selectPais = document.querySelector("#selectPais");
const selectComida = document.querySelector("#selectComida");
const btnLoguearse = document.querySelector("#btnLoguearse");
const btnRegistrarse = document.querySelector("#btnRegistrarse");
const registrosContainer = document.getElementById("registros-container");
const fechaActual = new Date().toISOString().split("T")[0];
const caloriasTotalesSpan = document.querySelector("#caloriasTotales");
const caloriasHoySpan = document.querySelector("#caloriasHoy");
const muestraCalorias = document.querySelector("#muestraCalorias");

function ocultar(page) {
  page.style.display = "none";
}

function mostrar(page) {
  page.style.display = "block";
}

function ocultarPantallas() {
  ocultar(LOGIN);
  ocultar(PRODUCTOS);
  ocultar(REGISTRO);
  ocultar(AGREGAR_COMIDA);
  ocultar(MAPA);
}

function cerrarMenu() {
  MENU.close();
}

function actualizarMenu() {
  ocultarOpcionesMenu();

  if (usuarioLogueado) {
    mostrar(btnCerrarSesion);
    mostrar(btnProductos);
    mostrar(btnAgregarComida);
    mostrar(btnMapa);
    mostrar(muestraCalorias);
  } else {
    mostrar(btnLogin);
    mostrar(btnRegistro);
  }
}

function ocultarOpcionesMenu() {
  ocultar(btnCerrarSesion);
  ocultar(btnProductos);
  ocultar(btnLogin);
  ocultar(btnRegistro);
  ocultar(btnAgregarComida);
  ocultar(btnMapa);
  ocultar(muestraCalorias);
}

function vaciarCamposLogin() {
  document.querySelector("#usuarioLogin").value = "";
  document.querySelector("#passLogin").value = "";
}

function vaciarCamposRegistro() {
  document.querySelector("#usuarioRegistro").value = "";
  document.querySelector("#passRegistro").value = "";
  document.querySelector("#verificacionPassRegistro").value = "";
  document.querySelector("#caloriasDiariasRegistro").value = "";
}

function vaciarCamposAgregarComida() {
  document.querySelector("#selectComida").value = "";
  document.querySelector("#fechaAgregar").value = "";
  document.querySelector("#cdadAlimento").value = "";
}

function mostrarProductos() {
  registrosContainer.innerHTML = "";
  if (listaProductos.length > 0) {
    listaProductos.forEach((p, index) => {
      crearProductoUI(p, index);
    });
  } else {
    cargarProductos();
  }
}

function cargarProductos() {
  registrosContainer.innerHTML = "";
  const url = APIbaseURL + "/registros.php?idUsuario=" + usuarioLogueado.id;

  fetch(url, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      apikey: usuarioLogueado.apiKey,
      iduser: usuarioLogueado.id,
    },
  })
    .then((r) => r.json())
    .then((datos) => {
      if (datos.mensaje) {
        mostrarToast("ERROR", "Error", "Por favor, intente nuevamente.");
      } else {
        const registros = datos.registros;
        registros.forEach((registro, index) => {
          //pusheo el producto a la lista local
          let prod = Producto.parse(registro);
          listaProductos.push(prod);
          //lo agrego a la UI
          crearProductoUI(prod, index);
          actualizarCalorias();
        });
      }
    })
    .catch(() => {
      mostrarToast("ERROR", "Error", "Por favor, intente nuevamente.");
    });
}

function actualizarCalorias() {
  // Actualiza los textos de calorías
  caloriasHoySpan.textContent = caloriasHoy;
  caloriasTotalesSpan.textContent = caloriasTotales;
  const caloriasDiariasPrevistas = usuarioLogueado.caloriasDiarias;
  // Calcula el porcentaje de calorías consumidas respecto a las previstas
  const porcentajeCalorias = (caloriasHoy / caloriasDiariasPrevistas) * 100;

  // Determina el color basado en las condiciones
  if (porcentajeCalorias > 100) {
    // Rojo si excede la cantidad total de calorías diarias prevista
    caloriasHoySpan.style.color = "red";
  } else if (porcentajeCalorias > 90) {
    // Amarillo si está por debajo hasta un 10%
    caloriasHoySpan.style.color = "yellow";
  } else {
    // Verde cuando esté por debajo
    caloriasHoySpan.style.color = "green";
  }
}

function crearProductoUI(registro, index) {
  let alimentoRegistro = getAlimentoById(registro.idAlimento);
  if (!alimentoRegistro) return; // Si no se encuentra el alimento, no hace nada
  //actualizo calorias

  if (fechaActual == registro.fecha) {
    caloriasHoy += alimentoRegistro.calorias * registro.cantidad;
  }
  caloriasTotales += alimentoRegistro.calorias * registro.cantidad;

  const registroItem = document.createElement("ion-item");
  registroItem.style.display = "flex";
  registroItem.style.flexDirection = "column";
  registroItem.style.alignItems = "center";
  registroItem.innerHTML = `
  <img src="${APIbaseURL}/imgs/${alimentoRegistro.imagen}.png" alt="Imagen de ${alimentoRegistro.nombre}" style="width: 40px; margin: 0 10px;">
  <ion-label><strong>Fecha:</strong> ${registro.fecha}<br><strong>Cantidad:</strong> ${registro.cantidad}</ion-label>`;

  const alimentoInfo = document.createElement("div");
  alimentoInfo.id = `alimento-info-${index}`;
  alimentoInfo.classList.add("alimento-info");
  alimentoInfo.style.marginTop = "5px";
  alimentoInfo.style.marginBottom = "5px";
  alimentoInfo.innerHTML = `
  <ion-card color="success">
    <ion-card-header>
      <ion-card-title>${alimentoRegistro.nombre}</ion-card-title>
      <button class="close-button" style="position: absolute; top: 0; right: 0; background: transparent; border: none; font-size: 30px;">&times;</button>
    </ion-card-header>
    <ion-card-content>
      <p>Calorías: ${alimentoRegistro.calorias}</p>
      <p>Proteínas: ${alimentoRegistro.proteinas}</p>
      <p>Grasas: ${alimentoRegistro.grasas}</p>
      <p>Carbohidratos: ${alimentoRegistro.carbohidratos}</p>
      <p>Porción: ${alimentoRegistro.porcion}</p>
    </ion-card-content>
  </ion-card>`;

  // Añadir evento para eliminar la tarjeta
  alimentoInfo
    .querySelector(".close-button")
    .addEventListener("click", function () {
      eliminarRegistro(
        registro.id,
        alimentoRegistro.calorias,
        registro.cantidad,
        registro.fecha
      );
      registroItem.remove();
    });

  registroItem.appendChild(alimentoInfo);
  registrosContainer.appendChild(registroItem);
}

function getAlimentoById(id) {
  return listaAlimentos.find((alimento) => alimento.id === id);
}

function getAlimentos() {
  const url = APIbaseURL + "/alimentos.php";
  fetch(url, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      apiKey: usuarioLogueado.apiKey,
      iduser: usuarioLogueado.id,
    },
  })
    .then((r) => r.json())
    .then((datos) => {
      const alimentos = datos.alimentos;
      alimentos.forEach((alimento) => {
        listaAlimentos.push(Alimento.parse(alimento));
      });
    })
    .catch(() => (listaAlimentos = []));
}

function cargarPaíses() {
  const urlPaises = APIbaseURL + "/paises.php";
  fetch(urlPaises, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((r) => r.json())
    .then((datos) => {
      const paises = datos.paises;
      paises.forEach((pais) => {
        let opcion = document.createElement("ion-select-option");
        opcion.value = pais.id;
        opcion.textContent = pais.name;
        selectPais.appendChild(opcion);
      });
    })
    .catch(() => {
      mostrarToast("ERROR", "Error", "Por favor, intente nuevamente.");
    });
}

function cargarAlimentos() {
  listaAlimentos.forEach((alimento) => {
    let opcion = document.createElement("ion-select-option");
    opcion.value = alimento.id;
    opcion.textContent = alimento.nombre;
    selectComida.appendChild(opcion);
  });
}
// MENSAJES
async function mostrarToast(tipo, titulo, mensaje) {
  const toast = document.createElement("ion-toast");
  toast.header = titulo;
  toast.message = mensaje;
  toast.position = "bottom";
  toast.duration = 2000;
  if (tipo === "ERROR") {
    toast.color = "danger";
  } else if (tipo === "SUCCESS") {
    toast.color = "success";
  } else if (tipo === "WARNING") {
    toast.color = "warning";
  }

  document.body.appendChild(toast);
  return toast.present();
}

document.getElementById("selectComida").addEventListener("ionChange", (e) => {
  mostrarInfoNutricional(e.detail.value);
});

function mostrarInfoNutricional(alimentoId) {
  const alimento = getAlimentoById(alimentoId);
  if (!alimento) return; // Si no encuentra el alimento, termina la función

  const contenedor = document.getElementById("alimentoInfo");
  contenedor.innerHTML = "";

  // Crear la card de información nutricional
  let card = document.createElement("div");
  card.innerHTML = `
    <ion-card>
      <ion-card-header>
        <ion-card-title>${alimento.nombre}</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        Calorías: ${alimento.calorias} kcal<br>
        Proteínas: ${alimento.proteinas} g<br>
        Grasas: ${alimento.grasas} g<br>
        Carbohidratos: ${alimento.carbohidratos} g<br>
        Porción: ${alimento.porcion}<br>
      </ion-card-content>
    </ion-card>
  `;
  contenedor.appendChild(card);
}

function setCardDefault() {
  const contenedor = document.getElementById("alimentoInfo");
  contenedor.innerHTML = "";

  // Crear la card de información nutricional
  let card = document.createElement("div");
  card.innerHTML = `
  <ion-card>
  <ion-card-header>
    <ion-card-title id="tituloAlimentoInfo">Alimento</ion-card-title>
  </ion-card-header>
  <ion-card-content id="contentAlimentoInfo">
    Calorías: kcal<br>
    Proteínas: g<br>
    Grasas: g<br>
    Carbohidratos: g<br>
    Porción:<br>
  </ion-card-content>
</ion-card>
  `;
  contenedor.appendChild(card);
}

function setFechaMax(id) {
  document.getElementById(id).setAttribute("max", fechaActual);
}

function filtrarPorFecha() {
  let fechaInicio = document.getElementById("fechaInicio").value;
  let fechaFin = document.getElementById("fechaFin").value;

  // Invierte las fechas si fechaInicio es mayor que fechaFin
  if (fechaInicio > fechaFin) {
    let temp = fechaInicio;
    fechaInicio = fechaFin;
    fechaFin = temp;
  }

  let registrosFiltrados = listaProductos;

  // Filtra solo si al menos una fecha está seleccionada
  if (fechaInicio || fechaFin) {
    registrosFiltrados = listaProductos.filter((registro) => {
      const fechaRegistro = new Date(registro.fecha);
      const inicio = fechaInicio
        ? new Date(fechaInicio)
        : new Date("1900-01-01"); // Usa una fecha de inicio muy antigua si no se proporciona
      const fin = fechaFin ? new Date(fechaFin) : new Date(); // Usa la fecha actual si no se proporciona una fecha de fin
      return fechaRegistro >= inicio && fechaRegistro <= fin;
    });
  }

  // Limpia la visualización actual de registros
  registrosContainer.innerHTML = "";

  // Procesa y muestra los registros filtrados
  registrosFiltrados.forEach((registro, i) => {
    crearProductoUI(registro, i);
  });
}

function buscarPaisesPorUsuario() {
  const numeroFiltro = document.querySelector("#numeroFiltro").value;
  const divPaisesQueCumplen = document.querySelector("#paisesQueCumplen");
  divPaisesQueCumplen.innerHTML = "";
  const urlPaises = APIbaseURL + "/usuariosPorPais.php";
  fetch(urlPaises, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      apiKey: usuarioLogueado.apiKey,
      iduser: usuarioLogueado.id,
    },
  })
    .then((r) => r.json())
    .then((datos) => {
      const paises = datos.paises;
      paises.forEach((pais) => {
        if (pais.cantidadDeUsuarios >= numeroFiltro) {
          const paisElement = document.createElement("p");
          paisElement.textContent = `${pais.name} (${pais.cantidadDeUsuarios} usuarios)`;
          divPaisesQueCumplen.appendChild(paisElement);
        }
      });
    })
    .catch(() => {
      mostrarToast("ERROR", "Error", "Por favor, intente nuevamente.");
    });
}
