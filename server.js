const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('desde_esp32', (data) => {
    console.log("Datos recibidos del ESP32:", data);
    io.emit('retransmision_esp32', data);  // <--- cliente escucha este
});



    socket.on('desde_esp32', (data) => {
        console.log("Datos desde ESP32: ", data);
        io.sockets.emit("retransmision_esp32", data);
    });
    
    // Recibir datos desde la página web
    socket.on('desde_cliente', (data) => {
        console.log(`Datos recibidos desde la página: ${data}`);
        io.sockets.emit("desde_servidor_comando", data);
    });

    // Manejar desconexiones
    socket.on('disconnect', () => {
        console.log('Dispositivo desconectado.');
    });
});

// Iniciar el servidor en el puerto 3000
server.listen(3000, () => {
    console.log('Servidor escuchando en puerto 3000');
});
