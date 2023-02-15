function traerProductos() {
    fetch('/productos')
        .then(data => {
            return data.json();
        })
        .then(post => {
            console.log(post);
        });
}

traerProductos()