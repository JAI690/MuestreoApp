const casos = {
    'media':{
        'known': (varianza,N,n) => {
            return (varianza/n)*((N-n)/(N-1))
        },
        'unknown': (varianza,N,n) => {
            return (varianza/n)*((N-n)/(N))
        },
        'promedio': (suma,totalElementos) => {
            return (suma/totalElementos)
        }
    },
    'total':{
        'known': (varianza,N,n) => {
            return (((N^2)*varianza)/n)*((N-n)/N-1)
        },
        'unknown': (varianza,N,n) => {
            return ((N*varianza)/n)*(N-n)
        },
        'total': (promedio,totalElementos) => {
            return (promedio*totalElementos)
        }
    },
    'proporcion':{
        'known': (p,N,n) => {
            return ((p*(1-p))/n)*((N-n)/(N-1))
        },
        'unknown': (p,q,N,n) => {
            return ((p*q)/n)*((N-n)/N)
        },
        'promedio': (suma,totalElementos) => {
            return (suma/totalElementos)
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


    const varianza = function(type, isKnown, a,b,c,d=0){
        const respuesta = casos[type][isKnown](a,b,c,d);  
        return respuesta
    }

    const cota =  function(type, isKnown,a,b,c,d=0){
        const varianzaCalculada = Number(varianza(type, isKnown, a,b,c,d))
        return 2*Math.sqrt(varianzaCalculada)
    }

    const promedios = function(type, isKnown, suma, totalElementos){
        const respuesta = casos[type][isKnown](suma,totalElementos);
        return respuesta;
    }

    const suma = function(array){
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
        const sumaTotal = suma(resultados);
        return sumaTotal/array.length
    }

    const calcularPromedio = function(array){
        return suma(array)/array.length
    }


module.exports = {varianza,cota,promedios,suma,calcularPromedio,calcularVarianza}
