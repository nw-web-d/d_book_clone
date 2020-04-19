<template>
  <main>
    <!-- Breadcrumbs -->
    <div class="a-spacing-top-medium"></div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-1"></div>
        <div class="col-md-10">
          <div class="row">
            <!-- 本情報の左ペイン -->
            <div class="col-md-3">
              <BookInfoLeft :product="product" />
            </div>

            <!-- 本情報の中央ペイン -->
            <div class="col-md-6">
              <BookInfoCenter :product="product" />
            </div>

            <!-- 本情報の右ペイン -->
            <div class="col-md-3">
              <BookInfoRight :product="product" />
            </div>
          </div>

          <div>
            <table>
              <tbody>
                <tr>
                  <td>
                    <div class="a-spacing-micro">
                      <div class="bestSeller">
                        <a href="#">電子書籍</a>
                      </div>
                    </div>
                  </td>
                  <td>&nbsp;</td>
                  <td><p class="a-size-medium">セット商品</p></td>
                </tr>
              </tbody>
            </table>

            <div class="row">
              <div class="col-sm-5">
                <div class="bx-root">
                  <a href="#" class="a-size-medium">{{
                    product.book_info.series
                  }}</a>
                  <span clsass="a-color-secondary">税込価格：</span>

                  <span
                    class="a-size-medium a-color-price offer-price a-text-normal"
                    >{{ product.price }}円</span
                  >
                </div>
              </div>
            </div>
          </div>

          <span class="a-size-medium a-text-normal"> あわせて読みたい本</span>
          <Carousel :products="magazineProducts" />

          <span class="a-size-medium a-text-normal">
            このシリーズの商品ラインナップ</span
          >
          <Carousel :products="seriesProducts" />

          <div class="row">
            <div col-md-12>
              <span class="a-size-medium a-text-normal">商品説明</span>
              <div class="bylineinfo">
                <p>{{ product.detail }}</p>
              </div>
            </div>
            <br />
          </div>

          <div class="row">
            <div col-md-12>
              <span class="a-size-medium a-text-normal">
                この著者・アーティストの他の商品</span
              >
              <Carousel :products="ownerProducts" />
            </div>
          </div>
        </div>
        <div class="col-md-1"></div>
      </div>
      <div>
        <div>
          <ReviewSection :product="product" />
        </div>
      </div>
      <div class="clearfix">
        <div class="float-left">
          <hr class="a-spacing-large" />
        </div>
      </div>

      <div class="row">
        <div class="col-md-1"></div>
        <div class="col-md-10">
          <span class="a-size-medium a-text-normal"> ランキング</span>
          <Carousel :products="products" />
        </div>
        <div class="col-md-1"></div>
      </div>
    </div>
  </main>
</template>

<script>
// import axios from 'axios'
import { mapGetters } from 'vuex'
import ReviewSection from '~/components/product/ReviewSection'
import BookInfoLeft from '~/components/product/BookInfoLeft'
import BookInfoCenter from '~/components/product/BookInfoCenter'
import BookInfoRight from '~/components/product/BookInfoRight'
import Carousel from '~/components/common/Carousel'

export default {
  components: {
    BookInfoLeft,
    BookInfoCenter,
    BookInfoRight,
    Carousel,
    ReviewSection
  },
  async asyncData({ $axios, params }) {
    // 書籍情報
    let resProduct = {}
    try {
      resProduct = await $axios.$get('/v1/product/' + params.id)
    } catch (err) {
      console.log(err)
    }

    // シリーズ情報
    let resSeries = []
    const series = resProduct.product.book_info.series
    try {
      resSeries = await $axios.$get(
        '/v1/product/list/series/' + encodeURI(series)
      )
    } catch (err) {
      console.log(err)
    }

    // 同雑誌情報
    let resMagazine = []
    const magazine = resProduct.product.book_info.magazine
    try {
      resMagazine = await $axios.$get(
        '/v1/product/list/magazine/' + encodeURI(magazine)
      )
    } catch (err) {
      console.log(err)
    }

    // 著者情報
    let resOwner = []
    const ownerName = resProduct.product.owner.name
    try {
      resOwner = await $axios.$get(
        '/v1/product/list/owner/' + encodeURI(ownerName)
      )
    } catch (err) {
      console.log(err)
    }

    return {
      product: resProduct.product,
      seriesProducts: resSeries.series_list,
      magazineProducts: resMagazine.magazine_list,
      ownerProducts: resOwner.owners_list
    }
  },
  computed: {
    ...mapGetters({
      products: 'products/products'
    })
  },
  methods: {}
}
</script>
