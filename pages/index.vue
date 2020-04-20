<template>
  <main class="listingPage">
    <h1><nuxt-link to="/test">テストページ</nuxt-link></h1>
    <div class="container-fluid">
      <div class="row">
        <div class="col-xl-2 col-lg-3 md-4 col-sm-4">
          <!-- Sidebar -->
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
                  :key="product.id"
                  :product="product"
                />
              </ul>
            </div>
            <div v-else>
              <div class="row">
                <GridProduct
                  v-for="product in products"
                  :key="product.id"
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
import { mapGetters } from 'vuex'
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
  data() {
    return {
      displayList: true
    }
  },
  computed: {
    ...mapGetters({
      products: 'products/products',
      isProductLoading: 'products/isProductLoading'
    })
  },
  methods: {
    changeDisplay(isList) {
      this.displayList = isList
    }
  }
}
</script>
