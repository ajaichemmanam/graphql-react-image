const jimp = require("jimp");
const fetch = require("node-fetch");

// Do Image Processing
function convertImage(image) {
  return jimp.read(image.image_uri).then(function (i) {
    return i.greyscale().writeAsync(`./tmp/${image.id}.png`);
  });
}

// Upload Image to some server and get url
function uploadToCloud(imageID) {
  return new Promise((resolve) => {
    // Upload file and return fileurl
    // For demo, Using azure function itself to serve static files
    imageUrl = "https://ajcazurefunc.azurewebsites.net/" + imageID + ".png";
    resolve(imageUrl);
  });
}

// Update the graphql db
function updateConvertedImage(image) {
  return new Promise((resolve) => {
    convertImage(image).then(function () {
      uploadToCloud(image.id).then(function (uploadUrl) {
        fetch("https://hasuraimagedemo.herokuapp.com/v1/graphql", {
          method: "POST",
          body: JSON.stringify({
            query: `
              mutation UpdateMutation($id: Int, $converted: String) {
    update_images(_set: {converted_image_uri: $converted}, where: {id: {_eq: $id}}) {
      returning {
        converted_image_uri
        id
      }
    }
  }
            `,
            variables: { id: image.id, converted: uploadUrl },
          }),
        }).then(function (response) {
          return response.json();
        });
      });
    });
    resolve();
  });
}

module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");
  try {
    const {
      event: { op, data },
      table,
    } = req.body;
    context.log(data);
    context.log(data.new.id);
    const image = data.new;

    updateConvertedImage(image).then(() => {
      const responseMessage = image
        ? "Image ID: " + image.id
        : "Image not found";

      context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage,
      };
    });
  } catch (e) {
    context.res = {
      status: 400,
      body: "Error Occured: " + e.toString(),
      // body: req.body.event
    };
    context.done();
  }
};
