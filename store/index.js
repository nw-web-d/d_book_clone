export const state = () => ({
  cart: [],
  cartLength: 0
})

export const actions = {
  addProductToCart({ state, commit }, product) {
    const cartProduct = state.cart.find((prod) => prod._id === product._id)

    if (!cartProduct) {
      commit('pushProductToCart', product)
    } else {
      commit('incrementProductQty', cartProduct)
    }
    commit('incrementCartLength', product)
  }
}

export const mutations = {
  pushProductToCart(state, product) {
    product.quantity = 1
    state.cart.push(product)
  },

  incrementProductQty(state, product) {
    product.quantity++
    const indexOfProduct = state.cart.indexOf(product)
    state.cart.splice(indexOfProduct, 1, product)
  },

  incrementCartLength(state) {
    state.cartLength = 0
    if (state.cart.length > 0) {
      state.cart.map((product) => {
        state.cartLength += parseInt(product.quantity)
      })
    }
  },

  /**
   * 1.find the product in the store
   * 2.change the quantity of the product
   * 3.update length of the cart
   * 4.replace the old product with the update the product
   **/
  changeQty(state, { product, qty }) {
    const cartProduct = state.cart.find((prod) => prod._id === product._id)
    cartProduct.quantity = parseInt(qty)

    state.cartLength = 0
    if (state.cart.length > 0) {
      state.cart.map((product) => {
        state.cartLength += parseInt(product.quantity)
      })
    }

    const indexOfProduct = state.cart.indexOf(product)
    state.cart.splice(indexOfProduct, 1, product)
  },
  /**
   * 1.remove the product quantity from the cartLength
   * 2.get the index of the product that we want to delete
   * 4.remove that product by useing splice
   **/
  removeProduct(state, product) {
    state.cartLength -= parseInt(product.quantity)
    const indexOfProduct = state.cart.indexOf(product)
    state.cart.splice(indexOfProduct, 1)
  }
}

export const getters = {
  getCartLength(state) {
    return state.cartLength
  },
  getCart(state) {
    return state.cart
  },
  getTotalPrice(state) {
    let total = 0
    state.cart.map((product) => {
      total += product.price * product.quantity
    })
    return total
  }
}
