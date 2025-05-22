var socket = io.connect();

var distancia = 0;
var temperatura = 0;

socket.on('retransmision_esp32', function(data) {
    // Asegúrate que los datos ya están como objeto. Si vienen como string, descomenta la línea siguiente:
    // data = JSON.parse(data);

    // Validación
    console.log("Datos recibidos:", data);

    distancia = parseFloat(data.distancia);
    temperatura = parseFloat(data.temperatura);

    actualizarDatosEnPantalla();
    drawVisualization();
});

socket.on('desde_servidor_comando', function(data){
    var cadena = `<div><strong>🖥️ Comando: <font color="green">${data}</font></strong></div>`;
    document.getElementById("div_comando").innerHTML = cadena;
});

function encender() {
    socket.emit("desde_cliente", "ON");
}

function apagar() {
    socket.emit("desde_cliente", "OFF");
}

function enviar_comando() {
    var comando = document.getElementById('txt_comando').value;
    socket.emit('desde_cliente', comando);
}

function actualizarDatosEnPantalla() {
    var cadena = `
        <div><strong>📏 Distancia: <font color="blue">${distancia.toFixed(2)} cm</font></strong></div>
        <div><strong>🌡️ Temperatura: <font color="red">${temperatura.toFixed(2)} °C</font></strong></div>
    `;
    document.getElementById("div_dato").innerHTML = cadena;
}

function drawVisualization() {
    // Distancia
    var dataDistancia = google.visualization.arrayToDataTable([
        ['Medida', 'Distancia (cm)', { role: 'style' }],
        ['Oxígeno', distancia, 'color: blue']
    ]);

    var chartDistancia = new google.visualization.BarChart(document.getElementById('div_grafica_distancia'));
    var optionsDistancia = {
        title: "Oxígeno en la sangre",
        width: 600,
        height: 200,
        legend: { position: "none" },
        hAxis: {
            title: '%',
            viewWindow: {
                min: 0,
                max: 100   // <- Fija el valor máximo
            }
        }
    };
    chartDistancia.draw(dataDistancia, optionsDistancia);

    // Temperatura
    var dataTemperatura = google.visualization.arrayToDataTable([
        ['Medida', 'Temperatura (°C)', { role: 'style' }],
        ['Temperatura', temperatura, 'color: red']
    ]);

    var chartTemperatura = new google.visualization.BarChart(document.getElementById('div_grafica_temperatura'));
    var optionsTemperatura = {
        title: "🌡️ Temperatura",
        width: 600,
        height: 200,
        legend: { position: "none" },
        hAxis: {
            title: '°C',
            viewWindow: {
                min: 0,
                max: 50   // <- Fija el valor máximo
            }
        }
    };
    chartTemperatura.draw(dataTemperatura, optionsTemperatura);
}



// Cargar Google Charts
google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(drawVisualization);
