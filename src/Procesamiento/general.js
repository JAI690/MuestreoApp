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
    'MAS':{
        'media':{
            'varianza': ({varianza,N,n}) => {
                    return (varianza/n)*((N-n)/(N))
            },
            'promedio': ({suma,n}) => {
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
                respuesta = promedios({type, suma,promedio, totalElementos,N});
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

    const general = function({muestreo, type,varianza, N, n, p, q,suma,categoria,promedio, cota}){
        let respuesta = {};

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
        return respuesta
    }

    const varianzaFormula = function({muestreo,type, varianza=0, N, n, p=0, q=0 }){
        const respuesta = casos[muestreo][type]['varianza']({varianza,N,n,p,q});  
        return respuesta
    }

    const cotaFormula =  function({muestreo,type,varianza=0, N, n, p=0, q=0}){
        const varianzaCalculada = casos[muestreo][type]['varianza']({varianza,N,n,p,q});  
        console.log(varianzaCalculada)
        return 2*Math.sqrt(varianzaCalculada)
    }

    const promedios = function({muestreo, type, suma, n,N,promedio}){
        const respuesta = casos[muestreo][type]['promedio']({suma,n,N,promedio});

        return respuesta;
    }

    const size = function({muestreo,categoria,cota,N,p,q,varianza}){
        const respuesta = casos[muestreo][categoria]['size']({cota,N,p,q,varianza})
        return respuesta
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


module.exports = {varianzaFormula,cotaFormula,promedios,funcionSuma,calcularPromedio,calcularVarianza,general}
