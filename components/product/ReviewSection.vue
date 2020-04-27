<template>
  <div class="row">
    <div
      class="col-md-12"
      style="background-color:#f8f7ef;padding-bottom: 10px;"
    >
      <div>
        <!-- <div class="reviewsMedleya"> -->
        <div class="row">
          <div class="col-lg-1 col-md-1 col-sm-0" />
          <div class="col-lg-10 col-md-10 col-sm-12" style="padding-top: 20px;">
            <div class="row">
              <div class="col-6">
                <!-- Total Customer reviews -->
                <a href="#" class="a-color-base">
                  <h2>みんなのレビュー 1,354</h2>
                </a>
                <template v-if="$auth.$state.loggedIn">
                  <div class="a-row">
                    <!-- Link to another Review page -->
                    <span
                      class="a-button-base writeReviewButton cm-cr-button-wide"
                    >
                      <span class="a-button-inner">
                        <nuxt-link
                          :to="{
                            name: 'review-id',
                            params: { id: product.id }
                          }"
                          >レビューを書く</nuxt-link
                        >
                      </span>
                    </span>
                  </div>
                </template>
              </div>

              <div class="col-6">
                <div class="cr-widget-ACR">
                  <div class="row">
                    <div class="col-3">
                      <StarRating
                        :rating="product.everyone_rating"
                        :star-size="25"
                      />
                    </div>
                    <div class="col-9" style="padding-left: 0px;">
                      <span>
                        <a href="#">
                          4.5 out of 5 stars
                          <i class="a-icon a-icon-popover"></i>
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="cr-widget-histogram">
                  <div class="row a-histogrm-row">
                    <div class="col-md-2 col-sm-2 col-2 pr-0">
                      <div class="aok-nowrap">
                        <a href="#">5 star</a>
                        <span class="a-letter-space"></span>
                      </div>
                    </div>
                    <div class="col-md-8 col-sm-8 col-8 pr-0">
                      <div>
                        <a href="#">
                          <div class="a-meter 5star">
                            <div
                              class="a-meter-bar a-meter-filled"
                              style="width: 64%;"
                            ></div>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div class="col-md-2 col-sm-2 col-2 pr-0">
                      <div class="aok-nowrap text-right">
                        <a href="#">64%</a>
                        <span class="a-letter-space"></span>
                      </div>
                    </div>
                  </div>
                  <div class="row a-histogrm-row" style="margin-top: -15px;">
                    <div class="col-md-2 col-sm-2 col-2 pr-0">
                      <div class="aok-nowrap">
                        <a href="#">4 star</a>
                        <span class="a-letter-space"></span>
                      </div>
                    </div>
                    <div class="col-md-8 col-sm-8 col-8 pr-0">
                      <div>
                        <a href="#">
                          <div class="a-meter 5star">
                            <div
                              class="a-meter-bar a-meter-filled"
                              style="width: 14%;"
                            ></div>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div class="col-md-2 col-sm-2 col-2 pr-0">
                      <div class="aok-nowrap text-right">
                        <a href="#">14%</a>
                        <span class="a-letter-space"></span>
                      </div>
                    </div>
                  </div>
                  <div class="row a-histogrm-row" style="margin-top: -15px;">
                    <div class="col-md-2 col-sm-2 col-2 pr-0">
                      <div class="aok-nowrap">
                        <a href="#">3 star</a>
                        <span class="a-letter-space"></span>
                      </div>
                    </div>
                    <div class="col-md-8 col-sm-8 col-8 pr-0">
                      <div>
                        <a href="#">
                          <div class="a-meter 5star">
                            <div
                              class="a-meter-bar a-meter-filled"
                              style="width: 4%;"
                            ></div>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div class="col-md-2 col-sm-2 col-2 pr-0">
                      <div class="aok-nowrap text-right">
                        <a href="#">4%</a>
                        <span class="a-letter-space"></span>
                      </div>
                    </div>
                  </div>
                  <div class="row a-histogrm-row" style="margin-top: -15px;">
                    <div class="col-md-2 col-sm-2 col-2 pr-0">
                      <div class="aok-nowrap">
                        <a href="#">2 star</a>
                        <span class="a-letter-space"></span>
                      </div>
                    </div>
                    <div class="col-md-8 col-sm-8 col-8 pr-0">
                      <div>
                        <a href="#">
                          <div class="a-meter 5star">
                            <div
                              class="a-meter-bar a-meter-filled"
                              style="width: 0%;"
                            ></div>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div class="col-md-2 col-sm-2 col-2 pr-0">
                      <div class="aok-nowrap text-right">
                        <a href="#">0%</a>
                        <span class="a-letter-space"></span>
                      </div>
                    </div>
                  </div>
                  <div class="row a-histogrm-row" style="margin-top: -15px;">
                    <div class="col-md-2 col-sm-2 col-2 pr-0">
                      <div class="aok-nowrap">
                        <a href="#">1 star</a>
                        <span class="a-letter-space"></span>
                      </div>
                    </div>
                    <div class="col-md-8 col-sm-8 col-8 pr-0">
                      <div>
                        <a href="#">
                          <div class="a-meter 5star">
                            <div
                              class="a-meter-bar a-meter-filled"
                              style="width: 4%;"
                            ></div>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div class="col-md-2 col-sm-2 col-2 pr-0">
                      <div class="aok-nowrap text-right">
                        <a href="#">4%</a>
                        <span class="a-letter-space"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr width="100%" />
            <div class="cr-lighthut">
              <h3>Read reviews that mention</h3>
              <div class="cr-lighthouse-terms">
                <span class="cr-lighthouse-span">
                  <a href="#">
                    <span class="cr-lighthouse-term">jeff bezos</span>
                  </a>
                </span>
                <span class="cr-lighthouse-span">
                  <a href="#">
                    <span class="cr-lighthouse-term">everything store</span>
                  </a>
                </span>
                <span class="cr-lighthouse-span">
                  <a href="#">
                    <span class="cr-lighthouse-term">brad stone</span>
                  </a>
                </span>
                <br />
                <span class="cr-lighthouse-span">
                  <a href="#">
                    <span class="cr-lighthouse-term">steve jobs</span>
                  </a>
                </span>
                <span class="cr-lighthouse-span">
                  <a href="#">
                    <span class="cr-lighthouse-term">well written</span>
                  </a>
                </span>
                <span class="cr-lighthouse-span">
                  <a href="#">
                    <span class="cr-lighthouse-term">great read</span>
                  </a>
                </span>
                <br />
                <span class="cr-lighthouse-span">
                  <a href="#">
                    <span class="cr-lighthouse-term">must read</span>
                  </a>
                </span>
                <span class="cr-lighthouse-span">
                  <a href="#">
                    <span class="cr-lighthouse-term">great book</span>
                  </a>
                </span>
                <span class="cr-lighthouse-span">
                  <a href="#">
                    <span class="cr-lighthouse-term">highly recomended</span>
                  </a>
                </span>
                <br />
                <span class="cr-lighthouse-span">
                  <a href="#">
                    <span class="cr-lighthouse-term">well searched</span>
                  </a>
                </span>
                <span class="cr-lighthouse-span">
                  <a href="#">
                    <span class="cr-lighthouse-term">long term</span>
                  </a>
                </span>
                <span class="cr-lighthouse-span">
                  <a href="#">
                    <span class="cr-lighthouse-term">barnes and noble</span>
                  </a>
                </span>
                <span class="cr-lighthouse-span">
                  <a href="#">
                    <span class="cr-lighthouse-term">sam walton</span>
                  </a>
                </span>
              </div>
            </div>
            <hr />
          </div>
          <div class="col-lg-1 col-md-1 col-sm-0" />
        </div>
        <div class="clearfix">
          <div class="float-left">
            <hr class="a-spacing-large" />
          </div>
        </div>

        <div class="row">
          <div class="col-lg-1 col-md-1 col-sm-0" />
          <div class="col-lg-10 col-md-10 col-sm-0">
            <div class="card-padding">
              <div class="review-header">
                <h3>
                  <span class="a-size-base">Showing 1-8 of 1,354 reviews</span>
                </h3>
              </div>
              <div class="review-sort-type">
                <span class="a-dropdown-container">
                  <span class="a-button a-button-dropdown">
                    <span class="a-button-inner">
                      <span class="a-button-text">
                        <span class="a-dropdown-prompt">Top Reviews</span>
                      </span>
                      <i class="a-icon a-icon-dropdown"></i>
                    </span>
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div class="col-lg-1 col-md-1 col-sm-0" />
        </div>
        <hr />
        <div
          v-for="review in reviews"
          :key="review._id"
          class="cr-widget-focalreviews"
        >
          <div class="row">
            <div class="col-lg-1 col-md-1 col-sm-0" />
            <div class="col-lg-10 col-md-10 col-sm-0">
              <!-- Reviews -->
              <div class="review-body">
                <div class="genome-widget">
                  <a href="#">
                    <div class="profile-avatar">
                      <img
                        src="https://images-na.ssl-images-amazon.com/images/S/amazon-avatars-global/default._CR0,0,1024,1024_SX48_.png"
                      />
                    </div>
                    <!-- Review Owner -->
                    <div class="profile-content">
                      <span class="a-profile-name">{{ review.user_name }}</span>
                    </div>
                  </a>
                </div>
                <div class="a-row">
                  <div class="row">
                    <div class="col-1">
                      <!-- Review Star -->
                      <StarRating :rating="review.rating" :star-size="15" />
                    </div>
                    <div class="col-11" style="padding-left: 0px;">
                      <!-- <span class="a-letter-space"></span> -->
                      <!-- Review Headline -->
                      <a href="#" class="review-title">{{ review.headline }}</a>
                    </div>
                  </div>
                </div>
                <span class="review-date">June 28, 2016</span>
                <div class="review-data">
                  <span class="a-color-secondary">Format: Hardcover</span>
                  <div
                    style="width: 1px !important; height: 15px !important; background-color: #ddd; display: inline-block; margin: 0px 5px -3px 5px;"
                  ></div>
                  <span class="avp-badge a-color-state">Verified Purchase</span>
                </div>
                <!-- Review Body -->
                <div class="review-body">
                  <!-- white-space:pre-wrap;注意！ -->
                  <span style="white-space:pre-wrap; word-wrap:break-word;">{{
                    review.body
                  }}</span>
                </div>
                <div class="review-comments">
                  <div class="a-spacing-small">
                    <span class="a-size-base a-color-tertiary"
                      >60 people found this helpful</span
                    >
                  </div>
                </div>
              </div>
              <!-- Reviews -->
            </div>
          </div>
          <div class="col-lg-1 col-md-1 col-sm-0" />
          <hr />
        </div>

        <div class="row">
          <div class="col-10" />
          <div class="col-2">
            <nuxt-link to="#">レビューをもっと見る</nuxt-link>
          </div>
        </div>
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
    },
    reviews: {
      type: Array,
      required: true,
      default: () => []
    }
  }
}
</script>
