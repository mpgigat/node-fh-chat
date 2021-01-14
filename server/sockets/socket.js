const { Usuarios } = require('../clases/usuarios');
const { io } = require('../server');
const {crearMensaje} =require('../utils/utilidades');
const usuarios= new Usuarios();

io.on('connection', (client) => {
    client.on('entrarChat',(data,callback)=>{
        if(!data.nombre || !data.sala){
            return callback({
                error:true,
                mensaje:'El nombre/sala es necesario'
            });
        }

        client.join(data.sala)

        usuarios.agregarPersona(client.id,data.nombre,data.sala);

        //client.broadcast.emit('listaPersona',usuarios.getPersonas());
        client.broadcast.to(data.sala).emit('listaPersona',usuarios.getPersonasSala(data.sala));

        callback(usuarios.getPersonasSala(data.sala));
    });

    client.on('disconnect',()=>{
        let personaBorrada=usuarios.deletePersona(client.id);

        // client.broadcast.emit('comunicar',crearMensaje('Administrador',`${personaBorrada.nombre} salio`));
        // client.broadcast.emit('listaPersona',usuarios.getPersonas());
        client.broadcast.to(personaBorrada.sala).emit('comunicar',crearMensaje('Administrador',`${personaBorrada.nombre} salio`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersona',usuarios.getPersonasSala(personaBorrada.sala));
    });

    client.on('comunicar',(data)=>{
        let persona=usuarios.getPersona(client.id);

        let mensaje=crearMensaje(persona.nombre,data.mensaje);
        //client.broadcast.emit('comunicar',mensaje);
        client.broadcast.to(persona.sala).emit('comunicar',mensaje);
    });

    //mensajes privados

    client.on('mensajePrivado',(data)=>{
        let persona=usuarios.getPersona(client.id);

        let mensaje=crearMensaje(persona.nombre,data.mensaje);
        client.broadcast.to(data.para).emit('mensajePrivado',mensaje);
    })
});