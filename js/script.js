const form = document.getElementById("formPedido");
const tabla = document.getElementById("tablaPedidos");
const filtroMesero = document.getElementById("filtroMesero");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const cliente = document.getElementById("cliente").value.trim();
    const mesero = document.getElementById("mesero").value.trim();
    const producto = document.getElementById("producto").value.trim();
    const cantidad = document.getElementById("cantidad").value.trim();
    const mesa = document.getElementById("mesa").value.trim();
    const estado = document.getElementById("estado").value;

    if (cliente === "" || mesero === "" || producto === "" || cantidad === "" || mesa === "") {
        alert("Completa todos los campos.");
        return;
    }

    const numero = tabla.rows.length + 1;

    const fila = `
        <tr>
            <td>${numero}</td>
            <td>${cliente}</td>
            <td>${mesero}</td>
            <td>${producto}</td>
            <td>${cantidad}</td>
            <td>${mesa}</td>
            <td>${badgeEstado(estado)}</td>
            <td>
                <button type="button" class="btn btn-sm btn-warning me-1" onclick="cambiarEstado(this)">Cambiar</button>
                <button type="button" class="btn btn-sm btn-danger" onclick="eliminarPedido(this)">Eliminar</button>
            </td>
        </tr>
    `;

    tabla.innerHTML += fila;
    form.reset();

    actualizarNumeracion();
    actualizarFiltroMeseros();
    aplicarFiltroMesero();
    actualizarResumen();
});

function badgeEstado(estado) {
    if (estado === "Pendiente") {
        return '<span class="badge bg-warning text-dark">Pendiente</span>';
    }

    if (estado === "En cocina") {
        return '<span class="badge bg-info text-dark">En cocina</span>';
    }

    return '<span class="badge bg-success">Entregado</span>';
}

function cambiarEstado(btn) {
    const celdaEstado = btn.parentElement.previousElementSibling;
    const texto = celdaEstado.textContent.trim();

    if (texto === "Pendiente") {
        celdaEstado.innerHTML = badgeEstado("En cocina");
    } else if (texto === "En cocina") {
        celdaEstado.innerHTML = badgeEstado("Entregado");
    } else {
        celdaEstado.innerHTML = badgeEstado("Pendiente");
    }

    actualizarResumen();
}

function eliminarPedido(btn) {
    btn.parentElement.parentElement.remove();
    actualizarNumeracion();
    actualizarFiltroMeseros();
    aplicarFiltroMesero();
    actualizarResumen();
}

function actualizarNumeracion() {
    const filasVisibles = tabla.querySelectorAll("tr");
    filasVisibles.forEach((fila, i) => {
        fila.cells[0].textContent = i + 1;
    });
}

function actualizarFiltroMeseros() {
    const meseros = new Set();
    const filas = tabla.querySelectorAll("tr");

    filas.forEach((fila) => {
        const nombreMesero = fila.cells[2].textContent.trim();
        if (nombreMesero !== "") {
            meseros.add(nombreMesero);
        }
    });

    const valorActual = filtroMesero.value;
    filtroMesero.innerHTML = '<option value="Todos">Todos</option>';

    [...meseros].sort().forEach((mesero) => {
        filtroMesero.innerHTML += `<option value="${mesero}">${mesero}</option>`;
    });

    const opciones = [...filtroMesero.options].map(op => op.value);
    filtroMesero.value = opciones.includes(valorActual) ? valorActual : "Todos";
}

function aplicarFiltroMesero() {
    const valorFiltro = filtroMesero.value;
    const filas = tabla.querySelectorAll("tr");

    filas.forEach((fila) => {
        const nombreMesero = fila.cells[2].textContent.trim();

        if (valorFiltro === "Todos" || nombreMesero === valorFiltro) {
            fila.style.display = "";
        } else {
            fila.style.display = "none";
        }
    });
}

function actualizarResumen() {
    const filas = tabla.querySelectorAll("tr");

    let total = 0;
    let pendientes = 0;
    let cocina = 0;
    let entregados = 0;

    filas.forEach((fila) => {
        total++;
        const estado = fila.cells[6].textContent.trim();

        if (estado === "Pendiente") {
            pendientes++;
        } else if (estado === "En cocina") {
            cocina++;
        } else if (estado === "Entregado") {
            entregados++;
        }
    });

    document.getElementById("totalPedidos").textContent = total;
    document.getElementById("totalPendientes").textContent = pendientes;
    document.getElementById("totalCocina").textContent = cocina;
    document.getElementById("totalEntregados").textContent = entregados;
}

filtroMesero.addEventListener("change", aplicarFiltroMesero);

actualizarFiltroMeseros();
actualizarResumen();