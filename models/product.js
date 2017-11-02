// SE ESTABLECE EL MODELO PRODUCTO

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: String,
    price: {type:Number, default: 0},
    picture: String,
    category: {type: String, enum: ['computers', 'phones', 'accesories']},
    description: String
});


const product  = mongoose.model('Product', productSchema);

module.exports = product;
