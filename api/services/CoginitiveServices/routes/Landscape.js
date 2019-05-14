const request = require("request-promise");

/**
 * Microsoft - Landscape
 */

exports.getLandscape = async (imageBinary) => {
    const params = {
        'visualFeatures': 'Categories,Description,Color',
    };

    const requestOptions = {
        uri: process.env.VISION_API_URL + '/analyze',
        qs: params,
        body: imageBinary,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key' : process.env.VISION_API_KEY
        }
    };

    var result = await request.post(requestOptions);

    return JSON.parse(result);
}