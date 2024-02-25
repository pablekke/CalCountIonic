// navegacion
const MENU = document.querySelector("#menu");
const ROUTER = document.querySelector("#ruteo");
const NAV = document.querySelector("#nav");
// pages
const HOME = document.querySelector("#page-home");
const LOGIN = document.querySelector("#page-login");
const PRODUCTOS = document.querySelector("#page-productos");
const REGISTRO = document.querySelector("#page-registro");
const AGREGAR_COMIDA = document.querySelector("#page-agregarComida");
const MAPA = document.querySelector("#page-mapa");

const APIbaseURL = "https://calcount.develotion.com";
let usuarioLogueado = null;
let listaAlimentos = [];
let listaProductos = [];
let caloriasTotales = 0;
let caloriasHoy = 0;
//  mapa
let map = null;
let posicionInicial = [-34.9, -56.19];
function inicializarMapa() {
  if (!map) {
    map = L.map("mapa-container");
    map.setView(posicionInicial, 18);
    //capa base
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    //añadir marcador
    L.marker(posicionInicial).addTo(map);
  }
}
//function cargarPosicionUsuario() {
//si estoy en un disp.mov
if (Capacitor.isNativePlatform()) {
  const loadCurrentPosition = async () => {
    const resultado = await Capacitor.Plugins.Geolocation.getCurrentPosition({
      timeout: 3000,
    });
    if (resultado.coords && resultado.coords.latitude) {
      posicionUsuario = [resultado.coords.latitude, resultado.coords.longitude];
    }
  };
  loadCurrentPosition();
}
//si estoy en web
else {
  window.navigator.geolocation.getCurrentPosition(
    //si todo sale bien
    (pos) => {
      if (pos && pos.coords && pos.coords.latitude) {
        posicionInicial = [pos.coords.latitude, pos.coords.longitude];
      }
    },
    //en caso de error
    () => {}
  );
}
//}
// INICIALIZAR

inicializar();

function inicializar() {
  cargarPaíses();
  //cargarPosicionUsuario();
  ROUTER.addEventListener("ionRouteDidChange", navegar);
}

function verificarInicio() {
  if (usuarioLogueado) {
    NAV.setRoot("page-productos");
    NAV.popToRoot();
  } else {
    NAV.setRoot("page-login");
    NAV.popToRoot();
  }
}

function actualizarUsuarioDesdeLS() {
  const usuarioEnLS = localStorage.getItem("usuarioLogueado");
  if (usuarioEnLS) {
    usuarioLogueado = JSON.parse(usuarioEnLS);
  }
}

//  NAVEGACIÓN
function navegar(evt) {
  actualizarUsuarioDesdeLS();
  actualizarMenu();
  ocultarPantallas();
  casoProductosYCaloriasVacios();
  const ruta = evt.detail.to;

  switch (ruta) {
    case "/":
      verificarInicio();
      break;
    case "/registro":
      mostrar(REGISTRO);
      break;
    case "/login":
      verificarInicio();
      mostrar(LOGIN);
      break;
    case "/productos":
      casoProductosYCaloriasVacios();
      mostrar(PRODUCTOS);
      break;
    case "/agregarComida":
      mostrar(AGREGAR_COMIDA);
      break;
    case "/mapa":
      mostrar(MAPA);

      break;
  }
}

try {
  registro_to_Login.addEventListener("click", function () {
    // Redirecciona a la página de registro
    window.location.href = "www/#/registro";
  });
} catch (e) {
  mostrarToast("ERROR", "Error", "Algo salió mal, intentá mas tarde.");
}

// LOG IN
function loguearse() {
  const usuario = document.querySelector("#usuarioLogin").value;
  const pass = document.querySelector("#passLogin").value;

  if (usuario && pass) {
    const urlLogin = APIbaseURL + "/login.php";
    const datos = {
      usuario: usuario,
      password: pass,
    };
    fetch(urlLogin, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    })
      .then((r) => r.json())

      .then((datos) => {
        if (datos.mensaje) {
          mostrarToast("ERROR", "Error", datos.mensaje);
        } else {
          usuarioLogueado = Usuario.parse(datos);
          vaciarCamposLogin();

          localStorage.setItem(
            "usuarioLogueado",
            JSON.stringify(usuarioLogueado)
          );

          mostrarToast("SUCCESS", "Registro exitoso", "Se ha iniciado sesión");
          getAlimentos();
          mostrarProductos();
          NAV.setRoot("page-productos");
          NAV.popToRoot();
        }
      })
      .catch(() => {
        mostrarToast("ERROR", "Error", "Por favor, intente nuevamente.");
      });
  } else {
    mostrarToast(
      "ERROR",
      "Error",
      "Los campos usuario/contraseña no pueden ser vacíos"
    );
  }
}

// LOG OUT
btnCerrarSesion.addEventListener("click", function () {
  cerrarMenu();
  localStorage.clear();
  usuarioLogueado = null;
  listaAlimentos = [];
  listaProductos = [];
  caloriasHoy = 0;
  caloriasTotales = 0;
  NAV.setRoot("page-login");
  NAV.popToRoot();
});

// REGISTRO
function registrarse() {
  const url = APIbaseURL + "/usuarios.php";
  const usuario = document.querySelector("#usuarioRegistro").value;
  const pass = document.querySelector("#passRegistro").value;
  const verificacionPass = document.querySelector(
    "#verificacionPassRegistro"
  ).value;
  const pais = document.querySelector("#selectPais").value;
  const caloriasDiarias = document.querySelector(
    "#caloriasDiariasRegistro"
  ).value;

  if (usuario && pass && verificacionPass && caloriasDiarias >= 1000) {
    if (pass === verificacionPass) {
      const data = {
        usuario: usuario,
        password: pass,
        idPais: pais,
        caloriasDiarias: caloriasDiarias,
      };
      fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((r) => r.json())
        .then((datos) => {
          if (datos.mensaje) {
            mostrarToast("ERROR", "Error", datos.mensaje);
          } else {
            vaciarCamposRegistro();
            localStorage.setItem(
              "usuarioLogueado",
              JSON.stringify(Usuario.parse(datos))
            );
            mostrarToast(
              "SUCCESS",
              "Registro exitoso",
              "Se ha iniciado sesión."
            );
            NAV.setRoot("page-agregarComida");
            NAV.popToRoot();
          }
        })
        .catch(() => {
          mostrarToast("ERROR", "Error", "Por favor, intente nuevamente.");
        });
    } else {
      mostrarToast(
        "ERROR",
        "Error",
        "El password y la verificación no coinciden."
      );
    }
  } else {
    mostrarToast("ERROR", "Error", "Todos los campos son obligatorios.");
  }
}

// AGREGAR COMIDA
function agregarComida() {
  const url = APIbaseURL + "/registros.php";

  const comida = document.querySelector("#selectComida").value;
  const fecha = document.querySelector("#fechaAgregar").value;
  const cantidad = document.querySelector("#cdadAlimento").value;

  if (comida && fecha && cantidad) {
    const data = {
      idAlimento: comida,
      idUsuario: usuarioLogueado.id,
      cantidad: cantidad,
      fecha: fecha,
    };
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        apikey: usuarioLogueado.apiKey,
        iduser: usuarioLogueado.id,
      },
      body: JSON.stringify(data),
    })
      .then((r) => r.json())
      .then((datos) => {
        if (datos.codigo !== 200) {
          mostrarToast("ERROR", "Error", datos.mensaje);
        } else {
          vaciarCamposAgregarComida();
          mostrarToast(
            "SUCCESS",
            "Añadido correctamente",
            "Se ha añadido un nuevo registro."
          );
          //pusheo el producto a la lista local
          listaProductos.push(Producto.parse(data));
          const UltimaPos = listaProductos.length - 1;
          //lo agrego  a la UI
          crearProductoUI(listaProductos[UltimaPos]);
          setCardDefault();
          actualizarCalorias();
          NAV.setRoot("page-agregarComida");
          NAV.popToRoot();
        }
      })
      .catch(() => {
        mostrarToast("ERROR", "Error", "Por favor, intente nuevamente.");
      });
  } else {
    mostrarToast("ERROR", "Error", "Todos los campos son obligatorios.");
  }
}

// eliminar un registro
function eliminarRegistro(id, calorias, cantidad, fecha) {
  const url = APIbaseURL + "/registros.php?idRegistro=" + id;

  if (id && calorias) {
    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        apikey: usuarioLogueado.apiKey,
        iduser: usuarioLogueado.id,
      },
    })
      .then((r) => r.json())
      .then((datos) => {
        if (datos.codigo !== 200) {
          mostrarToast("ERROR", "Error", datos.mensaje);
        } else {
          mostrarToast(
            "SUCCESS",
            "Eliminado con éxito",
            "Se ha eliminado el registro."
          );
          if (fechaActual == fecha) {
            caloriasHoy -= calorias * cantidad;
          }
          caloriasTotales -= calorias * cantidad;
          actualizarCalorias();

          //Eliminar de la lista local
          const index = listaProductos.findIndex((r) => r.id == id);
          if (index !== -1) {
            listaProductos.splice(index, 1);
          }
          casoProductosYCaloriasVacios();
          NAV.setRoot("page-productos");
          NAV.popToRoot();
        }
      })
      .catch(() => {
        mostrarToast("ERROR", "Error", "Por favor, intente nuevamente.");
      });
  }
}

function casoProductosYCaloriasVacios() {
  registrosContainer.innerHTML = "";
  if (listaProductos.length == 0) {
    caloriasHoySpan.textContent = 0;
    caloriasTotalesSpan.textContent = 0;

    // const mensaje = document.createElement("div");
    // mensaje.style.display = "block";
    // mensaje.innerHTML = `
    // <h1 style="margin: 0 10px">
    // Parece que no has añadido ningún alimento.
    // <br>
    // <a id="BtnAgregarComidaProductos" href="/www/index.html#/agregarComida">Agrega el primero</a>
    // </h1>`
    // // document.querySelector("#BtnAgregarComidaProductos")
    // // .addEventListener("click", function () {
    // //   // Redirecciona a la página de agregar comida
    // //   window.location.href = "/www/index.html#/agregarComida";
    // // });
    // registrosContainer.appendChild(mensaje);
  }
}
