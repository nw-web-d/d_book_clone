<template>
  <!--FOOTER-->
  <footer>
    <div id="footerArea" class="pbFooterArea">
      <div id="area4" class="pbArea pbAreaDisabled">
        <div class="pbNested">
          <div class="pbNested pbNestedWrapper" id="pbBlock2641111">
            <div
              class="stHeader stFixed stPadding"
              style="display: none; top: -90px;"
            >
              <div class="stHdBlock01 stResponsiveTarget">
                <p class="stLogo stSizeS">
                  <a href="https://honto.jp/"
                    ><img
                      src="~/assets/img/dnp/logo_honto_03.png"
                      alt="honto"
                      width="77"
                      height="37"
                  /></a>
                </p>
                <div class="stHdBlock02">
                  <div class="stHdWordSch">
                    <form
                      action="https://honto.jp/ebook/search.html"
                      id="dy_moduke_stSearchForm"
                      method="get"
                      onsubmit="searchBox(&#39;dy_moduke_&#39;, &#39;https://honto.jp/ebook/search.html&#39;, &#39;ip_hb_hs_01&#39;, 1); return false;"
                    >
                      <input
                        type="hidden"
                        name="tbty"
                        value="0"
                        id="stSearchTbtySlideIn"
                      />
                      <fieldset>
                        <legend>サイト内検索</legend>
                        <div class="stFormCheck">
                          <p>
                            <input
                              id="stHdInput03"
                              type="checkbox"
                              class="stEbBtn"
                              checked=""
                            /><label for="stHdInput03">電子</label>
                          </p>
                          <p>
                            <input
                              id="stHdInput04"
                              type="checkbox"
                              class="stNsBtn"
                            /><label for="stHdInput04">紙</label>
                          </p>
                          <!-- /stFormCheck -->
                        </div>
                        <div class="stFormText01">
                          <input
                            id="stSearchTextBoxSlideIn"
                            placeholder="キーワードを入力"
                            autocomplete="off"
                            type="text"
                            name="k"
                            value=""
                            maxlength="126"
                            pageblockid="2641111"
                            searchtextboxparam="sto_cls=2"
                          />
                        </div>
                        <button type="submit">検索</button>
                        <!-- .stBanner-->
                      </fieldset>
                      <input
                        type="hidden"
                        id="dy_moduke_stGenre"
                        name="gnrcd"
                      />
                      <input
                        type="hidden"
                        id="dy_moduke_stSearchGenre"
                        name="srchGnrNm"
                      />
                      <input type="hidden" name="srchf" value="1" />
                    </form>
                    <!-- .stHdWordSch-->
                  </div>
                  <div class="stHdBlock03">
                    <nav class="stHdUserNav">
                      <ul>
                        <li class="stCart">
                          <em>カート</em>
                          <p class="stEb">
                            <a href="https://honto.jp/reg/cart-eb.html"
                              >電子<span class="dy_ebookCartItemCount stNum"
                                >0</span
                              ></a
                            >
                          </p>
                          <p class="stNs">
                            <a href="https://honto.jp/reg/cart-ns.html"
                              >通販<span class="dy_netstoreCartItemCount stNum"
                                >0</span
                              ></a
                            >
                          </p>
                          <div class="stHdCartDetail01">
                            <ul>
                              <li>
                                <a
                                  href="https://honto.jp/reg/cart-eb.html"
                                  style="
                                      text-decoration: none;
                                      display: inline-block;
                                      vertical-align: bottom;
                                      position: relative;
                                      height: 52px;
                                    "
                                  ><span class="stBtn stCart stSizeM stEbBtn"
                                    ><span>電子書籍の</span>カートを見る (<span
                                      class="dy_ebookCartItemCount stNum"
                                      >0</span
                                    >)</span
                                  ></a
                                >
                              </li>
                              <li>
                                <a
                                  href="https://honto.jp/reg/cart-ns.html"
                                  style="
                                      text-decoration: none;
                                      display: inline-block;
                                      vertical-align: bottom;
                                      position: relative;
                                      height: 52px;
                                    "
                                  ><span class="stBtn stCart stSizeM stNsBtn"
                                    ><span>本の通販の</span>カートを見る (<span
                                      class="dy_netstoreCartItemCount stNum"
                                      >0</span
                                    >)</span
                                  ></a
                                >
                              </li>
                            </ul>
                          </div>
                        </li>
                        <li class="stMyMenu">
                          <a href="https://honto.jp/my.html"
                            ><em>Myメニュー</em></a
                          >
                          <div class="stMyMenuDetail">
                            <div class="stHdBlock stLine">
                              <dl>
                                <dt>総保有ポイント</dt>
                                <dd class="stPoint">
                                  <span class="stNum"> - </span
                                  ><span>ポイント</span>
                                </dd>
                              </dl>
                              <ul>
                                <li>
                                  <a
                                    href="https://honto.jp/my/account/point.html?cid=ip_hb_hm_m08"
                                    >ポイント残高確認</a
                                  >
                                </li>
                                <li>
                                  <a
                                    href="https://honto.jp/my/account/point/footmark.html?cid=ip_hb_hm_m09"
                                    >あしあと抽選ポイント</a
                                  >
                                </li>
                              </ul>
                              <!-- .stHdBlock-->
                            </div>
                            <div class="stHdBlock stLine">
                              <dl>
                                <dt>Myクーポン</dt>
                                <dd class="stPoint">
                                  <span class="stNum"> - </span><span>枚</span>
                                </dd>
                              </dl>
                              <ul>
                                <li>
                                  <a
                                    href="https://honto.jp/my/account/coupon.html?cid=ip_hb_hm_m10"
                                    >クーポン一覧</a
                                  >
                                </li>
                              </ul>
                              <!-- .stHdBlock-->
                            </div>

                            <div class="stHdBlock stLast">
                              <ul>
                                <li>
                                  <a
                                    href="https://honto.jp/my.html?cid=ip_hb_hm_m16"
                                    >Myページ</a
                                  >
                                </li>
                                <li>
                                  <a
                                    href="https://honto.jp/my/shelf.html?cid=ip_hb_hm_m03"
                                    >My本棚</a
                                  >
                                </li>
                                <li>
                                  <a
                                    href="https://honto.jp/my/review.html?cid=ip_hb_hm_m19"
                                    >Myレビュー</a
                                  >
                                </li>
                              </ul>
                              <ul>
                                <li>
                                  <a
                                    href="https://honto.jp/my/wishlist.html?cid=ip_hb_hm_m05"
                                    >ほしい本</a
                                  >
                                </li>
                                <li>
                                  <a
                                    href="https://honto.jp/my/account/history.html?cid=ip_hb_hm_m02"
                                    >購入履歴</a
                                  >
                                </li>
                                <li>
                                  <a
                                    href="https://honto.jp/my/account.html?cid=ip_hb_hm_m04"
                                    >アカウント</a
                                  >
                                </li>
                              </ul>
                              <!-- .stHdBlock.stLast-->
                            </div>
                            <!-- .stMyMenuDetail-->
                          </div>
                          <!-- .stMyMenu-->
                        </li>
                      </ul>
                      <!-- .stHdUserNav-->
                    </nav>
                    <!--stHdBlock03-->
                  </div>
                  <!-- .stHdBlock02-->
                </div>
                <!--.stHdBlock01-->
              </div>
              <!--.stHeader.stFixed-->
            </div>
          </div>

          <div class="pbNested pbNestedWrapper" id="pbBlock2641101">
            <div class="pbNested stFooter">
              <div class="pbNested pbNestedWrapper" id="pbBlock2641103">
                <div class="stFooterInfo02">
                  <div class="stBlockInner">
                    <dl>
                      <dt>
                        hontoからのお知らせ<a href="https://honto.jp/info.html"
                          >一覧</a
                        >
                      </dt>
                      <dd id="newsTitle[0]">
                        <a
                          href="https://honto.jp/info/detail_041000043768.html"
                          id="newsLinkUrl[0]"
                          >新型コロナウイルス感染症の拡大に伴うお客様へのお知らせ</a
                        >
                      </dd>
                      <dd id="newsTitle[1]">
                        <a
                          href="https://honto.jp/info/detail_041000043763.html"
                          id="newsLinkUrl[1]"
                          >新型コロナウイルス感染拡大防止に伴う電話サポート一時休止のお知らせ</a
                        >
                      </dd>
                      <dd id="newsTitle[2]">
                        <a
                          href="https://honto.jp/info/detail_041000043573.html"
                          id="newsLinkUrl[2]"
                          >【丸善・ジュンク堂書店×hontoブックツリー】「人生100年時代に活かす・ビジネスに活かす
                          立ち止まる人のための教養」18店舗で実施！</a
                        >
                      </dd>
                    </dl>
                    <!-- .stBlockInner-->
                  </div>
                  <!-- /.stFooterInfo02-->
                </div>
              </div>
              <div class="pbNested pbNestedWrapper" id="pbBlock2641104">
                <div class="stFooterInfo03">
                  <a href="https://honto.jp/"><p class="stLogo">honto</p></a>
                  <div class="stBlockInner">
                    <div class="stColumn">
                      <p>
                        <a href="https://honto.jp/ebook.html?cid=ip_hb_uhm_01"
                          >電子書籍ストア</a
                        >
                      </p>
                      <div class="stColumn">
                        <ul>
                          <li>
                            <a
                              href="https://honto.jp/ebook/gr/29001000000.html?cid=ip_hb_usm_01"
                              >小説・文学</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/ebook/gr/29007000000.html?cid=ip_hb_usm_02"
                              >経済・ビジネス</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/ebook/gr/29004150000.html?cid=ip_hb_usm_03"
                              >男性コミック</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/ebook/gr/29004160000.html?cid=ip_hb_usm_04"
                              >女性コミック</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/ebook/gr/29037000000.html?cid=ip_hb_usm_05"
                              >ライトノベル</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/ebook/gr/29006000000.html?cid=ip_hb_usm_06"
                              >暮らし・実用</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/ebook/gr/29031000000.html?cid=ip_hb_usm_07"
                              >雑誌</a
                            >
                          </li>
                        </ul>
                        <ul>
                          <li>
                            <a
                              href="https://honto.jp/ebook/gr/29029000000.html?cid=ip_hb_usm_08"
                              >BL(ボーイズラブ)</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/ebook/gr/29039000000.html?cid=ip_hb_usm_12"
                              >TL(ティーンズラブ)</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/ebook/gr/29030000000.html?cid=ip_hb_usm_16"
                              >アダルト</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/sitemap/ebook.html?cid=ip_hb_usm_13"
                              >ジャンル一覧</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/cp/ebook/recent/free.html?cid=ip_hb_usm_14"
                              >無料一覧</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/cp/ebook/recent/sale.html?cid=ip_hb_usm_15"
                              >セール一覧</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/ebook/release_012_103.html?cid=ip_hb_usm_10"
                              >新着予約一覧</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/ebook/feature.html?cid=ip_hb_usm_11"
                              >特集一覧</a
                            >
                          </li>
                        </ul>
                        <!-- stColumn-->
                      </div>
                      <!-- stColumn-->
                    </div>
                    <div class="stColumn">
                      <p>
                        <a
                          href="https://honto.jp/netstore.html?cid=ip_hb_uhm_02"
                          >本の通販ストア</a
                        >
                      </p>
                      <div class="stColumn">
                        <ul>
                          <li>
                            <a
                              href="https://honto.jp/netstore/gr/19001000000.html?cid=ip_hb_usm_43"
                              >小説・文学</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/netstore/gr/19002000000.html?cid=ip_hb_usm_31"
                              >文庫</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/netstore/gr/19007000000.html?cid=ip_hb_usm_32"
                              >経済・ビジネス</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/netstore/gr/19004150000.html?cid=ip_hb_usm_33"
                              >男性コミック</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/netstore/gr/19004160000.html?cid=ip_hb_usm_34"
                              >女性コミック</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/netstore/gr/19006000000.html?cid=ip_hb_usm_35"
                              >暮らし・実用</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/netstore/gr/19038000000.html?cid=ip_hb_usm_42"
                              >アウトレットブック</a
                            >
                          </li>
                        </ul>
                        <ul>
                          <li>
                            <a
                              href="https://honto.jp/netstore/gr/5.html?cid=ip_hb_usm_36"
                              >雑誌</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/netstore/gr/3.html?cid=ip_hb_usm_37"
                              >Music</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/netstore/gr/4.html?cid=ip_hb_usm_41"
                              >DVD</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/netstore/gr/19040000000.html?cid=ip_hb_usm_44"
                              >文具・雑貨</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/sitemap/netstore.html?cid=ip_hb_usm_45"
                              >ジャンル一覧</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/netstore/release_011_1050.html?cid=ip_hb_usm_38"
                              >新刊予約一覧</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/netstore/feature.html?cid=ip_hb_usm_39"
                              >特集一覧</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/netstore/bookoff.html?cid=ip_hb_usm_40"
                              >中古買取</a
                            >
                          </li>
                        </ul>
                        <!-- stColumn-->
                      </div>
                      <!-- stColumn-->
                    </div>
                    <div class="stColumn stLast">
                      <p>
                        <a href="https://honto.jp/store.html?cid=ip_hb_uhm_03"
                          >店舗情報</a
                        >
                      </p>
                      <div class="stColumn">
                        <ul>
                          <li>
                            <a
                              href="https://honto.jp/store/maruzen.html?cid=ip_hb_usm_51"
                              >丸善</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/store/junkudo.html?cid=ip_hb_usm_52"
                              >ジュンク堂</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/store/bunkyodo.html?cid=ip_hb_usm_53"
                              >文教堂</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://honto.jp/store/areasearch.html?cid=ip_hb_usm_54"
                              >店舗検索</a
                            >
                          </li>
                        </ul>
                        <!-- stColumn-->
                      </div>
                      <!-- stColumn-->
                    </div>
                    <nav class="stNav">
                      <ul>
                        <li>
                          <a
                            href="https://honto.jp/booktree.html?cid=ip_hb_footerInfo_01"
                            class="stInfo01"
                            >著者・著名人が薦める<br />テーマから本と出会える<br />ブックツリー</a
                          >
                        </li>
                        <li>
                          <a
                            href="https://honto.jp/article/hontoplus.html?cid=ip_hb_footerInfo_02"
                            class="stInfo05"
                            >本や書店の魅力発信<br />フリーマガジン<br />honto+</a
                          >
                        </li>
                        <li>
                          <a
                            href="https://honto.jp/netstore/bookoff.html?cid=ip_hb_footerInfo_03"
                            class="stInfo03"
                            >不要な本・CD・DVD・<br />ゲームが売れる<br />宅配買取
                            宅本便</a
                          >
                        </li>
                        <li>
                          <a
                            href="https://honto.jp/cp/ebook/recent/free.html?cid=ip_hb_footerInfo_04"
                            class="stInfo04"
                            >あの有名作品が<br />今だけ無料！<br />無料の本＆コミック</a
                          >
                        </li>
                      </ul>
                      <!-- stNav-->
                    </nav>
                    <!-- stBlockInner-->
                  </div>
                  <p class="stPageNav01">
                    <a
                      href="https://honto.jp/ebook/pd_25914816.html?cid=ip_ebset_setcontents_01#page"
                      >このページの先頭へ</a
                    >
                  </p>
                  <!--.stFooterInfo03-->
                </div>
                <div class="stFooterInfo04">
                  <nav class="stNav">
                    <ul>
                      <li>
                        <a href="https://honto.jp/reg?cid=ip_hb_mbf_14"
                          >会員登録</a
                        >
                      </li>
                      <li>
                        <a
                          href="https://honto.jp/reg/cart-eb.html?cid=ip_hb_mbf_02"
                          >カートを見る</a
                        >
                      </li>
                      <li>
                        <a
                          href="https://honto.jp/my/wishlist.html?cid=ip_hb_mbf_06"
                          >お気に入り</a
                        >
                      </li>
                      <li>
                        <a href="https://honto.jp/myinfo.html?cid=ip_hb_mbf_12"
                          >お知らせ</a
                        >
                      </li>
                    </ul>
                    <!-- stNav-->
                  </nav>
                  <!-- stFooterInfo04-->
                </div>
                <div class="stFooterInfo05">
                  <div class="stBlockInner">
                    <nav class="stNav">
                      <ul>
                        <li>
                          <a href="https://honto.jp/company.html">運営会社</a>
                        </li>
                        <li>
                          <a href="https://honto.jp/agreement.html"
                            >サービス利用規約</a
                          >
                        </li>
                        <li>
                          <a href="https://www.dnp.co.jp/privacy/"
                            >個人情報保護方針</a
                          >
                        </li>
                        <li>
                          <a href="https://honto.jp/privacy.html"
                            >個人情報の取り扱いについて</a
                          >
                        </li>
                        <li>
                          <a href="https://honto.jp/transactions.html"
                            >特定商取引に基づく表示</a
                          >
                        </li>
                        <li>
                          <a href="https://honto.jp/settlement.html"
                            >資金決済法に基づく表示</a
                          >
                        </li>
                        <li>
                          <a href="https://honto.jp/abj.html"
                            >コンテンツ使用許諾について</a
                          >
                        </li>
                        <li>
                          <a href="https://honto.jp/sitemap.html"
                            >サイトマップ</a
                          >
                        </li>
                        <li>
                          <a href="https://honto.jp/affiliate.html"
                            >紹介プログラム</a
                          >
                        </li>
                        <li>
                          <a href="https://help.honto.jp/" target="_blank"
                            >ヘルプ・お問い合わせ</a
                          >
                        </li>
                      </ul>
                      <!-- stNav-->
                    </nav>
                    <ul class="stSns">
                      <li>
                        <a
                          class="stSnsLine"
                          href="https://line.me/R/ti/p/%40pwo2641e"
                          target="_blank"
                          rel="noopener noreferrer"
                          >LINE</a
                        >
                      </li>
                      <li>
                        <a
                          class="stSnsTwitter"
                          href="https://twitter.com/honto_jp"
                          target="_blank"
                          rel="noopener noreferrer"
                          >Twitter</a
                        >
                      </li>
                      <li>
                        <a
                          class="stSnsInstagram"
                          href="https://instagram.com/hontojp/"
                          target="_blank"
                          rel="noopener noreferrer"
                          >Instagram</a
                        >
                      </li>
                    </ul>
                    <!-- stBlockInner-->
                  </div>
                  <p class="stCopyright">
                    Copyright © Dai Nippon Printing Co., Ltd.
                  </p>
                  <!-- /stFooterInfo05-->
                </div>
                <input
                  type="hidden"
                  id="dy_footerPageBlockId"
                  value="2641104"
                />

                <div
                  class="stFloatingBanner01 stHide"
                  id="dy_MigrationFloatingBanner"
                >
                  <a
                    class="stFloatingBanner01__close"
                    href="javascript:void(0);"
                    onclick="notificationPermission.closeFloatingBanner();"
                    >×</a
                  >
                  <div class="stFloatingBanner01__inner">
                    <p class="stFloatingBanner01__header">
                      hontoからおトクな情報をお届けします！
                    </p>
                    <div class="stFloatingBanner01__icon">
                      <img alt="" src="~/assets/img/dnp/logo_honto_02.png" />
                    </div>
                    <p class="stFloatingBanner01__text">
                      割引きクーポンや人気の特集ページ、ほしい本の値下げ情報などをプッシュ通知でいち早くお届けします。
                    </p>
                    <ul class="stFloatingBanner01__button-wrapper">
                      <li>
                        <a
                          href="javascript:void(0);"
                          style="text-decoration: none;"
                          ><span
                            class="stFloatingBanner01__button stBtn stSizeM stInvert stCancel"
                            onclick="notificationPermission.skipPermission();"
                            >キャンセル</span
                          ></a
                        >
                      </li>
                      <li>
                        <a
                          href="javascript:void(0);"
                          style="text-decoration: none;"
                          ><span
                            class="stFloatingBanner01__button stBtn stSizeM stInvert"
                            onclick="browserPushAjax.pushPermission();notificationPermission.closeFloatingBanner();"
                            >通知設定に進む</span
                          ></a
                        >
                      </li>
                    </ul>
                  </div>
                </div>

                <script
                  type="text/javascript"
                  src="~/assets/js/dnp/firebase-app.js"
                ></script>
                <script
                  type="text/javascript"
                  src="~/assets/js/dnp/firebase-messaging.js"
                ></script>
                <script type="text/javascript"></script>
              </div>
              <div class="pbNested pbNestedWrapper" id="pbBlock2641105">
                <!-- Empty block -->
              </div>
              <div class="pbNested pbNestedWrapper" id="pbBlock2641106">
                <script
                  type="text/javascript"
                  src="~/assets/js/dnp/s_code.min.js"
                ></script>
                <script type="text/javascript">
                  <!--
                  /**
                   * SiteCatalystに送信する値を設定<br>
                   * @param pageName s.pageNameの値
                   * @param prop51   s.prop51の値
                   * @param prop52   s.prop52の値
                   * @param prop53   s.prop53の値
                   * @param prop54   s.prop54の値
                   * @param prop55   s.prop55の値
                   */
                  function setCatalystParameter(pageName, prop51, prop52, prop53, prop54, prop55) {
                      s.eVar3 = "D=c3";
                      s.eVar5 = "D=c5";
                      s.eVar6 = "D=c6";
                      s.eVar7 = "D=c7";
                      s.eVar8 = "D=c8";
                      s.eVar9 = "D=c9";
                      s.eVar10 = "D=c10";
                      s.eVar22 = "D=c22";
                      s.eVar23 = "D=c23";
                      s.eVar25 = "D=c25";
                      s.eVar26 = "D=c26";
                      s.eVar27 = "D=c27";
                      s.prop27 = decodeURIComponent("honto%E3%83%88%E3%83%83%E3%83%97%20%3E%20%E9%9B%BB%E5%AD%90%E6%9B%B8%E7%B1%8D%20%3E%20%E6%BC%AB%E7%94%BB%E3%83%BB%E3%82%B3%E3%83%9F%E3%83%83%E3%82%AF%20%3E%20%E7%94%B7%E6%80%A7%E5%90%91%E3%81%91%E3%82%B3%E3%83%9F%E3%83%83%E3%82%AF%20%3E%20%E9%9B%86%E8%8B%B1%E7%A4%BE%20%3E%20%E3%82%B8%E3%83%A3%E3%83%B3%E3%83%97%E3%82%B3%E3%83%9F%E3%83%83%E3%82%AF%E3%82%B9DIGITAL%20%3E%20%E3%83%AF%E3%83%BC%E3%83%AB%E3%83%89%E3%83%88%E3%83%AA%E3%82%AC%E3%83%BC%20%3E%20%E3%83%AF%E3%83%BC%E3%83%AB%E3%83%89%E3%83%88%E3%83%AA%E3%82%AC%E3%83%BC%201");
                      s.prop23 = decodeURIComponent("203");
                      s.prop25 = decodeURIComponent("https%3A%2F%2Fhonto.jp%2Febook%2Fpd_25914816.html%3Fcid%3Dip_ebset_setcontents_01");
                      s.prop26 = decodeURIComponent("460");
                      s.products = decodeURIComponent("%3B2-25914816%3B%3B460%3B%3Bevar22%3D1-4.4%7Cevar23%3D203%7Cevar25%3Dhttps%3A%2F%2Fhonto.jp%2Febook%2Fpd_25914816.html%3Fcid%3Dip_ebset_setcontents_01%7Cevar26%3D460%7Cevar27%3Dhonto%E3%83%88%E3%83%83%E3%83%97%20%26gt%3B%20%E9%9B%BB%E5%AD%90%E6%9B%B8%E7%B1%8D%20%26gt%3B%20%E6%BC%AB%E7%94%BB%E3%83%BB%E3%82%B3%E3%83%9F%E3%83%83%E3%82%AF%20%26gt%3B%20%E7%94%B7%E6%80%A7%E5%90%91%E3%81%91%E3%82%B3%E3%83%9F%E3%83%83%E3%82%AF%20%26gt%3B%20%E9%9B%86%E8%8B%B1%E7%A4%BE%20%26gt%3B%20%E3%82%B8%E3%83%A3%E3%83%B3%E3%83%97%E3%82%B3%E3%83%9F%E3%83%83%E3%82%AF%E3%82%B9DIGITAL%20%26gt%3B%20%E3%83%AF%E3%83%BC%E3%83%AB%E3%83%89%E3%83%88%E3%83%AA%E3%82%AC%E3%83%BC%20%26gt%3B%20%E3%83%AF%E3%83%BC%E3%83%AB%E3%83%89%E3%83%88%E3%83%AA%E3%82%AC%E3%83%BC%201");
                      s.prop22 = decodeURIComponent("1-4.4");
                      s.prop10 = decodeURIComponent("833830e1-7924-11ea-8690-0f02ca05f4d9.2");
                      s.prop3 = decodeURIComponent("1");
                      s.prop5 = decodeURIComponent("MA");
                      s.prop6 = decodeURIComponent("1");
                      s.prop7 = decodeURIComponent("https%3A%2F%2Fhonto.jp%2Febook");
                      s.prop8 = decodeURIComponent("honto.jp");
                      s.prop9 = decodeURIComponent("0");
                      if (pageName.length > 0) {
                          // pageNameがパラメータで指定された場合
                          s.pageName = pageName;
                          s.prop51 = prop51;
                          s.prop52 = prop52;
                          s.prop53 = prop53;
                          s.prop54 = prop54;
                          s.prop55 = prop55;
                      } else {
                          // pageNameがパラメータで指定されない場合
                          s.events = decodeURIComponent("prodView%2Cevent1");
                          s.pageName='ebook/pd/' + decodeURIComponent('%E3%83%AF%E3%83%BC%E3%83%AB%E3%83%89%E3%83%88%E3%83%AA%E3%82%AC%E3%83%BC%201'); s.prop51='ip_ebset_setcontents_01;1;ebook/pd/' + decodeURIComponent('%E3%83%AF%E3%83%BC%E3%83%AB%E3%83%89%E3%83%88%E3%83%AA%E3%82%AC%E3%83%BC%201'); s.prop52='1;ebook/pd/' + decodeURIComponent('%E3%83%AF%E3%83%BC%E3%83%AB%E3%83%89%E3%83%88%E3%83%AA%E3%82%AC%E3%83%BC%201'); s.prop53='1;ebook'; s.prop54='1;ebook/pd'; s.prop55='1;ebook/pd/' + decodeURIComponent('%E3%83%AF%E3%83%BC%E3%83%AB%E3%83%89%E3%83%88%E3%83%AA%E3%82%AC%E3%83%BC%201');
                      }
                      s_sc(s);
                  }
                  //-->
                </script>
                <script type="text/javascript">
                  <!--
                  setCatalystParameter('', '', '', '', '', '');
                  //-->
                </script>
                <script type="text/javascript">
                  <!--

                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());

                  gtag('config', 'UA-24385593-3',  { 'cookie_domain': 'honto.jp', 'optimize_id': 'GTM-P4QTCWH' });

                  (function() {
                      var ga = document.createElement('script');
                      ga.type = 'text/javascript';
                      ga.async = true;
                      ga.src = 'https://www.googletagmanager.com/gtag/js?id=UA-24385593-3';
                      document.head.appendChild(ga);
                  })();
                  //-->
                </script>
                <script
                  type="text/javascript"
                  src="~/assets/js/dnp/vclp.js"
                  async=""
                ></script>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
  <!--/FOOTER-->
</template>
