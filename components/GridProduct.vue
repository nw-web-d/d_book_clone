<template>
  <div class="col-xl-2 col-lg-2 co-md-6 sm-6 br bb">
    <div class="history-box">
      <div class="s-item-container">
        <div>
          <div class="row">
            <!-- Image -->
            <div class="col-sm-12 text-center">
              <nuxt-link
                :to="{ name: 'product-id', params: { id: product._id } }"
              >
                <img
                  :src="product.photo_url"
                  style="width: 150px;"
                  class="img-fluid"
                />
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true,
      default: () => {}
    }
  }
}
</script>
