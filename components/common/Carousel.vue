<template>
  <div class="mainContent">
    <div class="row">
      <div class="col-xl-1 col-lg-1 md-1 col-sm-1" />
      <div class="col-xl-10 col-lg-10 md-10 col-sm-10">
        <carousel
          :per-page="7"
          :autoplay="true"
          :loop="true"
          :pagination-padding="5"
          :autoplay-timeout="4000"
          :navigation-enabled="true"
          :speed="1000"
          navigation-next-label="<button class='vue-navigation round rightnav'>&#8250;</button>"
          navigation-prev-label="<button class='vue-navigation round leftnav'>&#8249;</button>"
        >
          <slide v-for="product in products" :key="product._id">
            <!-- Image -->
            <nuxt-link
              :to="{ name: 'product-id', params: { id: product._id } }"
            >
              <img
                :src="product.photo_url"
                style="width: 100px;"
                class="img-fluid"
              />
            </nuxt-link>
          </slide>
        </carousel>
      </div>
    </div>
  </div>
</template>

<script>
import Carousel from 'vue-carousel/src/Carousel.vue'
import Slide from 'vue-carousel/src/Slide.vue'

export default {
  components: {
    Carousel,
    Slide
  },
  props: {
    products: {
      type: Array,
      required: true,
      default: () => []
    }
  }
}
</script>

<style>
button {
  text-decoration: none;
  display: inline-block;
  padding: 8px 16px;
}

button:hover {
  background-color: #ddd;
  color: black;
}

.vue-navigation {
  background-color: silver;
  color: white;
  border-radius: 50%;
}

.round {
  border-radius: 50%;
}
</style>
