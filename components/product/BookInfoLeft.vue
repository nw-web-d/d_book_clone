<template>
  <div>
    <div style="margin:auto;text-align:center;padding-bottom: 10px;">
      <img :src="product.photo_url" width="250px" class="img-fluid" />
    </div>

    <div class="a-section">
      <div class="a-button-stack">
        <span class="a-spacing-small a-button-primary a-button-icon">
          <span class="a-button-inner">
            <input
              type="submit"
              name="submit.add-to-cart"
              class="a-button-input"
            />
            <span class="a-button-text">アプリで立ち読み</span>
          </span>
        </span>
      </div>
      <div class="a-button-stack">
        <span class="a-spacing-small a-button-primary a-button-icon">
          <span class="a-button-inner">
            <input
              type="submit"
              name="submit.add-to-cart"
              class="a-button-input"
            />
            <span class="a-button-text">ブラウザで立ち読み</span>
          </span>
        </span>
      </div>
    </div>
    <div class="row">
      <div class="col-4" style="text-aling:left;padding-right: 0px;">
        みんなの評価
      </div>
      <div class="col-8">
        <StarRating :rating="product.rating" :star-size="15" />
      </div>
    </div>
    <div class="row">
      <div class="col-12" style="padding-top: 2px;padding-bottom: 2px;" />
    </div>
    <div class="row">
      <div class="col-4" style="text-aling:left;padding-right: 0px;">
        あなたの評価
      </div>
      <div class="col-8">
        <StarRating :rating="0" :star-size="15" :read-only="false" />
      </div>
    </div>
    <div class="row">
      <div class="col-4" />
      <div class="col-8">
        評価して"My本棚"に追加
      </div>
    </div>
    <hr />
    <div class="row">
      <div class="col-12">
        <ul>
          <li>
            <a href="#">第３５回講談社漫画賞少年部門受賞</a>
          </li>
          <!-- ul.stAward-->
        </ul>
        <div id="dyRankingLazyLoad">
          <ul class="stAward">
            <li>
              <a href="#">ファンタジーhonto ランキング第1位</a>
            </li>
            <!-- ul.stAward -->
          </ul>
        </div>

        <ul class="stItemData">
          <li>カテゴリ：一般</li>
          <li>販売開始日：2020/04/09</li>
          <li>
            出版社：
            <a href="#">講談社</a>
          </li>

          <li>ISBN：978-4-06-518689-3</li>
        </ul>
      </div>
    </div>
  </div>
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
