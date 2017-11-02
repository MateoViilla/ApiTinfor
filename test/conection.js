    const mongoose = require('mongoose');
    
    // concetar a mongodb 

    mongoose.Promise = global.Promise;

    //ES6 promise 


    before(function(done){

        mongoose.connect('mongodb://localhost/testaroo');
        // conectar a la base de datos despues de probar test run 
        
        mongoose.connection.once('open', function(){
            console.log('La conexion se realizo satsaactoriamente');
            done();
        }).on('error', function(error){
            console.log('ha ucurrido un error', error);
        });

    });

    // drop the characters collection before each test

    beforeEach(function(done){
        // Drop the collection
        mongoose.connection.collections.mariochars.drop(function(){
            done();
        });
    });
