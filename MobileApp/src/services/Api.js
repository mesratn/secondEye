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

export function getText() {
  return RequestHandler(`${URL}/text`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: qs.stringify({
      url: 'http://d2jaiao3zdxbzm.cloudfront.net/wp-content/uploads/figure-65.png'
    })
  });
}
