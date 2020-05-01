<template>
  <div>
    <div class="centerCol">
      <!-- Best seller -->
      <div class="a-spacing-micro">
        <div class="bestSeller">
          <a href="#">電子書籍</a>
        </div>
      </div>
      <!-- Product Title -->
      <div class="titleDiv">
        <h1 class="productTitle">
          <span class="largeTitle">{{ product.title }}</span>
        </h1>
      </div>
      <!-- Author's name -->
      <div class="bylineinfo">
        著者&nbsp;
        <a href="#" class="authorName">
          {{ product.author.name }}
        </a>
      </div>
      <div class="bylineinfo">
        <p>{{ product.detail }}</p>
      </div>
      <div class="reviewGroup"></div>
      <hr style="margin-top: 10px;" />
      <!-- A tags Dummy Data -->
      <div class="mediaMatrix">
        <div class="formats">
          <a href="#" class="link-expander">
            >
            <span class="tmmShowPrompt">See all 18 formats and editions</span>
          </a>
          <ul>
            <!-- Kindle -->
            <li class="swatchElement" style="width: 117px;">
              <span class="a-list-item">
                <span class="a-button-toggle">
                  <span class="a-button-inner">
                    <a href="#" class="a-button-text">
                      <span>Kindle</span>
                      <br />
                      <span class="a-color-secondary">-</span>
                    </a>
                  </span>
                </span>
                <span class="tmm-olp-links"></span>
                <span class="tmm-olp-links">
                  <a href="#" class="a-size-mini">
                    <span class="kcpAppBox">
                      <span class="a-declarative">
                        Read with Our
                        <span class="a-text-bold">Free App</span>
                      </span>
                    </span>
                  </a>
                </span>
              </span>
            </li>
            <!-- Audible -->
            <li class="swatchElement" style="width: 117px;">
              <span class="a-list-item">
                <span class="a-button-toggle">
                  <span class="a-button-inner">
                    <a href="#" class="a-button-text">
                      <span>
                        <img
                          src="/img/audibleLogo.png"
                          class="img-fluid"
                          style="width: 20px;"
                        />Audible
                      </span>
                      <br />
                      <span class="a-color-secondary">-</span>
                    </a>
                  </span>
                </span>
                <span class="tmm-olp-links"></span>
                <span class="tmm-olp-links">
                  <a href="#" class="a-size-mini">
                    <span class="kcpAppBox">
                      <span class="a-declarative">
                        <span class="a-text-bold">Free App</span> with your
                        Audible Trial
                      </span>
                    </span>
                  </a>
                </span>
              </span>
            </li>
            <!-- Paperback -->
            <li class="swatchElement" style="width: 117px;">
              <span class="a-list-item">
                <span class="a-button-toggle">
                  <span class="a-button-inner">
                    <a href="#" class="a-button-text">
                      <span>Paperback</span>
                      <br />
                      <span class="a-color-secondary">-</span>
                    </a>
                  </span>
                </span>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <!-- Description -->
      <div class="bookDescription">
        <div class="bookDescriptionInner">This book is awesome</div>
      </div>

      <!-- Product specification -->
      <div class="aboutEbooksFeature">
        <hr />
        <div class="row">
          <div class="col-sm-4 mb-1">
            <div class="a-declarative">
              Length:
              <span>
                <a href="#">
                  386 pages
                  <i class="a-icon a-icon-popover"></i>
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="centerCol">
      <div class="combinedBuyBox">
        <div class="buyBox">
          <div class="a-section">
            <div class="clearfix">
              <div class="float-left">
                <form>
                  <input id="test1" type="radio" name="radio-group checked" />
                  <label class="a-size-small" style="color: #fd7e14!important;"
                    >電子書籍</label
                  >
                </form>
              </div>

              <!-- Product Price -->
              <div class="float-right">
                <span
                  class="a-size-medium a-color-price offer-price a-text-normal"
                  >{{ product.price }}円</span
                >
              </div>
            </div>
          </div>

          <div class="a-section">
            <div class="a-button-stack" @click="addProductToCart(product)">
              <span class="a-spacing-small a-button-primary a-button-icon">
                <span class="a-button-inner">
                  <i class="a-icon a-icon-cart"></i>
                  <input
                    type="submit"
                    name="submit.add-to-cart"
                    class="a-button-input"
                  />
                  <span class="a-button-text">電子書籍をカートに入れる</span>
                </span>
              </span>
            </div>

            <div class="a-button-stack">
              <span class="a-spacing-small a-button-primary a-button-icon">
                <span class="a-button-inner">
                  <i class="a-icon a-icon-buynow"></i>
                  <input
                    type="submit"
                    name="submit.add-to-cart"
                    class="a-button-input"
                  />
                  <span class="a-button-text">ワンステップ購入</span>
                </span>
              </span>
            </div>
          </div>
          <div class="a-row">
            <div class="a-spacing-top-small">
              <div class="a-section a-spacing-none">
                <div class="a-section a-spacing-none a-spacing-top-mini">
                  This item shipts to
                  <b>California</b>
                  <b>Get it by Monday, Sept 23 - Monday, Sept. 30</b>
                  Choose this date at checkout
                </div>
              </div>
            </div>
          </div>
          <hr />
          <span class="a-declarative">
            <a href="#" class="a-link-normal">
              <div class="a-row a-spacing-mini">
                <i class="fal fa-map-market-alt"></i>
                <span class="a-size-small">Deliver to California</span>
              </div>
            </a>
          </span>
          <br />
          <hr />
          <div class="a-section">
            <div class="clearfix">
              <div class="float-left">
                <form>
                  <input id="test2" type="radio" name="radio-group" />
                  <label class="a-size-small a-color-success">紙の本</label>
                </form>
              </div>
              <div class="float-right">
                <span class="a-color-base offer-price a-text-normal"
                  >{{ product.price }}円</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  props: {
    product: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  methods: {
    ...mapActions(['addProductToCart'])
  }
}
</script>
