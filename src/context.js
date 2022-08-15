import React, { Component } from "react";

const ProductContext = React.createContext();

class ProductProvider extends Component {
  state = {
    products: [],
    cart: [],
    modalOpen: false,
    cartSubTotal: 0,
    cartTax: 0,
    cartTotal: 0,
    currency: { label: "USD", symbol: "$" },
  };

  setCurrency = (currencies) => {
    this.setState(() => {
      return { currency: currencies };
    });
  };

  addToCart = (id, allProducts, detailPrd, selectedAtrr, cartPrice) => {
    const price = cartPrice;

    if (!allProducts) {
      const product = detailPrd;

      const newObj = Object.assign(
        {
          inCart: true,
          count: 1,
          total: price.amount,
          symbol: price.symbol,
          selectedAtrr: selectedAtrr,
        },
        product
      );
      this.setState(
        () => {
          return { cart: [...this.state.cart, newObj] };
        },
        () => {
          this.addTotals();
        }
      );
    } else {
      const selProduct = allProducts.find((item) => item.id === id);
      const product = selProduct;

      const newObj = Object.assign(
        {
          inCart: true,
          count: 1,
          total: price.amount,
          symbol: price.symbol,
        },
        product
      );
      this.setState(
        () => {
          return { cart: [...this.state.cart, newObj] };
        },
        () => {
          this.addTotals();
        }
      );
    }
  };
  openModal = () => {
    this.setState(() => {
      return { modalProduct: this.state.cart, modalOpen: true };
    });
  };

  closeModal = () => {
    this.setState(() => {
      return { modalOpen: false };
    });
  };

  increment = (id) => {
    let tempCart = [...this.state.cart];
    const selectedProduct = tempCart.find((item) => item.id === id);
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];
    product.count = product.count + 1;
    product.total = product.count * product.prices[0].amount;

    this.setState(
      () => {
        return { cart: [...tempCart] };
      },
      () => {
        this.addTotals();
      }
    );
  };

  decrement = (id) => {
    let tempCart = [...this.state.cart];
    const selectedProduct = tempCart.find((item) => item.id === id);
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];

    product.count = product.count - 1;
    if (product.count === 0) {
      this.removeItem(id);
    } else {
      product.total = product.count * product.prices[0].amount;
      this.setState(
        () => {
          return { cart: [...tempCart] };
        },
        () => {
          this.addTotals();
        }
      );
    }
  };

  removeItem = (id) => {
    let tempCart = [...this.state.cart];

    tempCart = tempCart.filter((item) => item.id !== id);

    let removedProduct = tempCart;
    removedProduct.inCart = false;
    removedProduct.count = 0;
    removedProduct.total = 0;

    this.setState(
      () => {
        return {
          cart: [...tempCart],
        };
      },
      () => {
        this.addTotals();
      }
    );
  };

  // clearCart = () => {
  //   this.setState(
  //     () => {
  //       return { cart: [] };
  //     },
  //     () => {
  //
  //       this.addTotals();
  //     }
  //   );
  // };

  addTotals = () => {
    let subTotal = 0;

    this.state.cart.map((item) => (subTotal += item.total));
    const tempTax = subTotal * 0.21;
    const tax = parseFloat(tempTax.toFixed(2));
    const total = subTotal + tax;
    this.setState(() => {
      return {
        cartSubTotal: subTotal,
        cartTax: tax,
        cartTotal: total,
      };
    });
  };

  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          handleDetail: this.handleDetail,
          addToCart: this.addToCart,
          openModal: this.openModal,
          closeModal: this.closeModal,
          increment: this.increment,
          decrement: this.decrement,
          removeItem: this.removeItem,
          clearCart: this.clearCart,
          setCurrency: this.setCurrency,
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };
