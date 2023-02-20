let Usuario

function verificarUsuario() {

    Usuario = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    }
    console.log(Usuario)
    console.log('esta dentro de la funcion')
}