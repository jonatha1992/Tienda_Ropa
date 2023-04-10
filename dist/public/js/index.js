window.filtrarListas=filtrarListas
window.verProducto=verProducto
window.agregarCarrito=agregarCarrito
window.verCarrito=verCarrito
window.deleteItemCarrito=deleteItemCarrito
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
let carrito=[]   

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
        console.log('ejec')
        obtenerLocalStorage()
    }
    

function obtenerLocalStorage(){
    var miArrayRecuperado = JSON.parse(localStorage.getItem('carrito'));
    if(miArrayRecuperado){
        carrito=miArrayRecuperado
        document.getElementById('icon-basket').style.display='block'
        document.querySelector('.badge').style.display='block'
        document.querySelector('.badge').innerHTML=carrito.length
    }
}
function mostrarCategorias() {
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
            html +=`
            <div class="col">
                    <div class="card h-100">
                        <img src="${productos[i].imagen}"
                            class="card-img-top" alt="...">
                        <div class="card-body" style="text-align: center;">
                            <h5 class="card-title card-titulo">${productos[i].titulo}</h5>
                            <p class="card-text card-precio">${productos[i].precio}</p>
                            <button type="button" class="btn btn-secondary" onclick="verProducto(
                                '${productos[i].id}',
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
                                '${productos[i].id}',
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
                                    '${productos[i].id}',
                                    )">AGREGAR AL CARRITO</button>
                            </div>
                        </div>
                    </div>
                    `
                }
            }
            container_list_product.innerHTML=html
        
    });
    

    function verProducto(id){
        filtrarListas()
        document.getElementById('container-slick-categoria').style.display='none'
        document.getElementById('Pantalla-product').style.display='block'
        document.getElementById('lista-contain').style.display='none'
        let htmlTalles=``
        for (let i=0; i < productos.length;i++){
            if(id==productos[i].id){
                let objectStock=productos[i].stock
                let valuesStock=Object.values(objectStock);
                let keysStock=Object.keys(objectStock)
                for (let i=0; i < valuesStock.length;i++){
                    if (valuesStock[i]!=0 && keysStock[i]!='id'){
                        htmlTalles+= `
                        <div class="">
                            <input type="radio" class="btn-check" name="options2" id="${keysStock[i]}" autocomplete="off">
                            <label class="btn btn-outline-secondary" for="${keysStock[i]}">${keysStock[i]}</label>
                        </div>`
                    }
                }
                console.log('stock:  ',objectStock)
                
                let html=`
                <div class="row" id="container-info">
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
                    <div class="contenedor-info-product ">
                        <h1 style="color: #6c757d;">${productos[i].titulo}</h1>
                        <h1 style="    font-weight: bold;">$${productos[i].precio}</h1>
                        <span style="    color: #6c757d;">${productos[i].descripcion}
                        </span>
                        
                    </div>
                    
                    <div class="form-stock-color-talle">
                        <h3>Color</h3>
                        <div class="color input-box" >
                            <div class="">
                                <input type="radio" class="btn-check" name="options" id="option1" autocomplete="off" checked>
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
                        <h3>Talle</h3>
                        <div class="talle input-box" id="talle">
                            
                        </div>
                        
                        <div class="botones">
                            <button type="button" class="btn btn-secondary btn-lg" onclick="agregarCarrito('${productos[i].id}')">Agregar a Carrito</button>
                        </div>
                    </div>
                </div>
            </div>`
            document.getElementById('Pantalla-product').innerHTML=html
            document.getElementById('talle').innerHTML=htmlTalles
        }
    }
    }

    

function agregarCarrito(id){
    document.getElementById('Pantalla-product').style.display='none'
    document.getElementById('lista-contain').style.display='block'
    
    for (let i=0; i < productos.length;i++){
        if(productos[i].id==id){
            carrito.push(productos[i])

            let form_input=document.getElementById('talle')
            form_input.querySelectorAll('input').forEach(function(checkElement) {
                if(checkElement.checked){
                console.log('checkelementID',checkElement.id)
                let index=carrito.length-1
                carrito[index].talle=checkElement.id
                console.log(index)
            }
    })
            console.log('se agrego',productos[i].id)
            localStorage.setItem('carrito', JSON.stringify(carrito));
        }
    }
    document.getElementById('icon-basket').style.display='block'
        document.querySelector('.badge').style.display='block'
    document.querySelector('.badge').innerHTML=carrito.length
}

function verCarrito(){
    filtrarListas()
    document.getElementById('container-slick-categoria').style.display='none'
    document.getElementById('lista-contain').style.display='none'
    document.getElementById('container-carrito').style.display='block'
    let container_items=document.getElementById('container-item-carrito')
    let html=``
    let total=0
    for (let i=0; i < carrito.length;i++){
        
        console.log(parseInt(carrito[i].precio))
        let precio= parseInt(carrito[i].precio)
        total+=precio

        for (let z=0; z < productos.length;z++){
            if(productos[z].id==carrito[i].id){
                
                html+=`<div class="grid-container">
                <div class="grid-item">
                    <div class="title-product-img" style="display:flex;">
                    <img class= "img-product" src="${productos[z].imagen}" alt="">
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
                        <div style="    border: solid;
                        padding: 10px;">-</div>
                        <div style="    border: solid;
                        padding: 10px;">1</div>
                        <div style="    border: solid;
                        padding: 10px;">+</div>
                    </div>
                    </div>
                </div>
                <div class="grid-item encabezado">
                    <div class="title-product-precio hidden"><span>$${productos[z].precio}</span></div>
                </div>
                <div class="grid-item encabezado">
                    <div class="title-product-subtotal"><span>$${productos[z].precio}</span></div>
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
                </div>`
                
            }
        }
    }
    if (carrito.length==0){
        document.getElementById('lista-contain').style.display='block'
        document.getElementById('container-carrito').style.display='none'
        document.getElementById('icon-basket').style.display='none'
        document.querySelector('.badge').style.display='none'
    }else{
        container_items.innerHTML=html
        document.getElementById('total').innerHTML=total
    }
    
}



function deleteItemCarrito(index){
    carrito.splice(index, 1);
    verCarrito()
    document.querySelector('.badge').innerHTML=carrito.length
    localStorage.setItem('carrito', JSON.stringify(carrito));
}