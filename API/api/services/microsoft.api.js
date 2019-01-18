const request = require("request-promise");

exports.faces = async (imageBinary, params = {}) => {
    const options = {
        uri: process.env.FACE_API_URL + '/detect',
        qs: params,
        body: imageBinary,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': process.env.FACE_API_KEY
        }
    };

    var result = await request.post(options);

    return result;
}