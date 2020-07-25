var multipart = require("parse-multipart");
var fs = require("fs");

function writeToFile(image) {
  return new Promise((resolve) => {
    var filename = Date.now().toString() + ".png";
    fs.writeFile(`./tmp/${filename}`, image, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
      imageUrl = "https://ajcazurefunc.azurewebsites.net/" + filename;
      resolve(imageUrl);
    });
  });
}

module.exports = function (context, request) {
  context.log("JavaScript HTTP trigger function processed a request.");
  // encode body to base64 string
  var bodyBuffer = Buffer.from(request.body);

  var boundary = multipart.getBoundary(request.headers["content-type"]);
  // parse the body
  var parts = multipart.Parse(bodyBuffer, boundary);
  writeToFile(parts[0].data).then((imageUrl) => {
    //  context.res = { body : { name : parts[0].filename, type: parts[0].type, data: parts[0].data.length}};
    context.res = {
      status: 200 /* Defaults to 200 */,
      bbody: { "url" :imageUrl}
      //         body: req.body.
    };
    context.done();
  });
};
