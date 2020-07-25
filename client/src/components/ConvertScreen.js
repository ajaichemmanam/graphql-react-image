import React, {Component} from "react";
import { Subscription } from "react-apollo";
import gql from "graphql-tag";

import ErrorScreen from "./ErrorScreen.js";
import LoadingScreen from "./LoadingScreen.js";
import ImageScreen from "./ImageScreen.js";

class ConvertScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {id:""};
  }

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    this.setState({
      id:id
    })
  }

componentWillUnmount() {
  
  }
render() {
const id = this.state.id;
  return (
    <Subscription
      subscription={gql`
        subscription($id: Int) {
          images(where: { id: { _eq: $id } }) {
            id
            image_uri
            converted_image_uri
          }
        }
      `}
      variables={{ id }}
    >
      {({ data, error, loading }) => {
        // console.log(data, error, loading)
        if (error) {
          console.error(error);
          return <ErrorScreen />;
        }
        if (loading) return <LoadingScreen />;
        if (data.images.length === 0) {
          return "Invalid image ID";
        }
        if (!data.images[0].converted_image_uri) {
          return <LoadingScreen />;
        }
        return (
          <ImageScreen
            original={data.images[0].image_uri}
            converted={data.images[0].converted_image_uri}
          />
        );
      }}
    </Subscription>
  );
};
}
export default ConvertScreen;
