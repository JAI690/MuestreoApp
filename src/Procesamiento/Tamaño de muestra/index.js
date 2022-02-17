module.exports = {
    tamanoMuestra: function(tipo,N,varianza){
        const D = calcularD(tipo,N,varianza);
        const respuesta = (N*varianza)/(((N-1)*D)+varianza);
    return respuesta
    },
    
}

const calcularD = function(tipo,N,varianza){
    const cota = calcularCota(varianza)
    switch (tipo) {
        case 'mediaPoblacional':
            return((cota^2)/4);

        case 'totalPoblacional':
            return((cota^2)/4);

        case 'proporcionPoblacional':
            return((cota^2)/(4*(N^2)));

        default:
            return(0);
    }
}

const calcularCota = varianza => 2*Math.sqrt(varianza);