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
                      <span>作者登録</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="a-section">
              <h2>作者登録</h2>

              <!-- Error Message -->
              <div class="a-section a-spacing-none a-spacing-top-small">
                <b></b>
              </div>
              <form>
                <div class="a-spacing-medium a-spacing-top-medium">
                  <!-- Full name -->
                  <div class="a-spacing-top-medium">
                    <label style="margin-bottom: 0px;">氏名</label>
                    <input
                      v-model="name"
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
  data() {
    return {
      fullName: ''
    }
  },
  methods: {
    async onAdd() {
      try {
        const data = {
          name: this.name
        }
        const response = await this.$axios.$post(`/v2/admin/author/add`, data)
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
