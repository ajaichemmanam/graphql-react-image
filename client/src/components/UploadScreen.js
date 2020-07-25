import React, { Component } from "react";
import { Redirect } from "react-router-dom";

const fetch = require("node-fetch");

class UploadScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      redirectPath: null
    };
  }

  onChangeHandler = (e) => {
    console.log(e.target.files[0]);
    this.setState({
      selectedFile: e.target.files[0],
      redirectPath: null
    });
  };

  onClickHandler = () => {
    const data = new FormData();
    data.append("file", this.state.selectedFile);

    // Upload image to any server and return url
    var uploadUrl =
      "https://akm-img-a-in.tosshub.com/indiatoday/images/story/201611/mick_647_111816105803.jpg";
    // Insert imageURL to DB
    fetch("https://hasuraimagedemo.herokuapp.com/v1/graphql", {
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
        variables: { uri: uploadUrl },
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((responseAsJson) => {
          var id = responseAsJson.data["insert_images"]["returning"][0]["id"]
          var redirectPath = '/?id=' + id.toString()
        console.log(id, redirectPath);
        this.setState({redirectPath:redirectPath})
        // return()
        // return <Redirect to={{redirectPath}}/>
        // this.props.history.push(redirectPath);
      });
  };

  render() {
    return (
      <div>
        <input type="file" name="file" onChange={this.onChangeHandler} />
        <button type="button" onClick={this.onClickHandler}>
          Upload
        </button>
        {this.state.redirectPath? (<Redirect to={this.state.redirectPath}/>) : null}
      </div>
    );
  }
}

export default UploadScreen;
