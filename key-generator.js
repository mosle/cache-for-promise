const queryString = require('query-string');
class KeyGenerator{
    static axios(options){
        return options.url + "-" + queryString.stringify(options.params);
    }
}
export default KeyGenerator;
