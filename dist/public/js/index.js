window.filtrarListas=filtrarListas
window.verProducto=verProducto
window.agregarCarrito=agregarCarrito
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
let container_list_product=document.getElementById('lista-productos')

let categorias = [];
let productos=[]


function filtrarListas(categoria){
    let container_categoria=document.querySelector('.categorias-contain').style.display='none'
    let container_pagos=document.querySelector('.medios-pago').style.display='none'
    let container_glider=document.querySelector('.glider-contain').style.display='none'
    let container_banner=document.querySelector('.banner-2').style.display='none'
    $('body, html').animate({
			scrollTop: '0px'
		}, 300);
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
        url = "/productos";
            fetch(url)
                .then((response) => response.json())
                .then((datos) => {
                productos = datos;
                mostrarProductos()
                });
        } catch (error) {
        console.error(error);
        }
    }
    
function mostrarCategorias() {
    console.log(categorias)
    categorias.forEach((cat) => {
    const { id, nombre } = cat;
    let htmlCategoria=`<option id="${id}">${nombre}</option>`
    let html=`<div class="slick-item-categoria" id="${id}">${nombre}</div>`
    categoria.innerHTML+=html;
    categoriaSelect.innerHTML+=htmlCategoria
    });
    $('#slick-categorias').slick({
        arrows:false,
        infinite: true,
        speed: 300,
        responsive: [
            {
            breakpoint: 480,
            settings: {
                slidesToScroll: 2,
                variableWidth: true
                }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
    ]
    });
}

IniciarAPP()

async function mostrarProductos(){
        let html=``
        
        for (let i=0; i < productos.length;i++){
            let data=[productos[i]]
            console.log(data)
            html +=`
            <div class="col">
                    <div class="card h-100">
                        <img src="${productos[i].imagen}"
                            class="card-img-top" alt="...">
                        <div class="card-body" style="text-align: center;">
                            <h5 class="card-title card-titulo">${productos[i].titulo}</h5>
                            <p class="card-text card-precio">${productos[i].precio}</p>
                            <button type="button" class="btn btn-secondary" onclick="verProducto(
                                '${productos[i].titulo}',
                                '${productos[i].precio}',
                                '${productos[i].imagen}',
                                '${productos[i].descripcion}'
                                )">AGREGAR AL CARRITO</button>
                        </div>
                    </div>
                </div>
            `
        }
        container_list_product.innerHTML=html
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





document.querySelector(`.slick-categorias`).addEventListener("click", e => {
    let html=''
    let ruta_cat=document.querySelector('.ruta')
    ruta_cat.innerHTML=e.target.firstChild.nodeValue
    /* let input_preview=document.getElementsByName(`${e.target.id}`) */
    /* console.log(document.querySelectorAll('slick-item-categoria')) */
    filtrarListas()
        for (let i=0; i < productos.length;i++){
            if(e.target.id==productos[i].categoria.id){
                let data=[productos[i]]
                html+=`
                <div class="col">
                    <div class="card h-100">
                        <img src="${productos[i].imagen}" class="card-img-top" alt="...">
                        <div class="card-body" style="text-align: center;">
                            <h5 class="card-title card-titulo">${productos[i].titulo}</h5>
                            <p class="card-text card-precio">${productos[i].precio}</p>
                            <button type="button" class="btn btn-secondary" onclick="verProducto(
                                '${productos[i].titulo}',
                                '${productos[i].precio}',
                                '${productos[i].imagen}',
                                '${productos[i].descripcion}'
                                )">AGREGAR AL CARRITO</button>
                        </div>
                    </div>
                </div>
                `
            }
        }
        container_list_product.innerHTML=html
    
});




let selectCate=document.getElementById('floatingSelectCategoria')

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

    document.querySelector(`#floatingSelectCategoria`).addEventListener("change", e => {
        let html=''
        let ruta_cat=document.querySelector('.ruta')
        ruta_cat.innerHTML=e.target.value
        /* let input_preview=document.getElementsByName(`${e.target.id}`) */
        /* console.log(document.querySelectorAll('slick-item-categoria')) */
        
        let id_option=mostrarId()
        filtrarListas()
            for (let i=0; i < productos.length;i++){
                if(id_option==productos[i].categoria.id){
                    let data=[productos[i]]
                    
                    html+=`
                    <div class="col">
                        <div class="card h-100">
                            <img src="${productos[i].imagen}" class="card-img-top" alt="...">
                            <div class="card-body" style="text-align: center;">
                                <h5 class="card-title card-titulo">${productos[i].titulo}</h5>
                                <p class="card-text card-precio">${productos[i].precio}</p>
                                <button type="button" class="btn btn-secondary" onclick="verProducto(
                                    '${productos[i].titulo}',
                                    '${productos[i].precio}',
                                    '${productos[i].imagen}',
                                    '${productos[i].descripcion}'
                                    )">AGREGAR AL CARRITO</button>
                            </div>
                        </div>
                    </div>
                    `
                }
            }
            container_list_product.innerHTML=html
        
    });
    

    function verProducto(titulo,precio,imagen,descripcion){
        filtrarListas()
        document.getElementById('Pantalla-product').style.display='block'
        document.getElementById('lista-contain').style.display='none'
    }

function agregarCarrito(){
    document.getElementById('Pantalla-product').style.display='none'
    document.getElementById('lista-contain').style.display='block'
}