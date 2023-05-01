import { uploadFiles, TraerProductos, TraerColores, TraerCategorias, deleteFile } from "./bd.js";
import { Producto } from "../models/index.js";



//constantes
const formulario = document.querySelector("form");
const section = document.querySelector("section");
const tbody = document.querySelector('tbody');
const spinners = document.querySelectorAll('#spinner');

const id = document.getElementById("id");
const titulo = document.getElementById("titulo");
const categoria = document.getElementById("categoria");
const color = document.getElementById("color");
const precio = document.getElementById("precio");
const descripcion = document.getElementById("descripcion");
const imagen = document.getElementById("imagen");
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

const BtnGrabar = document.getElementById("agregar");
const BtnEditar = document.getElementById("editar");
const BtnBuscar = document.getElementById("buscar");
const BtnEliminar = document.getElementById("eliminar");

var parrafos = document.querySelectorAll('.talla');

//EVENTOS

window.addEventListener("load", IniciarAPP);

// funciones de agregar datos a card
BtnGrabar.addEventListener("click", () => Agregar());
BtnBuscar.addEventListener("click", () => Buscar(producto.id));
BtnEditar.addEventListener("click", () => Editar(producto.id));
BtnEliminar.addEventListener("click", () => Eliminar(producto.id));

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

function FiltrarProductos(id) {
  try {
    let filtrados = productos.filter(x => x.categoria?.id == id)
    MostrarProductos(filtrados)
  } catch (error) {
    console.log(error)

  }
}


function ControlarStock(stock) {
  return stock.S + stock.M + stock.L + stock.XL
}

function AgregarCard(event) {
  try {
    LimpiarErrores();
    let id = event.target.id;
    if (id == "S" || id == "M" || id == "L" || id == "XL") {
      producto.stock[event.target.id] = parseInt(event.target.value.trim());
      ControlarStock(producto.stock)
    } else if (id == "categoria" || id == "color") {
      var combo = document.getElementById(id)
      producto[event.target.id].id = event.target.value.trim();
      producto[event.target.id].nombre = combo.options[combo.selectedIndex].text;
      if (id === "categoria") {
        FiltrarProductos(producto.categoria.id)
      }
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

function scrollSuave() {
  // $('body, html').animate({
  //   scrollTop: '20px'
  // }, 300);

  // function()
  //  {
  window.scrollTo({

    top: section.offsetTop,
    behavior: 'smooth'
  });
};
// };

async function IniciarAPP() {
  try {
    limpiarformulario();

    mostrarSpinner();
    categorias = await TraerCategorias();
    MostrarCategorias();

    colores = await TraerColores();
    MostrarColores();

    productos = await TraerProductos()
    ocultarSpinner()
    MostrarProductos(productos)
  } catch (error) {
    console.error(error);
  }
}

// function TraerProductos() {
//   url = "/productos";
//   fetch(url)
//     .then((response) => response.json())
//     .then((datos) => {
//       productos = datos;
//     });
// }

function MostrarCategorias() {
  categorias.forEach((cat) => {
    const { id, nombre } = cat;
    const option = document.createElement("OPTION");
    option.value = id;
    option.textContent = nombre;
    categoria.appendChild(option);
  });
}

function MostrarColores() {
  colores.forEach((col) => {
    const { id, nombre } = col;
    const option = document.createElement("OPTION");
    option.value = id;
    option.textContent = nombre;
    color.appendChild(option);
  });
}

function MostrarProductos(productos) {


  tbody.innerHTML = "";

  productos.forEach(producto => {

    let tr = document.createElement("tr");
    tr.id = producto.id;

    let tdId = document.createElement("td");
    tdId.textContent = producto.id;

    let tdTitulo = document.createElement("td");
    tdTitulo.textContent = producto.titulo;

    let tdDescripcion = document.createElement("td");
    tdDescripcion.textContent = producto.descripcion;

    let tdPrecio = document.createElement("td");
    tdPrecio.textContent = `$${producto.precio}`;

    let tdStock = document.createElement("td");
    tdStock.textContent = `${ControlarStock(producto.stock)}`;

    let tdImagen = document.createElement("td");
    let img = document.createElement("img");
    img.width = 50;
    img.height = 50;
    img.src = producto.imagen
    tdImagen.appendChild(img);

    let tdBtn = document.createElement("td");

    let BtnSeleccionar = document.createElement("button");
    BtnSeleccionar.onclick = () => Seleccionar(tr.id)


    // formulario.focus();
    BtnSeleccionar.classList.add('btn', 'btn-primary', 'me-2', "bg-primary");
    BtnSeleccionar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-index-thumb-fill"                             viewBox="0 0 16 16">
                                 <path  d="M8.5 1.75v2.716l.047-.002c.312-.012.742-.016 1.051.046.28.056.543.18.738.288.273.152.456.385.56.642l.132-.012c.312-.024.794-.038 1.158.108.37.148.689.487.88.716.075.09.141.175.195.248h.582a2 2 0 0 1 1.99 2.199l-.272 2.715a3.5 3.5 0 0 1-.444 1.389l-1.395 2.441A1.5 1.5 0 0 1 12.42 16H6.118a1.5 1.5 0 0 1-1.342-.83l-1.215-2.43L1.07 8.589a1.517 1.517 0 0 1 2.373-1.852L5 8.293V1.75a1.75 1.75 0 0 1 3.5 0z" />
                            </svg>`

    tdBtn.appendChild(BtnSeleccionar)

    let BtnEliminar = document.createElement("button");
    BtnEliminar.onclick = () => Eliminar(tr.id);
    BtnEliminar.classList.add('btn', 'btn-danger', 'me-2', 'bg-danger');
    BtnEliminar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">   <path   d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" /> </svg>`

    tdBtn.appendChild(BtnEliminar)

    tr.appendChild(tdId)
    tr.appendChild(tdId);
    tr.appendChild(tdTitulo);
    tr.appendChild(tdDescripcion);
    tr.appendChild(tdPrecio);
    tr.appendChild(tdStock);
    tr.appendChild(tdImagen);
    tr.appendChild(tdBtn)

    tbody.appendChild(tr);
  })

}

async function Seleccionar(id) {

  producto = productos.find(x => x.id == id);
  EstadoEdicion()
  CargarFormulario()
  scrollSuave()
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
    color.value = producto.color.id;

    precio.value = producto.precio;
    card_precio.textContent = producto.precio


    descripcion.value = producto.descripcion;
    card_descripcion.textContent = producto.descripcion;

    s.value = producto.stock.S;
    m.value = producto.stock.M;
    l.value = producto.stock.L;
    xl.value = producto.stock.XL;

    ControlarStock(producto.stock);

    card_imagen.src = producto.imagen
    imagen.src = producto.imagen

  }
}


function EstadoAgregarBuscar() {

  id.disabled = false;
  Ocultar(BtnEditar)
  Ocultar(BtnEliminar)
  Visualizar(BtnGrabar)
  Visualizar(BtnBuscar)
}

function EstadoEdicion() {

  id.disabled = true;
  Visualizar(BtnEditar)
  Visualizar(BtnEliminar)
  Ocultar(BtnGrabar)
  Ocultar(BtnBuscar)
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

    // if (child.id !== 'id') {
    // Si es un input o un textarea, valida su valor
    if (child.tagName === 'INPUT' || child.tagName === 'TEXTAREA' || child.tagName === 'SELECT') {
      if (child.value === '' || child.value ==='--Seleccione') {
        child.classList.add('is-invalid');
        valido = true;
      } else {
        child.classList.remove('is-invalid');
      }
    }
    // }
    // Si el elemento tiene hijos, llama a la función recursivamente
    if (child.children.length > 0) {
      validarFormulario(child);
    }
  }
  return valido
}

function ValidarId() {

  var valido = productos.some(x => x.id == producto.id)
  return valido
}


function verificarCamposVacios(objeto) {
  for (let propiedad in objeto) {
    if (!objeto[propiedad] || objeto[propiedad] == null) {
      return true; // hay un campo vacío
    }
  }
  return false; // no hay campos vacíos
}

async function Agregar() {
  LimpiarErrores();
  try {
    if (!validarFormulario(formulario) ) {
      if (!ValidarId()) {
        if (ControlarStock(producto.stock) > 0) {
          mostrarSpinner()

          let url_img = await uploadFiles(producto.imagen);
          producto.imagen = url_img

          let res = await fetch("/producto", {
            method: "POST", // or 'PUT'
            body: JSON.stringify(producto), // data can be `string` or {object}!
            headers: {
              "Content-Type": "application/json",
            },
          })
          if (res.status === 200) {
            // La respuesta fue exitosa
            mostrarToast("El Producto fue agreagado correctamente", "bg-success");
            limpiarformulario()
            productos = await TraerProductos()
            ocultarSpinner()
            MostrarProductos(productos)
          } else {
            mostrarToast('¡No se pudo agregar el nuevo Producto!', 'bg-danger');
            ocultarSpinner()
          }
        }
      }
    }

  } catch (error) {
    console.log(error);
  }
}


async function Eliminar(id) {
  try {
    if (id !== undefined || id !== 0) {
      mostrarSpinner()
      producto = productos.find(x => x.id == id);
      await deleteFile(producto.imagen)


      let res = await fetch(`/producto/${id}`, {
        method: "DELETE", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (res.status === 200) {
        // La respuesta fue exitosa
        mostrarToast("El Producto fue Eliminado correctamente", "bg-success");
        limpiarformulario()
        EstadoAgregarBuscar()
        productos = await TraerProductos()
        ocultarSpinner();
        MostrarProductos(productos)
        return res.json(); // devuelve los datos en formato JSON
      } else {
        // La respuesta no fue exitosa
        mostrarToast('¡No se pudo Eliminar el numero Producto!', 'bg-danger');
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function Editar(id) {
  try {
    if (!verificarCamposVacios(producto)) {
      if (ControlarStock(producto.stock) > 0) {
        mostrarSpinner()
        if (producto.imagen !== imagen.src) {
          await deleteFile(imagen.src);
          let url_img = await uploadFiles(producto.imagen);
          producto.imagen = url_img
        }

        let url = `/producto/${id}`;

        let res = await fetch(url, {
          method: "PUT", // or 'PUT'
          body: JSON.stringify(producto), // data can be `string` or {object}!
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (res.status === 200) {
          // La respuesta fue exitosa
          mostrarToast("El Producto fue Modificado correctamente", "bg-success");
          limpiarformulario()
          EstadoAgregarBuscar()
          ocultarSpinner()
          productos = await TraerProductos()
          MostrarProductos(productos)
        } else {
          // La respuesta Negativa
          mostrarToast('La Modificación no se pudo realizar', 'bg-danger');
          ocultarSpinner()
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function Buscar(id) {
  try {
    let url = `/producto/${id}`;
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


// Función para mostrar el spinner
function mostrarSpinner() {
  // spinner.classList.remove('visually-hidden');
  spinners.forEach(spinner => spinner.classList.remove('visually-hidden'));

}

// Función para ocultar el spinner
function ocultarSpinner() {
  // spinner.classList.add('visually-hidden');
  spinners.forEach(spinner => spinner.classList.add('visually-hidden'));

}

  // resultado.innerHTML = "";
  // const spinner = document.createElement('div');
  // spinner.classList.add('spinner2');

  // spinner.innerHTML = `
  //       <div class="bounce1"></div>
  //       <div class="bounce2"></div>
  //       <div class="bounce3"></div>
  //                     `;
  // resultado.appendChild(spinner);


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


