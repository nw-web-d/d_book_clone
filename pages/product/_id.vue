<template>
  <main>
    <!-- Breadcrumbs -->
    <div class="a-spacing-top-medium"></div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-1"></div>
        <div class="col-md-10">
          <div class="row">
            <div class="col-md-3">
              <div style="margin:auto;text-align:center;padding-bottom: 10px;">
                <img
                  :src="product.thumbnail_url"
                  width="250px"
                  class="img-fluid"
                />
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
            </div>
            <div class="col-md-6">
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
                    {{ product.owner.name }}
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
                      <span class="tmmShowPrompt"
                        >See all 18 formats and editions</span
                      >
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
                                  <span class="a-text-bold">Free App</span> with
                                  your Audible Trial
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
                            <input
                              id="test1"
                              type="radio"
                              name="radio-group checked"
                            />
                            <label
                              class="a-size-small"
                              style="color: #fd7e14!important;"
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
                      <div class="a-button-stack">
                        <span
                          class="a-spacing-small a-button-primary a-button-icon"
                        >
                          <span class="a-button-inner">
                            <i class="a-icon a-icon-cart"></i>
                            <input
                              type="submit"
                              name="submit.add-to-cart"
                              class="a-button-input"
                            />
                            <span class="a-button-text"
                              >電子書籍をカートに入れる</span
                            >
                          </span>
                        </span>
                      </div>

                      <div class="a-button-stack">
                        <span
                          class="a-spacing-small a-button-primary a-button-icon"
                        >
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
                          <div
                            class="a-section a-spacing-none a-spacing-top-mini"
                          >
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
                          <span class="a-size-small"
                            >Deliver to California</span
                          >
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
                            <label class="a-size-small a-color-success"
                              >紙の本</label
                            >
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

            <div class="col-md-3">
              <div class="kcpAppBaseBox text-left">
                <img src="/img/readyondevice.png" class="img-fluid" />
              </div>
              <br />
              <div>
                <div>
                  <div class="bookDescription">
                    <div class="bookDescriptionInner">
                      新刊お知らせメール登録
                    </div>
                  </div>
                  <dl class="stSwitch" id="newInfMail">
                    <dt>この著者の新着情報</dt>
                    <dd>
                      <ul>
                        <li>
                          <a
                            href="https://honto.jp/ebook/pd_30237927.html?pmd=rate_upd&amp;lnk=ATHR_ART&amp;mode=Regist"
                            name="dy_REGIST_rcptNewInf_1"
                            id="dy_REGIST_rcptNewInf_1"
                            >受け取る</a
                          >
                        </li>
                        <li class="stSelected">受け取らない</li>
                      </ul>
                    </dd>
                    <dt>この商品の関連情報</dt>
                    <dd>
                      <ul>
                        <li>
                          <a
                            href="https://honto.jp/ebook/pd_30237927.html?pmd=rate_upd&amp;lnk=PRD_REL&amp;mode=Regist"
                            name="dy_REGIST_rcptNewInf_2"
                            id="dy_REGIST_rcptNewInf_2"
                            >受け取る</a
                          >
                        </li>
                        <li class="stSelected">受け取らない</li>
                      </ul>
                    </dd>
                    <!-- /.stBoxHead03-->
                  </dl>
                  <p class="stLink01">
                    <a href="https://honto.jp/my/account/favorite.html"
                      >一覧を見る</a
                    >
                  </p>
                </div>
                <div class="stSns01" style="text-decoration: none;">
                  <ul class="stSnsList">
                    <li>
                      <a
                        href="#"
                        onclick="openSnsPopUp('https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Fhonto.jp%2Febook%2Fpd_30237927.html&amp;text=%E9%80%B2%E6%92%83%E3%81%AE%E5%B7%A8%E4%BA%BA%E3%80%80%EF%BD%81%EF%BD%94%EF%BD%94%EF%BD%81%EF%BD%83%EF%BD%8B+%EF%BD%8F%EF%BD%8E+%EF%BD%94%EF%BD%89%EF%BD%94%EF%BD%81%EF%BD%8E%EF%BC%8831%EF%BC%89&amp;url=https%3A%2F%2Fhonto.jp%2Febook%2Fpd_30237927.html',this); return false;"
                        style="text-decoration: none;"
                        ><span class="stBtn sizeL stTwitter">twitter</span></a
                      >
                    </li>
                    <li>
                      <a
                        href="#"
                        onclick="openSnsPopUp('https://www.facebook.com/sharer.php?u=https%3A%2F%2Fhonto.jp%2Febook%2Fpd_30237927.html',this); return false;"
                        style="text-decoration: none;"
                        ><span class="stBtn sizeL stFacebook">Facebook</span></a
                      >
                    </li>
                    <li>
                      <a
                        href="https://b.hatena.ne.jp/add?mode=confirm&amp;title=%E9%80%B2%E6%92%83%E3%81%AE%E5%B7%A8%E4%BA%BA%E3%80%80%EF%BD%81%EF%BD%94%EF%BD%94%EF%BD%81%EF%BD%83%EF%BD%8B+%EF%BD%8F%EF%BD%8E+%EF%BD%94%EF%BD%89%EF%BD%94%EF%BD%81%EF%BD%8E%EF%BC%8831%EF%BC%89&amp;url=https%3A%2F%2Fhonto.jp%2Febook%2Fpd_30237927.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        style="text-decoration: none;"
                        ><span class="stBtn sizeL stHatena"
                          >はてなブックマーク</span
                        ></a
                      >
                    </li>
                    <li>
                      <a
                        href="#"
                        onclick="openSnsPopUp('https://mixi.jp/share.pl?u=https%3A%2F%2Fhonto.jp%2Febook%2Fpd_30237927.html&amp;k=78b1f71e8d011d9845ee14ca7b83c181cd716a15',this); return false;"
                        style="text-decoration: none;"
                        ><span class="stBtn sizeL stMixi">mixi</span></a
                      >
                    </li>
                    <li>
                      <a
                        href="https://8card.net/posts/links/new?application_id=902593464169451&amp;url=https%3A%2F%2Fhonto.jp%2Febook%2Fpd_30237927.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        style="text-decoration: none;"
                        ><span class="stBtn sizeL stEight">Eight</span></a
                      >
                    </li>
                    <li>
                      <a
                        href="#"
                        onclick="openSnsPopUp('https://getpocket.com/edit?url=https%3A%2F%2Fhonto.jp%2Febook%2Fpd_30237927.html&amp;title=%E9%80%B2%E6%92%83%E3%81%AE%E5%B7%A8%E4%BA%BA%E3%80%80%EF%BD%81%EF%BD%94%EF%BD%94%EF%BD%81%EF%BD%83%EF%BD%8B+%EF%BD%8F%EF%BD%8E+%EF%BD%94%EF%BD%89%EF%BD%94%EF%BD%81%EF%BD%8E%EF%BC%8831%EF%BC%89',this); return false;"
                        style="text-decoration: none;"
                        ><span class="stBtn sizeL stPocket">Pocket</span></a
                      >
                    </li>
                    <li>
                      <a
                        href="mailto:?subject=%E9%80%B2%E6%92%83%E3%81%AE%E5%B7%A8%E4%BA%BA%E3%80%80%EF%BD%81%EF%BD%94%EF%BD%94%EF%BD%81%EF%BD%83%EF%BD%8B+%EF%BD%8F%EF%BD%8E+%EF%BD%94%EF%BD%89%EF%BD%94%EF%BD%81%EF%BD%8E%EF%BC%8831%EF%BC%89&amp;body=https%3A%2F%2Fhonto.jp%2Febook%2Fpd_30237927.html?cid=ip_sns_mail"
                        style="text-decoration: none;"
                        ><span class="stBtn sizeL stMail">Mail</span></a
                      >
                    </li>
                    <!-- ul.stSnsList-->
                  </ul>
                </div>
              </div>
              <hr />
            </div>
          </div>

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

          <span class="a-size-medium a-text-normal"> あわせて読みたい本</span>
          <Carousel :products="products" />

          <span class="a-size-medium a-text-normal">
            このシリーズの商品ラインナップ</span
          >
          <Carousel :products="products" />

          <div>
            <span class="a-size-medium a-text-normal">商品説明</span>
            <div class="bylineinfo">
              <p>{{ product.detail }}</p>
            </div>
          </div>

          <span class="a-size-medium a-text-normal">
            この著者・アーティストの他の商品</span
          >
          <Carousel :products="products" />
        </div>
        <div class="col-md-1"></div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="list-group">
            <a href="#" class="list-group-item list-group-item-action active"
              >Home</a
            >
            <div class="list-group-item">
              List header
            </div>
            <div class="list-group-item">
              <h4 class="list-group-item-heading">
                List group item heading
              </h4>
              <p class="list-group-item-text">
                ...
              </p>
            </div>
            <div class="list-group-item justify-content-between">
              Help <span class="badge badge-secondary badge-pill">14</span>
            </div>
            <a
              href="#"
              class="list-group-item list-group-item-action active justify-content-between"
              >Home <span class="badge badge-light badge-pill">14</span></a
            >
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-1"></div>
        <div class="col-md-10">
          <h2>
            Heading
          </h2>
          <p>
            Donec id elit non mi porta gravida at eget metus. Fusce dapibus,
            tellus ac cursus commodo, tortor mauris condimentum nibh, ut
            fermentum massa justo sit amet risus. Etiam porta sem malesuada
            magna mollis euismod. Donec sed odio dui.
          </p>
          <p>
            <a class="btn" href="#">View details »</a>
          </p>
        </div>
        <div class="col-md-1"></div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import Carousel from '~/components/Carousel'
export default {
  components: {
    Carousel
  },
  computed: {
    ...mapGetters({
      products: 'products/products'
    }),
    product() {
      const id = this.$route.params.id
      if (id) {
        const filterArr = this.products.filter((product) => {
          return product.id === id
        })
        if (filterArr.length > 0) {
          return filterArr[0]
        }
      }
      return {}
    }
  }
}
</script>
