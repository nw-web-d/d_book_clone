<template>
  <div>
    <ul v-for="product in products" :key="product._id" :product="product">
      <li>{{ product._id }}</li>
    </ul>
    <Carousel :products="products" />

    <GridProduct
      v-for="product in products"
      :key="product._id"
      :product="product"
    />
  </div>
</template>
<script>
import GridProduct from '~/components/GridProduct'
export default {
  components: { GridProduct },
  async asyncData({ $axios }) {
    // 書籍情報
    let resProduct = {}
    try {
      resProduct = await $axios.$get(
        'https://bff-rest-for-express.web.app/v1/product/list'
      )
    } catch (err) {
      console.log(err)
    }
    return {
      products: resProduct.book_info_list
    }
  }
}
</script>
