const assert = require('assert');
const MarioChar = require('../models/mariochar');

describe('Guardando registros', function(){
    // create test

    it('Guardar registros en la base de datos', function(done){
       
        const char = new MarioChar({
            name: 'Mateo'
    });

    char.save().then(function(){
        done(); 
        });
    
    });
    
});