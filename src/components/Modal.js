import React, { Component } from "react";
import styled from "styled-components";
import { ProductConsumer } from "../context";
import { Link } from "react-router-dom";
export default class Modal extends Component {
  constructor(props) {
    super(props);

    // Set initial state
    this.state = {
      cartImg: { img: "", id: "" },
      count: 0,
      prdId: 0,
      currentIndex: 0,
    };

    // Binding this keyword

    this.goToPrevSlide = this.goToPrevSlide.bind(this);
    this.goToNextSlide = this.goToNextSlide.bind(this);
  }

  goToPrevSlide() {
    const { currentIndex } = this.state;
    const newPointer = currentIndex - 1;
    this.setState({ currentIndex: newPointer });
  }

  goToNextSlide() {
    const { currentIndex } = this.state;
    const newPointer = currentIndex + 1;
    this.setState({ currentIndex: newPointer });
  }

  render() {
    return (
      <ProductConsumer>
        {(value) => {
          const { modalOpen, closeModal } = value;
          const { cart } = value;

          if (!modalOpen) {
            return null;
          } else {
            return (
              <ModalContainer
                onClick={() => {
                  closeModal();
                  document.body.style.overflow = "unset";
                }}
              >
                <div
                  className="container"
                  onClick={(e) => {
                    // do not close modal if anything inside modal content is clicked
                    e.stopPropagation();
                  }}
                >
                  {cart.length !== 0 ? (
                    <div className="modal" id="modal">
                      <span>
                        <strong>My Bag</strong>, {cart.length} items
                      </span>
                      {cart.map((item) => (
                        <div className="row mt-20">
                          <span className="cart-headings mt-20">
                            <p>{item.name}</p>
                            <p>{item.brand}</p>
                            <h4>${parseFloat(item.total).toFixed(2)}</h4>
                            <span className="">
                              <strong>
                                <small>{item?.attributes[0]?.name}</small>
                              </strong>
                            </span>
                            <div className="btn-container">
                              {item?.attributes?.length === 0 ? (
                                ""
                              ) : (
                                <>
                                  {item.attributes[0].name === "Color" ? (
                                    <ColorBtn
                                      disabled
                                      selectedAtrr={item.selectedAtrr}
                                    ></ColorBtn>
                                  ) : (
                                    <div className="btn-container">
                                      {item.attributes[0].items.map((attr) => (
                                        <AttrBtn
                                          disabled
                                          selectedAtrr={
                                            item.selectedAtrr === attr.value
                                          }
                                          value={item.selectedAtrr}
                                        >
                                          {attr.value}
                                        </AttrBtn>
                                      ))}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </span>

                          <span>
                            <div className="cartItemValues mt-10 ml-10">
                              <span className="change-values mt-10">
                                <button
                                  className="qty-adjust-btn"
                                  onClick={() => {
                                    return value.increment(item.id);
                                  }}
                                >
                                  +
                                </button>
                                <span className="inputValue">
                                  <input
                                    className="value-text"
                                    value={item.count}
                                  />
                                </span>
                                <button
                                  className="qty-adjust-btn"
                                  onClick={() => {
                                    return value.decrement(item.id);
                                  }}
                                >
                                  -
                                </button>
                              </span>

                              <span className="img-box mt-10">
                                <img
                                  className="img-container"
                                  src={item.gallery[0]}
                                  alt="cart-img"
                                />
                              </span>
                            </div>
                          </span>
                        </div>
                      ))}

                      <div className="modalTotal">
                        <h4>Total</h4>
                        <h4>${parseFloat(value.cartTotal).toFixed(2)} </h4>
                      </div>
                      <span className="footerBtn">
                        <Link to="/cart">
                          <BagBtn
                            onClick={() => {
                              closeModal();
                              document.body.style.overflow = "unset";
                            }}
                          >
                            view bag
                          </BagBtn>
                        </Link>
                        <CartBtn>checkout</CartBtn>
                      </span>
                    </div>
                  ) : (
                    <div className="modal" id="modal">
                      <h2>Your cart is empty</h2>
                    </div>
                  )}
                </div>
              </ModalContainer>
            );
          }
        }}
      </ProductConsumer>
    );
  }
}

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  #modal {
    background: var(--mainWhite);
  }

  .modalTotal {
    display: flex;
    justify-content: space-between;
  }
  .modal {
    overflow: scroll;
    display: sticky;
    font-size: 16px;
    flex-direction: column;
    padding: 32px 16px;
    position: fixed;
    width: 325px;
    height: 400px;
    left: 980px;
    top: 78px;
  }

  .footerBtn {
    width: 100%;
    display: flex;
  }

  .cart-headings {
    width: 150px;
    font-size: 16px;
  }
  .cart-headings p {
    margin-bottom: 5px;
  }

  .btn-container {
    display: flex;
    width: 100px;
    justify-content: space-around;
  }
  .attribute-box {
    width: 24px;
    height: 24px;
    text-align: center;
    cursor: pointer;
    margin-top: 5px;
    font-size: 12px;
    background-color: white;
    border: 1px solid var(--mainDark);
  }

  .cartItemValues {
    display: flex;
  }

  .change-values {
    height: 190px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .qty-adjust-btn {
    width: 24px;
    height: 24px;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    background-color: white;
    border: 1px solid var(--mainDark);
  }

  .inputValue {
    width: 50px;
    display: flex;
    justify-content: center;
  }

  .value-text {
    width: 45px;
    border: 0;
    font-size: 16px;
  }

  .img-container {
    width: 121px;
    height: 190px;
    object-fit: contain;
  }
`;

const CartBtn = styled.button`
  width: 150px;
  height: 43px;
  color: white;
  cursor: pointer;
  border: 0;
  font-size: 14px;
  margin-left: 25px;
  text-transform: uppercase;
  background-color: var(--mainGreen);
`;

const BagBtn = styled.button`
  width: 150px;
  height: 43px;
  color: var(--mainDark);
  cursor: pointer;
  font-size: 14px;
  text-transform: uppercase;
  background-color: white;
  border: 1px solid var(--mainDark);
`;

const AttrBtn = styled.button`
  width: 24px;
  height: 24px;
  text-align: center;
  cursor: pointer;
  margin-top: 5px;
  font-size: 12px;
  margin-top: 5px;
  margin-left: 5px;
  color: ${(props) => (props.selectedAtrr ? "white" : "black")};
  background-color: ${(props) => (props.selectedAtrr ? "black" : "white")};
  border: 2px solid var(--mainDark);
`;

const ColorBtn = styled.button`
  width: 24px;
  height: 24px;
  justify-content: center;
  cursor: pointer;
  background-color: ${(props) => props.selectedAtrr};
  border: 0;
`;
