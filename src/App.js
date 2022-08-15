import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Nav from "./components/Nav";
import ProductList from "./components/ProductList";
import Details from "./components/Details";
import Defaults from "./components/Defaults";
import Modal from "./components/Modal";
import AddCart from "./components/AddCart";
import Clothes from "./components/Clothes";
import Tech from "./components/Tech";

export default class App extends Component {
  render() {
    return (
      <>
        <Router>
          <Nav />

          <Switch>
            <Route exact path="/" component={ProductList} />
            <Route path="/details/:id" component={Details} />
            <Route path="/cart" component={AddCart} />
            <Route path="/clothes" component={Clothes} />
            <Route path="/tech" component={Tech} />

            <Route component={Defaults} />
          </Switch>
          <Modal />
        </Router>
      </>
    );
  }
}
