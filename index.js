// PEDIR TODA LA INFORMACIÓN 
// SE CONECTA A LA BASE DE DATOS 
//  VE CONECTADO EMPIEZA A ESCUCHAR EL SERVIDOR 
'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config');
const conectionurl = 'mongodb://adminmateo:mateoadmin@ds245755.mlab.com:45755/shopmongodb';

mongoose.connect(conectionurl, (err, res) => {
    if(err){
        return console.log(`ha ocurrido un error al conectarse a la base de datos ${err}`);
    }
    console.log('Conexión a la base de datos establecida');
    app.listen(config.port, () => {
        console.log(`API rest corriendo en http://localhost:${config.port}`);
    });
});

