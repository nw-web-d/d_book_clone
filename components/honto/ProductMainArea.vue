<template>
  <div>
    <div class="stMainArea">
      <div class="stOverview">
        <p class="stFormat stEb">電子書籍</p>

        <h1 class="stTitle">
          <a
            href="https://honto.jp/ebook/pd-series_C-20004-BT0000222604.html?cid=ip_eb_srs_ttl"
            >{{ product.title }}</a
          >
        </h1>

        <p class="stAuthor">
          <span>著者</span>
          <span>
            <a href="https://honto.jp/ebook/search/au_1001882453.html">{{
              product.author.name
            }}</a></span
          >
        </p>
        <ul class="stSeries">
          <li>
            <a href="https://honto.jp/ebook/pd-series_C-20004-BT0000222604.html"
              >シリーズ一覧</a
            >
          </li>
          <li>
            <a href="https://honto.jp/ebook/pd_30299398.html">最新巻</a>
          </li>
        </ul>

        <p class="stText">
          {{ product.detail }}
        </p>
        <p class="stMore">
          <a
            href="https://honto.jp/ebook/pd_25914816.html?cid=ip_ebset_setcontents_01#productInfomation"
            >もっと見る</a
          >
        </p>
        <!-- .stOverview-->
      </div>

      <div class="stCart01">
        <div class="stBlock stEb">
          <div class="stHeading stCurrent">
            <div class="stCheck">
              <input
                id="EbAction_01"
                type="radio"
                name="action_0001"
                class="stEbBtn"
                checked=""
              />
              <label for="EbAction_01">電子書籍</label>
            </div>
            <div class="stTitle">
              <p class="stTitle">{{ product.title }}</p>
            </div>

            <div class="stPrice">
              <span>税込</span>
              <span class="stPrice">{{ product.price }}</span>
              <span class="stUnit">円</span>
              <span class="stPoint"><em>4</em>pt</span>
            </div>
          </div>
          <div class="stContents" style="height: auto;">
            <div class="stBlockInner">
              <div class="ebook-button-wrapper" style="text-decoration: none;">
                <div class="ebook-cart-wrapper">
                  <p id="dy_put_cart_25914816">
                    <a
                      href="javascript:void(0);"
                      style="
                                        text-decoration: none;
                                        display: inline-block;
                                        vertical-align: bottom;
                                        position: relative;
                                        height: 62px;
                                      "
                      ><span
                        class="stBtn stCart stSizeL stEbBtn ebook-cart__button"
                        id="dy_put_cart_img_25914816"
                        onclick="putCart.put(&#39;3324204&#39;,&#39;&#39;,&#39;25914816&#39;,&#39;&#39;,&#39;https://honto.jp/reg/cart-eb.html&#39;,&#39;pcDetailEbk&#39;,&#39;0&#39;,&#39;1&#39;);"
                        ><span>電子書籍を</span>カートに入れる</span
                      ></a
                    >
                  </p>
                </div>
                <form
                  id="form_id_orderOneStep_25914816"
                  onsubmit=""
                  method="post"
                  action="https://honto.jp/ebook/pd_25914816.html?cid=ip_ebset_setcontents_01"
                >
                  <input type="hidden" name="onestep-posted" value="true" />
                  <input type="hidden" name="prdid" value="25914816" />
                  <input type="hidden" name="onestep-prdId" value="25914816" />
                  <input type="hidden" name="slsPrdCls" value="1" />
                  <input type="hidden" name="price" value="460" />
                  <input type="hidden" name="dispDate" value="20200508" />
                </form>

                <div class="stBtn ebook-onestep-wrapper">
                  <p>
                    <a
                      href="javascript:void(0);"
                      style="text-decoration: none;"
                    >
                      <span
                        class="stBtn stSizeL ebook-onestep__button"
                        onclick="oneStepPurchase.add(&#39;3324204&#39;, &#39;form_id_orderOneStep_25914816&#39;, &#39;pc&#39;);"
                      >
                        <span class="ebook-onestep-button__text"
                          >ワンステップ購入</span
                        >
                      </span>
                    </a>
                  </p>
                </div>
              </div>
              <p class="stRight">
                ワンステップ購入とは
                <span class="stHelp"
                  ><a
                    href="https://honto.jp/ebook/pd_25914816.html?cid=ip_ebset_setcontents_01#oneStep"
                    rel="lightbox"
                    >ワンステップ購入とは</a
                  ></span
                >
              </p>

              <ul class="stListLink07 stAlignRight"></ul>

              <p id="dy_addWntBk_25914816">
                <a href="javascript:void(0);" style="text-decoration: none;"
                  ><span
                    class="stBtn stUserAction stWish stSizeL"
                    id="dy_img_25914816"
                    onclick="prdWantBookAjax.add(&#39;3324204&#39;,&#39;25914816&#39;, &#39;25914816&#39;,&#39;pcDetail&#39;);"
                    >ほしい本に追加（値下がりすると通知がきます）</span
                  ></a
                >
              </p>

              <ul class="stAction">
                <li>
                  <span class="stListLink08 stGift"
                    ><a
                      href="https://honto.jp/reg/giftebook.html?prdid=25914816"
                      >ギフト購入</a
                    ></span
                  >
                </li>
                <li id="dy_addShelfBtnDisp_25914816">
                  <span class="stListLink08 stShelf" id="dy_addShlfBtn_25914816"
                    ><a
                      href="javascript:void(0);"
                      onclick="prdAddMyBookShelf.add(&#39;3324204&#39;,&#39;25914816&#39;,&#39;25914816&#39;,&#39;pcDetail&#39;,&#39;true&#39;);"
                      >My本棚に追加</a
                    ></span
                  >
                </li>
              </ul>

              <div class="stContinuationBox">
                <div class="stImage">
                  <img
                    alt=""
                    src="~/assets/img/dnp/bg_booklife_illust_016.png"
                    height="44"
                  />
                </div>
                <div class="stColumn">
                  <div class="stDocLink01">
                    <a
                      href="https://honto.jp/ebook/pd_25914816.html?cid=ip_ebset_setcontents_01#dy_continuation_C-20004-BT0000222604_01"
                      rel="lightbox"
                      >続刊予約</a
                    >
                  </div>
                  このシリーズの最新巻を自動購入できます
                </div>
              </div>
              <div style="display: none;">
                <div id="dy_continuation_C-20004-BT0000222604_01">
                  <p class="stHdg1">続刊予約とは</p>
                  <div class="stSection01">
                    <p class="stMarginB20">
                      今後、発売されるシリーズの本を自動的に購入できる機能です。<span
                        class="stMarginL20"
                        ><img
                          class="stMiddle"
                          src="~/assets/img/dnp/bg_booklife_illust_016.png"
                          height="69"
                      /></span>
                    </p>
                    <p class="stMarginB00">
                      こんな方にオススメ
                    </p>
                    <ul class="stMarginB20">
                      <li>
                        ①お気に入りのシリーズは買い忘れしたくない
                      </li>
                      <li>②不定期の発売情報を得るのが面倒だ</li>
                    </ul>
                    <ul class="stListNotice01 stMarginB20">
                      <li>
                        <span class="stMark">※</span
                        ><a href="https://honto.jp/my/account/next-issue.html"
                          >シリーズ購読一覧</a
                        >から、いつでも簡単にキャンセルができます。
                      </li>
                      <li>
                        <span class="stMark">※</span
                        >honto会員とクレジットカードの登録が必要です。未登録でも、ボタンを押せばスムーズにご案内します。
                      </li>
                    </ul>
                    <div class="stLightboxActionArea01">
                      <a
                        id="dy_apply_link_C-20004-BT0000222604_01_continuation"
                        href="javascript:void(0);"
                        style="text-decoration: none;"
                        ><span
                          class="stBtn stSeries stSizeL stEbBtn"
                          onclick="Javascript:continueBuyApply.apply(&#39;3324204&#39;,&#39;C-20004-BT0000222604&#39;,&#39;pc&#39;);"
                          ><span>続刊の予約購入を</span>申し込む</span
                        ></a
                      >
                    </div>
                  </div>
                </div>
              </div>

              <div class="stDevice">
                <p>
                  ご利用中のデバイスが対応しているかご確認ください
                </p>
                <div class="stCenter">
                  <ul class="stIcon01">
                    <li>ブラウザ</li>
                    <li>iOS</li>
                    <li>Android</li>
                    <li>Win</li>
                    <li>Mac</li>
                  </ul>
                </div>
                <p class="stMarginB00">
                  対応デバイスごとのコンテンツタイプやファイルサイズ<span
                    class="stHelp"
                    ><a
                      href="https://honto.jp/ebook/pd_25914816.html?cid=ip_ebset_setcontents_01#deviceList_25914816"
                      rel="lightbox"
                      >ヘルプ</a
                    ></span
                  >
                </p>
                <!-- .stDevice-->
              </div>
              <!-- stBlockInner-->
            </div>
            <!-- stContents-->
          </div>
          <!-- .stBlock-->
        </div>

        <div style="display: none;">
          <div id="deviceList_25914816">
            <p class="stHdg1">
              対応デバイス毎のコンテンツタイプやファイルサイズ
            </p>
            <div class="stSection01">
              <table class="stTableData01">
                <thead>
                  <tr>
                    <th>対応デバイス</th>
                    <th>コンテンツタイプ</th>
                    <th>ファイルサイズ</th>
                    <th>閲覧期限</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ブラウザ</td>
                    <td>EPUB</td>
                    <td></td>
                    <td>無制限</td>
                  </tr>
                  <tr>
                    <td>iOS</td>
                    <td>EPUB</td>
                    <td>38.6MB</td>
                    <td>無制限</td>
                  </tr>
                  <tr>
                    <td>Android</td>
                    <td>EPUB</td>
                    <td>38.6MB</td>
                    <td>無制限</td>
                  </tr>
                  <tr>
                    <td>Win</td>
                    <td>EPUB</td>
                    <td>38.6MB</td>
                    <td>無制限</td>
                  </tr>
                  <tr>
                    <td>Mac</td>
                    <td>EPUB</td>
                    <td>38.6MB</td>
                    <td>無制限</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- #deviceList-->
          </div>
          <!-- div(style='display:none;')-->
        </div>

        <div class="stBlock stNs">
          <div class="stHeading">
            <div class="stCheck">
              <input
                id="NsAction"
                type="radio"
                name="action_0001"
                class="stNsBtn"
              />
              <label for="NsAction">紙の本</label>
            </div>
            <div class="stTitle">
              <p class="stTitle">
                ワールドトリガー １ 三雲修 （ジャンプ・コミックス）
              </p>
            </div>
            <div class="stPrice">
              <span>税込</span>
              <span class="stPrice">484</span>
              <span class="stUnit">円</span>
              <span class="stPoint"><em>4</em>pt</span>
            </div>
          </div>
          <div class="stContents">
            <div class="stBlockInner">
              <p class="stTitle">
                <a href="https://honto.jp/netstore/pd-book_25643629.html"
                  >ワールドトリガー １ 三雲修 （ジャンプ・コミックス）</a
                >
              </p>

              <form action="https://honto.jp/reg/cart-ns.html" method="GET">
                <p id="dy_put_cart_25643629">
                  <a
                    href="javascript:void(0);"
                    style="
                                      text-decoration: none;
                                      display: inline-block;
                                      vertical-align: bottom;
                                      position: relative;
                                      height: 62px;
                                    "
                    ><span
                      class="stBtn stCart stSizeL stNsBtn"
                      id="dy_put_cart_img_25643629"
                      onclick="putCart.put(&#39;3324204&#39;,&#39;&#39;,&#39;25643629&#39;,&#39;&#39;,&#39;https://honto.jp/reg/cart-ns.html&#39;,&#39;pcDetail&#39;,&#39;0&#39;,&#39;2&#39;);"
                      ><span>紙の本を</span>カートに入れる</span
                    ></a
                  >
                </p>
              </form>

              <p id="dy_addWntBk_25643629">
                <a href="javascript:void(0);" style="text-decoration: none;"
                  ><span
                    class="stBtn stUserAction stWish stSizeL"
                    id="dy_img_25643629"
                    onclick="prdWantBookAjax.add(&#39;3324204&#39;,&#39;25914816&#39;, &#39;25643629&#39;,&#39;pcDetail&#39;);"
                    >ほしい本に追加</span
                  ></a
                >
              </p>

              <ul class="stAction">
                <li id="dy_addShelfBtnDisp_25643629">
                  <span class="stListLink08 stShelf" id="dy_addShlfBtn_25643629"
                    ><a
                      href="javascript:void(0);"
                      onclick="prdAddMyBookShelf.add(&#39;3324204&#39;,&#39;25914816&#39;,&#39;25643629&#39;,&#39;pcDetail&#39;);"
                      >My本棚に追加</a
                    ></span
                  >
                </li>
              </ul>

              <ul class="stInfo">
                <li class="stSend">
                  発送可能日：
                  <span class="stIconProduct02">24時間</span>
                </li>
                <li class="stDelivery">
                  <a
                    href="https://help.honto.jp/faq_detail.html?id=10163&amp;category=&amp;page=1"
                    target="_blank"
                    >納期/配送の目安について</a
                  >
                </li>
              </ul>

              <form
                id="form_id_dy_ReqEbkBtn"
                onsubmit=""
                method="post"
                action="https://honto.jp/ebook/pd_25914816.html?cid=ip_ebset_setcontents_01"
              >
                <input type="hidden" name="prdid" value="" />
                <input type="hidden" name="ebkReqExec" value="true" />
              </form>
              <!-- .stBlockInner-->
            </div>
            <!-- .stContents-->
          </div>
          <!-- .stBlock-->
        </div>

        <!-- .stCartArea-->
      </div>

      <div style="display: none;">
        <div id="reserveEBook">
          <p class="stHdg1">予約購入とは</p>
          <div class="stSection01">
            <div class="stLayoutImg02 stImgRight">
              <p class="stImg stMarginR30">
                <img
                  src="~/assets/img/dnp/icon_timer01.png"
                  alt=""
                  width="46"
                  height="50"
                />
              </p>
              <div class="stContents">
                <p>
                  まだ販売されていない電子書籍の予約ができます。予約すると、販売開始日に自動的に決済されて本が読めます。
                </p>
                <ul class="stListNotice01">
                  <li>
                    <span class="stMark">※</span
                    >商品は販売開始日にダウンロード可能となります。
                  </li>
                  <li>
                    <span class="stMark">※</span
                    >価格と販売開始日は変更となる可能性があります。
                  </li>
                  <li>
                    <span class="stMark">※</span
                    >ポイント・クーポンはご利用いただけません。
                  </li>
                  <li>
                    <span class="stMark">※</span>間違えて予約購入しても、<a
                      href="https://honto.jp/my/account/ebookreserve.html"
                      >予約一覧</a
                    >から簡単にキャンセルができます。
                  </li>
                  <li>
                    <span class="stMark">※</span
                    >honto会員とクレジットカードの登録が必要です。未登録でも、ボタンを押せばスムーズにご案内します。
                  </li>
                </ul>
                <p class="stDocLink01 stBlank">
                  <a href="https://help.honto.jp/?p=10071"
                    >予約購入について詳しく見る</a
                  >
                </p>
                <!-- /.stContents -->
              </div>
              <!-- /.stLayoutImg02 -->
            </div>
            <!-- /.stSection01 -->
          </div>
          <!-- #reserveEBook-->
        </div>
      </div>
      <div style="display: none;">
        <div id="oneStep">
          <p class="stHdg1">ワンステップ購入とは</p>
          <div class="stSection01">
            <div class="stLayoutImg02 stImgRight">
              <p class="stImg stMarginR30">
                <img
                  src="~/assets/img/dnp/icon_onestep_01.png"
                  alt=""
                  width="25"
                  height="39"
                />
              </p>
              <div class="stContents">
                <p>
                  ワンステップ購入とは、ボタンを1回押すだけでカートを通らずに電子書籍を購入できる機能です。
                </p>
                <p class="stMarginB00">こんな方にオススメ</p>
                <ul class="stListNotice01">
                  <li><span class="stMark">①</span>とにかくすぐ読みたい</li>
                  <li><span class="stMark">②</span>購入までの手間を省きたい</li>
                </ul>
                <ul class="stListNotice01">
                  <li>
                    <span class="stMark">※</span
                    >ポイント・クーポンはご利用いただけません。
                  </li>
                  <li>
                    <span class="stMark">※</span
                    >間違えて購入しても、完了ページもしくは購入履歴詳細から簡単にキャンセルができます。
                  </li>
                  <li>
                    <span class="stMark">※</span
                    >初めてのご利用でボタンを押すと会員登録（無料）をご案内します。購入する場合はクレジットカード登録までご案内します。
                  </li>
                </ul>
                <p class="stDocLink01 stBlank stLeft">
                  <a href="https://help.honto.jp/?p=4021059" target="_blank"
                    ><span>キャンセルについて詳しく見る</span></a
                  >
                </p>
                <!-- /.stContents -->
              </div>
              <!-- /.stLayoutImg02 stImgRight -->
            </div>
            <!-- /.stSection01 -->
          </div>
          <!-- /.oneStep -->
        </div>
        <!-- div(style='display:none;')-->
      </div>
      <!-- .stMainArea-->
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