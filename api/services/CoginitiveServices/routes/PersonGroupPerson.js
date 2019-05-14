const request = require("request-promise");

/**
 * Microsoft - PersonGroupPerson
 */

exports.getPersonName = async (personGroupId = "", personId = "") => {
    
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
