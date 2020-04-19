<template>
  <div>
    <Carousel :products="products" />

    <GridProduct
      v-for="product in products"
      :key="product.id"
      :product="product"
    />
  </div>
</template>
<script>
import Carousel from '~/components/common/Carousel'
import GridProduct from '~/components/GridProduct'
export default {
  components: { Carousel, GridProduct },
  async asyncData({ $axios }) {
    // 書籍情報
    let resProduct = {}
    try {
      resProduct = await $axios.$get('/v1/product/list')
    } catch (err) {
      console.log(err)
    }

    return {
      products: resProduct.book_info_list
    }
  }
}
</script>
