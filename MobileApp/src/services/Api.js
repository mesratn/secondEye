import qs from "qs";
const URL = 'http://192.168.0.104:3000';

// OTHERS FUNCTIONS

function genFormData(data) {
    var formData = new FormData();
    for(let prop in data) {
        formData.append(prop, data[prop]);
    }

    return formData;
}

// FETCH FUNCTIONS

function RequestHandler(url, options = {}) {
    // options.credentials = 'include';
    return fetch(url, options).then((res) => errorHandler(res));
}

function errorHandler(response) {
    if (!response.ok)
        throw JSON.parse(response._bodyText) || response._bodyText;
    else
        return JSON.parse(response._bodyText);
}

export function getEmotions(image) {
    return RequestHandler(`${URL}/emotions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: qs.stringify({
            data: image
        })
    });
}

export function getLandscapes(image){
    return RequestHandler(`${URL}/landscape`, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: qs.stringify({
            data: image
        })
    });
}

export function getTexts(image){
    return RequestHandler(`${URL}/read`, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: qs.stringify({
            data: image
        })
    });
}

export function saveFace(image){
    return RequestHandler(`${URL}/face/add`, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: qs.stringify({
            data: image,
            name : 'Tom'
        })
    });
}

export function saveFace(image){
    return RequestHandler(`$(URL)/face/added`, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: qs.stringify({
            data: image
        })
    });
}