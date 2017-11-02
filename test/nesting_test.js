const assert = require('assert');
const mongoose = require('mongoose');
const Author = require('../models/author');


// Describe our test

describe('Nesting records ', function(){

    //CreateTest

    it('Creating an author whith sub-documents', function(done){
        var pat = new Author ({
            name: "Mateo el grande",
            books: [{title: "El libro de la selva", pages: 400}]
        });

    pat.save().then(function(){
        Author.findOne({name: "Mateo el grande"}).then(function(record){
            assert(record.books.length === 1);
            done();
        });
    });

  });

  it('Adds a book to an author', function(done){
    var pat = new Author ({
        name: "Mateo el grande",
        books: [{title: "El libro de la selva", pages: 400}]
    });

    pat.save().then(function(){
        Author.findOne({name: 'Mateo el grande'}).then(function(record){
            record.books.push({title: "La sirenita", pages: 600});
            record.save().then(function(){
                Author.findOne({name: 'Mateo el grande'}).then(function(result){
                    assert(result.books.length === 2);
                    done();
                });
            });
        });
    });
  });

});