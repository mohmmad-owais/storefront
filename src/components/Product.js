import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { ProductConsumer } from "../context";

export default class Product extends Component {
  render() {
    const allProducts = this.props.data;

    const history = this.props.options.history;

    return (
      <Grid>
        <ProductConsumer>
          {(value) =>
            allProducts.map((item) => {
              const inCart = value.cart;
              const findCart = inCart.find(
                (cartValue) => cartValue.id === item.id
              );
              const currencies = value.currency;
              const prices = item.prices.filter(
                (x) => x.currency.label === currencies.label
              );
              const cartPrice = {
                symbol: currencies.symbol,
                amount: prices[0]?.amount,
              };

              return (
                <Item key={item.id}>
                  <ProductWrapper inStock={!item.inStock}>
                    <div className="card">
                      {!item.inStock && (
                        <span className="outStock">
                          <p>Out of stock</p>
                        </span>
                      )}
                      <div className="img-container ">
                        <Link to={`/details/${item.id}`}>
                          <img
                            src={item.gallery[0]}
                            alt=""
                            className="card-img-top"
                          />
                        </Link>
                        {!item.inStock ? (
                          ""
                        ) : (
                          <button
                            className="cart-btn"
                            onClick={() => {
                              if (item?.attributes.length !== 0) {
                                return history.push(`/details/${item.id}`);
                              } else {
                                return value.addToCart(
                                  item.id,
                                  allProducts,
                                  "",
                                  "",
                                  cartPrice
                                );
                              }
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="#fff"
                              className="bi bi-cart"
                              viewBox="0 0 16 16"
                            >
                              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <div className="textDetails">
                        <span className="mt-20 mb-10">{item.name}</span>
                        <p>
                          <strong>
                            {currencies.symbol} {prices[0]?.amount}
                          </strong>
                        </p>
                      </div>
                    </div>
                  </ProductWrapper>
                </Item>
              );
            })
          }
        </ProductConsumer>
      </Grid>
    );
  }
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 500px 500px;
  grid-gap: 25px;
  padding-bottom: 50px;
`;

const Item = styled.div`
  display: flex;
  justify-content: center;
`;

const ProductWrapper = styled.div`
  .textDetails {
    width: 100%;
    margin-left: 30px;
    display: flex;
    flex-direction: column;
  }

  .outStock {
    position: relative;
    text-align: center;
  }
  .outStock p {
    width: 200px;

    font-size: 24px;
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 500%);
    color: #8d8f9a;
    text-transform: uppercase;
  }

  .card {
    width: 386px;
    height: 444px;
    align-items: center;
    justify-content: flex-start;
    padding: 10px;
    display: flex;
    flex-direction: column;
    background-color: ${(props) => (props.inStock ? "white" : "white")};
    opacity: ${(props) => (props.inStock ? 0.6 : "")};
    border-color: transparent;
    transition: ${(props) => (props.inStock ? "" : "all 1s linear")};
    cursor: pointer;
  }
  &:hover {
    .card {
      border: ${(props) =>
        props.inStock ? "" : "0.04rem solid rgba(0, 0, 0, 0.2)"};
      box-shadow: ${(props) =>
        props.inStock ? "" : "2px 2px 5px 5px rgba(0, 0, 0, 0.2)"};
    }
  }

  .img-container {
    position: relative;
    overflow: hidden;
  }
  .card-img-top {
    width: 354px;
    height: 340px;
    object-fit: cover;
    transition: all 1s linear;
  }

  .cart-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0.2rem 0.4rem;
    background: var(--mainGreen);
    border: none;
    font-size: 1.4rem;
    border-radius: 2rem;
    transform: translate(100%, 100%);
    width: 52px;
    height: 52px;
    transition: all 1s ease-in-out;
  }
  .img-container:hover .card-img-top {
    transform: ${(props) => (props.inStock ? "" : "scale(1.2)")};
  }
  .card:hover .cart-btn {
    transform: translate(0, 0);
  }
  .cart-btn:hover {
    color: var(--mainBlue);
    cursor: pointer;
  }

  .productDetails {
    font-size: 18px;
    margin-top: 10px;
  }
`;
