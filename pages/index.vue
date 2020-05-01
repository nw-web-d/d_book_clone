<template>
  <main class="listingPage">
    <div class="container-fluid">
      <div class="row">
        <div class="col-xl-2 col-lg-3 md-4 col-sm-4">
          <!-- Sidebar -->
          <ul>
            <li>
              バグはこちらにお願いします
              <a href="https://github.com/nw-web-d/d_book_clone/issues"
                >https://github.com/nw-web-d/d_book_clone/issues</a
              >
            </li>
            <hr />
            <li>
              <h4><nuxt-link to="/admin">管理画面</nuxt-link></h4>
            </li>
            <li>
              <h3><nuxt-link to="/auth/login">Login</nuxt-link></h3>
            </li>
          </ul>
        </div>

        <!-- Main Contents -->
        <div class="col-xl-10 col-lg-9 md-8 col-sm-8">
          <FeatureProduct />
          <Carousel :products="products" />

          <div class="col-12">
            <div class="btn-group btn-group-sm pull-right">
              <button
                id="list"
                class="btn btn-outline-dark"
                @click.prevent="changeDisplay(true)"
              >
                <i class="fa fa-list" aria-hidden="true"></i> List
              </button>
              <button
                id="grid"
                class="btn btn-outline-dark"
                @click.prevent="changeDisplay(false)"
              >
                <i class="fa fa-th" aria-hidden="true"></i> Grid
              </button>
            </div>
          </div>
          <div class="mainResults">
            <div v-if="displayList">
              <ul class="s-result-list">
                <ListProduct
                  v-for="product in products"
                  :key="product._id"
                  :product="product"
                />
              </ul>
            </div>
            <div v-else>
              <div class="row">
                <GridProduct
                  v-for="product in products"
                  :key="product._id"
                  :product="product"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import FeatureProduct from '~/components/FaetureProduct'
import Carousel from '~/components/common/Carousel'
import ListProduct from '~/components/ListProduct'
import GridProduct from '~/components/GridProduct'

export default {
  components: {
    FeatureProduct,
    ListProduct,
    GridProduct,
    Carousel
  },
  async asyncData({ $axios }) {
    let resProducts = []
    try {
      resProducts = await $axios.$get('/v2/product')
    } catch (err) {
      console.log(err)
    }
    return {
      products: resProducts.products
    }
  },
  data() {
    return {
      displayList: true
    }
  },
  methods: {
    changeDisplay(isList) {
      this.displayList = isList
    }
  }
}
</script>
