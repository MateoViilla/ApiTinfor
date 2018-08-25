// SE ESTABLECE EL MODELO facturaO

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const facturaSchema = new Schema({

   
    FechaImpresion: { type: String, required: false },
    NombreCliente: { type: String, required: false},
    NIC: { type: String, required: false, unique: true },
    Direccion: { type: String, required: false },
    Unic: { type: String, required: false },
    Ruta: { type: String, required: false },
    Itin: { type: String, required: false },
    FechaLectura: { type: String, required: false },
    Municipio: { type: String, required: false },
    Clasificacion: { type: String, required: false },
    Lector: { type: String, required: false }, 
    escaneado: {type: Boolean, default: false},
    empleado: {type:String, default:null}

});


const factura = mongoose.model('Factura', facturaSchema);

module.exports = factura;
