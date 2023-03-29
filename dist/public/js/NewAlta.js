import { uploadFiles } from "./bd.js";
// require.resolve("../../models/index");
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

const producto = {
  id: 0,
  titulo: "",
  precio: "",
  image: "",
  descripcion: "",
  categoria: {
    id: 0,
    nombre: "",
  },
  color: {
    id: 0.0,
    nombre: "",
  },
  stock: {
    id: 0,
    s: 0,
    m: 0,
    l: 0,
    xl: 0,
  },
};

const grabar = document.getElementById("agregar-editar");
const btn_agregar = document.getElementById("agregar-editar");
const btn_buscar = document.getElementById("buscar");

//EVENTOS

window.addEventListener("load", IniciarAPP);

// funciones de agregar datos a card
grabar.addEventListener("click", agregar);
btn_buscar.addEventListener("click", editar);

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

function AgregarCard(event) {
  let id = event.target.id;
  console.log(id);
  if (id == "s" || id == "m" || id == "l" || id == "xl") {

    producto.stock[event.target.id] = event.target.value.Drim();
  }
   else if (id == "categoria" || id == "color") {
    producto[event.target.id].id = event.target.value.trim();
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

//funciones

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

function AgregarImagen(event) {
  {
    let file = event.target.files[0];

    if (file) {
      let img = URL.createObjectURL(file);
      img.withd;
      card_imagen.src = img;
      producto.image = img;
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

  if (
    id.value == "" ||
    titulo.value == "" ||
    precio.value == "" ||
    descripcion.value == "" ||
    imagen.value == ""
  ) {
    if (titulo.value == "") titulo.classList.add("is-invalid");
    if (precio.value == "") precio.classList.add("is-invalid");
    if (descripcion.value == "") descripcion.classList.add("is-invalid");
    if (imagen.value == "") imagen.classList.add("is-invalid");
    if (id.value == "") id.classList.add("is-invalid");
    if (categoria.value == "") categoria.classList.add("is-invalid");
  } else {
    let url_img = await uploadFiles(resultado);
    console.log(url_img);
    let producto = {
      sku: id.value,
      nombre: titulo.value,
      precio: precio.value,
      image: url_img,
      descripcion: descripcion.value,
      categoria: categoria.value,
      stock: {
        S: parseInt(s.value),
        M: parseInt(m.value),
        L: parseInt(l.value),
        XL: parseInt(xl.value),
      },
    };

    /* const refProduct= ref(db, "Productos/");
            push(refProduct,producto) */
    fetch("/producto", {
      method: "POST", // or 'PUT'
      body: JSON.stringify(producto), // data can be `string` or {object}!
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .catch((error) => console.error("Error:", error))
      .then((response) => console.log("Success:", response));

    id.value = "";
    titulo.value = "";
    precio.value = "";
    imagen.value = "";
    descripcion.value = "";
    s.value = 0;
    m.value = 0;
    l.value = 0;
    xl.value = 0;
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
