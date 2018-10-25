import qs from "qs";
const URL = 'http://51.75.21.24:3000';

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

export function getEmotions() {
    return RequestHandler(`${URL}/emotions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: qs.stringify({
            url: 'https://pbs.twimg.com/profile_images/1007439915917938688/ZsxLbPmx_400x400.jpg'
        })
    });
}

export function getLandscapes(){
    return RequestHandler(`${URL}/landscape`, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: qs.stringify({
            url: 'https://images.pexels.com/photos/371633/pexels-photo-371633.jpeg?auto=compress&cs=tinysrgb&h=350'
        })
    });
}

export function getTexts(){
    return RequestHandler(`${URL}/read`, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: qs.stringify({
            url: 'https://i.stack.imgur.com/35SY5.png'
        })
    });
}

export function saveFace(){
    return RequestHandler(`${URL}/add`, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: qs.stringify({
            url :'https://pbs.twimg.com/profile_images/1007439915917938688/ZsxLbPmx_400x400.jpg',
            name : 'Tom'
        })
    });
}