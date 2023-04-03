import { uploadFiles } from "./bd.js";
import { Producto } from "../models/index.js";
// const pro = new BEProducto();
//constantes

const input_img = document.getElementById("imagen");
const id = document.getElementById("id");
const titulo = document.getElementById("titulo");
const categoria = document.getElementById("categoria");
const color = document.getElementById("color");
const precio = document.getElementById("precio");
const descripcion = document.getElementById("descripcion");
const imagen = document.getElementById("imagen");

const formulario = document.querySelector("form");

const card_id = document.getElementById("card_id");
const card_titulo = document.getElementById("card_titulo");
const card_precio = document.getElementById("card_precio");
const card_descripcion = document.getElementById("card_descripcion");
const card_imagen = document.getElementById("card_imagen");
const card_stock = document.getElementById("card_stock");

const s = document.getElementById("s");
const m = document.getElementById("m");
const l = document.getElementById("l");
const xl = document.getElementById("xl");

//variables
// window.getItemAt = getItemAt;
let productos = [];
let categorias = [];
var colores = [];
var inputElem = null;
var resultsElem = null;
var activeIndex = 0;
var filteredResults = [];

let producto = new Producto();

const grabar = document.getElementById("agregar-editar");
const btn_agregar = document.getElementById("agregar-editar");
const btn_buscar = document.getElementById("buscar");

//EVENTOS

window.addEventListener("load", IniciarAPP);

// funciones de agregar datos a card
grabar.addEventListener("click", agregar);
// btn_buscar.addEventListener("click", editar);

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

input_img.addEventListener("change", AgregarImagen);


//funciones
function AgregarCard(event) {
  try {
    LimpiarErrores();
    let id = event.target.id;
    if (id == "s" || id == "m" || id == "l" || id == "xl") {
      producto.stock[event.target.id] = event.target.value.trim();
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
  toastHeader.classList.add(clase)
  toast.show();
}


function limpiarformulario() {
  formulario.reset();
  card_id.textContent = ''
  s.textContent = ''
  card_titulo.textContent = '';
  card_precio.textContent = '';
  card_descripcion = '';
  card_stock = '0';
  card_imagen.src = "../static/prototipo.png";
}

function LimpiarHtml(div) {
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
      console.log(producto.imagen);
      card_imagen.classList.remove("visually-hidden");
    } else {
      card_imagen.classList.add("visually-hidden");
    }
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

async function agregar() {
  LimpiarErrores();

  try {
    if (
      id.value == "" ||
      titulo.value == "" ||
      precio.value == "" ||
      descripcion.value == "" ||
      imagen.value == ""
    ) {
      if (id.value == "") id.classList.add("is-invalid");
      if (titulo.value == "") titulo.classList.add("is-invalid");
      if (precio.value == "") precio.classList.add("is-invalid");
      if (descripcion.value == "") descripcion.classList.add("is-invalid");
      if (imagen.value == "") imagen.classList.add("is-invalid");
      if (categoria.value == "") categoria.classList.add("is-invalid");
    } else {
      let url_img = await uploadFiles(producto.imagen);
      producto.imagen = url_img

      /* const refProduct= ref(db, "Productos/");
        push(refProduct,producto) */
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
            return res.json(); // devuelve los datos en formato JSON
          } else {
            // La respuesta no fue exitosa
            mostrarToast('La respuesta de la solicitud Fetch no fue exitosa', 'bg-danger');
          }
        })
        .catch((error) => console.error("Error:", error))
        .then((response) => console.log("Respuesta:", response));

      limpiarformulario()
      producto = new Producto();

    }
  } catch (error) {

    console.log(error);
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

function editar() {
  const sku = inputElem.value;

  console.log(sku);
  productos.map((result, index) => {
    if (result.titulo == sku || result.sku == sku) {
      console.log(result);
      let input_sku = document.getElementById("id-sku");
      let input_titulo = document.getElementById("titulo");
      let input_precio = document.getElementById("precio");
      let input_imagen = document.getElementById("imagen");
      let input_descripcion = document.getElementById("descripcion");

      let input_s = document.getElementById("s");
      let input_m = document.getElementById("m");
      let input_l = document.getElementById("l");
      let input_xl = document.getElementById("xl");

      input_titulo.value = result.titulo;
      input_precio.value = result.precio;
      /* input_imagen.value=result.imagen */
      console.log(input_descripcion.value);
      input_descripcion.value = result.descripcion;
      input_s.value = result.stock.s;
      input_m.value = result.stock.m;
      input_l.value = result.stock.l;
      input_xl.value = result.stock.xl;
      input_sku.innerHTML = result.sku;
    }
  });
}
