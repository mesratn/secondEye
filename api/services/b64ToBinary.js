var atob = require('atob');

var BASE64_MARKER = ';base64,';

/**
 * @param {String} dataURI Base64 string 
 * @return {Array} Return image binary
 */
exports.convertDataURIToBinary = (dataURI) => {
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);

    var raw = atob(base64);
    var rawLength = raw.length;

    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }

    return array;
}