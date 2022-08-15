import React, { Component } from "react";

import { Query } from "@apollo/react-components";
import { GET_PRODUCT } from "../gql/queries";
import styled from "styled-components";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ProductConsumer } from "../context";

export default class Details extends Component {
  state = {
    selectedImg: "",
    selectedAtrr: "",
  };

  componentDidMount() {
    this.setImg();
  }

  setImg = () => {
    const client = new ApolloClient({
      uri: "http://localhost:4000",
      cache: new InMemoryCache(),
    });

    client
      .query({
        query: GET_PRODUCT,
        variables: { id: this.props.match.params.id },
      })
      .then((res) => {
        this.setState(() => {
          return {
            selectedImg: res.data.product.gallery[0],
            selectedAtrr: res.data?.product?.attributes[0]?.items[0]?.value,
          };
        });
      });
  };

  render() {
    const productId = this.props.match.params.id;
    console.log("sel", this.state.selectedAtrr);
    return (
      <Query query={GET_PRODUCT} variables={{ id: productId }}>
        {({ loading, error, data }) => {
          console.log("data", data);
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          const {
            id,
            name,
            brand,
            description,
            gallery,
            attributes,
            prices,
            inStock,
          } = data?.product;

          return (
            <div className="container">
              <DetailSection>
                <div className="img-container">
                  <div className="vertical-pictures">
                    {gallery.map((item, index) => (
                      <span key={index}>
                        <img
                          key={index}
                          src={item}
                          onClick={() =>
                            this.setState(() => {
                              return { selectedImg: item };
                            })
                          }
                          className="img-box"
                          alt="gallery-img"
                        />
                      </span>
                    ))}
                  </div>

                  <span className="selected-img-container">
                    <img
                      className="selectedImg"
                      src={this.state.selectedImg}
                      alt="selectedimg"
                    />
                  </span>
                </div>

                <ProductConsumer>
                  {(value) => {
                    const inCart = value.cart;

                    const findCart = inCart.find(
                      (cartValue) => cartValue.id === id
                    );
                    console.log("findCart", findCart);
                    const currencies = value.currency;
                    const price = prices.filter(
                      (x) => x.currency.label === currencies.label
                    );

                    const cartPrice = {
                      symbol: currencies.symbol,
                      amount: price[0]?.amount,
                    };

                    return (
                      <div className="product-details">
                        <h2>{name}</h2>
                        <span>{brand}</span>

                        {attributes[0]?.name === "Color" ? (
                          <>
                            <span className="mt-40">
                              <strong>{attributes[0]?.name + ":"}</strong>
                            </span>
                            <div className="box-wrapper">
                              {attributes[0]?.items.map((attr) => {
                                return (
                                  <button
                                    className="color-box"
                                    value={attr.value}
                                    onClick={(e) =>
                                      this.setState(() => {
                                        return { selectedAtrr: e.target.value };
                                      })
                                    }
                                    style={{
                                      backgroundColor: attr.value,
                                    }}
                                  ></button>
                                );
                              })}
                            </div>
                          </>
                        ) : (
                          attributes[0] && (
                            <>
                              <span className="mt-40">
                                <strong>{attributes[0]?.name + ":"}</strong>
                              </span>
                              <div className="box-wrapper">
                                {attributes[0]?.items.map((attr) => {
                                  return (
                                    <button
                                      className="attribute-box"
                                      value={attr.value}
                                      onClick={(e) =>
                                        this.setState(() => {
                                          return {
                                            selectedAtrr: e.target.value,
                                          };
                                        })
                                      }
                                      style={{
                                        backgroundColor:
                                          this.state.selectedAtrr === attr.value
                                            ? "#1D1F22"
                                            : "white",
                                        color:
                                          this.state.selectedAtrr === attr.value
                                            ? "white"
                                            : "black",
                                      }}
                                    >
                                      {attr.value}
                                    </button>
                                  );
                                })}
                              </div>
                            </>
                          )
                        )}

                        <span className="mt-40">
                          <strong>{prices[0]?.__typename}:</strong>
                        </span>
                        <span className="mt-10" style={{ fontSize: 24 }}>
                          <strong>
                            {currencies.symbol} {price[0]?.amount}{" "}
                          </strong>
                        </span>

                        <button
                          className="cart-btn"
                          disabled={
                            !inStock ||
                            findCart?.selectedAtrr === this.state.selectedAtrr
                          }
                          onClick={() => {
                            value.addToCart(
                              id,
                              "",
                              data?.product,
                              this.state.selectedAtrr,
                              cartPrice
                            );
                          }}
                        >
                          {!inStock ? "Out of stock" : "Add to cart"}
                        </button>

                        <div
                          className="mt-40"
                          dangerouslySetInnerHTML={{
                            __html: description,
                          }}
                        ></div>
                      </div>
                    );
                  }}
                </ProductConsumer>
              </DetailSection>
            </div>
          );
        }}
      </Query>
    );
  }
}

const DetailSection = styled.div`
  display: flex;

  .img-container {
    flex: 3;
    display: flex;
  }
  .selected-img-container {
    width: 100%;
    justify-content: center;
  }
  .selectedImg {
    width: 100%;
    margin-left: 20px;
    height: 511px;
    object-fit: cover;
    cursor: pointer;
  }

  .vertical-pictures {
    display: flex;
    flex-direction: column;
    width: 130px;
    height: 400px;
    overflow: auto;
    align-items: center;
  }

  .img-box {
    width: 90px;
    height: 80px;
    cursor: pointer;
    object-fit: cover;
    margin-bottom: 20px;
  }

  .product-details {
    display: flex;
    flex: 2;
    margin-left: 40px;
    flex-direction: column;
    font-size: 30px;
  }

  span {
    text-transform: uppercase;
  }

  .box-wrapper {
    display: flex;
    margin-top: 10px;
  }

  .attribute-box {
    width: 63px;
    height: 45px;
    justify-content: center;
    margin-left: 5px;
    cursor: pointer;
    font-size: 16px;
    border: 2px solid var(--mainDark);
  }
  .color-box {
    width: 32px;
    height: 32px;
    justify-content: center;
    margin-left: 5px;
    cursor: pointer;
    font-size: 16px;
    border: 0;
  }

  .cart-btn {
    width: 292px;
    height: 52px;
    color: white;
    cursor: pointer;
    border: 0;
    font-size: 16px;
    margin-top: 30px;
    text-transform: uppercase;
    background-color: var(--mainGreen);
  }
`;
