// SE ESTABLECE EL MODELO clienteO

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clienteSchema = new Schema({
    nombre:  {type: String, required: false},
    clasificacion:  {type: String, required: false},
    direccionInmueble:  {type: String, required: false},
    direccionEnvio:  {type: String, required: false},

});


const cliente  = mongoose.model('Cliente', clienteSchema);

module.exports = cliente;
