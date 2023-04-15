import { uploadFiles } from "./bd.js";
import { Producto } from "../models/index.js";
// const pro = new BEProducto();
//constantes
const formulario = document.querySelector("form");

const id = document.getElementById("id");
const titulo = document.getElementById("titulo");
const categoria = document.getElementById("categoria");
const color = document.getElementById("color");
const precio = document.getElementById("precio");
const descripcion = document.getElementById("descripcion");
const imagen = document.getElementById("imagen");
const Contenedor_Stock = document.getElementById("contenedor-stock");
const s = document.getElementById("S");
const m = document.getElementById("M");
const l = document.getElementById("L");
const xl = document.getElementById("XL");


const card_id = document.getElementById("card_id");
const card_titulo = document.getElementById("card_titulo");
const card_precio = document.getElementById("card_precio");
const card_descripcion = document.getElementById("card_descripcion");
const card_imagen = document.getElementById("card_imagen");
const card_stock = document.getElementById("card_stock");


//variables
// window.getItemAt = getItemAt;
let productos = [];
let categorias = [];
let colores = [];

let producto = new Producto();
let reader = new FileReader();


const BtnGrabar = document.getElementById("agregar");
const BtnEditar = document.getElementById("editar");
const BtnBuscar = document.getElementById("buscar");
const BtnEliminar = document.getElementById("eliminar");
var parrafos = document.querySelectorAll('.talla');

//EVENTOS

window.addEventListener("load", IniciarAPP);

// funciones de agregar datos a card
BtnGrabar.addEventListener("click", Agregar);
BtnBuscar.addEventListener("click", Buscar);
BtnEditar.addEventListener("click", Editar);
// BtnEliminar.addEventListener("click", Eliminar);

id.addEventListener("input", AgregarCard);
titulo.addEventListener("input", AgregarCard);
precio.addEventListener("input", AgregarCard);
descripcion.addEventListener("input", AgregarCard);

//stock
s.addEventListener("input", AgregarCard);
m.addEventListener("input", AgregarCard);
l.addEventListener("input", AgregarCard);
xl.addEventListener("input", AgregarCard);
color.addEventListener("change", AgregarCard);
categoria.addEventListener("change", AgregarCard);
imagen.addEventListener("change", AgregarImagen);



// Selecciona todos los párrafos dentro del contenedor

//Agrega el evento click a cada párrafo
parrafos.forEach(function (parrafo) {
  parrafo.addEventListener('click', MostrarStockCard);
});

//funciones

function ControlarStock() {
  return producto.stock.S + producto.stock.M + producto.stock.L + producto.stock.XL
}


function AgregarCard(event) {
  try {
    LimpiarErrores();
    let id = event.target.id;
    if (id == "S" || id == "M" || id == "L" || id == "XL") {
      producto.stock[event.target.id] = parseInt(event.target.value.trim());
      ControlarStock()
    } else if (id == "categoria" || id == "color") {

      var combo = document.getElementById(id)
      producto[event.target.id].id = event.target.value.trim();
      producto[event.target.id].nombre = combo.options[combo.selectedIndex].text;
    } else {
      producto[event.target.id] = event.target.value.trim();
      if (event.target.id == "id") {
        card_id.textContent = producto.id;
      }
      if (event.target.id == "titulo") {
        card_titulo.textContent = producto.titulo;
      }
      if (event.target.id == "precio") {
        card_precio.textContent = "$" + producto.precio;
      }
      if (event.target.id == "descripcion") {
        card_descripcion.textContent = producto.descripcion;
      }
    }
  }
  catch (error) {
    console.log(error);
  }
}

function mostrarToast(mensaje, clase) {
  const toastDiv = document.querySelector('#toast');
  const toastBody = document.querySelector('.toast-body');
  const toastHeader = document.querySelector('.toast-header');
  const toast = new bootstrap.Toast(toastDiv);
  toastBody.textContent = mensaje;
  toastHeader.classList.remove('bg-success', 'bg-danger');
  toastHeader.classList.add(clase)
  toast.show();

}


function limpiarformulario() {
  formulario.reset();
  card_id.textContent = ''
  card_titulo.textContent = '';
  card_precio.textContent = '';
  card_descripcion.textContent = '';
  card_stock.textContent = '';
  card_imagen.src = "/static/prototipo.png";
  producto = new Producto();
}

function LimpiarHtml(div) { // funcion para eliminar todos el contenido de los nodos hijos
  const children = div.children;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    // obtener el valor original del elemento
    const originalValue = child.innerHTML;
    // aquí puedes realizar alguna operación con el elemento hijo
    // por ejemplo, imprimir su valor original en la consola
    console.log(originalValue);
    // si el hijo es otro elemento div, puedes llamar a la función recursivamente
    if (child.tagName === 'DIV') {
      traverseDivChildrenAndGrandchildren(child);
    } else {
      // si el hijo no es un div, también puedes recorrer sus hijos recursivamente
      traverseDivChildrenAndGrandchildren(child);
    }
  }
}


function IniciarAPP() {
  try {
    limpiarformulario();

    let url = "/categorias";
    fetch(url)
      .then((response) => response.json())
      .then((datos) => {
        categorias = datos;
        mostrarCategorias();
      });

    url = "/colores";
    fetch(url)
      .then((response) => response.json())
      .then((datos) => {
        colores = datos;
        mostrarColores(datos);
      });
  } catch (error) {
    console.error(error);
  }
}

function mostrarCategorias() {
  categorias.forEach((cat) => {
    const { id, nombre } = cat;
    const option = document.createElement("OPTION");
    option.value = id;
    option.textContent = nombre;
    categoria.appendChild(option);
  });
}

function mostrarColores() {
  colores.forEach((col) => {
    const { id, nombre } = col;
    const option = document.createElement("OPTION");
    option.value = id;
    option.textContent = nombre;
    color.appendChild(option);
  });
}

async function AgregarImagen(event) {
  {
    let file = event.target.files[0];
    if (file) {
      let img = URL.createObjectURL(file);
      img.withd;
      card_imagen.src = img;
      producto.imagen = file;
      Visualizar(card_imagen)
    } else {
      Ocultar(card_imagen)
    }
  }
}

async function CargarFormulario() {
  if (producto != null) {
    id.value = producto.id;
    card_id.textContent = producto.id

    titulo.value = producto.titulo;
    card_titulo.textContent = producto.titulo;

    categoria.value = producto.categoria.id;
    color.value = producto.color.id;;

    precio.value = producto.precio;
    card_precio.textContent = producto.precio


    descripcion.value = producto.descripcion;
    card_descripcion.textContent = producto.descripcion;

    s.value = producto.stock.S;
    m.value = producto.stock.M;
    l.value = producto.stock.L;
    xl.value = producto.stock.XL;

    ControlarStock();
    console.log(imagen);

    // imagen.src = producto.imagen
    // imagen.text = producto.imagen
    card_imagen.src = producto.imagen

    console.log(producto);
  }
}



function EstadoAgregarBuscar() {

  id.disabled = false;
  Ocultar(BtnEditar)
  Ocultar(BtnEliminar)
  Visualizar(BtnGrabar)
}

function EstadoEdicion() {

  id.disabled = true;
  Visualizar(BtnEditar)
  Visualizar(BtnEliminar)
  Ocultar(BtnGrabar)
}


function Visualizar(elemento) {
  elemento.classList.remove('visually-hidden');
}
function Ocultar(elemento) {
  elemento.classList.add('visually-hidden');
}


function MostrarStockCard(event) {

  var talle = event.target.textContent;
  var spam = card_stock.querySelector('span')

  if (talle === 'XL') {
    spam.textContent = producto.stock.XL
  } else if (talle === 'L') {
    spam.textContent = producto.stock.L
  } else if (talle === 'M') {
    spam.textContent = producto.stock.M
  } else if (talle === 'S') {
    spam.textContent = producto.stock.S
  }
  Visualizar(card_stock)
  setTimeout(function () {
    Ocultar(card_stock)
  }, 1500)
}

function MostrarMensajeError(mensaje) {
  try {
    console.log(mensaje)
  }
  catch (e) {
    console.log(e)

  }
}



function LimpiarErrores() {
  var nodosHijos2 = document.querySelectorAll("input", "textarea");

  nodosHijos2.forEach((elemento) => {
    if (elemento.classList.contains("is-invalid")) {
      elemento.classList.remove("is-invalid");
    }
  });
}

function validarFormulario(elemento) {
  let valido = false
  // Recorre todos los elementos hijos del formulario
  for (let i = 0; i < elemento.children.length; i++) {
    const child = elemento.children[i];

    // Si es un input o un textarea, valida su valor
    if (child.tagName === 'INPUT' || child.tagName === 'TEXTAREA') {
      if (child.value === '') {
        child.classList.add('is-invalid');
        valido = true;
      } else {
        child.classList.remove('is-invalid');
      }
    }
    // Si el elemento tiene hijos, llama a la función recursivamente
    if (child.children.length > 0) {
      validarFormulario(child);
    }
  }
  return valido
}

async function Agregar() {
  LimpiarErrores();
  try {
    if (!validarFormulario(formulario)) {
      if (ControlarStock > 0) {
        let url_img = await uploadFiles(producto.imagen);
        producto.imagen = url_img
        fetch("/producto", {
          method: "POST", // or 'PUT'
          body: JSON.stringify(producto), // data can be `string` or {object}!
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(res => {
            if (res.ok) {
              // La respuesta fue exitosa
              mostrarToast("El Producto fue agreagado correctamente", "bg-success");
              limpiarformulario()
              return res.json(); // devuelve los datos en formato JSON
            } else {
              // La respuesta no fue exitosa
              mostrarToast('¡No se pudo agregar el numero Producto!', 'bg-danger');
            }
          })
          .catch((error) => console.error("Error:", error))
          .then((response) => console.log("Respuesta:", response));
      }
      else {
        MostrarMensaje("ERror"); //mostrar mensaje de errror que no existe stock
      }
    }
  } catch (error) {
    console.log(error);
  }
}


async function Eliminar() {
  LimpiarErrores();
  try {
    if (producto.id !== null || producto.id === 0) {
      if (ControlarStock == 0) {

        fetch(`/producto/${producto.id}`,{
          method: "DELETE", // or 'PUT'
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(res => {
            if (res.ok) {
              // La respuesta fue exitosa
              mostrarToast("El Producto fue Eliminado correctamente", "bg-success");
              limpiarformulario()
              return res.json(); // devuelve los datos en formato JSON
            } else {
              // La respuesta no fue exitosa
              mostrarToast('¡No se pudo Eliminar el numero Producto!', 'bg-danger');
            }
          })
          .catch((error) => console.error("Error:", error))
          .then((response) => console.log("Respuesta:", response));
      }
      else {
        MostrarMensaje("ERror"); //mostrar mensaje de errror que no existe stock
      }
    }
  } catch (error) {
    console.log(error);
  }
}
function verificarCamposVacios(objeto) {
  for (let propiedad in objeto) {
    if (!objeto[propiedad] || objeto[propiedad] == null) {
      return true; // hay un campo vacío
    }
  }
  return false; // no hay campos vacíos
}
async function Editar() {
  try {
    if (!verificarCamposVacios(producto)) {
      if (ControlarStock() > 0) {
        let url_img = await uploadFiles(producto.imagen);
        producto.imagen = url_img

        let url = `/producto/${producto.id}`;

        fetch(url, {
          method: "PUT", // or 'PUT'
          body: JSON.stringify(producto), // data can be `string` or {object}!
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(res => {
            if (res.ok) {
              // La respuesta fue exitosa
              mostrarToast("El Producto fue Modificado correctamente", "bg-success");
              limpiarformulario()
              EstadoAgregarBuscar()
              return res.json(); // devuelve los datos en formato JSON
            } else {
              // La respuesta Negativa
              mostrarToast('La Modificación no se pudo realizar', 'bg-danger');
            }
          })
          .catch((error) => console.error("Error:", error))
          .then((response) => console.log("Respuesta:", response));
      }
      else {
        MostrarMensajeError("Error ");
      }
    }
  } catch (error) {
    console.log(error);
  }
}


function Buscar() {
  try {
    let url = `/producto/${producto.id}`;
    fetch(url).
      then(response => {
        if (response.status == 200) {
          mostrarToast("Consulta realizada con exito", "bg-success");
          return response.json()
        } else {
          mostrarToast(`¡No existe el Codigo de Articulo ${producto.id} !`, "bg-danger")
        }
      }).then(datos => {
        if (datos != undefined) {
          producto = datos
          CargarFormulario()
          EstadoEdicion()
        } else {
          limpiarformulario()
        }
      });
  } catch (e) {
    console.log(e)
  }
}

// function init() {
//   /* const refcategoria= ref(db, "Productos/");
//     onChildAdded(refcategoria,(snap)=>{
//         let data=snap.val();
//         productos.push(data)
//         }) */

//   resultsElem = document.querySelector("ul");
//   inputElem = document.getElementById("sku");

//   resultsElem.addEventListener("click", (event) => {
//     console.log("me diste click");
//     handleResultClick(event);
//   });
//   inputElem.addEventListener("input", (event) => {
//     autocomplete(event);
//   });
//   /* inputElem.addEventListener("keyup", (event) => {
//         handleResultKeyDown(event);
//     }); */
// }

// function autocomplete(event) {
//   console.log("products", productos);
//   const value = inputElem.value;
//   if (!value) {
//     console.log("entre");
//     hideResults();
//     inputElem.value = "";
//     return;
//   }
//   filteredResults = productos.filter((country) => {
//     return country.sku.toLowerCase().startsWith(value.toLowerCase());
//   });
//   console.log("filtro:", filteredResults);
//   if (filteredResults.length > 0) {
//     btn_agregar.disabled = true;
//     btn_buscar.disabled = false;
//     resultsElem.innerHTML = filteredResults
//       .map((result, index) => {
//         const isSelected = index === 0;
//         return `
//                         <li
//                         id='autocomplete-result-${index}'
//                         class='autocomplete-result${isSelected ? " selected" : ""
//           }'
//                         role='option'
//                         ${isSelected ? "aria-selected='true'" : ""}
//                         >
//                         ${result.sku}
//                         </li>
//                     `;
//       })
//       .join("");
//     resultsElem.classList.remove("hidden");
//   } else {
//     btn_agregar.disabled = false;
//     btn_buscar.disabled = true;
//   }
// }

// function handleResultClick(event) {
//   if (event.target && event.target.nodeName === "LI") {
//     selectItem(event.target);
//   }
// }

// function handleResultKeyDown(event) {
//   console.log(event);
//   const { key } = event;
//   const activeItem = this.getItemAt(activeIndex);
//   if (activeItem) {
//     activeItem.classList.remove("selected");
//     activeItem.setAttribute("aria-selected", "false");
//   }
//   switch (key) {
//     case "Backspace":
//       return;
//     case "Escape":
//       hideResults();
//       inputElem.value = "";
//       return;
//     case "ArrowUp": {
//       if (activeIndex === 0) {
//         activeIndex = filteredResults.length - 1;
//       }
//       activeIndex--;
//       break;
//     }
//     case "ArrowDown": {
//       if (activeIndex === filteredResults.length - 1) {
//         activeIndex = 0;
//       }
//       activeIndex++;
//       break;
//     }
//     default:
//       selectFirstResult();
//   }
//   console.log(activeIndex);
//   selectResult();
// }

// function selectFirstResult() {
//   activeIndex = 0;
// }

// function selectResult() {
//   const value = inputElem.value;
//   const autocompleteValue = filteredResults[activeIndex].nombre;
//   const activeItem = this.getItemAt(activeIndex);
//   if (activeItem) {
//     activeItem.classList.add("selected");
//     activeItem.setAttribute("aria-selected", "true");
//   }
//   if (!value || !autocompleteValue) {
//     return;
//   }
//   if (value !== autocompleteValue) {
//     inputElem.value = autocompleteValue;
//     inputElem.setSelectionRange(value.length, autocompleteValue.length);
//   }
// }
// function selectItem(node) {
//   if (node) {
//     btn_agregar.disabled = true;
//     btn_buscar.disabled = false;
//     inputElem.value = node.innerText;
//     console.log("viene el hide");
//     hideResults();
//     editar();
//   }
// }

// function hideResults() {
//   resultsElem.innerHTML = "";
//   resultsElem.classList.add("hidden");
// }

// function getItemAt(index) {
//   return this.resultsElem.querySelector(`#autocomplete-result-${index}`);
// }

// init();


