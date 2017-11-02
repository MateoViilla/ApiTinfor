const assert = require('assert');
const MarioChar = require('../models/mariochar');

// Describe our tests
describe('Updating  records', function(){
  var char;
  // Add a character to the db before each tests
  beforeEach(function(done){
    char = new MarioChar({
      name: 'Mateo',
      weight: 50
    });
    char.save().then(function(){
      done();
    });
  });

  // Create tests
  it('Updating a record from the database', function(done){
    MarioChar.findOneAndUpdate({name: 'Mateo'}, {name: 'Mateo Villa'}).then(function(){
      MarioChar.findOne({_id:char._id}).then(function(result){
        assert(result.name === 'Mateo Villa');
        done();
      })
      
    });
  });


  // Create tests
  it('Incrementar ancho en 1 ', function(done){
    MarioChar.update({}, {$inc: {weight:1}}).then(function(){
        MarioChar.findOne({name: 'Mateo'}).then(function(record){
            assert(record.weight === 51);
            done();
        })
    })
    
  });

});