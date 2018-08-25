'use strict'

const express = require('express')
const userCtrl = require('../controllers/UsuarioCtrl')
const facturaCtrl = require('../controllers/FacturasCtrl')
const auth = require('../middlewares/auth')
var xlsxtojson = require("xlsx-to-json");
var xlstojson = require("xls-to-json");
let { json2excel, excel2json } = require('js2excel');

const api = express.Router()


api.get('/usuarios', userCtrl.obtenerUsuarios)
api.get('/usuario', userCtrl.obtenerUsuario)
api.post('/usuario', userCtrl.guardarUsuario)
api.delete('/usuario', userCtrl.eliminarUsuario)
api.put('/usuario', userCtrl.modificarUsuario)
api.post('/usuario/logIn', userCtrl.logIn)

// Guarda una factura 
api.post('/factura', facturaCtrl.saveFactura)

//Guarda una lista de facturas pasandolas en un parametro facturas : []
api.post('/facturas', facturaCtrl.guardarExcelDeFacturas)

//Obtiene todas las faturas 
api.get('/factura', facturaCtrl.getFacturas)

// Le cambia de estado a una factura a leída pasadno el NIC 
// y retorna todas las facturas leídas
api.post('/factura/lectura', facturaCtrl.setFacturaEscaneada)

//Retorna todas las facturas leídas 
api.get('/factura/lectura', facturaCtrl.getFacturasEscaneada)

//Asigna una factura a un empleado tipo lector pasando numeroDocumento, NIC 
api.post('/factura/lector', facturaCtrl.asignarFactura)

//Obtiene todas las facturas asignadas a un empleado tipo lector 
api.post('/facturas/lector', facturaCtrl.getFacturasAsignadas)




api.get('/private', auth, (req, res) => {
  res.status(200).send({ message: 'Tienes acceso' })
})

api.post('/xlstojson', function (req, res) {
  xlsxtojson({
    input: "./Facturas.xlsx",
    output: "output.json",
    lowerCaseHeaders: true
  }, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
});

api.post('/jsontoxlsx', function (req, res) {
  try {
    let data = req.body.json;
    json2excel({
      data,
      name: 'user-info-data',
      formateDate: 'yyyy/mm/dd'
    });
  } catch (e) {
    console.error('export error');
  }
})

module.exports = api
