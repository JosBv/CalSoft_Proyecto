async function login(){

    const usuario =
        document.getElementById("usuario").value;

    const clave =
        document.getElementById("clave").value;

    const mensaje =
        document.getElementById("mensaje");

    const respuesta = await fetch(
        "http://localhost:3000/login",

        {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                usuario,
                clave
            })

        }
    );

    const data = await respuesta.json();

    if(data.success){

        window.location.href = "pedidos.html";

    } else {

        mensaje.textContent =
            "Usuario o contraseña incorrectos";

    }

}