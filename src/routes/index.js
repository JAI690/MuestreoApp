const express = require('express');
var multer = require('multer');
var upload = multer();
const { parse } = require('csv-parse/sync');
const {mediaPoblacional} = require('../Procesamiento/Media poblacional/index')
const {varianzaFormula,cota, promedios,funcionSuma,calcularPromedio,calcularVarianza, general} = require('../Procesamiento/general')

const router = express.Router();


const casos = {
    'media':{
        'known': ['varianza', 'N', 'n'],
        'unknown': ['varianza', 'N', 'n'],
        'promedio': ['suma','totalElementos'],
        'muestra': []
    },
    'total':{
        'known': ['varianza', 'N', 'n'],
        'unknown': ['varianza', 'N', 'n'],
        'promedio': ['promedio','totalElementos'],
        'muestra': []
    },
    'proporcion':{
        'known': ['p','N','n'],
        'unknown':['p','q','N','n'],
        'promedio': ['suma','totalElementos'],
        'muestra': []
    }
}

router.get('/', (req,res) => {
    res.render("../views/decision.hbs")
});

router.get('/formulario', (req,res) => {
    res.render("../views/formulario.hbs")
});

router.get('/archivo', (req,res) => {
    res.render("../views/formularioArchivo.hbs")
});

router.post('/archivo',upload.fields([{name: 'file', maxCount: 1}]), (req,res) => {

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

    const {tipo} = req.body;

    const varianza = calcularVarianza(datos);
    const n = datos.length;
    const suma = funcionSuma(datos);
    const totalElementos = datos.length
    const promedio = calcularPromedio(datos);

    const {N, p, q, cota} = req.body

    const parametros = {
        type: tipo,
        varianza: Number(varianza),
        N: Number(N),
        n: Number(n),
        suma: Number(suma),
        totalElementos: Number(totalElementos),
        promedio: Number(promedio),
        p: Number(p),
        q: Number(q),
        cota: Number(cota)
    }
    const resultado = general(parametros);
    console.log(resultado)

    const respuesta = {
        resultado,
        parametros
    }


    res.render('../views/resultado.hbs', respuesta)
})

router.post('/upload', (req,res)=>{

    const {muestreo, tipo, categoria} = req.body;
    console.log('muestreo:'+muestreo);
    console.log('tipo:'+tipo);
    console.log('categoria:'+categoria);

    const {N, n, varianza_poblacional, varianza_muestral, suma, totalElementos, promedio, p, q, cota} = req.body
    
    const parametros = {
        muestreo: muestreo,
        type: tipo,
        categoria,
        varianza: Number(varianza_muestral||varianza_poblacional),
        N: Number(N),
        n: Number(n),
        suma: Number(suma),
        totalElementos: Number(totalElementos),
        promedio: Number(promedio),
        p: Number(p),
        q: Number(q),
        cota: Number(cota)
    }
    const resultado = general(parametros);
    console.log(resultado)

    const respuesta = {
        resultado,
        parametros
    }

    res.render('../views/resultado.hbs', respuesta)
})

module.exports = router;