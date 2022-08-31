import React, { Component } from "react";
import styled from "styled-components";
import { ProductConsumer } from "../context";
import CartItems from "./CartItems";
import Title from "./Title";

export default class AddCart extends Component {
  render() {
    return (
      <div className="container">
        <Title name="Cart" />
        <span className="divider mt-20" />
        <ProductConsumer>
          {(value) => {
            const { cart, currency } = value;
            const quantity = cart
              .map((x) => x?.count)
              .reduce((a, b) => a + b, 0);

            let cartImg = cart.map((item) => item.gallery);

            if (cart.length > 0) {
              return (
                <>
                  <CartItems cart={cart} value={value} cartImg={cartImg} />

                  {/* Total Section */}

                  <TotalSection>
                    <div className="mb-10 mt-20">
                      <span className="totalText">Tax 21%:</span>{" "}
                      <strong>
                        {" "}
                        {currency.symbol} {value.cartTax}
                      </strong>
                    </div>
                    <div className="mb-10 ">
                      <span className="totalText">Quantity: </span>
                      <strong> {quantity}</strong>
                    </div>
                    <div className="mb-10 ">
                      <span className="totalText">
                        <strong>Total:</strong>
                      </span>
                      <strong>
                        {currency.symbol}
                        {parseFloat(value.cartTotal).toFixed(2)}
                      </strong>
                    </div>

                    <CartBtn>Order</CartBtn>
                  </TotalSection>
                </>
              );
            } else {
              return <h2>Your cart is empty</h2>;
            }
          }}
        </ProductConsumer>
      </div>
    );
  }
}

const TotalSection = styled.div`
  .totalText {
    display: inline-block;
    width: 75px;
  }
`;

const CartBtn = styled.button`
  width: 279px;
  height: 43px;
  color: white;
  cursor: pointer;
  margin-bottom: 20px;
  border: 0;
  font-size: 16px;
  margin-top: 10px;
  text-transform: uppercase;
  background-color: var(--mainGreen);
`;
