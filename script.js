let socket;

function conectarWebSocket() {
    socket = new WebSocket('ws://' + window.location.hostname + '/ws');
    
    socket.onopen = function(event) {
        document.getElementById('status').innerHTML = 'Conectado';
    };

    socket.onclose = function(event) {
        document.getElementById('status').innerHTML = 'Desconectado';
        setTimeout(conectarWebSocket, 2000);
    };

    socket.onmessage = function(event) {
        let data = JSON.parse(event.data);
        document.getElementById('kp').value = data.kp;
        document.getElementById('ki').value = data.ki;
        document.getElementById('kd').value = data.kd;
    };
}

function enviarParametros() {
    if (socket.readyState === WebSocket.OPEN) {
        let params = {
            kp: parseFloat(document.getElementById('kp').value),
            ki: parseFloat(document.getElementById('ki').value),
            kd: parseFloat(document.getElementById('kd').value)
        };
        socket.send(JSON.stringify(params));
    }
}

window.onload = conectarWebSocket;