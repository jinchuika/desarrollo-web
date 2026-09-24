// Archivo de JavaScript del proyecto.
// Es UN SOLO archivo para las tres paginas del sitio.
// Por eso cada bloque que busca un elemento va dentro de un if:
// si el elemento no existe en esa pagina, el bloque no se ejecuta
// y el resto del archivo sigue corriendo.

// === ANIO DEL PIE DE PAGINA (las tres paginas) ===
const anio = document.querySelector("#anio");

if (anio) {
    anio.textContent = new Date().getFullYear() + 4;
}

// === MOSTRAR Y OCULTAR PROYECTOS (solo perfil.html) ===
const boton = document.querySelector("#ver-mas");
const extra = document.querySelector("#proyectos-extra");

if (boton && extra) {                       // los DOS tienen que existir
    boton.addEventListener("click", function () {
        extra.classList.toggle("oculto");
    });
}

// === VALIDACION DEL FORMULARIO DE CONTACTO (solo contacto.html) ===
const formulario = document.querySelector("#contacto");

if (formulario) {
    const nombre = document.querySelector("#nombre");
    const correo = document.querySelector("#correo");
    const mensaje = document.querySelector("#mensaje");

    const errorNombre = document.querySelector("#error-nombre");
    const errorCorreo = document.querySelector("#error-correo");
    const errorMensaje = document.querySelector("#error-mensaje");

    const exito = document.querySelector("#mensaje-exito");

    // marca o limpia un campo y escribe su mensaje de error
    function marcar(campo, parrafo, texto) {
        parrafo.textContent = texto;
        if (texto === "") {
            campo.classList.remove("campo-invalido");
        } else {
            campo.classList.add("campo-invalido");
        }
    }

    // muestra el mensaje de cierre dentro de la pagina
    function mostrarExito(texto) {
        exito.textContent = texto;
        exito.classList.remove("oculto");
    }

    // lo esconde otra vez al empezar un envio nuevo
    function ocultarExito() {
        exito.textContent = "";
        exito.classList.add("oculto");
    }

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();          // sin esto la pagina se recarga
        ocultarExito();                   // se limpia lo de la vez anterior

        let valido = true;

        // nombre: al menos 3 caracteres que no sean espacios
        if (nombre.value.trim().length < 3) {
            marcar(nombre, errorNombre, "Escriba su nombre completo");
            valido = false;
        } else {
            marcar(nombre, errorNombre, "");
        }

        // correo: no vacio, con arroba, y con un punto despues de la arroba
        const posArroba = correo.value.indexOf("@");

        if (correo.value.trim() === "") {
            marcar(correo, errorCorreo, "Escriba su correo");
            valido = false;
        } else if (posArroba === -1) {
            marcar(correo, errorCorreo, "Al correo le falta la arroba");
            valido = false;
        } else if (correo.value.indexOf(".", posArroba) === -1) {
            marcar(correo, errorCorreo, "Al correo le falta el punto despues de la arroba");
            valido = false;
        } else {
            marcar(correo, errorCorreo, "");
        }

        // mensaje: al menos 10 caracteres
        if (mensaje.value.trim().length < 10) {
            marcar(mensaje, errorMensaje, "Escriba un mensaje de al menos 10 letras");
            valido = false;
        } else {
            marcar(mensaje, errorMensaje, "");
        }

        if (valido) {
            fetch("https://formsubmit.co/ajax/lc@zolar.dev", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({
                    nombre: nombre.value, correo: correo.value,
                    mensaje: mensaje.value, _captcha: "false"
                })
            })
                .then(function () { formulario.reset(); mostrarExito("Su mensaje fue enviado."); })
                .catch(function () { mostrarExito("No se pudo enviar."); });

            formulario.reset();
        }
    });
}

// === PROYECTOS DESDE ARCHIVO DE DATOS (solo perfil.html) ===
// Requiere en perfil.html:  <div class="tarjetas" id="tarjetas"></div>
// Requiere el archivo:      datos/proyectos.json
// Y requiere Live Server: con doble clic sobre el archivo, fetch falla.
const contenedor = document.querySelector("#tarjetas");

function dibujarTarjetas(proyectos) {
    contenedor.innerHTML = "";                    // se limpia antes de dibujar
    proyectos.forEach(function (proyecto) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta";
        tarjeta.innerHTML =
            "<h3>" + proyecto.nombre + "</h3>" +
            "<p>" + proyecto.descripcion + "</p>";
        contenedor.appendChild(tarjeta);
    });
}

if (contenedor) {
    fetch("datos/proyectos.json")
        .then(function (respuesta) {
            return respuesta.json();              // el texto pasa a ser lista
        })
        .then(function (proyectos) {
            dibujarTarjetas(proyectos);
        })
        .catch(function (error) {
            contenedor.innerHTML = "<p>No se pudieron cargar los proyectos.</p>";
        });
}

// Animación de contador incremental de años de experiencia
document.addEventListener("DOMContentLoaded", () => {
    const contadorElemento = document.getElementById("contador-anios");
    if (!contadorElemento) return;

    const valorFinal = 13; // Número hasta el cual contará
    const duracionTotalMs = 1500; // Duración total de la animación en milisegundos (1.5 segundos)
    const intervaloMs = duracionTotalMs / valorFinal;

    let valorActual = 1;

    const timer = setInterval(() => {
        valorActual++;
        contadorElemento.textContent = valorActual;

        if (valorActual >= valorFinal) {
            clearInterval(timer);
        }
    }, intervaloMs);
});