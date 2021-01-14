var socket = io();

var params= new URLSearchParams(window.location.search);
if(!params.has('nombre') || !params.has('sala')){
    window.location='index.html';
    throw new Error('El nombre/sala es necesario');
}

var usuario={
    nombre:params.get('nombre'),
    sala:params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');
    socket.emit('entrarChat',usuario,function(resp){
        console.log('Usuarios conectados :>> ', resp);
    })
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('comunicar', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });




// Escuchar información
socket.on('comunicar', function(mensaje) {

    console.log('Servidor:', mensaje);

});

//escuchar cuando un usuario entra o slae dle char
socket.on('listaPersona', function(personas) {

    console.log(personas);

});

//mensajes privados
socket.on('mensajePrivado', function(mensaje) {

    console.log('Mensaje Privado',mensaje);

});