<template>
  <div>
    <noscript
      ><p class="stCenter">
        <strong class="stStr01"
          >JavaScriptが無効の場合は一部ご利用いただけない機能がございますので、有効にすることをお勧めいたします。
        </strong>
      </p>
      <!-- Google Tag Manager -->
      <iframe
        src="https://www.googletagmanager.com/ns.html?id=GTM-MLM9VG"
        height="0"
        width="0"
        style="display: none; visibility: hidden;"
      ></iframe>
      <!-- End Google Tag Manager -->
    </noscript>
    <div id="page" class="pbPage">
      <div id="headerArea" class="pbHeaderArea">
        <div id="area1" class="pbArea pbAreaDisabled">
          <div class="pbNested">
            <!--ナビバー -->
            <Navbar />

            <div id="pbBlock2640587" class="pbNested pbNestedWrapper">
              <!-- ジャンル名の取得ができないページではブロックを非表示-->
            </div>
            <div id="pbBlock2640589" class="pbNested pbNestedWrapper">
              <!-- トピックバー -->
              <TopicPath />
            </div>
            <div id="pbBlock2640582" class="pbNested pbNestedWrapper"></div>
            <div id="pbBlock4852927" class="pbNested pbNestedWrapper">
              <script>
                _etmc.push(['setOrgId', '110008041'])
              </script>
            </div>
          </div>
        </div>
      </div>
      <nuxt />
      <Footer />
    </div>
  </div>
</template>

<script>
import Navbar from '~/components/honto/Navbar'
import TopicPath from '~/components/honto/TopicPath'
import Footer from '~/components/honto/Footer'
export default {
  components: {
    Navbar,
    TopicPath,
    Footer
  }
}
</script>
