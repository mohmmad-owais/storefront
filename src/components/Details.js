import React, { Component } from "react";
import * as DOMPurify from "dompurify";
import { GET_PRODUCT } from "../gql/queries";
import styled from "styled-components";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ProductConsumer } from "../context";

export default class Details extends Component {
  state = {
    data: "",
    selectedImg: "",
    selectedAtrr: {},
    loading: true,
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
            data: res.data.product,
            selectedImg: res.data.product.gallery[0],
            loading: false,
          };
        });
      });
  };

  render() {
    const {
      id,
      name,
      brand,
      description,
      gallery,
      attributes,
      prices,
      inStock,
    } = this.state.data;
    const cartId = Math.floor(Math.random() * 100 * new Date());
    let attributeArray = this.state.selectedAtrr;

    if (this.state.loading) return <p>Loading...</p>;
    return (
      <div>
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
                const currencies = value.currency;
                const price = prices.filter(
                  (x) => x.currency.label === currencies.label
                );

                const cartPrice = {
                  symbol: currencies.symbol,
                  amount: price[0]?.amount,
                };
                const cart = value.cart;

                const index = cart?.findIndex(
                  (item) => item?.selectedAtrr === attributeArray
                );

                return (
                  <div className="product-details">
                    <h2>{name}</h2>
                    <span>{brand}</span>
                    {attributes.map((atrribute) =>
                      atrribute.name === "Color" ? (
                        <>
                          <span className="mt-40">
                            <strong>{atrribute.name + ":"}</strong>
                          </span>
                          <div className="box-wrapper">
                            {atrribute.items.map((attr) => {
                              return (
                                <span
                                  className="colorboxitem"
                                  style={{
                                    border:
                                      attributeArray[atrribute.name] ===
                                      attr.value
                                        ? "1px solid #5ECE7B"
                                        : "0",
                                  }}
                                >
                                  <button
                                    className="color-box"
                                    value={attr.value}
                                    onClick={(e) => {
                                      return this.setState((prevState) => {
                                        return {
                                          selectedAtrr: {
                                            ...prevState.selectedAtrr,

                                            [atrribute.name]: e.target.value,
                                          },
                                        };
                                      });
                                    }}
                                    style={{
                                      backgroundColor: attr.value,
                                    }}
                                  ></button>
                                </span>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="mt-40">
                            <strong>{atrribute.name + ":"}</strong>
                          </span>
                          <div className="box-wrapper">
                            {atrribute.items.map((attr) => {
                              return (
                                <button
                                  className="attribute-box"
                                  value={attr.value}
                                  onClick={(e) => {
                                    return this.setState((prevState) => {
                                      return {
                                        selectedAtrr: {
                                          ...prevState.selectedAtrr,

                                          [atrribute.name]: e.target.value,
                                        },
                                      };
                                    });
                                  }}
                                  style={{
                                    backgroundColor:
                                      attributeArray[atrribute.name] ===
                                      attr.value
                                        ? "#1D1F22"
                                        : "white",
                                    color:
                                      attributeArray[atrribute.name] ===
                                      attr.value
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
                        Object.values(attributeArray).length !==
                          attributes.length
                      }
                      onClick={() => {
                        const findCart = cart.find((x) => x?.id === id);

                        if (cart.length !== 0) {
                          let cartObj = cart[index]?.selectedAtrr;

                          const match =
                            JSON.stringify(cartObj) ===
                            JSON.stringify(attributeArray);

                          if (match === true) {
                            return value.increment(cartId);
                          } else if (
                            findCart?.id === id &&
                            findCart.selectedAtrr === ""
                          ) {
                            return value.increment(findCart.cartId);
                          }

                          if (match === false) {
                            value.addToCart(
                              cartId,
                              id,
                              "",
                              this.state.data,
                              this.state.selectedAtrr,
                              cartPrice
                            );
                            console.log("match", match);
                          }
                        } else {
                          value.addToCart(
                            cartId,
                            id,
                            "",
                            this.state.data,
                            this.state.selectedAtrr,
                            cartPrice
                          );
                        }
                      }}
                    >
                      {!inStock ? "Out of stock" : "Add to cart"}
                    </button>
                    {Object.values(attributeArray).length !==
                      attributes.length && (
                      <p
                        style={{
                          marginTop: 10,
                          fontSize: 12,
                          color: "red",
                        }}
                      >
                        Please Select Attributes !
                      </p>
                    )}
                    <div
                      className="mt-20"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(description),
                      }}
                    />
                  </div>
                );
              }}
            </ProductConsumer>
          </DetailSection>
        </div>
      </div>
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

  .colorboxitem {
    border: 1px solid red;
    padding: 4px 2px 0px 2px;
    margin-right: 5px;
  }
`;
