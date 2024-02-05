// Objeto para almacenar el estado de selección de días
let seleccionados = {};

// Variable para almacenar el contador actual
let contadorActual = 0;

// Función para cargar festividades y obtener información de una fecha específica
async function getHolidayInfo(dia, mes, año) {
    try {
        const response = await fetch('festividades.json');
        const data = await response.json();

        // Buscar la festividad correspondiente
        const festividadEncontrada = data.find(festividad =>
            festividad.numDia === dia && festividad.numMes === mes && festividad.numAño === año
        );

        // Devolver el nombre de la festividad, cadena vacía si es "nan"
        return festividadEncontrada ? (festividadEncontrada.festividad !== "nan" ? festividadEncontrada.festividad : "") : "";
    } catch (error) {
        console.error('Error:', error);
        return "Error al cargar las festividades.";
    }
}


// Función para incrementar el contador de días seleccionados
function incrementarContador() {
    const contadorSeleccionados = document.getElementById('contador');
    const valorActual = parseInt(contadorSeleccionados.textContent, 10) || 0;

    // Verificar si ya se ha contado este día en el mes actual
    if (!diasSeleccionadosMesActual.includes(diaActual)) {
        contadorSeleccionados.textContent = valorActual + 1;
        diasSeleccionadosMesActual.push(diaActual);
    }
}

// Función para decrementar el contador de días seleccionados
function decrementarContador() {
    const contadorSeleccionados = document.getElementById('contador');
    const valorActual = parseInt(contadorSeleccionados.textContent, 10) || 0;

    if (valorActual > 0) {
        contadorSeleccionados.textContent = valorActual - 1;

        // Eliminar el día del registro al deseleccionar
        const index = diasSeleccionadosMesActual.indexOf(diaActual);
        if (index !== -1) {
            diasSeleccionadosMesActual.splice(index, 1);
        }
    }
}

// Array para almacenar los días seleccionados en el mes actual
const diasSeleccionadosMesActual = [];

// Variable para almacenar el día actual
let diaActual = null;

// Función para seleccionar/deseleccionar días
function toggleSeleccion(td) {
    const dia = parseInt(td.textContent, 10);
    diaActual = dia; // Actualizar el día actual
    const mesAnioElement = document.getElementById('mesAnio');
    const mesAnioTexto = mesAnioElement.textContent;
    const [nombreMes, año] = mesAnioTexto.split(' ');
    const mes = getNumeroMes(nombreMes);
    const claveDia = `${dia}-${mes}-${año}`;
    const estaSeleccionado = td.classList.toggle('seleccionado');
    seleccionados[claveDia] = estaSeleccionado;

    if (estaSeleccionado) {
        incrementarContador();
    } else {
        decrementarContador();
    }

    actualizarResultado(dia, mes, Number(año), estaSeleccionado);
}
// Función para crear el calendario y restaurar la selección de días
async function crearCalendario(mes, año) {
    const container = document.getElementById('calendarioContainer');
    container.innerHTML = ''; 

    // Restaurar la selección anterior
    seleccionados = seleccionados || {};

    const tabla = document.createElement('table');
    tabla.id = 'calendario';
    container.appendChild(tabla);

    const thead = document.createElement('thead');
    const trEncabezado = document.createElement('tr');
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    diasSemana.forEach(dia => {
        const th = document.createElement('th');
        th.textContent = dia;
        trEncabezado.appendChild(th);
    });

    thead.appendChild(trEncabezado);
    tabla.appendChild(thead);

    const tbody = document.createElement('tbody');
    tabla.appendChild(tbody);

    const primerDia = new Date(año, mes - 1, 1).getDay();
    const ultimoDia = new Date(año, mes, 0).getDate();

    let dayCount = 1;

    for (let i = 0; i < 6; i++) {
        const tr = document.createElement('tr');

        for (let j = 0; j < 7; j++) {
            const td = document.createElement('td');
            const dia = dayCount <= ultimoDia ? dayCount : 0;
            const claveDia = `${dia}-${mes}-${año}`;

            if (seleccionados[claveDia]) {
                td.classList.add('seleccionado');
                incrementarContador();
            }

            td.addEventListener('click', () => toggleSeleccion(td));

            const resultado = await getHolidayInfo(dia, mes, año);
            td.textContent = dia > 0 ? `${dia}${resultado ? ` - ${resultado}` : ""}` : "";

            dayCount++;

            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    }

    document.getElementById('mesAnio').textContent = `${getNombreMes(mes)} ${año}`;
}

// Función para obtener el nombre del mes
function getNombreMes(mes) {
    const nombresMeses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return nombresMeses[mes - 1];
}

// Función para cambiar al mes siguiente o anterior
function cambiarMes(delta) {
    const mesAnioElement = document.getElementById('mesAnio');
    const mesAnioTexto = mesAnioElement.textContent;
    const [nombreMes, año] = mesAnioTexto.split(' ');
    const mes = getNumeroMes(nombreMes);

    const nuevoMes = mes + delta;
    let nuevoAño = Number(año);

    if (nuevoMes === 0) {
        nuevoAño--;
        crearCalendario(12, nuevoAño);
    } else if (nuevoMes === 13) {
        nuevoAño++;
        crearCalendario(1, nuevoAño);
    } else {
        crearCalendario(nuevoMes, nuevoAño);
    }
}

// Función para obtener el número del mes a partir de su nombre
function getNumeroMes(nombreMes) {
    const nombresMeses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return nombresMeses.indexOf(nombreMes) + 1;
}

// Función para actualizar el resultado según los días seleccionados
async function actualizarResultado(dia, mes, año, seleccionado) {
    const resultado = seleccionado ? await getHolidayInfo(dia, mes, año) : "";
    document.getElementById('resultado').textContent = resultado;
}

// Inicializar el calendario con el mes y año actual y restaurar la selección
const fechaActual = new Date();
crearCalendario(fechaActual.getMonth() + 1, fechaActual.getFullYear());
