import React, { Component } from "react";
import styled from "styled-components";

export default class CartItems extends Component {
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
    const { cart } = this.props;
    const { value } = this.props;

    return (
      <MinContainer>
        {cart?.map((item) => (
          <>
            <CartItemSection className="mt-10">
              <div className="cartItem mt-10">
                <h2>{item.name}</h2>
                <span className="mt-10">{item.brand}</span>

                <p className="mt-10">
                  {value.currency.symbol}
                  {parseFloat(item.total).toFixed(2)}
                </p>

                {item?.attributes?.length === 0 ? (
                  ""
                ) : (
                  <>
                    <span className="mt-10">
                      <strong>
                        <small>{item.attributes[0].name}:</small>
                      </strong>
                    </span>
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
                            selectedAtrr={item.selectedAtrr === attr.value}
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
              <div className="cartItemValues">
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
                    <input className="value-text" value={item.count} />
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
                    src={
                      this.state.cartImg?.img === ""
                        ? item.gallery[0]
                        : item.id === this.state.cartImg?.id
                        ? this.state.cartImg?.img
                        : item.gallery[0]
                    }
                    alt="cart-img"
                  />
                  {item?.attributes?.length === 0 ? (
                    ""
                  ) : (
                    <>
                      <button
                        className="img-icons"
                        disabled={
                          item.gallery.length === this.state.currentIndex
                        }
                        onClick={() => {
                          this.goToNextSlide();

                          this.setState((prevState) => ({
                            cartImg: {
                              img: item.gallery[this.state.currentIndex],
                              id: item.id,
                            },
                          }));
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="20"
                          fill="currentColor"
                          class="bi bi-chevron-right"
                          viewBox="0 0 20 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                          />
                        </svg>
                      </button>
                      <button
                        className="img-icons"
                        style={{ marginRight: 30 }}
                        disabled={this.state.currentIndex === 0}
                        onClick={() => {
                          this.goToPrevSlide();
                          this.setState((prevState) => ({
                            cartImg: {
                              img: item.gallery[this.state.currentIndex],
                              id: item.id,
                            },
                          }));
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="20"
                          fill="currentColor"
                          class="bi bi-chevron-left"
                          viewBox="0 0 20 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                          />
                        </svg>
                      </button>
                    </>
                  )}
                </span>
              </div>
            </CartItemSection>
            <span className="divider mt-20" />
          </>
        ))}
      </MinContainer>
    );
  }
}

const MinContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const CartItemSection = styled.div`
  display: flex;
  justify-content: space-between;
  .img-box {
    position: relative;
  }
  p {
    font-size: 22px;
    font-weight: bolder;
  }
  .cartItem {
    display: flex;
    flex-direction: column;
  }

  .btn-container {
    display: flex;
    width: 210px;
    justify-content: space-around;
  }

  .cartItemValues {
    display: flex;
  }

  .change-values {
    height: 288px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .qty-adjust-btn {
    width: 45px;
    height: 45px;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    background-color: white;
    border: 1px solid var(--mainDark);
  }

  .inputValue {
    width: 70px;
    display: flex;
    justify-content: center;
  }

  .value-text {
    width: 45px;
    border: 0;
    font-size: 16px;
  }

  .img-container {
    width: 200px;
    height: 288px;
    object-fit: contain;
  }
  .img-icons {
    position: absolute;
    bottom: 20px;
    right: 20px;
    text-align: center;
    color: white;
    opacity: 0.8;
    background: var(--mainDark);
    border: none;
    font-size: 18px;
    cursor: pointer;
    width: 24px;
    height: 24px;
  }
`;

const AttrBtn = styled.button`
  width: 63px;
  height: 45px;
  justify-content: center;
  cursor: pointer;
  margin-top: 5px;
  margin-left: 5px;
  font-size: 14px;
  color: ${(props) => (props.selectedAtrr ? "white" : "black")};
  background-color: ${(props) => (props.selectedAtrr ? "black" : "white")};
  border: 2px solid var(--mainDark);
`;
const ColorBtn = styled.button`
  width: 32px;
  height: 32px;
  justify-content: center;
  cursor: pointer;
  background-color: ${(props) => props.selectedAtrr};
  border: 0;
`;
