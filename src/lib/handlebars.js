const helpers = {};
const hb = require('handlebars');


hb.registerHelper('isDefined', function (element) {
    if(element.toString() !== 'NaN'){
        return element
    }
});

module.exports = helpers;