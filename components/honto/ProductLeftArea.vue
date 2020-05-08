<template>
  <div>
    <div class="stLeftArea">
      <div class="stContents">
        <div class="stImg">
          <div class="stPhoto">
            <div class="stCover">
              <a
                href="https://honto.jp/lb.html?prdid=25914816&amp;srt=1"
                rel="lightbox"
                ><img
                  :src="product.photo_url"
                  width="265"
                  height="360"
                  alt="ワールドトリガー 1(ジャンプコミックスDIGITAL)"
              /></a>
            </div>
            <!-- .stPhoto-->
          </div>
          <!-- .stImg-->
        </div>

        <p class="stRead">
          <a
            rel="lightbox"
            href="https://honto.jp/ebook/pd_25914816.html?cid=ip_ebset_setcontents_01#dy_standReadingItemsDialog25914816"
            showclosebutton="true"
            style="text-decoration: none;"
            ><span class="stBtn stRead stSizeS stInvert"
              >アプリで立ち読み</span
            ></a
          >
        </p>
        <div style="display: none;">
          <div id="dy_standReadingItemsDialog25914816">
            <p class="stHdg1">hontoアプリの確認</p>

            <div class="stSection01">
              <p class="stMarginB00">
                立ち読みには最新の「honto」アプリ（無料）が必要です。
              </p>
              <p class="stListNotice01">
                <span class="stMark">※</span
                >バージョンの確認はアプリの「設定/情報」から確認できます。
              </p>

              <div class="stAccount09">
                <div class="stBoxHead03">
                  <h2 class="stHeading stMarginB10">
                    <span>最新の「honto」アプリをご利用の方</span>
                  </h2>
                  <p class="stCenter">
                    <a
                      href="javascript:void(0);"
                      onclick="appStandReadingAjax.standReadingWithLightBox(&#39;3324204&#39;,&#39;25914816&#39;,&#39;C-20004-BT000022260400100101&#39;,&#39;10&#39;,&#39;PC&#39;);"
                      style="text-decoration: none;"
                      ><span class="stBtn stRead stSizeM stInvert"
                        >立ち読みする</span
                      ></a
                    >
                    <!-- /.stBoxHead03 -->
                  </p>
                </div>

                <div class="stBoxHead03">
                  <h2 class="stHeading stMarginB10">
                    <span>最新の「honto」アプリをダウンロードされる方</span>
                  </h2>
                  <p class="stCenter">
                    <a
                      href="https://honto.jp/ebook/dlinfo.html"
                      style="text-decoration: none;"
                      ><span class="stBtn stRead stSizeM"
                        >hontoビューアアプリ</span
                      ></a
                    >
                  </p>
                  <!-- /.stBoxHead03 -->
                </div>
                <!-- /stAccount09 -->
              </div>
              <!-- /.stSection01 -->
            </div>

            <!-- /dy_standReadingItemsDialog -->
          </div>
          <!-- /display -->
        </div>
        <p class="stRead">
          <a
            href="javascript:void(0);"
            onclick="browserStandReadingAjax.standReading(&#39;3324204&#39;,&#39;C-20004-BT000022260400100101&#39;,&#39;27537-120466575-001-001&#39;,&#39;128&#39;,&#39;27537_120466575_001_001_128_542_t&#39;,&#39;25914816&#39;);"
            style="text-decoration: none;"
          >
            <span class="stBtn stRead stSizeS stInvert"
              >ブラウザで立ち読み</span
            >
          </a>
        </p>

        <ul class="stData01">
          <li class="stAllRating">
            <span class="stTitle">みんなの評価</span>
            <span
              ><img
                src="~/assets/img/dnp/product/img_star45_l.png"
                alt="5つ星のうち 4.4"
                width="93"
                height="16"
              />
              <a href="https://honto.jp/ebook/pd-review_0625914816_192.html"
                >82件</a
              >
            </span>
          </li>
          <li class="stRating">
            <span class="stTitle">あなたの評価</span>
            <a
              href="https://honto.jp/ebook/pd_25914816.html?cid=ip_ebset_setcontents_01&amp;pmd=rate_upd"
              ><img
                src="~/assets/img/dnp/product/img_star0_l.png"
                alt=""
                height="16"
                width="86"
            /></a>
            <span class="stValue">
              <span class="stBefore stAddMyBook">評価して"My本棚"に追加</span>
              <span class="stAfter stAddMyBook dyNoDisplay"
                >評価ありがとうございます。<a
                  class="stStarClear"
                  pageblockid="3324204"
                  name="star"
                  href="https://honto.jp/ebook/pd_25914816.html?cid=ip_ebset_setcontents_01#"
                  rateparam="prdid=25914816&amp;exec=del"
                  >×</a
                ></span
              >
            </span>
          </li>
          <!-- ul.stData01-->
        </ul>

        <!-- .stContents-->
      </div>
      <div class="stExtra">
        <ul class="stAward">
          <!-- ul.stAward-->
        </ul>
        <div id="dyRankingLazyLoad"></div>

        <ul class="stItemData">
          <li>販売開始日：2013/10/04</li>
          <li>
            出版社：
            <a href="https://honto.jp/ebook/search/pb_9000036149.html"
              >集英社</a
            >
          </li>
          <li>
            レーベル：
            <a href="https://honto.jp/ebook/search/lb_1000001991.html"
              >ジャンプコミックスDIGITAL</a
            >
          </li>

          <li>ISBN：978-4-08-870809-6</li>
          <!-- ul.stItemData-->
        </ul>
        <!-- /.stExtra-->
      </div>

      <span class="stIconProduct01">コミック</span>

      <!-- stColumn-->
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
