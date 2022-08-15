import React, { Component } from "react";
import Product from "./Product";
import Title from "./Title";
import styled from "styled-components";

import { GET_PRODUCTS } from "../gql/queries";
import { Query } from "@apollo/react-components";

export default class ProductList extends Component {
  state = {
    route: "all",
  };

  componentDidMount() {
    const routeFound = this.props.routeName;
    if (routeFound) {
      this.setState(() => {
        return { route: routeFound };
      });
    }
  }

  render() {
    return (
      <>
        <Query
          query={GET_PRODUCTS}
          variables={{ input: { title: this.state.route } }}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;
            const productData = data.category.products.map((data) => data);

            return (
              <ProductContainer className="container">
                <Title name={data.category.name} title="" />
                <Product options={this.props} data={productData} />
              </ProductContainer>
            );
          }}
        </Query>
      </>
    );
  }
}

const ProductContainer = styled.div`
  .productWrapper {
    display: flex;

    flex-direction: row;
  }
`;
