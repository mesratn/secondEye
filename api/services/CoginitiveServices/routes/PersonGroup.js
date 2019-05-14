const request = require("request-promise");

/**
 * Microsoft - PersonGroup
 */

exports.create = async (nameToRegister) => {
    const requestOptions = {
        uri: process.env.FACE_API_URL + '/persongroups/group1/persons',
        body: JSON.stringify({ name: nameToRegister }),
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.FACE_API_KEY
        }
    };

    var result = await request.post(requestOptions);

    return JSON.parse(result);
}

exports.addFace = async (imageBinary, params = {}) => {
    const requestOptions = {
        uri: process.env.FACE_API_URL + '/persongroups/group1/persons/${personId}/persistedFaces?',
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

exports.train = async () => {
    const requestOptions = {
        uri: process.env.FACE_API_URL + '/persongroups/group1/train',
        body: '',
        headers: {
            'Ocp-Apim-Subscription-Key': process.env.FACE_API_KEY
        }
    };

    var result = await request.post(requestOptions);

    return true;
}

exports.identify = async (personGroupId = "", faceIds = []) => {
    const requestOptions = {
        uri: process.env.FACE_API_URL + '/identify',
        body: JSON.stringify({
            personGroupId,
            faceIds
        }),
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.FACE_API_KEY
        }
    };

    var result = await request.post(requestOptions);

    return JSON.parse(result);
}
