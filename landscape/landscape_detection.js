function processImage() {
  // Replace <Subscription Key> with your valid subscription key.
  var subscriptionKey = "746202e68e074d51983b4e8e4a95ff7a";

  // NOTE: You must use the same region in your REST call as you used to
  // obtain your subscription keys. For example, if you obtained your
  // subscription keys from westus, replace "westcentralus" in the URL
  // below with "westus".
  //
  // Free trial subscription keys are generated in the westcentralus region.
  // If you use a free trial subscription key, you shouldn't need to change
  // this region.
  var uriBase = "https://westeurope.api.cognitive.microsoft.com/vision/v2.0/analyze";

  // Request parameters.
  var params = {
    'visualFeatures': 'Categories, Description, Color'
  };

  // Display the image.
  var sourceImageUrl = document.getElementById("inputImage").value;
  document.querySelector("#sourceImage").src = sourceImageUrl;

  // Perform the REST API call.
  $.ajax({
    url: uriBase + "?" + $.param(params),

    // Request headers.
    beforeSend: function(xhrObj) {
      xhrObj.setRequestHeader("Content-Type","application/json");
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
    },

    type: "POST",

    // Request body.
    data: '{"url": ' + '"' + sourceImageUrl + '"}',
  })

  .done(function(data) {

  // Show formatted JSON on webpage.
  //$("#responseTextArea").val(JSON.stringify(data, null, 2));
  $("#response").empty();
  console.dir(data);

  for (var i = 0; i < data["description"]["captions"].length; ++i) {
    $("#response").append("<p>" + Upper1st(data["description"]["captions"][i]["text"]) + "</p>");
  }
})

  .fail(function(jqXHR, textStatus, errorThrown) {
    // Display error message.
    var errorString = (errorThrown === "") ?
    "Error. " : errorThrown + " (" + jqXHR.status + "): ";

    errorString += (jqXHR.responseText === "") ?
    "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
    jQuery.parseJSON(jqXHR.responseText).message :
    jQuery.parseJSON(jqXHR.responseText).error.message;

    alert(errorString);
  });
};

function Upper1st(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
