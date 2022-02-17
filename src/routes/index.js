const express = require('express');
var multer = require('multer');
var upload = multer();
const { parse } = require('csv-parse/sync');
const {mediaPoblacional} = require('../Procesamiento/Media poblacional/index')
const {varianza,cota, promedios,suma,calcularPromedio,calcularVarianza} = require('../Procesamiento/general')

const router = express.Router();

router.get('/', (req,res) => {
    res.render("../views/formulario.hbs")
});

router.post('/upload',upload.fields([{name: 'file', maxCount: 1}]), (req,res) => {
    //Recibir archivo
    const archivo = req.files;
    //Leer archivo
    const contenido = archivo['file'][0].buffer.toString();
    //Parsear archivo a un array
    const records = parse(contenido, {
        columns: false,
        skip_empty_lines: true
      });
    const datos = records[0]
    //Mostrar datos
    console.log(datos);
    const sumacion = suma(datos)
    const prom = calcularPromedio(datos)
    const varianza2 = calcularVarianza(datos)
    console.log(sumacion)
    console.log(prom)
    console.log(varianza2)
    res.send('Ok')
})

router.get('/pruebas', (req,res)=>{
    const respuesta = varianza('media','known',12,50,20);
    const cota1 = cota('media','known',12,50,20);
    const promedio = promedios('media','promedio',200,10)
    const sumacion = suma([1,2,3,4,5,6])
    const prom = calcularPromedio([1,2,3,4,5,6])
    const varianza2 = calcularVarianza([1,2,3,4,5,6])
    console.log(respuesta)
    console.log(cota1)
    console.log(promedio)
    console.log(sumacion)
    console.log(prom)
    console.log(varianza2)

    res.send('oks')
})

module.exports = router;