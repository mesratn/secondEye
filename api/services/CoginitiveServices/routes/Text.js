const request = require("request-promise");

/**
 * Microsoft - Text
 */

exports.recognizeText = async (imageBinary) => {
    const params = {
        'mode': 'Handwritten',
    };

    var _include_headers = (body, response, resolveWithFullResponse)  => {
        return {'headers': response.headers, 'data': body};
    }

    const requestOptions = {
        uri: process.env.VISION_API_URL + 'recognizeText',
        qs: params,
        body: imageBinary,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key' : process.env.VISION_API_KEY
        },
        transform: _include_headers 
    };

    var result = await request.post(requestOptions);

    return result;
}

exports.readText = async (response) => {
    const requestOptions = {
        uri: response['operation-location'],
        headers: {
            'Ocp-Apim-Subscription-Key' : process.env.VISION_API_KEY
        }
    };

    var result = await request.get(requestOptions);

    return JSON.parse(result);

}
