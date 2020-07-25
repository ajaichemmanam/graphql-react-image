import React, { Component } from "react";

import logo from "../assets/loading.gif";
import "./imageScreen.css";
class LoadingScreen extends Component {
  render() {
    return (
      <div className="imgContainer">
        <div className="imgStyle">
          <img src={logo} alt="original loading..." />
        </div>
        <div className="imgStyle">
          <img src={logo} alt="converted loading..." />
        </div>
      </div>
    );
  }
}
export default LoadingScreen;
