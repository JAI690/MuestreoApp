module.exports = {
    mediaPoblacional: function(datos){
    const initialValue = 0;
    const suma = datos.reduce(
        (previousValue, currentValue) => Number(previousValue) + Number(currentValue),
        initialValue
    );
    const respuesta = suma/datos.length

    return respuesta
    },

    varianzaPoblacional: function(){

    },

    cotaPoblacional: function(varianza){
        const respuesta = 2*Math.sqrt(varianza);
        return respuesta
    }
    
}

