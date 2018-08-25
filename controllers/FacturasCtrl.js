'use strict'

const Factura = require('../models/factura');
const Cliente = require('../models/cliente');

function getFacturas(req, res) {
    Factura.find({}, function (err, facturas) {

        if (err) return res.status(500).send({ message: err })
        if (!facturas[0]) return res.status(404).send({ message: 'No hay facturas' })
        return res.status(200).send(facturas);

    });
}

function getFacturasEscaneada(req, res) {

    Factura.find({ escaneado: true, empleado: null }, function (err, facturas) {

        if (err) return res.status(500).send({ message: err })
        if (!facturas[0]) return res.status(404).send({ message: 'No hay facturas escaneadas' })
        return res.status(200).send({ facturas });

    });
}

function guardarExcelDeFacturas(req, res) {
    let facturas = req.body.facturas;
    Factura.insertMany(JSON.parse(facturas), (err, facturasInsertadas) => {
        if (err)
            return res.status(500).send({ message: `Ha ocurrido un error al guardar la lista de facturas ${err}` });
        if (!facturasInsertadas)
            return res.status(400).send({ message: `No se han guardado las facturas ${err}` });
        
        return res.status(200).send({ message: `Facturas almacenadas correctamente`, facturas:facturasInsertadas });
        
    })

}

function saveFactura(req, res) {
    let factura = new Factura();

    factura.FechaImpresion = req.body.FechaImpresion;
    factura.NIC = req.body.NIC;
    factura.NombreCliente = req.body.NombreCliente;
    factura.Direccion = req.body.Direccion;
    factura.Unic = req.body.Unic;
    factura.Ruta = req.body.Ruta;
    factura.Itin = req.body.Itin;
    factura.FechaLectura = req.body.FechaLectura;
    factura.Municipio = req.body.Municipio;
    factura.Clasificacion = req.body.Clasificacion;
    factura.Lector = req.body.Lector;
    factura.escaneado = req.body.escaneado;
    factura.empleado = req.body.empleado;

    factura.save((err, facturaStored) => {

        if (err) return res.status(500).send({ message: `Ha ocurrido un error al guardar la factura error: ${err.errmsg}` });
        return res.status(200).send({ message: "Guardado con éxito", factura: facturaStored });

    });
}

function asignarFactura(req, res) {
    let empleado = req.body.numeroDocumento;
    let NIC = req.body.NIC;

    Factura.findOneAndUpdate({ empleado: null, escaneado: true, NIC: NIC }, { empleado: empleado }, (err, productUpdated) => {
        if (err) return res.status(500).send({ message: `Error al asginar la factura : ${err}` })

        return res.status(200).send({ product: productUpdated })
    })

    /*Factura.updateMany({
        NIC: { $in: facturas }, 
        escaneado: false  
    },{
        escaneado:true,
        empleado: empleado
    },(err, facturasActualizadas)=>{
        if (err) res.status(500).send({ message: `Error al actualizar el producto: ${err}` })

        res.status(200).send({ message: facturasActualizadas })
    })*/
}

function getFacturasAsignadas(req, res) {
    let empleado = req.body.empleado;

    Factura.find({ empleado: empleado }, (err, facturas) => {
        if (err)
            return res.status(500).send({ message: `Error al obtener facturas para el lector ${empleado} err ${err}` })

        if (!facturas)
            return res.status(400).send({ message: `No se encontraron facturas para el lector${empleado}` })

        return res.status(200).send({ facturas: facturas })
    })
}

function setFacturaEscaneada(req, res) {
    let NIC = req.body.NIC;

    Factura.findOneAndUpdate({ NIC: NIC }, { escaneado: true }, (err, facturasUpdated) => {

        if (err) return res.status(500).send({ message: `Error al actualizar el producto: ${err}` })
        if (!facturasUpdated) return res.status(400).send({message: `No se ha cambiado el estado de la factura. Verificar datos`})
        
        Factura.find({ escaneado: true, empleado: null }, function (err, facturas) {
            if (err) return res.status(500).send({ message: err })
            if (!facturas[0]) return res.status(404).send({ message: 'No hay facturas escaneadas' })
            return res.status(200).send({ facturas:facturas });
        });
    })
}

function deleteFacturas(req, res) {
    Factura.remove({}, function (err, removed) {
        if (err) return res.status(500).send({ "OK": 0, "Mensaje": "No fue posible Eliminar en la BD. Intente nuevamente o consulte al admimnistrador." });
        return res.status(200).send({ message: 'Elminada con éxito', factura: removed });
    });
}





/**
 * NOTAS:
 * - Queda pendiente los metodos guardar, modificar, eliminar
 * y analizar en que casos se debe usar populate, tener en cuenta que 
 * un usuario solo debe de existir una vez 
 * 
 */

function saveDispositivo(req, res) {
    let dispositivo = new Dispositivo();

    dispositivo.NOMBRE_DISPOSITIVO = os.hostname();
    dispositivo.USUARIO = req.body.USUARIO;
    dispositivo.DIRECCION_IP = ip.address();
    var fecha = new Date(Date.now());

    function pad(n) { return n < 10 ? "0" + n : n; }
    fecha = pad(fecha.getFullYear()) + "-" + pad(fecha.getMonth() + 1) + "-" + pad(fecha.getDate()) + " " + pad(fecha.getHours()) + ":" + pad(fecha.getMinutes());

    dispositivo.FECHA_CONEXION = fecha;

    dispositivo.save((err, dispositivoStored) => {

        if (err) res.status(500).send({ "OK": 0, "Mensaje": "No fue posible guardar en la BD. Intente nuevamente o consulte al admimnistrador." });
        return res.send({ "OK": 1, "Mensaje": "Guardado con éxito" });

    });
}

function deleteAll(req, res) {
    Dispositivo.remove({}, function (err, removed) {
        if (err) res.status(500).send({ "OK": 0, "Mensaje": "No fue posible Eliminar en la BD. Intente nuevamente o consulte al admimnistrador." });
        return res.send({ "OK": 1, "Mensaje": "Limpiado con éxito" });
    });
}

module.exports = {
    saveFactura,
    getFacturas,
    setFacturaEscaneada,
    getFacturasEscaneada,
    asignarFactura,
    getFacturasAsignadas,
    guardarExcelDeFacturas
}