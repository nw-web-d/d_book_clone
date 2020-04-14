<template>
  <div>
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
        <dl>
          <dt>この著者の新着情報</dt>
          <dd>
            <ul>
              <li>
                <a href="#">受け取る</a>
              </li>
              <li class="stSelected">受け取らない</li>
            </ul>
          </dd>
          <dt>この商品の関連情報</dt>
          <dd>
            <ul>
              <li>
                <a href="#">受け取る</a>
              </li>
              <li class="stSelected">受け取らない</li>
            </ul>
          </dd>
          <!-- /.stBoxHead03-->
        </dl>
        <p class="stLink01">
          <a href="https://honto.jp/my/account/favorite.html">一覧を見る</a>
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
              ><span class="stBtn sizeL stHatena">はてなブックマーク</span></a
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
</template>
<script>
export default {
  props: {
    product: {
      type: Object,
      required: true,
      default: () => {}
    }
  }
}
</script>
