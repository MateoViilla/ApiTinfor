// SE ESTABLECE EL MODELO LECTURA

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lecturaSchema = new Schema({
    
    tipo:  {type: String, required: true},
    QR:  {type: String, required: false},
    barCode:  {type: String, required: false},

});


const lectura  = mongoose.model('Lectura', lecturaSchema);

module.exports = lectura;
