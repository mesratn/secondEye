const request = require("request-promise");

/**
 * Microsoft - Face
 */

exports.Face = {};

exports.Face.detect = async (imageBinary, params = {}) => {
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

/**
 * Microsoft - PersonGroup
 */

exports.PersonGroup = {};

exports.PersonGroup.create = async (nameToRegister) => {
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

exports.PersonGroup.addFace = async (imageBinary, params = {}) => {
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

exports.PersonGroup.train = async () => {
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

exports.PersonGroup.identify = async (personGroupId = "", faceIds = []) => {
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

/**
 * Microsoft - PersonGroupPerson
 */

exports.PersonGroupPerson = {};

exports.PersonGroupPerson.getPersonName = async (personGroupId = "", personId = "") => {
    
    const requestOptions = {
        uri: process.env.FACE_API_URL + `persongroups/${personGroupId}/persons/${personId}`,
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.FACE_API_KEY
        }
    };

    var result = await request.get(requestOptions);

    return JSON.parse(result);
}

/**
 * Microsoft - Landscape
 */

exports.Landscape = {};

exports.Landscape.getLandscape = async (imageBinary) => {
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

    var result = await request.get(requestOptions);

    return JSON.parse(result);
}