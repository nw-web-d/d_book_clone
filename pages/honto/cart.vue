<template>
  <!--MAIN-->
  <main>
    <div class="stCartTabContainer">
      <div class="stView">
        <h1 class="stHdg1 stMarginT40">電子書籍カート</h1>

        <div class="stTabContainer01">
          <div class="stTabNav01 stTabTop">
            <ul class="stTabs shopping jsBorderColor stEb ele">
              <li class="stCurrent electronCart" style="z-index: 3;">
                <a href="https://honto.jp/reg/cart-eb.html" class="png"
                  ><span
                    >電子書籍カート (<span id="dy_ebookCartItemCount">1</span
                    >)</span
                  ></a
                >
              </li>
              <li class="orderCart" style="z-index: 1;">
                <a href="https://honto.jp/reg/cart-ns.html" class="png"
                  ><span
                    >通販カート (<span id="dy_netstoreCartItemCount">0</span
                    >)</span
                  ></a
                >
              </li>
            </ul>

            <!-- /.stTabNav01 -->
          </div>
          <!-- /.stTabContainer01 -->
        </div>
        <!-- /.stView -->
      </div>
      <!-- /.stCartTabContainer -->
    </div>

    <!--SHOPPING CART-->
    <div id="areaWrapper1" class="pbAreaWrapper1">
      <div id="areaWrapper2" class="pbAreaWrapper2">
        <div id="mainArea" class="pbMainArea">
          <div id="area0" class="pbArea">
            <div class="pbNested">
              <div id="pbBlock2653077" class="pbNested pbNestedWrapper">
                <!-- Empty block -->
              </div>
              <div id="pbBlock2653078" class="pbNested pbNestedWrapper">
                <form
                  id="OrdShoppingBasketElectronicBookPc"
                  method="post"
                  action="https://honto.jp/reg/cart-eb"
                >
                  <input id="dy_prdId" type="hidden" name="prdId" />
                  <input id="dy_pageNo" type="hidden" name="pageNo" value="1" />
                  <input id="dy_pmd" type="hidden" name="pmd" />
                  <input
                    id="dy_ordTokenKey"
                    type="hidden"
                    name="ordTokenKey"
                    value="fa57d8972f99533ebfa54ffda6e3a5e7"
                  />
                  <input id="dy_cartItemCount" type="hidden" value="1" />
                  <input
                    id="hidAddCartFromCarousel"
                    type="hidden"
                    value="2653078"
                  />
                  <div id="stSection01" class="stSection01">
                    <div class="stLayoutMS stMarginT10 stMarginB20">
                      <div class="stSub">
                        <div class="stLogin01">
                          <div
                            class="stContents"
                            style="text-decoration: none;"
                          >
                            <p
                              id="register"
                              class="stBtn"
                              style="text-decoration: none;"
                            >
                              <button
                                id="dy_buttonRegister"
                                type="submit"
                                name="buttonRegister"
                                class="stBtn stSizeL stEbBtn dyPreventDoubleSubmit"
                                onclick=""
                              >
                                購入手続きへ進む
                              </button>
                            </p>
                            <dl class="stTotal">
                              <dt><span>合計（税込）</span></dt>
                              <dd>
                                <span class="stYen"
                                  ><span id="ttlAmtUp">{{
                                    getCartTotalPrice
                                  }}</span
                                  >円</span
                                >
                              </dd>
                              <dt><span>獲得予定ポイント</span></dt>
                              <dd>
                                <span id="ttlPtUp" class="stYen">0pt</span>
                              </dd>
                            </dl>

                            <ul class="stLink05">
                              <li class="stBack">
                                <a
                                  id="dy_buttonContinue"
                                  href="https://honto.jp/reg/cart-eb?ordTokenKey=fa57d8972f99533ebfa54ffda6e3a5e7&amp;pmd=continue"
                                  class="dyPreventDoubleSubmit"
                                  onclick=""
                                  >買い物を続ける</a
                                >
                              </li>
                            </ul>
                            <!-- /stContents -->
                          </div>
                          <!-- /.stLogin01 -->
                        </div>

                        <p class="stLinkExternal01">
                          <a
                            href="https://help.honto.jp/faq_detail.html?id=10189&amp;page=1"
                            target="_blank"
                            >獲得予定ポイントについて</a
                          >
                        </p>
                        <!-- /.stSub -->
                      </div>

                      <div class="stMain">
                        <table
                          cellspacing="0"
                          class="stTableData01 stTableCart"
                        >
                          <colgroup>
                            <col width="4%" />
                            <col width="70%" />
                            <col width="10%" />
                            <col width="16%" />
                          </colgroup>
                          <thead>
                            <tr>
                              <th colspan="2">商品名</th>
                              <th>操作</th>
                              <th>価格(税込)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="product in getCart"
                              id="stWishBlock0"
                              :key="product._id"
                            >
                              <td class="stInputCell" style="display: none;">
                                <input
                                  id="dy_checkPrd[0]"
                                  name="checkPrd[]"
                                  value="29620592"
                                  type="checkbox"
                                />
                                <label for="dy_checkPrd[0]"></label>
                              </td>
                              <td colspan="2">
                                <div
                                  class="stProduct03 stMarginB00 noBookJadge"
                                >
                                  <p class="stImg">
                                    <a
                                      href="https://honto.jp/ebook/pd_29620592.html"
                                      class="dy_bookImgLink"
                                      ><img
                                        :src="product.photo_url"
                                        class="dy_bookImgUrl img-fluid w-100"
                                        alt=""
                                    /></a>
                                  </p>
                                  <div class="stContents">
                                    <p>
                                      <a
                                        id="dy_prdNm[0]"
                                        href="https://honto.jp/ebook/pd_29620592.html"
                                        ><em>{{ product.title }}</em></a
                                      >
                                    </p>

                                    <ul class="stFontSmall">
                                      <li>{{ product.author.name }}</li>
                                      <li>集英社</li>
                                    </ul>
                                    <p>
                                      <span class="stIconProduct01"
                                        >一般書</span
                                      >
                                    </p>
                                    <ul class="stIcon01">
                                      <li id="dy_tmnlTy[0_0]">iOS</li>
                                      <li id="dy_tmnlTy[0_1]">Android</li>
                                      <li id="dy_tmnlTy[0_2]">Win</li>
                                      <li id="dy_tmnlTy[0_3]">Mac</li>
                                    </ul>
                                    <!-- /.stContents -->
                                  </div>
                                  <!-- /.stProduct03 -->
                                </div>
                              </td>
                              <td class="stCenter stMiddle">
                                <p>
                                  <a
                                    id="dy_buttonWntBk[0]"
                                    href="https://honto.jp/reg/cart-eb.html#"
                                    onclick=""
                                    class="dyPreventDoubleSubmit"
                                    style="text-decoration: none;"
                                    ><span class="stBtn stSizeXS stInvert"
                                      >ほしい本に入れる</span
                                    ></a
                                  >
                                </p>
                                <p class="stLink01">
                                  <a
                                    id="dy_buttonDel[0]"
                                    href="#"
                                    class="dyPreventDoubleSubmit"
                                    @click="
                                      $store.commit('removeProduct', product)
                                    "
                                    >カートから削除</a
                                  >
                                </p>
                              </td>
                              <td class="stRight stMiddle">
                                <span class="stYen"
                                  ><span>{{
                                    product.price * product.quantity
                                  }}</span
                                  >円</span
                                >（税込）
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <div class="stBoxCart02 stMarginB10">
                          <p class="stChoiceAll" style="display: none;">
                            <a
                              id="dy_linkSelAll"
                              href="https://honto.jp/reg/cart-eb.html#linkTag"
                              onclick="Event.stop(event);"
                              style="text-decoration: none;"
                              ><span class="stBtn stSizeS stInvert stChoiceAll"
                                >すべて選択</span
                              ></a
                            >
                            <span class="addBookBtnWrapper"
                              ><a
                                id="dy_buttonLmpMove"
                                href="https://honto.jp/reg/cart-eb.html#"
                                onclick=""
                                class="dyPreventDoubleSubmit"
                                style="text-decoration: none;"
                                ><span class="stBtn stWish stSizeS"
                                  >選択した商品をまとめてほしい本に追加</span
                                ></a
                              ></span
                            >
                          </p>
                          <p class="deleate" style="display: none;">
                            <a
                              id="dy_buttonLmpDel"
                              href="https://honto.jp/reg/cart-eb.html#"
                              onclick=""
                              class="stLink dyPreventDoubleSubmit"
                              >カートから削除</a
                            >
                          </p>
                          <p class="stCenter" style="text-decoration: none;">
                            <span class="stBtn stSizeS stInvert"
                              >まとめて操作</span
                            >
                          </p>
                          <!-- /.stBoxCart02 -->
                        </div>
                        <!-- /.stMain -->
                      </div>
                      <!-- /.stLayoutMS -->
                    </div>
                    <!-- /.stSection01 -->
                  </div>
                </form>

                <div id="ord-shopping-basket-track-cart"></div>
              </div>
              <div id="pbBlock2653079" class="pbNested pbNestedWrapper">
                <!-- Empty block -->
              </div>
              <div id="pbBlock2653070" class="pbNested pbNestedWrapper">
                <div class="stBoxCarousel01" mode="normal">
                  <div class="stView">
                    <div class="stHdg2">
                      <h2><span>電子で最近チェックした本</span></h2>
                      <div class="stSubTitle">
                        <a href="https://honto.jp/my/store/ck-history.html"
                          >一覧を見る</a
                        >
                      </div>
                      <!-- /stHdg2 -->
                    </div>
                    <!-- /stView -->
                  </div>
                  <div class="stCorusel01">
                    <p
                      class="stBtnPrev stMarginT20"
                      style="text-decoration: none;"
                    >
                      <span class="stBtn stUi stPrev stDisabled">前へ戻る</span>
                    </p>
                    <div class="stView">
                      <ul
                        id="remindCorusel"
                        class="stView stLazyLoad"
                        pageblockid="2653070"
                        coruselparam="pgNum=&amp;dispNum=NA&amp;itmRefineCls=0&amp;dispRoot=CARTEB&amp;adultDisplayFlg=&amp;pgnm=%2Freg%2Fcart-eb"
                        style="width: 813px; transform: translateX(0px);"
                      >
                        <li
                          startitemnum="0"
                          maxitemnum="6"
                          data-index="0"
                          style="margin-right: 37px;"
                        >
                          <div class="stItem">
                            <div class="stPhoto">
                              <div class="stBookItem">
                                <a
                                  href="https://honto.jp/ebook/pd_25914816.html"
                                  style="text-decoration: none;"
                                  ><span
                                    class="stBtn stFav"
                                    style="right: -56px; top: -56px;"
                                    ><span></span><span></span>ワールドトリガー
                                    1</span
                                  >
                                  <div class="stSummary">
                                    <p class="stTitle">ワールドトリガー 1</p>
                                    <p class="stAuthor">葦原大介（著者）</p>
                                    <!-- /stSummary -->
                                  </div>
                                </a>
                                <div class="stCover">
                                  <img
                                    class="lazyloaded"
                                    src="~/assets/img/dnp/product/25914816_1BL.png"
                                    data-src="https://image.honto.jp/item/1/133/2591/4816/25914816_1BL.png"
                                    alt="ワールドトリガー 1（ジャンプコミックスDIGITAL）"
                                    width="133"
                                    height="180"
                                  />
                                </div>
                              </div>
                            </div>
                            <p>
                              <span class="stIconProduct01">コミック</span>
                            </p>
                            <p class="stTitle">
                              <a href="https://honto.jp/ebook/pd_25914816.html"
                                >ワールドトリガー 1</a
                              >
                            </p>
                            <p class="stAuthor">
                              <a
                                href="https://honto.jp/ebook/search.html?athid=1001882453"
                                >葦原大介（著者）</a
                              >
                            </p>
                            <p class="stReview">
                              <img
                                src="~/assets/img/dnp/product/img_star45_l.png"
                                alt="4.4"
                                class="stStar"
                                height="11"
                                width="57"
                              />
                              （<a
                                href="https://honto.jp/ebook/pd-review_0625914816_192.html"
                                >レビュー：82件</a
                              >）
                            </p>

                            <p class="stPrice">
                              税込価格：<span class="stYen"
                                ><span>460</span>円</span
                              >（<span class="stPoint">4pt</span>）
                            </p>
                            <p>
                              <a
                                href="https://honto.jp/reg/cart-eb.html#"
                                onclick="moveCartItem.moveCartItem(&#39;25914816&#39;, &#39;2653070&#39;, &#39;1&#39;,&#39;2&#39;,&#39;ip_eb_crrcc_00&#39; , this); Event.stop(event);"
                                style="text-decoration: none;"
                              >
                                <span class="stBtn stAction stSizeM stEbBtn"
                                  ><span>電子書籍を</span>カートに入れる</span
                                >
                              </a>
                            </p>
                            <p class="stDelete stMarginT10">
                              <a
                                href="https://honto.jp/reg/cart-eb.html#"
                                onclick="HC.Ajax.update(2653070, null, &#39;remindId=25914816&amp;pgNum=&amp;dispNum=NA&amp;itmRefineCls=0&amp;dispRoot=CARTEB&amp;adultDisplayFlg=&amp;pgnm=%2Freg%2Fcart-eb&#39;);return false;"
                                >履歴を削除</a
                              >
                            </p>
                            <!-- /.stItem -->
                          </div>
                        </li>
                        <li
                          startitemnum="0"
                          maxitemnum="6"
                          data-index="1"
                          style="margin-right: 37px;"
                        >
                          <div class="stItem">
                            <div class="stPhoto">
                              <div class="stBookItem">
                                <a
                                  href="https://honto.jp/ebook/pd_29974975.html"
                                  style="text-decoration: none;"
                                  ><span
                                    class="stBtn stFav"
                                    style="right: -56px; top: -56px;"
                                    ><span></span><span></span>ワールドトリガー
                                    21</span
                                  >
                                  <div class="stSummary">
                                    <p class="stTitle">ワールドトリガー 21</p>
                                    <p class="stAuthor">葦原大介（著者）</p>
                                    <!-- /stSummary -->
                                  </div>
                                </a>
                                <div class="stCover">
                                  <img
                                    class="lazyloaded"
                                    src="~/assets/img/dnp/product/29974975_1BL.png"
                                    data-src="https://image.honto.jp/item/1/133/2997/4975/29974975_1BL.png"
                                    alt="ワールドトリガー 21（ジャンプコミックスDIGITAL）"
                                    width="133"
                                    height="180"
                                  />
                                </div>
                              </div>
                            </div>
                            <p>
                              <span class="stIconProduct01">コミック</span>
                            </p>
                            <p class="stTitle">
                              <a href="https://honto.jp/ebook/pd_29974975.html"
                                >ワールドトリガー 21</a
                              >
                            </p>
                            <p class="stAuthor">
                              <a
                                href="https://honto.jp/ebook/search.html?athid=1001882453"
                                >葦原大介（著者）</a
                              >
                            </p>
                            <p class="stReview">
                              <img
                                src="~/assets/img/dnp/product/img_star45_l.png"
                                alt="4.6"
                                class="stStar"
                                height="11"
                                width="57"
                              />
                              （<a
                                href="https://honto.jp/ebook/pd-review_0629974975_192.html"
                                >レビュー：12件</a
                              >）
                            </p>

                            <p class="stPrice">
                              税込価格：<span class="stYen"
                                ><span>460</span>円</span
                              >（<span class="stPoint">4pt</span>）
                            </p>
                            <p>
                              <a
                                href="https://honto.jp/reg/cart-eb.html#"
                                onclick="moveCartItem.moveCartItem(&#39;29974975&#39;, &#39;2653070&#39;, &#39;1&#39;,&#39;2&#39;,&#39;ip_eb_crrcc_00&#39; , this); Event.stop(event);"
                                style="text-decoration: none;"
                              >
                                <span class="stBtn stAction stSizeM stEbBtn"
                                  ><span>電子書籍を</span>カートに入れる</span
                                >
                              </a>
                            </p>
                            <p class="stDelete stMarginT10">
                              <a
                                href="https://honto.jp/reg/cart-eb.html#"
                                onclick="HC.Ajax.update(2653070, null, &#39;remindId=29974975&amp;pgNum=&amp;dispNum=NA&amp;itmRefineCls=0&amp;dispRoot=CARTEB&amp;adultDisplayFlg=&amp;pgnm=%2Freg%2Fcart-eb&#39;);return false;"
                                >履歴を削除</a
                              >
                            </p>
                            <!-- /.stItem -->
                          </div>
                        </li>
                        <li
                          startitemnum="0"
                          maxitemnum="6"
                          data-index="2"
                          style="margin-right: 37px;"
                        >
                          <div class="stItem">
                            <div class="stPhoto">
                              <div class="stBookItem">
                                <a
                                  href="https://honto.jp/ebook/pd_29937336.html"
                                  style="text-decoration: none;"
                                  ><span
                                    class="stBtn stFav"
                                    style="right: -56px; top: -56px;"
                                    ><span></span
                                    ><span></span>となりの育児くん。（分冊版）
                                    【第12話】</span
                                  >
                                  <div class="stSummary">
                                    <p class="stTitle">
                                      となりの育児くん。（分冊版） 【第12話】
                                    </p>
                                    <p class="stAuthor">NYAN</p>
                                    <!-- /stSummary -->
                                  </div>
                                </a>
                                <div class="stCover">
                                  <img
                                    class="lazyloaded"
                                    src="~/assets/img/dnp/product/29937336_1BL.png"
                                    data-src="https://image.honto.jp/item/1/133/2993/7336/29937336_1BL.png"
                                    alt="となりの育児くん。（分冊版） 【第12話】"
                                    width="133"
                                    height="180"
                                  />
                                </div>
                              </div>
                            </div>
                            <p>
                              <span class="stIconProduct01">コミック</span>
                            </p>
                            <p class="stTitle">
                              <a href="https://honto.jp/ebook/pd_29937336.html"
                                >となりの育児くん。（分冊版） 【第1...</a
                              >
                            </p>
                            <p class="stAuthor">
                              <a
                                href="https://honto.jp/ebook/search.html?athid=1001786566"
                                >NYAN</a
                              >
                            </p>
                            <p class="stReview">
                              <img
                                src="~/assets/img/dnp/product/img_star5_l.png"
                                alt="5.0"
                                class="stStar"
                                height="11"
                                width="57"
                              />
                              （<a
                                href="https://honto.jp/ebook/pd-review_0629937336_192.html"
                                >レビュー：1件</a
                              >）
                            </p>

                            <p class="stPrice">
                              税込価格：<span class="stYen"
                                ><span>165</span>円</span
                              >（<span class="stPoint">1pt</span>）
                            </p>
                            <p>
                              <a
                                href="https://honto.jp/reg/cart-eb.html#"
                                onclick="moveCartItem.moveCartItem(&#39;29937336&#39;, &#39;2653070&#39;, &#39;1&#39;,&#39;2&#39;,&#39;ip_eb_crrcc_00&#39; , this); Event.stop(event);"
                                style="text-decoration: none;"
                              >
                                <span class="stBtn stAction stSizeM stEbBtn"
                                  ><span>電子書籍を</span>カートに入れる</span
                                >
                              </a>
                            </p>
                            <p class="stDelete stMarginT10">
                              <a
                                href="https://honto.jp/reg/cart-eb.html#"
                                onclick="HC.Ajax.update(2653070, null, &#39;remindId=29937336&amp;pgNum=&amp;dispNum=NA&amp;itmRefineCls=0&amp;dispRoot=CARTEB&amp;adultDisplayFlg=&amp;pgnm=%2Freg%2Fcart-eb&#39;);return false;"
                                >履歴を削除</a
                              >
                            </p>
                            <!-- /.stItem -->
                          </div>
                        </li>
                        <li
                          startitemnum="0"
                          maxitemnum="6"
                          data-index="3"
                          style="margin-right: 37px;"
                        >
                          <div class="stItem">
                            <div class="stPhoto">
                              <div class="stBookItem">
                                <a
                                  href="https://honto.jp/ebook/pd_30271593.html"
                                  style="text-decoration: none;"
                                  ><span
                                    class="stBtn stFav"
                                    style="right: -56px; top: -56px;"
                                    ><span></span
                                    ><span></span>BEASTARS&emsp;18</span
                                  >
                                  <div class="stSummary">
                                    <p class="stTitle">BEASTARS&emsp;18</p>
                                    <p class="stAuthor">板垣巴留</p>
                                    <!-- /stSummary -->
                                  </div>
                                </a>
                                <div class="stCover">
                                  <img
                                    class="lazyloaded"
                                    src="~/assets/img/dnp/product/30271593_1BL.png"
                                    data-src="https://image.honto.jp/item/1/133/3027/1593/30271593_1BL.png"
                                    alt="BEASTARS&emsp;18（少年チャンピオン・コミックス）"
                                    width="133"
                                    height="180"
                                  />
                                </div>
                              </div>
                            </div>
                            <p>
                              <span class="stIconProduct01">コミック</span>
                            </p>
                            <p class="stTitle">
                              <a href="https://honto.jp/ebook/pd_30271593.html"
                                >BEASTARS&emsp;18</a
                              >
                            </p>
                            <p class="stAuthor">
                              <a
                                href="https://honto.jp/ebook/search.html?athid=1002225965"
                                >板垣巴留</a
                              >
                            </p>
                            <p class="stReview">
                              <img
                                src="~/assets/img/dnp/product/img_star5_l.png"
                                alt="4.8"
                                class="stStar"
                                height="11"
                                width="57"
                              />
                              （<a
                                href="https://honto.jp/ebook/pd-review_0630271593_192.html"
                                >レビュー：4件</a
                              >）
                            </p>

                            <p class="stPrice">
                              税込価格：<span class="stYen"
                                ><span>440</span>円</span
                              >（<span class="stPoint">4pt</span>）
                            </p>
                            <p>
                              <a
                                href="https://honto.jp/reg/cart-eb.html#"
                                onclick="moveCartItem.moveCartItem(&#39;30271593&#39;, &#39;2653070&#39;, &#39;1&#39;,&#39;2&#39;,&#39;ip_eb_crrcc_00&#39; , this); Event.stop(event);"
                                style="text-decoration: none;"
                              >
                                <span class="stBtn stAction stSizeM stEbBtn"
                                  ><span>電子書籍を</span>カートに入れる</span
                                >
                              </a>
                            </p>
                            <p class="stDelete stMarginT10">
                              <a
                                href="https://honto.jp/reg/cart-eb.html#"
                                onclick="HC.Ajax.update(2653070, null, &#39;remindId=30271593&amp;pgNum=&amp;dispNum=NA&amp;itmRefineCls=0&amp;dispRoot=CARTEB&amp;adultDisplayFlg=&amp;pgnm=%2Freg%2Fcart-eb&#39;);return false;"
                                >履歴を削除</a
                              >
                            </p>
                            <!-- /.stItem -->
                          </div>
                        </li>
                        <li
                          startitemnum="0"
                          maxitemnum="6"
                          data-index="4"
                          style="margin-right: 37px;"
                        >
                          <div class="stItem">
                            <div class="stPhoto">
                              <div class="stBookItem">
                                <a
                                  href="https://honto.jp/ebook/pd_28181281.html"
                                  style="text-decoration: none;"
                                  ><span
                                    class="stBtn stFav"
                                    style="right: -56px; top: -56px;"
                                    ><span></span><span></span>ワールドトリガー
                                    17</span
                                  >
                                  <div class="stSummary">
                                    <p class="stTitle">ワールドトリガー 17</p>
                                    <p class="stAuthor">葦原大介（著者）</p>
                                    <!-- /stSummary -->
                                  </div>
                                </a>
                                <div class="stCover">
                                  <img
                                    class="lazyloaded"
                                    src="~/assets/img/dnp/product/28181281_1BL.png"
                                    data-src="https://image.honto.jp/item/1/133/2818/1281/28181281_1BL.png"
                                    alt="ワールドトリガー 17（ジャンプコミックスDIGITAL）"
                                    width="133"
                                    height="180"
                                  />
                                </div>
                              </div>
                            </div>
                            <p>
                              <span class="stIconProduct01">コミック</span>
                            </p>
                            <p class="stTitle">
                              <a href="https://honto.jp/ebook/pd_28181281.html"
                                >ワールドトリガー 17</a
                              >
                            </p>
                            <p class="stAuthor">
                              <a
                                href="https://honto.jp/ebook/search.html?athid=1001882453"
                                >葦原大介（著者）</a
                              >
                            </p>
                            <p class="stReview">
                              <img
                                src="~/assets/img/dnp/product/img_star5_l.png"
                                alt="4.8"
                                class="stStar"
                                height="11"
                                width="57"
                              />
                              （<a
                                href="https://honto.jp/ebook/pd-review_0628181281_192.html"
                                >レビュー：13件</a
                              >）
                            </p>

                            <p class="stPrice">
                              税込価格：<span class="stYen"
                                ><span>460</span>円</span
                              >（<span class="stPoint">4pt</span>）
                            </p>
                            <p>
                              <a
                                href="https://honto.jp/reg/cart-eb.html#"
                                onclick="moveCartItem.moveCartItem(&#39;28181281&#39;, &#39;2653070&#39;, &#39;1&#39;,&#39;2&#39;,&#39;ip_eb_crrcc_00&#39; , this); Event.stop(event);"
                                style="text-decoration: none;"
                              >
                                <span class="stBtn stAction stSizeM stEbBtn"
                                  ><span>電子書籍を</span>カートに入れる</span
                                >
                              </a>
                            </p>
                            <p class="stDelete stMarginT10">
                              <a
                                href="https://honto.jp/reg/cart-eb.html#"
                                onclick="HC.Ajax.update(2653070, null, &#39;remindId=28181281&amp;pgNum=&amp;dispNum=NA&amp;itmRefineCls=0&amp;dispRoot=CARTEB&amp;adultDisplayFlg=&amp;pgnm=%2Freg%2Fcart-eb&#39;);return false;"
                                >履歴を削除</a
                              >
                            </p>
                            <!-- /.stItem -->
                          </div>
                        </li>
                      </ul>
                    </div>
                    <p
                      class="stBtnNext stMarginT20"
                      style="text-decoration: none;"
                    >
                      <span class="stBtn stUi stNext stDisabled">次に進む</span>
                    </p>
                    <!-- /.stCorusel01 -->
                  </div>
                  <!-- /.stBoxCarousel01 -->
                </div>
              </div>
              <div id="pbBlock2653075" class="pbNested pbNestedWrapper">
                <script type="text/javascript">
                  var dy_pw = document.getElementById('dy_pw')
                  if (dy_pw) dy_pw.focus()
                </script>
              </div>
              <div id="pbBlock2653076" class="pbNested pbNestedWrapper">
                <!-- Empty block -->
              </div>
              <div id="pbBlock2961327" class="pbNested pbNestedWrapper">
                <script type="text/javascript">
                  var deqwas = {}
                  deqwas.cart_item = '29620592'
                  deqwas.cart_quantity = '1'
                  deqwas.uid = ''
                  setTimeout(function() {
                    var script = document.createElement('script')
                    script.type = 'text/javascript'
                    script.charset = 'UTF-8'
                    script.async = true
                    script.src =
                      (location.protocol == 'https:' ? 'https:' : 'http:') +
                      '//dex00.deqwas.net/hontojpad/scripts/c.js?noCache=' +
                      Math.floor((new Date().getTime() + 1.8e7) / 8.64e7)
                    var s = document.getElementsByTagName('script')[0]
                    s.parentNode.insertBefore(script, s)
                  }, 0)
                </script>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--/SHOPPING CART-->
  </main>
  <!--/MAIN-->
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  layout: 'honto',
  computed: {
    ...mapGetters(['getCart', 'getCartTotalPrice', 'getCartLength'])
  },
  methods: {
    onChangeQuantity(event, product) {
      const qty = event.target.value
      this.$store.commit('changeQty', { product, qty })
    },
    checkQty(prodQty, qty) {
      if (parseInt(prodQty) === parseInt(qty)) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
