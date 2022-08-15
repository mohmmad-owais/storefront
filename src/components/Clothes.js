import React, { Component } from "react";
import ProductList from "./ProductList";

export default class Clothes extends Component {
  render() {
    const routeName = this.props.location.pathname.substring(1);

    return <ProductList routeName={routeName} />;
  }
}
