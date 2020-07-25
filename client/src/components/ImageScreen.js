import React, { Component } from "react";

import "./imageScreen.css";
class ImageScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="imgContainer">
        <div className="imgStyle">
          <img src={this.props.original} alt="Original" />
          <div>Original Image</div>
        </div>
        <div className="imgStyle">
          <img src={this.props.converted} alt="Processed" />
          <div>Converted Image</div>
        </div>
      </div>
    );
  }
}
export default ImageScreen;
