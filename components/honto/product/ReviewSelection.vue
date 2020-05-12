<template>
  <div>
    <div id="pbBlock2641045" class="pbNested pbNestedWrapper">
      <div class="pbNested stUserReview01">
        <div id="pbBlock2641047" class="pbNested pbNestedWrapper">
          <div class="pbNested stBoxReview07">
            <div id="pbBlock2641053" class="pbNested pbNestedWrapper">
              <div class="stBlock">
                <div class="stColumn">
                  <h2>
                    みんなのレビュー<span
                      >（<a
                        href="https://honto.jp/ebook/pd-review_0625914816.html?cid=ip_ebset_setcontents_01"
                        >82件</a
                      >）</span
                    >
                  </h2>
                  <p class="stTotalRating">
                    <span class="stTitle">みんなの評価</span>
                    <StarRating :rating="product.rating" :star-size="25" />
                    <span class="stRating10">{{ product.rating }}</span>
                  </p>
                  <template v-if="$auth.$state.loggedIn">
                    <div>
                      <p>
                        <nuxt-link
                          :to="{
                            name: 'review-id',
                            params: { id: product._id }
                          }"
                          style="text-decoration: none;"
                        >
                          <span class="stBtn stSizeXS stInvert"
                            >レビューを書く</span
                          ></nuxt-link
                        >
                      </p>
                    </div>
                  </template>
                </div>
                <div class="stColumn stReviewItem">
                  <p>評価内訳</p>
                  <ul>
                    <li>
                      <span
                        ><span style="width: 41%;" class="stReview11"
                          ><span class="stRating">星 5</span>
                          <span class="stNumber"
                            >(<a
                              href="https://honto.jp/ebook/pd-review_0625914816.html?cid=ip_ebset_setcontents_01&amp;rtcl=05"
                              ><span class="stNum">34件</span></a
                            >)</span
                          >
                        </span></span
                      >
                    </li>
                    <li>
                      <span
                        ><span style="width: 27%;" class="stReview09"
                          ><span class="stRating">星 4</span>
                          <span class="stNumber"
                            >(<a
                              href="https://honto.jp/ebook/pd-review_0625914816.html?cid=ip_ebset_setcontents_01&amp;rtcl=04"
                              ><span class="stNum">22件</span></a
                            >)</span
                          >
                        </span></span
                      >
                    </li>
                    <li>
                      <span
                        ><span style="width: 20%;" class="stReview07"
                          ><span class="stRating">星 3</span>
                          <span class="stNumber"
                            >(<a
                              href="https://honto.jp/ebook/pd-review_0625914816.html?cid=ip_ebset_setcontents_01&amp;rtcl=03"
                              ><span class="stNum">16件</span></a
                            >)</span
                          >
                        </span></span
                      >
                    </li>
                    <li>
                      <span
                        ><span style="width: 1%;" class="stReview05"
                          ><span class="stRating">星 2</span>
                          <span class="stNumber"
                            >(<a
                              href="https://honto.jp/ebook/pd-review_0625914816.html?cid=ip_ebset_setcontents_01&amp;rtcl=02"
                              ><span class="stNum">1件</span></a
                            >)</span
                          >
                        </span></span
                      >
                    </li>

                    <li>
                      <span
                        ><span style="width: 1%;" class="stReview03"
                          ><span class="stRating">星 1</span>
                          <span class="stNumber"
                            >(<a
                              href="https://honto.jp/ebook/pd-review_0625914816.html?cid=ip_ebset_setcontents_01&amp;rtcl=01"
                              ><span class="stNum">1件</span></a
                            >)</span
                          >
                        </span></span
                      >
                    </li>
                  </ul>
                </div>
                <!-- .stBlock-->
              </div>
            </div>
          </div>
        </div>
        <div id="pbBlock2641046" class="pbNested pbNestedWrapper">
          <div class="pbNested stUserReview01">
            <div id="pbBlock2641052" class="pbNested pbNestedWrapper">
              <nav class="stReviewSort">
                <dl>
                  <dt>並び順を変更する</dt>
                  <dd>
                    <a
                      href="https://honto.jp/ebook/pd_25914816_092.html?cid=ip_ebset_setcontents_01"
                      >役に立った順</a
                    >
                  </dd>
                  <dd>
                    <a
                      href="https://honto.jp/ebook/pd_25914816_093.html?cid=ip_ebset_setcontents_01"
                      >投稿日の新しい順</a
                    >
                  </dd>
                  <dd class="stCurrent">評価の高い順</dd>
                  <dd>
                    <a
                      href="https://honto.jp/ebook/pd_25914816_094.html?cid=ip_ebset_setcontents_01"
                      >評価の低い順</a
                    >
                  </dd>
                </dl>
              </nav>

              <div
                v-for="review in reviews"
                id="stReviewOver"
                :key="review._id"
              >
                <div class="stBoxReview04">
                  <div class="stHeading">
                    <p>
                      <span class="stIconProduct01">電子書籍</span>
                    </p>
                    <h3>{{ review.headline }}</h3>
                    <p class="stDate">2016/01/02 16:01</p>
                  </div>
                  <p class="stUtility">
                    8人中、8人の方がこのレビューが役に立ったと投票しています。
                  </p>
                  <p class="stReviewer">
                    <span class="stReview11">
                      <!-- Review Star -->
                      <StarRating :rating="review.rating" :star-size="15" />
                    </span>

                    投稿者：<span class="stReviewerName">{{
                      review.user_name
                    }}</span>
                    -
                    <a
                      href="https://honto.jp/review/user-review_811000013921.html?pgcl=5"
                      >この投稿者のレビュー一覧を見る</a
                    >
                  </p>
                  <p>
                    <span style="white-space:pre-wrap; word-wrap:break-word;">{{
                      review.body
                    }}</span>
                  </p>
                  <div class="stVote">
                    <p class="stText01">
                      <em>このレビューは役に立ちましたか？</em>
                      <span
                        ><a
                          href="https://honto.jp/ebook/pd_25914816.html?cid=ip_ebset_setcontents_01&amp;mrmid=100000095407&amp;pmd=PrdReviewListPc&amp;recl=1"
                          class="dyPreventDoubleSubmit"
                          onclick=""
                          >はい</a
                        ></span
                      >
                      <span
                        ><a
                          href="https://honto.jp/ebook/pd_25914816.html?cid=ip_ebset_setcontents_01&amp;mrmid=100000095407&amp;pmd=PrdReviewListPc&amp;recl=2"
                          class="dyPreventDoubleSubmit"
                          onclick=""
                          >いいえ</a
                        ></span
                      >
                    </p>
                    <p class="stText02">
                      <a
                        href="https://honto.jp/ebook/report_0625914816_22100000095407.html?__TOKEN__=e9d82291be45cd5c54803167b0dc3568"
                        >報告する</a
                      >
                    </p>
                    <!-- /.stVote-->
                  </div>

                  <!-- /.stBoxReview04-->
                </div>
                <!-- /#stReviewOver -->
              </div>

              <div class="stMore">
                <p>
                  <a href="https://honto.jp/ebook/pd-review_0625914816_191.html"
                    >レビューをもっと見る</a
                  >
                </p>
              </div>
            </div>
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
