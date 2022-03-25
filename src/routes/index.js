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

    const {muestreo, tipo, categoria, asignacion} = req.body;
    console.log('muestreo:'+muestreo);
    console.log('tipo:'+tipo);
    console.log('categoria:'+categoria);
    console.log('asignacion:'+asignacion);

    const {numeroEstratos, N, n, varianza_poblacional, varianza_muestral, suma, totalElementos, promedio, p, q, cota, cotaMuestra, costo} = req.body

    const parametros = {
        asignacion: asignacion,
        muestreo: muestreo,
        type: tipo,
        categoria,
        varianza: varianza_muestral||varianza_poblacional,
        N: N,
        n: n,
        suma: suma,
        totalElementos: totalElementos,
        promedio: promedio,
        p: p,
        q: q,
        cota: cota,
        estratos: numeroEstratos,
        cotaMuestra: cotaMuestra,
        costo: costo
    }
    
    let resultadoFinal = {};

    const resultado = general(parametros);

    const datos = Object.keys(resultado)
    let resultados = [];

    for(let i=0; i<numeroEstratos; i++){
        let objeto = {}
        datos.forEach((dato) => {
            objeto[dato] = resultado[dato][i]
        });
        resultados.push(objeto)
    }



    const condicionesAgregados = {
        'media': {
            'estimacion': (suma,N) => {
                return suma/N;
            },
            'varianza': (suma,N) => {
                return suma/(N*N);
            },
            'cota': (varianza) => {
                return 2*Math.sqrt(varianza)
            }
        },
        'total': {
            'estimacion': (suma) => {
                return (suma);
            },
            'varianza': (suma) => {
                return (suma);
            },
            'cota': (varianza) => {
                return 2*Math.sqrt(varianza)
            }
        },
        'proporcion': {
            'estimacion': (suma,N) => {
                return (suma/N);
            },
            'varianza': (suma,N) => {
                return (suma/(N*N));
            },
            'cota': (varianza) => {
                return 2*Math.sqrt(varianza)
            }
        }
    }

    const sumarArray = (array)=>{
        let initial = 0;
        return array.reduce((prev,current)=>Number(prev)+Number(current),initial);
    }

    let agregado = {}
    if(muestreo==='MAE'){
        if(tipo==='muestra'){
            //vamos a sacar las n individuales
            resultadoFinal['size'] = resultado.size;
            resultados = resultado.wEstratos.map((estrato) => {
                return({
                    size: estrato*resultado.size,
                    factor: estrato*100
                })
            });
        }else{
            let sumapromedios = sumarArray(resultado.estimacion)
            let sumavarianzas = sumarArray(resultado.varianza)
            let sumaN = sumarArray(N);

            const estimacionAgregada = condicionesAgregados[tipo]['estimacion'](sumapromedios,sumaN);
            const varianzaAgregada = condicionesAgregados[tipo]['varianza'](sumavarianzas,sumaN);
            const cotaAgregada = condicionesAgregados[tipo]['cota'](varianzaAgregada);
            const margenAgregada = cotaAgregada/estimacionAgregada*100;
            const minimoAgregada = estimacionAgregada-cotaAgregada;
            const maximoAgregada = estimacionAgregada+cotaAgregada;

            agregado['estimacion'] = estimacionAgregada;
            agregado['varianza'] = varianzaAgregada;
            agregado['cota'] = cotaAgregada;
            agregado['margen'] = margenAgregada;
            agregado['minimo'] = minimoAgregada;
            agregado['maximo'] = maximoAgregada;

            resultadoFinal = agregado;
        }
    }
    console.log(resultadoFinal)
    const respuesta = {
        resultado:resultadoFinal,
        parametros,
        resultados
    }

    res.render('../views/resultado.hbs', respuesta)
})

module.exports = router;