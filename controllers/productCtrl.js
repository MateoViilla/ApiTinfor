// TODO EL CONTROLADOR PARA PRODUCTOS 

'use strict'

const Product = require('../models/product');


function getProduct(req, res){
    let productId = req.params.productId;
    
        Product.findById(productId, (err, product)=>{
            if(err) return res.status(500).send({message:'Error al realizar la peticion'});
            if(!product) return res.status(404).send({message:'El producto no existe' });
                
            res.status(200).send({product});
        })
}

function getProducts(req, res){
    Product.find({}, (err, products) => {
        if(err) return res.status(500).send({message:'Error al realizar la peticion'});
        if(!products) return res.status(404).send({message:'No hay productos' });

        res.status(200).send({products});
    });
}

function getAsus(req, res){
    Product.findOne({price: 1500}, (err, products) => {
        if(err) return res.status(500).send({message:'Error al realizar la peticion'});
        if(!products) return res.status(404).send({message:'No hay productos' });

        res.status(200).send({products});
    });
}

function saveProduct(req, res){
    
    console.log('POST /api/product');
    
    console.log(req.body);

    let product = new Product();

    product.name = req.body.name;
    product.picture = req.body.picture;
    product.price = req.body.price;
    product.category = req.body.category;
    product.description = req.body.description;
    
    product.save((err, productStored) => {
        if(err) res.status(500).send({message: 'error al guardar en base de datos'});

        res.status(200).send({product: productStored});

    })
}

function updateProduct(req, res){
    let productId = req.params.productId;
    let update = req.body;
    Product.findOneAndUpdate(productId, update, (err, productUpdated) => {
        if(err) res.status(500).send({message:'error al actualizar'});

        res.status(200).send({product: productUpdated});
    })
}

function deleteProduct(req, res){
    let productId = req.params.productId;
    
    Product.findById(productId, (err, product) => {
        if(err) res.status(500).send({message:'Error al borrar'});

        product.remove(err => {
        if(err) res.status(500).send({message:'Error al borrar'});
            res.status(200).send({message:'el producto ha sido eliminado'});
        });
    });
}

module.exports = {
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    saveProduct
}