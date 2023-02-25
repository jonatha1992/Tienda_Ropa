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

let response = await fetch('/productos');

if (response.ok) { 
    
    let json = await response.json();
    
    let html=``
    let container_list_product=document.getElementById('lista-productos')
    for (let i=0; i < json.length;i++){
        html +=`
        <div class="col">
                <div class="card h-100">
                    <img src="${json[i].image}"
                        class="card-img-top" alt="...">
                    <div class="card-body" style="text-align: center;">
                        <h5 class="card-title card-titulo">${json[i].nombre}</h5>
                        <p class="card-text card-precio">${json[i].precio}</p>
                        <button type="button" class="btn btn-secondary">AGREGAR AL CARRITO</button>
                    </div>
                </div>
            </div>
        `
    }
    container_list_product.innerHTML=html
} else {
    alert("Error-HTTP: " + response.status);
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