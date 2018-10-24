import qs from "qs";
const URL = 'http://192.168.1.136:3000';

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

exort function getLandscapes(){
    return RequestHandler(`${URL}/landscapes`, {
        method: 'POST,
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: qs.stringify({
            url: 'https://images.pexels.com/photos/371633/pexels-photo-371633.jpeg?auto=compress&cs=tinysrgb&h=350'
        })
    });
}