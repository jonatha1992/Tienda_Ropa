window.filtrarListas = filtrarListas;
window.verProducto = verProducto;
window.agregarCarrito = agregarCarrito;
window.verCarrito = verCarrito;
window.deleteItemCarrito = deleteItemCarrito;
window.despachar = despachar;
window.validarForm = validarForm;
window.enviarNotificacion = enviarNotificacion;
/* async function traerProductos() {
    let productos=[]
    fetch('/productos')
        .then(data => {
        })
        .then(post => {
            productos.push(post)
        });
        
        return productos;
} */

const categoria = document.getElementById("slick-categorias");
const categoriaSelect = document.getElementById("floatingSelectCategoria");
let container_list_product = document.getElementById("lista-productos");

let categorias = [];
let productos = [];
let carrito = [];
let formDespacho = {};
let dollarUS2 = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  useGrouping: true,
}); // $147,741.15

function stylosJS() {
  const ancho = window.screen.width;
  const alto = window.screen.height;

  if (ancho < 768) {
    console.log("Este dispositivo es un móvil.");
    document.getElementById("container-slick-categoria").style.display =
      "block";
  } else if (ancho >= 768 && ancho < 1024) {
    console.log("Este dispositivo es una tablet.");
    document.getElementById("container-slick-categoria").style.display = "none";
  } else {
    console.log("Este dispositivo es un escritorio.");
    document.getElementById("container-slick-categoria").style.display = "none";
  }

  document.getElementById("back").style.display = "none";
  document.getElementById("menu-mobile").style.display = "block";
  document.getElementById("container-carrito").style.display = "none";
  let container_categoria = (document.querySelector(
    ".categorias-contain"
  ).style.display = "block");
  let container_pagos = (document.querySelector(".medios-pago").style.display =
    "flex");
  let container_glider = (document.querySelector(
    "#carrusel-hero"
  ).style.display = "block");
  let container_banner = (document.querySelector(".banner-2").style.display =
    "flex");
  document.getElementById("Pantalla-product").style.display = "none";
  document.getElementById("lista-contain").style.display = "block";
  $("body, html").animate(
    {
      scrollTop: "0px",
    },
    300
  );
}

function filtrarListas(categoria) {
  let container_categoria = (document.querySelector(
    ".categorias-contain"
  ).style.display = "none");
  let container_pagos = (document.querySelector(".medios-pago").style.display =
    "none");
  let container_glider = (document.querySelector(
    "#carrusel-hero"
  ).style.display = "none");
  let container_banner = (document.querySelector(".banner-2").style.display =
    "none");
  $("body, html").animate(
    {
      scrollTop: "0px",
    },
    300
  );
}

document.getElementById("logo").addEventListener("click", (e) => {
  stylosJS();
  obtenerLocalStorage();
});

document.getElementById("back").addEventListener("click", (e) => {
  stylosJS();
  obtenerLocalStorage();
});

document.getElementById("back-carrito").addEventListener("click", (e) => {
  document.getElementById("back-carrito").style.display = "none";
  verCarrito();
});
document.getElementById(`inicio`).addEventListener("click", (e) => {
  stylosJS();
  let html = "";
  let ruta_cat = document.querySelector(".ruta");
  ruta_cat.innerHTML = "";
  for (let i = 0; i < productos.length; i++) {
    let data = [productos[i]];

    html += `
                <div class="col">
                    <div class="card h-100">
                        <img src="${productos[i].imagen}" class="card-img-top" alt="...">
                        <div class="card-body" style="
                        text-align: center;">
                            <h5 class="card-title card-titulo">${productos[i].titulo}</h5>
                            <p class="card-text card-precio">${productos[i].precio}</p>
                            <button type="button" class="btn btn-secondary" onclick="verProducto(
                                '${productos[i].id}',
                                )">AGREGAR AL CARRITO</button>
                        </div>
                    </div>
                </div>
                `;
  }
  container_list_product.innerHTML = html;
});

function IniciarAPP() {
  try {
    let url = "/categorias";
    fetch(url)
      .then((response) => response.json())
      .then((datos) => {
        categorias = datos;
        mostrarCategorias();
      });
    url = "/productos";
    fetch(url)
      .then((response) => response.json())
      .then((datos) => {
        productos = datos;
        mostrarProductos();
      });
  } catch (error) {
    console.error(error);
  }
  console.log("ejec");
  obtenerLocalStorage();
}

function obtenerLocalStorage() {
  var miArrayRecuperado = JSON.parse(localStorage.getItem("carrito"));
  if (miArrayRecuperado) {
    carrito = miArrayRecuperado;
    document.getElementById("icon-basket").style.display = "block";
    document.querySelector(".badge").style.display = "block";
    document.querySelector(".badge").innerHTML = carrito.length;
  }
}
function mostrarCategorias() {
  categorias.forEach((cat) => {
    const { id, nombre } = cat;
    let htmlCategoria = `<option id="${id}">${nombre}</option>`;
    let html = `<div class="slick-item-categoria" id="${id}">${nombre}</div>`;
    categoria.innerHTML += html;
    categoriaSelect.innerHTML += htmlCategoria;
  });
  $("#slick-categorias").slick({
    arrows: false,
    infinite: true,
    speed: 300,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToScroll: 2,
          variableWidth: true,
        },
      },
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ],
  });
}

IniciarAPP();

async function mostrarProductos() {
  let html = ``;

  for (let i = 0; i < productos.length; i++) {
    let data = [productos[i]];
    html += `
            <div class="col">
                    <div class="card h-100">
                      <div class="img-product">
                        <img src="${productos[i].imagen}"
                            class="card-img-top" alt="...">
                        </div>
                        <div class="card-body" style="
                        text-align: center;">
                            <h5 class="card-title card-titulo">${
                              productos[i].titulo
                            }</h5>
                            <p class="card-text card-precio">${dollarUS2.format(
                              productos[i].precio
                            )}</p>
                            <button type="button" class="btn btn-secondary" onclick="verProducto(
                                '${productos[i].id}',
                                )">AGREGAR AL CARRITO</button>
                        </div>
                    </div>
                </div>
            `;
  }
  container_list_product.innerHTML = html;
  console.log(productos);
}

/* let lista_productos=traerProductos() */

/* function listarProductos(){
    console.log(lista_productos)
    let html=``
    let container_list_product=document.getElementById('lista-productos')
    for (let i=0; i < lista_productos.length;i++){
        html +=`
        <div class="col">
                <div class="card h-100">
                    <img src="${lista_productos[i].image}"
                        class="card-img-top" alt="...">
                    <div class="card-body" style="text-align: center;">
                        <h5 class="card-title card-titulo">${lista_productos[i].nombre}</h5>
                        <p class="card-text card-precio">${lista_productos[i].precio}</p>
                        <button type="button" class="btn btn-secondary">AGREGAR AL CARRITO</button>
                    </div>
                </div>
            </div>
        `
    }
    console.log(html)
    container_list_product.innerHTML=html
}

listarProductos() */

document.querySelector(`.slick-categorias`).addEventListener("click", (e) => {
  let html = "";
  let ruta_cat = document.querySelector(".ruta");
  ruta_cat.innerHTML = e.target.firstChild.nodeValue;
  /* let input_preview=document.getElementsByName(`${e.target.id}`) */
  /* console.log(document.querySelectorAll('slick-item-categoria')) */
  filtrarListas();
  for (let i = 0; i < productos.length; i++) {
    if (e.target.id == productos[i].categoria.id) {
      let data = [productos[i]];
      html += `
                <div class="col">
                    <div class="card h-100">
                        <img src="${productos[i].imagen}" class="card-img-top" alt="...">
                        <div class="card-body" style="text-align: center;">
                            <h5 class="card-title card-titulo">${productos[i].titulo}</h5>
                            <p class="card-text card-precio">${productos[i].precio}</p>
                            <button type="button" class="btn btn-secondary" onclick="verProducto(
                                '${productos[i].id}',
                                )">AGREGAR AL CARRITO</button>
                        </div>
                    </div>
                </div>
                `;
    }
  }
  container_list_product.innerHTML = html;
});

let selectCate = document.getElementById("floatingSelectCategoria");

/*
selectCate.addEventListener("change", e => {
    console.log(e.target.value)
    let id_option=mostrarId()
    console.log(id_option)


}); */

function mostrarId() {
  var idSeleccionado = selectCate.options[selectCate.selectedIndex].id;
  return idSeleccionado;
}

document
  .querySelector(`#floatingSelectCategoria`)
  .addEventListener("change", (e) => {
    let html = "";
    let ruta_cat = document.querySelector(".ruta");
    ruta_cat.innerHTML = e.target.value;
    /* let input_preview=document.getElementsByName(`${e.target.id}`) */
    /* console.log(document.querySelectorAll('slick-item-categoria')) */

    let id_option = mostrarId();
    filtrarListas();
    for (let i = 0; i < productos.length; i++) {
      if (id_option == productos[i].categoria.id) {
        let data = [productos[i]];

        html += `
                    <div class="col">
                        <div class="card h-100">
                            <img src="${productos[i].imagen}" class="card-img-top" alt="...">
                            <div class="card-body" style="text-align: center;">
                                <h5 class="card-title card-titulo">${productos[i].titulo}</h5>
                                <p class="card-text card-precio">${productos[i].precio}</p>
                                <button type="button" class="btn btn-secondary" onclick="verProducto(
                                    '${productos[i].id}',
                                    )">AGREGAR AL CARRITO</button>
                            </div>
                        </div>
                    </div>
                    `;
      }
    }
    container_list_product.innerHTML = html;
  });

function verProducto(id) {
  filtrarListas();
  document.getElementById("back").style.display = "block";
  document.getElementById("menu-mobile").style.display = "none";
  document.getElementById("container-slick-categoria").style.display = "none";
  document.getElementById("Pantalla-product").style.display = "block";
  document.getElementById("lista-contain").style.display = "none";
  let htmlTalles = ``;
  let objectStock;
  let valuesStock;
  let keysStock;
  for (let i = 0; i < productos.length; i++) {
    console.log(id, productos[i].id);
    if (id == productos[i].id) {
      objectStock = productos[i].stock;
      valuesStock = Object.values(objectStock);
      keysStock = Object.keys(objectStock);
      /*console.log(valuesStock,keysStock)
                for (let i=0; i < valuesStock.length;i++){
                    if (valuesStock[i]>0 && keysStock[i]!='id'){
                        htmlTalles+= `
                        <div class="">
                            <input type="radio" class="btn-check" name="options2" id="${keysStock[i]}" autocomplete="off">
                            <label class="btn btn-outline-secondary" for="${keysStock[i]}">${keysStock[i]}</label>
                        </div>`
                    }
                } */

      let html = `
                <div class="row" id="container-info">
                
                <div class="info" id="info-mobile">
                <span style="color: #6c757d;display:block;font-size: 2rem;">${
                  productos[i].titulo
                }</span>
                <span class="tag tag-purple">${
                  productos[i].categoria.nombre
                }</span>
                </div>
                <div class="col-6 width-mobile" style="display: flex; justify-content: space-around;">
                
                    <div class="contenedor-preview">
                        <img src="${productos[i].imagen}" alt="">
                        <img src="${productos[i].imagen}" alt="">
                        <img src="${productos[i].imagen}" alt="">
                        <img src="${productos[i].imagen}" alt="">
                    </div>
                    <div class="contenedor-imagen">
                        <img src="${productos[i].imagen}" alt="">
                    </div>
                </div>
                <div class="col-6 width-mobile" style="display: flex;flex-direction: column;justify-content: space-evenly;   ">
                    <div class="contenedor-info-product " style="height: 50%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-evenly;">
                        <div class="info" id="info-desktop">
                        <span style="color: #6c757d;display:block;font-size: 2rem;">${
                          productos[i].titulo
                        }</span>
                        <span class="tag tag-purple">${
                          productos[i].categoria.nombre
                        }</span>
                        </div>
                        <h1 style="    font-weight: bold;">${dollarUS2.format(
                          productos[i].precio
                        )}</h1>
                        <span style="    color: #6c757d;">${
                          productos[i].descripcion
                        }
                        </span>
                        
                    </div>
                    
                    <div class="form-stock-color-talle">
                        
                        <div class="color input-box" style="display: none;">
                            <h3>Color</h3>
                            <div class="">
                                <input type="radio" class="btn-check" name="options" id="option1" autocomplete="off">
                                <label class="btn btn-outline-secondary" for="option1">Checked</label>
                            </div>
                            <div class="">
                                <input type="radio" class="btn-check" name="options" id="option2" autocomplete="off">
                                <label class="btn btn-outline-secondary" for="option2">Radio</label>
                            </div>
                            <div class="">
                                <input type="radio" class="btn-check" name="options" id="option3" autocomplete="off">
                                <label class="btn btn-outline-secondary" for="option3">Radio</label>
                            </div>
                            <div class="">
                                <input type="radio" class="btn-check" name="options" id="option4" autocomplete="off">
                                <label class="btn btn-outline-secondary" for="option4">Radio</label>
                            </div>
                            <div class="">
                                <input type="radio" class="btn-check" name="options" id="option5" autocomplete="off">
                                <label class="btn btn-outline-secondary" for="option5">Radio</label>
                            </div>
                        </div>
                        <div class="container-talle">
                        <div class="talle input-box" id="talle">
                            
                        </div>
                        <div class="alert-talle"><span>Selecciona un talle.</span></div>
                        </div>
                        <div class="botones">
                            <button type="button" class="btn btn-secondary btn-lg" onclick="agregarCarrito('${
                              productos[i].id
                            }')">Agregar a Carrito</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row" style="margin-top: 50px;">
            <span style='font-size: 1.2rem;
            padding-bottom: 20px;'>Tambien podria interesarte:</span>
            <div id="slick-intereses">
                
            </div>
            </div>`;
      document.getElementById("Pantalla-product").innerHTML = html;

      cargarIntereses(productos[i].categoria.id);
    }
  }
  for (let i = 0; i < valuesStock.length; i++) {
    if (valuesStock[i] > 0 && keysStock[i] != "id") {
      htmlTalles += `
            <div class="">
                <input type="radio" class="btn-check" name="options2" id="${keysStock[i]}" autocomplete="off">
                <label class="btn btn-outline-secondary" for="${keysStock[i]}">${keysStock[i]}</label>
            </div>`;
    }
  }
  document.getElementById("talle").innerHTML = htmlTalles;
}

function agregarCarrito(id) {
  let form_input = document.getElementById("talle");
  form_input.querySelectorAll("input").forEach(function (checkElement) {
    if (checkElement.checked) {
      for (let i = 0; i < productos.length; i++) {
        if (productos[i].id == id) {
          document.querySelector(".alert-talle").style.display = "none";
          carrito.push(productos[i]);
          let index = carrito.length - 1;
          carrito[index].talle = checkElement.id;
          console.log("se agrego", productos[i].id);
          localStorage.setItem("carrito", JSON.stringify(carrito));
          document.getElementById("icon-basket").style.display = "block";
          document.querySelector(".badge").style.display = "block";
          document.querySelector(".badge").innerHTML = carrito.length;
          document.getElementById("Pantalla-product").style.display = "none";
          document.getElementById("lista-contain").style.display = "block";
          /* document.getElementById('container-slick-categoria').style.display='block' */
          const ancho = window.screen.width;
          const alto = window.screen.height;
          if (ancho < 768) {
            console.log("Este dispositivo es un móvil.");
            document.getElementById("container-slick-categoria").style.display =
              "block";
          } else if (ancho >= 768 && ancho < 1024) {
            console.log("Este dispositivo es una tablet.");
            document.getElementById("container-slick-categoria").style.display =
              "none";
          } else {
            console.log("Este dispositivo es un escritorio.");
            document.getElementById("container-slick-categoria").style.display =
              "none";
          }
          document.getElementById("menu-mobile").style.display = "block";
          document.getElementById("back").style.display = "none";
          $("body, .lista-contain").animate(
            {
              scrollTop: "0px",
            },
            300
          );
        }
      }
    } else {
      document.querySelector(".alert-talle").style.display = "flex";
    }
  });
}

function verCarrito() {
  console.log(carrito);
  filtrarListas();
  document.getElementById("pago-despacho-contacto").style.display = "none";
  document.getElementById("back").style.display = "block";
  document.getElementById("menu-mobile").style.display = "none";
  document.getElementById("Pantalla-product").style.display = "none";
  document.getElementById("container-slick-categoria").style.display = "none";
  document.getElementById("lista-contain").style.display = "none";
  document.getElementById("container-carrito").style.display = "block";
  let container_items = document.getElementById("container-item-carrito");
  let html = ``;
  let total = 0;
  for (let i = 0; i < carrito.length; i++) {
    let precio = parseInt(carrito[i].precio);
    total += precio;

    for (let z = 0; z < productos.length; z++) {
      if (productos[z].id == carrito[i].id) {
        html += `<div class="grid-container">
                <div class="grid-item">
                    <div class="title-product-img-carrito" style="display:flex;">
                    <img class= "img-product-carrito" src="${
                      productos[z].imagen
                    }" alt="">
                    <div style="    display: flex;
                    padding-left: 10px;
                    align-items: flex-start;
                    flex-direction: column;
                    justify-content: space-evenly;">
                        <span>${productos[z].titulo}</span>
                        <div id="cantidad-mobile">
                        <div style="    border: solid;padding: 10px;">-</div>
                        <div style="    border: solid;padding: 10px;">1</div>
                        <div style="    border: solid;padding: 10px;">+</div>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="grid-item encabezado">
                    <div class="title-product-cantidad" id="cantidad-desktop">
                    <div class="" style="display: flex;">
                        <div style="    border: solid;    color: #080807;;    border-color: #ebc4c3;
                        padding: 10px;">-</div>
                        <div style="    border-top: solid;border-bottom:solid;    color: #080807;;    border-color: #ebc4c3;
                        padding: 10px;">1</div>
                        <div style="    border: solid;    color: #080807;;    border-color: #ebc4c3;
                        padding: 10px;">+</div>
                    </div>
                    </div>
                </div>
                <div class="grid-item encabezado">
                    <div class="title-product-precio hidden"><span>${dollarUS2.format(
                      productos[z].precio
                    )}</span></div>
                </div>
                <div class="grid-item encabezado">
                    <div class="title-product-subtotal"><span>${dollarUS2.format(
                      productos[z].precio
                    )}</span></div>
                </div>
                <div class="grid-item">
                    <div class="title-product-trash"> 
                    
                    <svg onclick="deleteItemCarrito('${i}')" class="trash-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                    </svg>
                    <span>$${productos[z].precio}</span>
                    </div>
                </div>
                </div>`;
      }
    }
  }
  if (carrito.length == 0) {
    document.getElementById("lista-contain").style.display = "block";
    document.getElementById("container-carrito").style.display = "none";
    document.getElementById("icon-basket").style.display = "none";
    document.querySelector(".badge").style.display = "none";
    const ancho = window.screen.width;
    const alto = window.screen.height;
    if (ancho < 768) {
      console.log("Este dispositivo es un móvil.");
      document.getElementById("container-slick-categoria").style.display =
        "block";
    } else if (ancho >= 768 && ancho < 1024) {
      console.log("Este dispositivo es una tablet.");
      document.getElementById("container-slick-categoria").style.display =
        "none";
    } else {
      console.log("Este dispositivo es un escritorio.");
      document.getElementById("container-slick-categoria").style.display =
        "none";
    }
  } else {
    container_items.innerHTML = html;
    document.getElementById("total").innerHTML = total;
  }
}

function deleteItemCarrito(index) {
  carrito.splice(index, 1);
  verCarrito();
  document.querySelector(".badge").innerHTML = carrito.length;
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function shuffleArray(arr) {
  return arr.sort(function () {
    return Math.random() - 0.5;
  });
}
function cargarIntereses(cate) {
  let contenedor_intereses = document.getElementById("slick-intereses");
  var shuffledArray = shuffleArray(productos);
  let html = ``;
  for (let z = 0; z < shuffledArray.length; z++) {
    if (shuffledArray[z].categoria.id == cate)
      html += `
                    <div class="container-item-intereses" onclick="verProducto(${shuffledArray[z].id})">
                        <div class="design-promociones">
                            <img class="img-promociones" src="${shuffledArray[z].imagen}" alt="">
                            <div style="display: flex;
                            flex-direction: column;
                            justify-content: space-evenly;;">
                                <span>${shuffledArray[z].titulo}</span>
                                <span>${shuffledArray[z].precio}</span>
                            </div>
                        </div>
                    </div>
                    
    `;
  }

  contenedor_intereses.innerHTML = html;

  $("#slick-intereses").slick({
    arrows: false,
    infinite: true,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          variableWidth: true,
        },
      },
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ],
  });
}

function despachar() {
  document.getElementById("icon-basket").style.display = "none";
  document.querySelector(".badge").style.display = "none";
  document.getElementById("back").style.display = "none";
  document.getElementById("back-carrito").style.display = "block";
  document.getElementById("container-carrito").style.display = "none";
  document.getElementById("pago-despacho-contacto").style.display = "block";
}

function validarNumeroTelefono(numero) {
  // Verificar si el número comienza con "11" y tiene una longitud de diez dígitos
  if (/^11\d{8}$/.test(numero)) {
    return true; // El número es válido
  } else {
    return false; // El número es inválido
  }
}

function validarForm() {
  let telefono = document.getElementById("telefono").value;
  let nombre = document.getElementById("nombre").value;
  const isValidNumber_ = validarNumeroTelefono(telefono);
  if (isValidNumber_ && telefono != "") {
    formDespacho.telefono = telefono;
    document.getElementById(`telefono`).classList.remove("is-invalid");
  }

  if (nombre != "") {
    formDespacho.nombre = nombre;
    document.getElementById(`nombre`).classList.remove("is-invalid");
  }

  let form_input_pago = document.getElementById(`pago`);
  form_input_pago.querySelectorAll("input").forEach(function (checkElement) {
    if (checkElement.checked) {
      formDespacho.metodo_pago = checkElement.id;
    }
  });

  let form_input_despacho = document.getElementById(`despacho`);
  form_input_despacho
    .querySelectorAll("input")
    .forEach(function (checkElement) {
      if (checkElement.checked) {
        formDespacho.envio = checkElement.id;
      }
    });

  if (formDespacho.nombre) {
    if (formDespacho.telefono) {
      if (formDespacho.metodo_pago) {
        if (formDespacho.envio) {
          const modalDespacho = document.getElementById("modal-despacho");
          const isVisible = "is-visible";
          modalDespacho.classList.add(isVisible);
          let contenido = document.querySelector(".modal-content");
          if (formDespacho.envio == "envio-domicilio") {
            console.log("ingresar direccion");
            let html = `
                        <div style="padding-bottom: 20px;">
                        <span style="text-align: center;
                        font-size: 1.2rem;
                        font-weight: bold;
                        color: #495057;">INGRESE DOMICILIO DE ENVIO:</span>
                        </div>
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" id="direccion" placeholder="direccion">
                                <label for="direccion">Direccion</label>
                            </div>
                            <div class="form-floating">
                                <input type="text" class="form-control" id="entrecalles" placeholder="entrecalles">
                                <label for="entrecalles">Entrecalles</label>
                            </div>
                            <div class="botones" style="margin-top: 20px;">
                                <button style="margin-top: 20px;" type="button" class="btn btn-primary btn-lg" onclick="enviarNotificacion()">ENVIAR PEDIDO</button>
                            </div>`;
            contenido.innerHTML = html;
          } else {
            let html = `
                        <div style="padding-bottom: 20px;">
                            <span style="text-align: center;
                            font-size: 1.2rem;
                            font-weight: bold;
                            color: #495057;">INGRESE SUCURSAL DE ENVIO:</span>
                        </div>
                        <div class="form-floating">
                            <select class="form-select" id="sucursal" aria-label="Floating label select example">
                                <option selected>Open this select menu</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select>
                            <label for="sucursal">Works with selects</label>
                        </div>
                        <div class="botones" style="margin-top: 20px;">
                            <button  type="button" class="btn btn-primary btn-lg" onclick="enviarNotificacion()">ENVIAR PEDIDO</button>
                        </div>`;

            contenido.innerHTML = html;
          }
        } else {
          console.log("ingrese metodo de envio/retiro");
        }
      } else {
        console.log("ingrese metodo de pago");
      }
    } else {
      document.getElementById(`telefono`).classList.add("is-invalid");
    }
  } else {
    document.getElementById(`nombre`).classList.add("is-invalid");
  }
}

let contacto = document.querySelector(`#contacto`);
contacto.addEventListener("input", (e) => {
  if (e.target.id == "nombre") {
    let nombre = e.target.value;
    let input_nombre = document.getElementById("nombre");
    if (nombre.length != 0) {
      input_nombre.classList.remove("is-invalid");
      /* document.getElementById('noNombre').style.display="none" */
    }
  }
  if (e.target.id == "telefono") {
    let numero = e.target.value;
    if (numero.length == 10) {
      document.getElementById("telefono").classList.remove("is-invalid");
      /* document.getElementById('invalid-feedback-numero').innerHTML="" */
    } else {
      document.getElementById("telefono").classList.add("is-invalid");
    }
  }
});

document.addEventListener("click", (e) => {
  if (e.target == document.querySelector("#modal-despacho.is-visible")) {
    const isVisible = "is-visible";
    document
      .querySelector("#modal-despacho.is-visible")
      .classList.remove(isVisible);
    /* modalAtras(true) */
  }
});

function enviarNotificacion() {
  if (formDespacho.envio == "envio-domicilio") {
    let direccion = document.getElementById("direccion");
    let entrecalles = document.getElementById("entrecalles");
    if (direccion.value != "") {
      formDespacho.domicilio = {
        direccion: direccion.value,
        entrecalles: entrecalles.value,
      };
      enviarOrden();
    } else {
      direccion.classList.add("is-visible");
      console.log("completa domicilio");
    }
  } else {
    let sucursal = document.getElementById("sucursal");
    if (sucursal != "") {
      formDespacho.sucursal = sucursal.value;
      enviarOrden();
    } else {
      console.log("completa sucu");
      direccion.classList.add("is-visible");
    }
  }
}

function reporte() {
  let pago = formDespacho.metodo_pago;
  const fechaHoraActual = new Date();
  const fechaHoraActualStr = fechaHoraActual.toLocaleString();
  let pruebita = `Hola%20este%20es%20el%20pedido%20${formDespacho.id}%0A`;
  if (formDespacho.domicilio) {
    pruebita += `con%20envio%20a%20%2A${formDespacho.domicilio.direccion}%2CEntrecalles:%20${formDespacho.domicilio.entrecalles}%2A`;
  } else {
    pruebita += `retira%20en%20sucursal%20%2A${formDespacho.sucursal}%2A`;
  }
  pruebita += `%0AMetodo%20De%20Pago:%20%2A${pago.replace(" ", "%20")}%2A
                %0AFecha%20De%20Compra:%20${fechaHoraActualStr}
                %0ADetalle%20del%20pedido:${pizzasxbordes()}`;
  let enlace = `http://api.whatsapp.com/send?phone=+5491160235647&text=${pruebita}`;
  /* window.location.href =enlace */

  formDespacho.carrito = carrito;
  /* const btncompra = document.getElementById('fin');
    btncompra.disabled = false;
    setTimeout(() => btncompra.disabled = false, 1000,); */
}

function pizzasxbordes() {
  let k = ``;
  let t = 0;
  for (let x = 0; x < carrito.length; x++) {
    let pizza = carrito[x].titulo.replace(/\s+/g, "%20");
    let agg = [carrito[x].agregados];
    k += `%0A1x%20${pizza}%20${carrito[x].talle}`;
    /* for (let z=0; z < productos.length;z++){
            for (let i=0; i < agg.length;i++){
                if(agg[i].acompañamiento==productos[z].titulo){

                    k+=`%0A%09%2B%20${productos[z].nombre.replace(' ', '%20')}`
                    t+=productos[z].precio
                }
                if (agg[i].bebidas==productos[z].titulo) {
                    k+=`%0A%09%2B%20${productos[z].nombre.replace(' ', '%20')}`
                    t+=productos[z].precio
                }
                if (agg[i].comida==productos[z].titulo){

                    k+=`%0A%09%2B%20${productos[z].nombre.replace(' ', '%20')}`
                        t+=productos[z].precio
                }
                if (agg[i].postres_helados==productos[z].titulo){

                    k+=`%0A%09%2B%20${productos[z].titulo.replace(' ', '%20')}`
                        t+=productos[z].precio
                }
            }
        } */
    /* k+=`%0A%09%20${carrito[x].aclaracion.replace(' ', '%20')}` */
    t += carrito[x].precio;
  }
  k += `%0A%2ATOTAL%3A%24${t}%2A`;
  return k;
}

async function enviarOrden() {
  let res = await fetch("/newOrden", {
    method: "POST", // or 'PUT'
    body: JSON.stringify(formDespacho), // data can be `string` or {object}!
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.status === 200) {
    // La respuesta fue exitosa
    reporte();
    /* mostrarToast("El Producto fue agreagado correctamente", "bg-success");
        limpiarformulario()
        productos = await TraerProductos()
        ocultarSpinner()
        MostrarProductos(productos) */
  } else {
    console.log("no se pudo agregar la orden");
    /* mostrarToast('¡No se pudo agregar el nuevo Producto!', 'bg-danger');
        ocultarSpinner() */
  }
}
