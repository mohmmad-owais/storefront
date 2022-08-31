import React, { Component } from "react";
import Product from "./Product";
import Title from "./Title";
import styled from "styled-components";

import { GET_PRODUCTS } from "../gql/queries";
import { Query } from "@apollo/react-components";

export default class ProductList extends Component {
  render() {
    const routeName = this.props.location.pathname.substring(1);

    return (
      <>
        <Query
          query={GET_PRODUCTS}
          variables={{ input: { title: routeName || "all" } }}
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
