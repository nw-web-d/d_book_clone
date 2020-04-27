export const state = () => ({
  cart: [],
  cartLength: 0
})

export const actions = {
  addProductToCart({ state, commit }, product) {
    console.log(product)
    console.log(state.cart)
    const cartProduct = state.cart.find((prod) => prod.id === product.id)
    // const cartProduct = state.cart.find(prod => prod._id === product._id);

    if (!cartProduct) {
      commit('pushProductToCart', product)
    } else {
      commit('incrementProductQty', product)
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
        state.cartLength += product.quantity
      })
    }
  }
}

export const getters = {
  getCartLength(state) {
    return state.cartLength
  },
  getCart(state) {
    return state.cart
  }
}
