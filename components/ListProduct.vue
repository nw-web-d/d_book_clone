<template>
  <li class="s-result-item celwidget">
    <div class="s-item-container">
      <!-- Best seller -->
      <div class="a-spacing-micro">
        <div class="bestSeller">
          <a href="#">Best Seller</a>
        </div>
      </div>

      <div>
        <div class="row">
          <!-- Image -->
          <div class="col-sm-3 text-center">
            <nuxt-link :to="{ name: 'product-id', params: { id: product.id } }">
              <img
                :src="product.thumbnail_url"
                style="width: 150px;"
                class="img-fluid"
              />
            </nuxt-link>
          </div>

          <div class="col-sm-9">
            <div class="a-row a-spacing-small">
              <!-- Titel and Date -->
              <nuxt-link
                class="a-link-normal"
                :to="{ name: 'product-id', params: { id: product.id } }"
              >
                <h2 class="a-size-medium">
                  {{ product.title }}
                  <span class="a-letter-space"></span>
                  <span class="a-size-small a-color-secondary"
                    >Sep 3, 2019</span
                  >
                </h2>
              </nuxt-link>
            </div>

            <!-- Author's name -->
            <div class="a-row a-spacing-small">
              <span class="a-size-small a-color-secondary">by</span>
              <span class="a-size-small a-color-secondary">
                <a href="#" class="a-link-normal a-text-nomal">{{
                  product.owner.name
                }}</a>
              </span>
            </div>

            <!-- shipemet -->
            <div class="a-row">
              <span class="a-size-small">Japan</span>
            </div>

            <div class="row">
              <div class="col-sm-7">
                <div class="a-row spacing-none">
                  <a href="#" class="a-link-normal a-text-nomal">Softcover</a>
                </div>

                <!-- Price-->
                <div class="a-row a-spacing-none">
                  <a href="#" class="a-link-normal a-text-normal">
                    <span class="a-offscreen">${{ product.price }}</span>
                    <span class="a-color-base sx-zero-spacing">
                      <span class="sx-price sx-price-large">
                        <sup class="sx-price-currency">$</sup>
                        <span class="sx-price-whole">{{ product.price }}</span>
                        <sup class="sx-price-fractional">00</sup>
                      </span>
                    </span>
                  </a>
                  <span class="a-letter-space"></span>
                  <span
                    class="a-size-base-plus a-color a-color-secondary a-text-strike"
                    >$28.00</span
                  >
                </div>

                <!-- aubible trial -->
                <div class="a-row a-spacing-none">
                  <span class="a-size-small a-color-secondary"
                    >Free with Audible trial</span
                  >
                </div>
                <div>
                  <StarRating
                    :rating="product.everyone_rating"
                    :star-size="15"
                  />
                </div>
                <hr />

                <!-- Other Formats -->
                <span class="a-size-small a-color-secondary">
                  Other Formats:
                  <span class="a-letter-space"></span>
                  <a href="#" class="a-size-small a-link-normal a-text-normal"
                    >Audio CD</a
                  >
                </span>
              </div>

              <!-- Ratings -->
              <div class="col-sm-5">
                <div class="a-row a-spacing-mini">
                  <!-- Star Ratings -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import StarRating from '~/components/common/StarRating'
export default {
  components: {
    StarRating
  },
  props: {
    product: {
      type: Object,
      required: true,
      default: () => {}
    }
  }
}
</script>
