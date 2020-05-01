<template>
  <main>
    <div class="registerAddress mt-3">
      <div class="container-fluid c-section">
        <div class="row">
          <div class="col-sm-3"></div>
          <div class="col-sm-6">
            <div class="a-section a-spacing-medium">
              <div class="a-subheader a-breadcrumb a-spacing-small">
                <ul>
                  <li>
                    <nuxt-link to="/admin">
                      <span>管理画面</span>
                    </nuxt-link>
                  </li>
                  <li class="a-breadcrumb-divider">›</li>
                  <li>
                    <a href="#">
                      <span>書籍登録</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="a-section">
              <h2>書籍登録</h2>

              <!-- Error Message -->
              <div class="a-section a-spacing-none a-spacing-top-small">
                <b></b>
              </div>
              <form>
                <div class="a-spacing-medium a-spacing-top-medium">
                  <div class="a-spacing-top-medium">
                    <label style="margin-bottom: 0px;">タイトル</label>
                    <input
                      v-model="title"
                      type="text"
                      class="a-input-text"
                      style="width: 100%;"
                    />
                  </div>

                  <div class="a-spacing-top-medium">
                    <label style="margin-bottom: 0px;">詳細説明</label>
                    <textarea
                      v-model="detail"
                      placeholder="あらすじ等"
                      style="height:6em; width: 100%;"
                    ></textarea>
                  </div>

                  <div class="a-spacing-top-medium">
                    <label style="margin-bottom: 0px;">画像URL</label>
                    <input
                      v-model="photoUrl"
                      type="text"
                      class="a-input-text"
                      style="width: 100%;"
                    />
                  </div>

                  <div class="a-spacing-top-medium">
                    <label style="margin-bottom: 0px;">著者</label>
                    <select v-model="author" class="a-select-option">
                      <option
                        v-for="author in authorList"
                        :key="author._id"
                        :value="author._id"
                        >{{ author.name }}</option
                      >
                      <option></option>
                    </select>
                  </div>

                  <div class="a-spacing-top-medium">
                    <label style="margin-bottom: 0px;">シリーズ</label>
                    <select v-model="series" class="a-select-option">
                      <option
                        v-for="series in seriesList"
                        :key="series._id"
                        :value="series._id"
                        >{{ series.series }}({{ series.magazine }})</option
                      >
                      <option></option>
                    </select>
                  </div>
                  <div class="a-spacing-top-medium">
                    <label style="margin-bottom: 0px;">値段</label>
                    <input
                      v-model="price"
                      type="text"
                      class="a-input-text"
                      style="width: 100%;"
                    />
                  </div>

                  <div class="a-spacing-top-large">
                    <span class="a-button-register">
                      <span class="a-button-inner">
                        <span class="a-button-text" @click="onAdd">登録</span>
                      </span>
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div class="col-sm-3"></div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
export default {
  layout: 'none',
  async asyncData({ $axios }) {
    let resAuthorList = {}
    let resSeriesList = {}
    try {
      resAuthorList = await $axios.$get('/v2/admin/author')
      resSeriesList = await $axios.$get('/v2/admin/series')
    } catch (err) {
      console.log(err)
    }
    return {
      authorList: resAuthorList.authors,
      seriesList: resSeriesList.series
    }
  },
  data() {
    return {
      title: '',
      detail: '',
      photoUrl: '',
      author: '',
      series: '',
      price: '460'
    }
  },
  methods: {
    async onAdd() {
      try {
        console.log()
        const data = {
          title: this.title,
          detail: this.detail,
          photo_url: this.photoUrl,
          author_id: this.author,
          series_id: this.series,
          price: this.price
        }
        const response = await this.$axios.$post(`/v2/admin/product/add`, data)
        if (response.success) {
          this.$router.push('/admin')
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
