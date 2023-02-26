
document.addEventListener('DOMContentLoaded', function () {

    const modo = 'login' | 'registro'

    const inputEmail = document.querySelector("#email")
    const inputPassword = document.querySelector("#password")
    const btnIngresar = document.querySelector('#btn-ingresar');
    const conteinerButon = document.querySelector('#conteiner-buton');
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
    btnIngresar.addEventListener('click', VerificarUsuario)
    enlaceRegistro.addEventListener('click', RegistrarUsuario)

    function RegistrarUsuario() {

        modo = 'register'
        conteinerRegister.classList.add('visually-hidden')
        btnIngresar.textContent = 'Registrar'

        // let CopiaPassword = inputPassword.cloneNode(true)
        // CopiaPassword.id = 'CopiaPassword'
        // CopiaPassword.querySelector('input').id ='CopiaPassword'
        // CopiaPassword.querySelector('label').for ='CopiaPassword'
        // formulario.insertBefore(CopiaPassword, conteinerButon)



    }


    function VerificarUsuario() {

        spinner.classList.remove('visually-hidden');
        let respuesta

        setTimeout(() => {
            fetch('/usuario', {
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
                    formulario.appendChild(alerta)

                    setTimeout(() => {
                        alerta.remove();
                    }, 1000);

                } else {
                    window.location.href = '/alta'
                }
            });
            spinner.classList.add('visually-hidden');

        }, 1000);




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
            mostrarAlerta(`El Campo ${e.target.id} es obligatorio`, e.target.parentElement);
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
        limpiarAlerta(e.target.parentElement);
        // Asignar los valores
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


