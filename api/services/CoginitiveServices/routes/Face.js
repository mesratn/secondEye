const request = require("request-promise");

/**
 * Microsoft - Face
 */

exports.detect = async (imageBinary, params = {}) => {
    const requestOptions = {
        uri: process.env.FACE_API_URL + '/detect',
        qs: params,
        body: imageBinary,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': process.env.FACE_API_KEY
        }
    };

    var result = await request.post(requestOptions);

    return JSON.parse(result);
}
