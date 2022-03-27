const sumarArray = (array)=>{
    let initial = 0;
    return array.reduce((prev,current)=>Number(prev)+Number(current),initial);
}

const casos2 = {
    'media':{
        'varianza':{
            'known': ({varianza,N,n}) => {
                return (varianza/n)*((N-n)/(N-1))
            },
            'unknown': ({varianza,N,n}) => {
                return (varianza/n)*((N-n)/(N))
            }
        },
        'promedio': ({suma,totalElementos}) => {
            return (suma/totalElementos)
        },
        'size': ({cota,N,varianza}) => {
            const D = (cota^2)/4;
                return (N*varianza)/(((N-1)*D) + varianza)
        }
    },
    'total':{
        'varianza':{
            'known': ({varianza,N,n}) => {
                return (((N^2)*varianza)/n)*((N-n)/N-1)
            },
            'unknown': ({varianza,N,n}) => {
                return ((N*varianza)/n)*(N-n)
            }
        },
        'promedio': ({suma,totalElementos}) => {
            return (suma*totalElementos)
        },
        'size': ({cota,N,varianza}) => {
            const D = (cota^2)/(4*(N^2));
                return (N*varianza)/(((N-1)*D) + varianza)
        }
    },
    'proporcion':{
        'varianza':{
            'known': ({p,N,n}) => {
                return ((p*(1-p))/n)*((N-n)/(N-1))
            },
            'unknown': ({p,q,N,n}) => {
                return ((p*q)/n)*((N-n)/N)
            }
        },
        'promedio': ({suma,totalElementos}) => {
            return (suma/totalElementos)
        },
        'size': ({cota,N,p,q}) => {
            const D = (cota^2)/4;
                return (N*p*q)/(((N-1)*D) + (p*q))
        }
    }

}

const casos = {
    'MAS': {
        'media':{
            'varianza': ({varianza,N,n}) => {
                    return (varianza/n)*((N-n)/(N))
            },
            'promedio': ({suma,n}) => {
                console.log('suma', suma, n)
                return (suma/n)
            },
            'size': ({cota,N,varianza}) => {
                const D = (cota*cota)/4;
                    return (N*varianza)/(((N-1)*D) + varianza)
            }
        },
        'total':{
            'varianza': ({varianza,N,n}) => {
                return ((N*varianza)/n)*(N-n)
            },
            'promedio': ({promedio,N}) => {
                return (promedio*N)
            },
            'size': ({cota,N,varianza}) => {
                const D = (cota*cota)/(4*(N*N));
                    return (N*varianza)/(((N-1)*D) + varianza)
            }
        },
        'proporcion':{
            'varianza': ({p,q,N,n}) => {
                    return ((p*q)/n)*((N-n)/N)
            },
            'promedio': ({suma,n}) => {
                return (suma/n)
            },
            'size': ({cota,N,p,q}) => {
                const D = (cota*cota)/4;
                    return (N*p*q)/(((N-1)*D) + (p*q))
            }
        }
    },
    'MAE':{
        'media':{
            'varianza': ({varianza,N,n}) => {
                    return (N*N)*((N-n)/N)*(varianza/n)
            },
            'promedio': ({suma,n,N}) => {
                return ((suma/n)*N)
            },
            'sizeTotal': ({cota,N,sumaNumerador,sumaDenominador}) => {
                const D = (cota*cota)/4;
                    return (sumaNumerador)/(((N*N)*D) + sumaDenominador)
            },
            'Numerador': ({N,varianza,w}) => {
                return (((N*N)*varianza)/w)
            },
            'Denominador': ({N,varianza}) => {
                return (N*varianza)
            }
        },
        'total':{
            'varianza': ({varianza,N,n}) => {
                return (N*N)*((N-n)/N)*(varianza/n)
            },
            'promedio': ({promedio,N}) => {
                console.log('prom',promedio);
                console.log('N',N)
                return (promedio*N)
            },
            'sizeTotal': ({cota,N,sumaNumerador,sumaDenominador}) => {
                const D = (cota*cota)/(4*(N*N));
                    return (sumaNumerador)/(((N*N)*D) + sumaDenominador)
            },
            'Numerador': ({N,varianza,w}) => {
                return (((N*N)*varianza)/w)
            },
            'Denominador': ({N,varianza}) => {
                return (N*varianza)
            }
        },
        'proporcion':{
            'varianza': ({p,q,N,n}) => {
                    return (N*(p*q/(n-1))*(N-n))
            },
            'promedio': ({p,N}) => {
                return (N*p)
            },
            'sizeTotal': ({cota,N,sumaNumerador,sumaDenominador}) => {
                const D = (cota*cota)/4;
                    return (sumaNumerador)/(((N*N)*D) + sumaDenominador)
            },
            'Numerador': ({N,varianza,w}) => {
                return (((N*N)*varianza)/w)
            },
            'Denominador': ({N,varianza}) => {
                return (N*varianza)
            }
        }
    }
}

//MEDIA
    //known (varianza, N, n)
    //unknown (varianza, N, n)
    //promedio (suma, totalElementos)


//TOTAL
    //known (varianza, N, n)
    //unknown (varianza, N, n)
    //total (promedio, totalElementos)

//PROPORCION
    //known (p, N, n)
    //unknown (p, q, N, n)
    //promedio (suma, totalElementos)

    const general2 = function({queCalcular,type,isKnown,varianza, N, n, p, q,suma,totalElementos,promedio, cota}){
        let respuesta = 'no especificada';

        switch (queCalcular){
            case 'promedio': 
                respuesta = promedios({type, suma,promedio, totalElementos,N,p,q});
                break
            case 'varianza':
                respuesta =  varianzaFormula({type,isKnown,varianza,N,n,p,q});
                break
            case 'cota':
                respuesta =  cotaFormula({type,isKnown,varianza,N,n,p,q});
                break
            case 'muestra':
                respuesta =  size({type,cota,N,p,q,varianza});
                break
        }
        return respuesta
    }

    const general = function({asignacion, muestreo, type,varianza, N, n, p, q,suma,categoria,promedio, cota, estratos, cotaMuestra, costo}){
        let respuesta = {};

        switch(muestreo){

            case 'MAS': 
                switch (type){
                    default:
                        respuesta['estimacion'] = promedios({muestreo,type, suma,promedio, n,N});
                        respuesta['varianza'] =  varianzaFormula({muestreo,type,varianza,N,n,p,q});
                        respuesta['cota'] =  cotaFormula({muestreo,type,varianza,N,n,p,q});
                        respuesta['margen'] = respuesta['cota']/respuesta['estimacion']*100
                        respuesta['minimo'] = respuesta['estimacion']-respuesta['cota']
                        respuesta['maximo'] = respuesta['estimacion']+respuesta['cota']

                        break
                    case 'muestra':
                        respuesta['muestra'] =  size({muestreo,categoria,cota,N,p,q,varianza});
                        break
                }
                break;
            case 'MAE':
                switch (type){
                    default:
                        respuesta['estimacion'] = promedios({muestreo,type, suma,promedio, n,N,estratos,p});
                        respuesta['varianza'] =  varianzaFormula({muestreo,type,varianza,N,n,p,q,estratos});
                        respuesta['cota'] =  cotaFormula({muestreo,type,varianza,N,n,p,q,estratos});
                        respuesta['margen'] = respuesta['cota'].map((cota, index) => cota/respuesta['estimacion'][index]*100)
                        respuesta['minimo'] = respuesta['estimacion'].map((estimacion, index)  => estimacion-respuesta['cota'][index])
                        respuesta['maximo'] = respuesta['estimacion'].map((estimacion, index)  => estimacion+respuesta['cota'][index])

                        break
                    case 'muestra':
                        console.log('N',N)
                        const resultado =  size({asignacion, muestreo, type, categoria,cota:cotaMuestra,N,varianza, estratos, costo,p,q});

                        respuesta['size'] = resultado.size;
                        respuesta['wEstratos'] = resultado.wFactores;
                        break
                }
                break;
        }
        return respuesta
    }

    const varianzaFormula = function({muestreo,type,varianza, N, n, p, q, estratos=1}){
        let respuesta = [];
        
        switch(type){
            case 'proporcion':
                for(let i=0; i<estratos; i++){

                    let nIndividual = n[i];
                    let NIndividual = N[i];
                    let pIndividual = p[i];
                    let qIndividual = q[i];

                    let respuestaIndividual = casos[muestreo][type]['varianza']({n:nIndividual,N:NIndividual,p:pIndividual, q:qIndividual});
                    respuesta.push(respuestaIndividual)
                };
            break;
            default:
                for(let i=0; i<estratos; i++){

                    let nIndividual = n[i];
                    let NIndividual = N[i];
                    let varianzaIndividual = varianza[i];

                    let respuestaIndividual = casos[muestreo][type]['varianza']({n:nIndividual,N:NIndividual,varianza:varianzaIndividual});
                    respuesta.push(respuestaIndividual);
                }
            break;
        }

        return respuesta
    }

    const cotaFormula =  function({muestreo,type,varianza, N, n, p, q, estratos=1}){
        let respuesta = [];
        
        switch(type){
            case 'proporcion':
                for(let i=0; i<estratos; i++){

                    let nIndividual = n[i];
                    let NIndividual = N[i];
                    let pIndividual = p[i];
                    let qIndividual = q[i];

                    let respuestaIndividual = casos[muestreo][type]['varianza']({n:nIndividual,N:NIndividual,p:pIndividual, q:qIndividual});
                    respuesta.push(respuestaIndividual)
                };
            break;
            default:
                for(let i=0; i<estratos; i++){

                    let nIndividual = n[i];
                    let NIndividual = N[i];
                    let varianzaIndividual = varianza[i];

                    let respuestaIndividual = casos[muestreo][type]['varianza']({n:nIndividual,N:NIndividual,varianza:varianzaIndividual});
                    respuesta.push(respuestaIndividual);
                }
            break;
        }

        const varianzasCalculadas = respuesta.map((respuesta)=>2*Math.sqrt(respuesta));
        return varianzasCalculadas
    }

    const promedios = function({muestreo, type, suma=[], n,N,promedio=[], estratos=1,p=0}){
        const respuesta = [];
        let variante = [];
        suma?variante=suma:promedio?variante=promedio:variante=1;


        
        for(let i=0; i<estratos; i++){
            let sumaIndividual = []
            let promedioIndividual = []
            if(type==='proporcion'){
                sumaIndividual = p[i]*n[i]
                promedioIndividual = p[i]*n[i]
            }else{
                sumaIndividual = suma[i];
                promedioIndividual = promedio[i];
            }
            let nIndividual = n[i];
            let NIndividual = Number(N[i]);
            let pIndividual = p[i]
            let respuestaIndividual = casos[muestreo][type]['promedio']({suma:sumaIndividual,n:nIndividual,N:NIndividual,promedio:promedioIndividual,p:pIndividual});

            respuesta.push(respuestaIndividual)
        }
        console.log('promedios', respuesta)
        return respuesta;
    }

    const size = function({asignacion, muestreo, type, categoria,cota,N,p,q,varianza, estratos=1, costo=[]}){
        let respuesta = [];
        let numeradores = [];
        let denominadores = [];
        let Nsuma = sumarArray(N);
        console.log('p',p)
        if(!varianza){
            varianza = p.map((dato,index)=>dato*q[index])
        }

        let costosos = costo.map((costito,index) => {
            costito!==0?costoRaiz = Math.sqrt(costito):costoRaiz=1;
            return((N[index]*Math.sqrt(varianza[index]))/costoRaiz);
        });
        const sumaW = sumarArray(costosos)

        const wIndividuales = []

        for(let i=0; i<estratos; i++){

            let NIndividual = N[i];
            let varianzaIndividual = varianza[i];
            let costoIndividual = costo[i]

            let wIndividual = funcionW({asignacion,N:NIndividual,Ntotal:Nsuma,estratos,varianza:varianzaIndividual,costo:costoIndividual,sumaWTotal:sumaW,sumaWTotalSinCosto:sumaW})
            let numerador = casos[muestreo][categoria]['Numerador']({N:NIndividual, varianza:varianzaIndividual, w:wIndividual});
            let denominador = casos[muestreo][categoria]['Denominador']({N:NIndividual,varianza:varianzaIndividual})
            console.log('w',wIndividual)
            numeradores.push(numerador);
            denominadores.push(denominador);
            wIndividuales.push(wIndividual)

        }

        const sumaNumerador = sumarArray(numeradores);
        const sumaDenominador = sumarArray(denominadores);


        respuesta['size'] = casos[muestreo][categoria]['sizeTotal']({cota, N:Nsuma, sumaNumerador, sumaDenominador })
        respuesta['wFactores'] = wIndividuales;

        return respuesta
    }

    const funcionW = function({asignacion,N,Ntotal,estratos,varianza,costo,sumaWTotal, sumaWTotalSinCosto}){
        switch(asignacion){
            case 'proporcional':
                return (N/Ntotal);
            case 'equitativa':
                return (1/estratos);
            case 'optima':
                if(costo===0){
                    return ((N*Math.sqrt(varianza)/sumaWTotalSinCosto))
                }else{
                    return (((N*Math.sqrt(varianza))/Math.sqrt(costo))/sumaWTotal)
                };
        }
    }

    const funcionSuma = function(array){
        let initialValue = 0;
        const resultado = array.reduce(
            (previousValue, currentValue) => Number(previousValue) + Number(currentValue),
            initialValue
        );
        return resultado
    }

    const calcularVarianza = function(array){
        const promedio = calcularPromedio(array);
        const resultados = []
        array.forEach(elemento => {
            resultados.push(Math.pow(elemento-promedio,2));
        });
        const sumaTotal = funcionSuma(resultados);
        return sumaTotal/(array.length-1)
    }

    const calcularPromedio = function(array){
        return funcionSuma(array)/array.length
    }

    const individualMAE = function({muestreo, type,varianza, N, n, p, q,suma,categoria,promedio, cota, estratos, cotaMuestra, costo}){
        let respuesta = {};
        console.log('params',N,n,suma,promedio,p)
        respuesta['estimacion'] = promedios({muestreo,type, suma,promedio, n,N,estratos,p,q});
        respuesta['varianza'] =  varianzaFormula({muestreo,type,varianza,N,n,p,q,estratos});
        respuesta['cota'] =  cotaFormula({muestreo,type,varianza,N,n,p,q,estratos});
        respuesta['margen'] = respuesta['cota']/respuesta['estimacion']*100
        respuesta['minimo'] = Number(respuesta['estimacion'])-Number(respuesta['cota']);
        respuesta['maximo'] = Number(respuesta['estimacion'])+Number(respuesta['cota']);
        
        return respuesta
    }


module.exports = {varianzaFormula,cotaFormula,promedios,funcionSuma,calcularPromedio,calcularVarianza,general,individualMAE}
