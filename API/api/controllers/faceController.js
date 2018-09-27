'use strict';

var face_api_key = "a81e3ac9d45b4406a68e4d3cd4898c6b";
var face_api_url = "https://westeurope.api.cognitive.microsoft.com/face/v1.0/";
var request = require('request');

exports.test_faces = function(req, res) {
  res.json({ message: 'Test face OK' });
};


//Recoit l'url de l'image, renvoit un json avec la phrase
exports.get_faces = function(req, res) {
  // Request parameters
  var params = {
    "returnFaceId": "true",
    "returnFaceLandmarks": "false",
    "returnFaceAttributes":
    "age,gender,smile,glasses"
  };
  var sourceImageUrl = req.body.url;

  //Request options
  const options = {
    uri: face_api_url + '/detect',
    qs: params,
    body: '{"url": ' + '"' + sourceImageUrl + '"}',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key' : face_api_key
    }
  };

  // Perform the REST API call.
  request.post(options, (error, response, body) => {
    if (error) {
      res.send(error);
    }
    let data = JSON.parse(body);
    var faceCount = '"I detect '+data.length+' faces!"';
    var response = '{"global" :'+faceCount+', "faces":[';
    var i;
    for (i = 0; i < data.length; i++) {
      if (i == 0)
      var responseString = '{"message": ';
      else
      var responseString = ',{"message": ';
      if (data.length == 1)
      responseString += '"Here is what I detect in this face';
      else
      responseString += '"For the face number ' + (i+1);
      var gender = data[i].faceAttributes.gender;
      responseString += '. The gender is : '+gender;
      var age = data[i].faceAttributes.age;
      responseString += '. The age is estimated to : '+age+'."}';
      response += responseString;
    }
    response += ']}'
    response = JSON.parse(response);
    res.json(response);
  });
};

exports.get_emotions = function(req, res) {
  // Request parameters
  var params = {
    "returnFaceId": "true",
    "returnFaceLandmarks": "false",
    "returnFaceAttributes":
    "age,gender,smile,glasses,emotion"
  };
  var sourceImageUrl = req.body.url;

  //Request options
  const options = {
    uri: face_api_url + '/detect',
    qs: params,
    body: '{"url": ' + '"' + sourceImageUrl + '"}',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key' : face_api_key
    }
  };

  // Perform the REST API call.
  request.post(options, (error, response, body) => {
    if (error) {
      res.send(error);
    }
    let data = JSON.parse(body);
    var faceCount = '"I detect '+data.length+' faces!"';
    var response = '{"global" :'+faceCount+', "faces":[';
    var i;
    for (i = 0; i < data.length; i++) {
      if (i == 0)
      var responseString = '{"message": ';
      else
      var responseString = ',{"message": ';
      if (data.length == 1)
      responseString += '"Here is what I detect in this face';
      else
      responseString += '"For the face number ' + (i+1);

      var emotion = data[i].faceAttributes.emotion;
      var rightEmotion = "";
      var biggestScore = 0;
      for (var key in emotion) {
        if(emotion[key] > biggestScore) {
          biggestScore = emotion[key];
          rightEmotion = key;
        }
      }
      responseString += '. The most shown emotion is ' + rightEmotion+'."}';

      response += responseString;
    }
    response += ']}'
    response = JSON.parse(response);
    res.json(response);
  });
};

exports.add_face = function(req, res) {
  var url = req.body.url;
  var name = req.body.name;
  const option = {
    uri: face_api_url + '/persongroups/group1/persons',
    body:"{'name': '"+name+"'}",
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key' : face_api_key
    }
  };

  request.post(option, (error, response, body)=>{
    if(error){
      res.send(error);
    }
    let data = JSON.parse(body);
    var personId = data.personId;
    console.log("person id");
    console.log(personId);
    var params = {
      "personId": personId
    };
    console.log(url);
    const options = {
      uri: face_api_url + '/persongroups/group1/persons/{personId}/persistedFaces?',
      qs : params,
      body: "{'url': '"+url+"'}",
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key' : face_api_key
      }
    };
    request.post(options, (error, response, body)=>{
      if(error){
        res.send(error);
      }

      let data2 = JSON.parse(body);
      var persistedId = data2.persistedFaceId;
      console.log("persisted id");
      console.log(persistedId);
      res.json(persistedId);
    });
  });


};

exports.get_added_face = function(req, res) {
  res.json({ message: 'Test face OK' });
  const options = {
    uri: face_api_url + '/identify?',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key' : face_api_key
    }
  };
  request.get(options, (error, response, body)=>{
    if(error){
      res.send(error);
    }
    console.log(response.statusCode);
  });
};
;
