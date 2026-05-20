async function login() {

    const usuario =
        document.getElementById("usuario").value.trim();

    const clave =
        document.getElementById("clave").value.trim();

    const mensaje =
        document.getElementById("mensaje");

    try {

        const respuesta = await fetch(
            "http://localhost:3000/login",

            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    usuario: usuario,
                    clave: clave
                })

            }

        );

        const data = await respuesta.json();

        console.log(data);

        if(data.success){

            mensaje.style.color = "green";

            mensaje.textContent =
                "Login correcto";

            setTimeout(() => {

                window.location.href = "dashboard.html";

            }, 1000);

        } else {

            mensaje.style.color = "red";

            mensaje.textContent =
                "Usuario o contraseña incorrectos";

        }

    } catch(error){

        console.log(error);

        mensaje.textContent =
            "Error de conexión";

    }

}