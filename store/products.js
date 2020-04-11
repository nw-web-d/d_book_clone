export const state = () => ({
  isLoading: false,
  productList: [
    {
      id: 'MQ==',
      title: 'The Everything Store: Jeff Bezos and the Age of Amazon',
      thumbnail_url:
        'https://m.media-amazon.com/images/I/71ykofulttL._AC_UY218_ML3_.jpg',
      owner: {
        name: 'Jeff Bezos'
      },
      price: 999.9
    },
    {
      id: 'Mg==',
      title:
        'King Of The North Jon Snow House Of Stark Game-Of-Thrones Notebook: (110 Pages, Lined paper, 6 x 9 size, Soft Glossy Cover)',
      thumbnail_url:
        'https://m.media-amazon.com/images/I/51klGdI-fmL._AC_UY218_ML3_.jpg',
      owner: {
        name: 'Kristina Seifert'
      },
      price: 1199.9
    },
    {
      id: 'Mw==',
      title: 'Harry Potter Magical spell: A complete list of what they all do',
      owner: {
        name: 'J.K.Rowling'
      },
      photo: '/product-images/harry_potter.jpg',
      thumbnail_url:
        'https://m.media-amazon.com/images/I/41yBw4ZuxKL._AC_UY218_ML3_.jpg',
      price: 1800
    },
    {
      id: 'NA==',
      title: 'Chain-Saw-Man',
      thumbnail_url:
        'https://m.media-amazon.com/images/I/71AaizrszVL._AC_UL320_ML3_.jpg',
      owner: {
        name: 'Tatsuki'
      },
      price: 1000,
      quantity: 0
    },
    {
      id: 'NQ==',
      title: 'Steve Jobs (Litterature & Documents)',
      thumbnail_url:
        'https://m.media-amazon.com/images/I/71mmowWE5iL._AC_UY218_ML3_.jpg',
      owner: {
        name: 'Walter Isaacson'
      },
      price: 1000
    }
  ]
})
export const mutations = {
  UPDATE_PRODUCT_LIST(state, productList) {
    state.productList = productList
    state.isLoading = false
  }
}

export const getters = {
  products: (state) => {
    return state.productList
  },
  isProductLoading: (state) => {
    return state.isLoading
  }
}
