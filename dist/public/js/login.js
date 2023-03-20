
document.addEventListener('DOMContentLoaded', function () {

    let Register = false

    const inputEmail = document.querySelector("#email")
    const inputPassword = document.querySelector("#password")
    const inputCopyPassword = document.querySelector("#CopyPassword")
    const DivCopiPassword = document.querySelector("#conteiner-CopyPassword")
    const ConteinerButton = document.querySelector("#conteiner-button")
    const btnIngresar = document.querySelector('#btn-ingresar');
    const conteinerRegister = document.querySelector('#conteiner-register');
    const formulario = document.querySelector('form');
    const enlaceRegistro = document.querySelector('#enlace-register');
    const spinner = document.querySelector('#spinner');

    const Usuario = {
        email: '',
        password: ''
    }


    //asignar funciones a eventos

    inputEmail.addEventListener('input', Validar);
    inputPassword.addEventListener('input', Validar);
    inputCopyPassword.addEventListener('input', Validar);
    btnIngresar.addEventListener('click', VerificarUsuario)
    enlaceRegistro.addEventListener('click', RegistrarUsuario)

    function RegistrarUsuario() {

        Register = true
        conteinerRegister.classList.add('visually-hidden') // oculto el enlace
        DivCopiPassword.classList.remove('visually-hidden') // muestro el div
        btnIngresar.textContent = 'Registrar' // cambio el texto de boton 
    }

    function VerificarUsuario() {

        if (!Register) {
            spinner.classList.remove('visually-hidden');
            let respuesta
            setTimeout(() => {
                fetch('/User', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(Usuario) // body data type must match "Content-Type" header
                }).then(res => {
                    return res.json();
                }).then(data => {
                    respuesta = data
                    if (respuesta.verificado === false) {
                        const alerta = document.createElement('P');
                        alerta.classList.add('alert', 'alert-danger')
                        alerta.textContent = 'No coinciden los usuario y contraseña';
                        // formulario.appendChild(alerta)
                        formulario.insertBefore(alerta, ConteinerButton)
                        setTimeout(() => {
                            alerta.remove();
                        }, 1000);

                    } else {
                        window.location.href = '/alta'
                    }
                });
                spinner.classList.add('visually-hidden');

            }, 1000);

        } else { //ingresa si esta en modo register

            const contra1 = inputPassword.value;
            const contra2 = inputCopyPassword.value;

            if (contra1 == contra2) {
                spinner.classList.remove('visually-hidden');
                setTimeout(() => {
                    fetch('/RegisterUser', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(Usuario) // body data type must match "Content-Type" header
                    }).then(res => {
                        return res.json();
                    }).then(data => {
                        respuesta = data
                        if (respuesta.verificado === true) {
                            const alerta = document.createElement('P');
                            alerta.classList.add('alert', 'alert-success')
                            alerta.textContent = 'Usuario Registrado Correctamente';
                            formulario.appendChild(alerta)

                            setTimeout(() => {
                                alerta.remove();
                            }, 1500);
                            window.location.href = '/alta'

                        } else {
                            const alerta = document.createElement('P');
                            alerta.classList.add('alert', 'alert-danger')
                            alerta.textContent = 'Error al registrar el usuario';
                            formulario.appendChild(alerta)
                            setTimeout(() => {
                                alerta.remove();
                            }, 1500);
                        }
                    });
                    spinner.classList.add('visually-hidden');

                }, 1500);


            } else {
                const alerta = document.createElement('P');
                alerta.classList.add('alert', 'alert-danger')
                alerta.textContent = 'No coinciden las contraseñas';
                formulario.insertBefore(alerta, DivCopiPassword)

                setTimeout(() => {
                    alerta.remove();
                }, 1500);
            }

        }
    }

    //funciones 
    function validarEmail(email) {
        const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        const resultado = regex.test(email);
        return resultado;
    }

    function mostrarAlerta(mensaje, referencia) {
        limpiarAlerta(referencia)
        const Error = document.createElement('p');
        Error.classList.add('alert', 'alert-warning', 'text-center')
        Error.textContent = mensaje;
        referencia.appendChild(Error)
    }
    function limpiarAlerta(referencia) {
        const alerta = referencia.querySelector('.alert');
        if (alerta) {
            alerta.remove();
        }
    }
    function Validar(e) {

        if (e.target.value.trim() === '') { //verificar 
            if (!Register) {
                mostrarAlerta(`El Campo ${e.target.id} es obligatorio`, e.target.parentElement);
            } else {
                mostrarAlerta(`Se debe completar ambos campos`, e.target.parentElement);
            }
            Usuario[e.target.id] = '';
            comprobarUsuario()
            return;
        }
        if (e.target.id === 'email' && !validarEmail(e.target.value)) {
            mostrarAlerta('El email no es válido', e.target.parentElement);
            Usuario[e.target.id] = '';
            comprobarUsuario()
            return;
        }

        limpiarAlerta(e.target.parentElement);// le paso el elemento padre
        Usuario[e.target.id] = e.target.value.trim().toLowerCase();
        comprobarUsuario()

    }


    function comprobarUsuario() {

        if (Object.values(Usuario).includes('')) {
            btnIngresar.disabled = true;
        } else {
            btnIngresar.disabled = false;
        }
    }
})


