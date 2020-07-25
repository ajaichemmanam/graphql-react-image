import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

const fetch = require("node-fetch");
const request = require("request");

function uploadFile(data) {
  return new Promise((resolve, reject) => {
    fetch(
      "https://ajcazurefunc.azurewebsites.net/api/uploadFile?code=ck3vwUNF97b/ulWwgGLY7a1st0sFzIhciap1nWWFOoKJ5Jz7mGLCmg==",
      {
        method: "POST",
        body: data,
      }
    )
      .then((response) => {
        // console.log(response.json());
        return response.json();
      })
      .then((responseAsJson) => {
        resolve(responseAsJson.url);
      });
  });
}

function insertDB(imageUrl) {
  return new Promise((resolve, reject) => {
    fetch("https://hasurademodeployment.herokuapp.com/v1/graphql", {
      method: "POST",
      body: JSON.stringify({
        query: `
      mutation insertimage_mutation ($uri: String) {
          insert_images(objects: [{image_uri: $uri}]) {
            returning {
              id
              image_uri
            }
          }
        }
          `,
        variables: { uri: imageUrl },
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((responseAsJson) => {
        var id = responseAsJson.data["insert_images"]["returning"][0]["id"];
        var redirectPath = "/?id=" + id.toString();
        resolve(redirectPath);
      });
  });
}
class UploadScreen extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };
  constructor(props, context) {
    super(props, context);

    this.state = {
      selectedFile: null,
      redirectPath: null,
    };
  }

  componentDidMount() {
    console.log(this.props.history);
  }

  onChangeHandler = (e) => {
    console.log(e.target.files[0]);
    this.setState({
      selectedFile: e.target.files[0],
      redirectPath: null,
    });
  };

  onClickHandler = () => {
    const data = new FormData();
    data.append("file", this.state.selectedFile);

    // Upload image to any server and return url
    uploadFile(data).then((imageUrl) => {
      console.log(imageUrl);
      // Insert imageURL to DB
      insertDB(imageUrl).then((redirectPath) => {
        console.log(redirectPath);
        // HACK: NEED TO FIX AUTO REDIRECT
        this.props.history.push(redirectPath);
        window.location.reload();
      });
    });
  };

  render() {
    return (
      <div>
        <input type="file" name="file" onChange={this.onChangeHandler} />
        <button type="button" onClick={this.onClickHandler}>
          Upload
        </button>
        {/* {this.state.redirectPath ? (
          <Redirect to={this.state.redirectPath} />
        ) : null} */}
      </div>
    );
  }
}

export default withRouter(UploadScreen);
