
'use strict'

const User = require('../models/user');
const HistorialSancion = require('../models/historialSancion');

const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto'),
    algorithm = 'aes-128-ecb',
    password = '1eVRiqy7b9Uv7ZMM';

//*Registra los usuarios con cada tipo de usuario, 0 || 1 dependiendo que tipo sea 
function registrar(req, res) {


    const user = new User({
        email: req.body.email,
        displayName: req.body.displayName,
        password: req.body.password
      })
    
      User.findOne({ identificacion: req.body.identificacion }, (err, usuarioExistente) => {
        if (err) return res.send({ message: err });
        if (usuarioExistente) {
          return res.send({ "OK": 0, "Mensaje": "El usuario ya esta registrado" });
        }
      user.save((err) => {
        if (err) return res.status(500).send({ message: `Error al crear el usuario: ${err}` })
    
        return res.status(201).send({ token: service.createToken(user) })
      })
    })
}

//*Metodo para conservar la sesion abierta de los usuarios, con el fin de validar cada ruta 
function loguearse(req, res, next) {
  let nuevoUser = new User({
    identificacion: req.body.identificacion
  });

  if (!req.body.identificacion || !req.body.password) {
    return res.send({ "OK": 0, "Mensaje": "Ingrese los campos requeridos" })
  }

  User.findOne({ "identificacion": req.body.identificacion }, (err, usuarioExistente) => {
    if (err) return res.send({ "OK": 0, "Mensaje": "Ha ocurrido un error" });
    if (!usuarioExistente) {
      return res.send({ "OK": 0, "Mensaje": "El usuario no esta registrado" });
    }
    //if (!usuarioExistente.validPassword(req.body.password)) {
    //if (!decryptar(usuarioExistente.password) == req.body.password) {
    var encriptada = encryptar(req.body.password);
    var validado = usuarioExistente.password == encriptada;
    if (!validado) {
      return res.send({ "OK": 0, "Mensaje": 'Contraseña incorrecta' });
    }

    req.logIn(usuarioExistente, (err) => {
      if (err) {
        return res.send({ "OK": 0, "Mensaje": "Ha ocurrido un error" });
      }
  
      return res.send({ "OK": 1, "Mensaje": "Login exitoso" });
    })
    
    
  });

  // })
}

//*Método para traer a todos los usuarios de la base de datos 
function getUsuarios(req, res) {
  User.find({ "identificacion": { $ne: "selecta" }, "IDRANGO": { $ne: "idRango" }}, (err, users) => {
    if (err) return res.send({ "OK": 0, "Mensaje": 'Error al realizar la peticion' });
    if (!users[0]) return res.send({ "OK": 0, "Mensaje": 'No hay usuarios' });
    res.send({ "OK": 1, "DATOS": users });
  });
}

//* Método para obtener un usuario pasandole como parámetro el _id
function getUsuario(req, res) {
  let userId = req.params.userId;

  User.findById(userId, (err, user) => {
    if (err) return res.send({ message: 'Error al realizar la peticion' });
    if (!user) return res.send({ message: 'El usuario no existe' });
    res.send(user);
  })
}

//*Comprueba el tipo de usuario admin o agente
function comprobarIdentificacion(req, res, next) {
  let userId = req.body.id;
  let update = req.body;

  User.findOne({ "identificacion": req.body.identificacion }, (err, user) => {
    if (err) return res.send({ "OK": 0, "Mensaje": "No fue posible guardar en BD. Intente de nuevo o consulte al administrador." });
    if (!user) return next();
    if (user._id != userId) return res.send({ "OK": 0, "Mensaje": "La cédula ya se encuentra almacenada con otro usuario" });

    return next();
  });
}

//*Método para modifica un usuario pasandole como parámetro en _id y el cuerpo nuevo del usuario
function updateUsuario(req, res) {
  let userId = req.body.id;
  let update = req.body;
  if (!update.password) {
    var newBody = {
      tipoUsuario: req.body.tipoUsuario,
      identificacion: req.body.identificacion,
      nombre: req.body.nombre,
      email: req.body.email
    }
    update = newBody;
  }
  if (update.password) {
    let hash = encryptar(update.password);
    update.password = hash;
  }
  User.findOneAndUpdate({ "_id": userId }, update, (err, userUpdated) => {
    if (!userUpdated) return res.send({ "OK": 0, "Mensaje": "El documento ya existe" });
    if (err) return res.send({ "OK": 0, "Mensaje": "La cédula ya se encuentra registrada \n No fue posible modificar en la BD. Intente nuevamente o consulte al admimnistrador." });
    return res.send({ "OK": 1, "Mensaje": "Modificado con éxito"});
  })
}

function encryptar(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decryptar(text){
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}

//*Método para camiar el estado de un usuario pasandole como parámetro en _id y el cuerpo nuevo del usuario
function cambiarEstado(req, res) {
  let userId = req.body.ID;
  var update = {
    "estado": req.body.ESTADO
  }
  User.findOneAndUpdate({ "_id": userId }, update, (err, userUpdated) => {
    if (err) res.send({ "OK": 0, "Mensaje": "No fue posible modificar en la BD. Intente nuevamente o consulte al admimnistrador." });
    return res.send({ "OK": 1, "Mensaje": "Modificado con éxito" });
  })
}

//*Obtiene el historial de rangos de comparendos 
function getUserHistorial(req, res) {
  let idUsuario = req.body.idUsuario;
  HistorialSancion.find({ "idUsuario": idUsuario}, (err, historialSancion) => {
    if (err) return res.send({ "OK": 0, "Mensaje": 'Error al realizar la peticion' });
    if (!historialSancion) return res.send({ "OK": 0, "Mensaje": 'No hay usuarios' });
    res.send({ "OK": 1, "DATOS": historialSancion });
  });
}

//* Edita el campo actual de rango por usuario 
function editRango(req, res){
  let userId = req.body.idUsuario;
  User.findById(userId, (err, user) => {
    if (err) return res.send({OK: 0, Mensaje:"Ha ocurrido un error, intente nuevamente o consulte al admimnistrador."});
    if (!user) return res.send({OK: 0, Mensaje:"El usuario no existe o fue removido"});
    
    if (user.numeroComparendos > req.body.rango ) return res.send({OK: 0, Mensaje:"Debe digitar un número mayor al de las saciones realizadas"});
    var fecha = new Date(Date.now());
    
    function pad(n) {return n < 10 ? "0"+n : n;}
    fecha = pad(fecha.getFullYear())+"-"+pad(fecha.getMonth()+1)+"-"+pad(fecha.getDate())+" "+pad(fecha.getHours())+":"+pad(fecha.getMinutes());

    var update = {
      "rangoComparendos": req.body.rango,
      "fechaAsignacionRango": fecha,
      "solicitudRango": 0
    }

    
    User.findOneAndUpdate({ "_id": userId }, update, (err, userUpdated) => {
      if (err) res.send({ "OK": 0, "Mensaje": "No fue posible modificar en la BD. Intente nuevamente o consulte al admimnistrador." });
      return res.send({ "OK": 1, "Mensaje": "Modificado con éxito" });
    })
  })
}

//*Guarda un nuevo rangoComparendos general 
function saveRango(req, res) {
  let newUser = new User();
  newUser.IDRANGO = "idRango";
  newUser.rangoComparendos = req.body.rangoComparendos;

  newUser.save((err, newUserStored) => {
      if (err) res.send({ "OK": 0, "Mensaje": "No fue posible guardar en la BD. Intente nuevamente o consulte al admimnistrador." });
      return res.send({ "OK": 1, "Mensaje": "Guardado con éxito" });
  });
}

//* Obtiene el rangoComparendos general 
function getRango(req, res, next) {
  User.findOne({ "IDRANGO": "idRango" }, (err, Rango) => {
      if (err) return res.send({ "OK": 0, "Mensaje": 'Error al realizar la peticion' });
      if (!Rango) return res.send({ "OK": 0, "Mensaje": 'No hay Rango' });
      res.send({ OK: 1, DATO: Rango });
  });
}

//*Modifica el rangoComparendos general
function editarRango(req, res){
    
    let update = {
      rangoComparendos: req.body.rangoComparendos
    }

    User.findOneAndUpdate({"IDRANGO": "idRango"}, update, (err, rangoUpdated) => {
      if (err) return res.send({OK: 0, Mensaje:"Ha ocurrido un error. Intente de nuevo o consulte con el administrador"});
      if (!rangoUpdated){
        let newUser = new User();
        newUser.IDRANGO = "idRango";
        newUser.rangoComparendos = req.body.rangoComparendos;
      
        newUser.save((err, newUserStored) => {
            if (err) res.send({ "OK": 0, "Mensaje": "No fue posible guardar en la BD. Intente nuevamente o consulte al admimnistrador." });
            //return res.send({ "OK": 1, "Mensaje": "Guardado con éxito" });
        });
      } 
      //return res.send({OK:0, Mensaje:"No se ha podido editar el rango. Intente de nuevo o consulte con el administrador"});
      return res.send({OK:1, Mensaje:"Rango modificado con éxito"});
    })
}

//* Método para eliminar un usuario pasandole como parámetro el _id
function deleteUser(req, res) {
  let userId = req.body.ID;
  User.findById(userId, (err, user) => {
    if (err) res.send({ "OK": 0, message: 'Error al borrar' });
    user.remove(err => {
      if (err) res.send({ "OK": 0, "Mensaje": "No fue posible eliminar en la BD. Intente nuevamente o consulte al admimnistrador." });
      res.send({ "OK": 1, "Mensaje": "Eliminado con éxito" });

    });
  });
}

//* metodo que solicita un nuevo rango
function solicitarRango (req, res){
  let userId = req.body.ID;
  var update = {
    "solicitudRango": 1
  }
  User.findOneAndUpdate({ "identificacion": userId }, update, (err, userUpdated) => {
    if (err) res.send({ "OK": 0, "Mensaje": "No fue posible modificar en la BD. Intente nuevamente o consulte al admimnistrador." });
    if (!userUpdated) res.send({ "OK": 0, "Mensaje": "El usuario no existe en base de datos" });
    return res.send({ "OK": 1, "Mensaje": "Modificado con éxito" });
  })
}
//* Obtiene listado de los usuarios que han solicitado nuevo rango 



/**
 * 
 * function logout(req, res, next) {
 * req.logout();
 * return res.send({ "OK": 1, "Mensaje": "Has salido" });
 * 
}*/

module.exports = {
  registrar,
  loguearse,
  getUsuarios,
  getUsuario,
  comprobarIdentificacion,
  updateUsuario,
  cambiarEstado,
  editRango,
  saveRango,
  getRango,
  editarRango,
  getRango,
  getUserHistorial,
  deleteUser,
  solicitarRango,
  usersPendientesPorRango,
  logout
}