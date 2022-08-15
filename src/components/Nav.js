import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import logo from "../img/a-logo.png";
import { GET_PRODUCTS } from "../gql/queries";
import styled from "styled-components";
import { ButtonContainer } from "./Button";
import { ProductConsumer } from "../context";
import { ApolloClient, InMemoryCache } from "@apollo/client";

export default class Nav extends Component {
  constructor(props) {
    super(props);

    // Set initial state
    this.state = {
      isOpen: false,
      selectedOption: {},
      currencies: "",
    };

    // Binding this keyword
    this.toggling = this.toggling.bind(this);
    this.setCurrency = this.setCurrency.bind(this);
  }

  componentDidMount() {
    this.setCurrency();
  }
  toggling = () =>
    this.setState((prevState) => {
      return { isOpen: !this.state.isOpen };
    });

  setCurrency = () => {
    const client = new ApolloClient({
      uri: "http://localhost:4000",
      cache: new InMemoryCache(),
    });

    client
      .query({
        query: GET_PRODUCTS,
      })
      .then((res) => {
        this.setState(() => {
          const currencies = res.data.category.products[0].prices.map(
            (item) => item.currency
          );
          return { currencies: currencies };
        });
      });
  };

  render() {
    return (
      <NavBar className="">
        <ul className="nav-items">
          <li className="nav-links">
            <NavLink
              exact
              className={(isActive) =>
                isActive ? "active-link " : " nav-links"
              }
              to="/"
            >
              all
            </NavLink>
          </li>
          <li className="nav-links">
            <NavLink
              strict
              to="/clothes"
              className={(isActive) => (isActive ? "active-link" : "nav-links")}
            >
              clothes
            </NavLink>
          </li>
          <li className="nav-links">
            <NavLink
              to="/tech"
              className={(isActive) =>
                isActive ? " active-link" : "nav-links"
              }
            >
              tech
            </NavLink>
          </li>
        </ul>
        <NavLink to="/">
          <img src={logo} className="logo" alt="logo" />
        </NavLink>
        <ProductConsumer>
          {(value) => {
            return (
              <>
                <div>
                  <DropDownContainer>
                    <DropDownHeader onClick={this.toggling}>
                      {value.currency.symbol || "$"}
                      {this.state.isOpen ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          fill="currentColor"
                          class="bi bi-chevron-up ml-10"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          fill="currentColor"
                          class="bi bi-chevron-down ml-10"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                          />
                        </svg>
                      )}
                    </DropDownHeader>
                    {this.state.isOpen && (
                      <DropDownListContainer>
                        <DropDownList>
                          {this.state.currencies.map((option) => (
                            <ListItem
                              selected={option === value.currency}
                              onClick={() => {
                                value.setCurrency(option);
                                this.setState(() => {
                                  return { isOpen: false };
                                });
                              }}
                              key={Math.random()}
                            >
                              {option.symbol} {option.label}
                            </ListItem>
                          ))}
                        </DropDownList>
                      </DropDownListContainer>
                    )}
                  </DropDownContainer>

                  <ButtonContainer
                    onClick={() => {
                      value.openModal();
                      // Disables Background Scrolling whilst the Modal is open
                      if (typeof window != "undefined" && window.document) {
                        document.body.style.overflow = "hidden";
                      }
                    }}
                  >
                    <span className="cart">
                      <span className="cart-items">{value.cart.length}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="18"
                        fill="#43464E"
                        class="bi bi-cart"
                        viewBox="0 0 16 16"
                      >
                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                      </svg>
                    </span>
                  </ButtonContainer>
                </div>
              </>
            );
          }}
        </ProductConsumer>
      </NavBar>
    );
  }
}

const NavBar = styled.nav`
  display: flex;
  margin-top: 20px;
  justify-content: space-between;

  .cart-items {
    width: 18px;
    height: 18px;
    position: absolute;
    right: 35px;
    top: 22px;
    line-height: 1.5;
    color: #fff;
    font-size: 12px;
    background-color: var(--mainDark);
    border-radius: 50%;
  }

  .active-link {
    font-weight: bold;
    color: var(--mainGreen);
    text-decoration: none;
    padding-bottom: 5px;
    border-bottom: 2px solid var(--mainGreen);
  }

  .nav-links {
    color: var(--mainDark);
    font-size: 16px;
    display: block;

    text-transform: uppercase;
    text-decoration: none;
  }

  .nav-items {
    display: flex;
    justify-content: space-around;
    width: 250px;
    flex-direction: row;
  }

  .logo {
    width: 35px;
    height: 35px;
    margin-top: 5px;
    margin-right: 50px;
  }

  .cart {
    margin-right: 20px;
  }
  @media (max-width: 576px) {
    .navbar-nav {
      flex-direction: row !important;
    }
  }
`;

const DropDownContainer = styled("div")`
  width: 50px;
  margin: 0 auto;
  position: absolute;
  z-index: 1;
  top: 30px;
  right: 70px;
`;

const DropDownHeader = styled("div")`
  margin-bottom: 0.8em;
  font-size: 18px;
  color: #1d1f22;
  cursor: pointer;
  background: #ffffff;
`;

const DropDownListContainer = styled("div")`
  width: 100px;
`;

const DropDownList = styled("ul")`
  padding: 0;
  margin: 0;
  text-align: center;
  box-shadow: 0 2px 3px rgba(0, 0.1, 0.1, 0.15);
  background: #ffffff;
  border: 2px solid #e5e5e5;
  box-sizing: border-box;
  color: #1d1f22;
  font-size: 18px;
  font-weight: 500;
  &:first-child {
    padding-top: 0.8em;
  }
`;

const ListItem = styled("li")`
  list-style: none;
  padding: ${(props) => (props.selected ? "10px 0 10px 0" : "0")};
  cursor: pointer;
  background: ${(props) => (props.selected ? "#EEEEEE" : "")};
  margin-bottom: 0.8em;
`;
