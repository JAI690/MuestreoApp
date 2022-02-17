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
    'media':{
        'varianza':{
            'known': ({varianza}) => {
                return varianza
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
            'known': ({varianza}) => {
                return varianza
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
            'known': ({varianza}) => {
                return varianza
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

    const general = function({queCalcular,type,isKnown,varianza, N, n, p, q,suma,totalElementos,promedio, cota}){
        let respuesta = 'no especificada';

        switch (queCalcular){
            case 'promedio': 
                respuesta = promedios({type, suma: suma||promedio, totalElementos});
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
    const varianzaFormula = function({type, isKnown, varianza=0, N, n, p=0, q=0 }){
        const respuesta = casos[type]['varianza'][isKnown]({varianza,N,n,p,q});  
        return respuesta
    }

    const cotaFormula =  function({type, isKnown,varianza=0, N, n, p=0, q=0}){
        const varianzaCalculada = casos[type]['varianza'][isKnown]({varianza,N,n,p,q});  
        console.log(varianzaCalculada)
        return 2*Math.sqrt(varianzaCalculada)
    }

    const promedios = function({type, suma, totalElementos}){
        const respuesta = casos[type]['promedio']({suma,totalElementos});

        return respuesta;
    }

    const size = function({type,cota,N,p,q,varianza}){
        const respuesta = casos[type]['size']({cota,N,p,q,varianza})

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
            resultados.push(Math.abs(elemento-promedio));
        });
        const sumaTotal = funcionSuma(resultados);
        return sumaTotal/array.length
    }

    const calcularPromedio = function(array){
        return funcionSuma(array)/array.length
    }


module.exports = {varianzaFormula,cotaFormula,promedios,funcionSuma,calcularPromedio,calcularVarianza,general}
