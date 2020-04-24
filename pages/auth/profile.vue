<template>
  <div class="row">
    <div class="col-sm-4"></div>
    <div class="col-sm-4">
      <form class="mt-4">
        <dev class="a-box a-spacing-extra-large">
          <div class="a-box-inner">
            <h1 class="a-spacing-small">
              Profile Update
            </h1>
            <a href="#" @click="onLogout()">Logout</a>
            <!--Email-->
            <div class="a-row a-pspacing-base">
              <label for="ap_customer" class="a-form-label">name</label>
              <input
                id="ap_customer_name"
                type="text"
                class="a-input-text form-contral auth-autofocus auth-required-field auth-contact-verification-request-info"
                v-model="name"
                :placeholder="$auth.$state.user.name"
              />
            </div>

            <!--Email-->
            <div class="a-row a-pspacing-base">
              <label for="ap_customer" class="a-form-label">Email</label>
              <input
                id="ap_customer_name"
                type="email"
                class="a-input-text form-contral auth-autofocus auth-required-field auth-contact-verification-request-info"
                v-model="email"
                :placeholder="$auth.$state.user.email"
              />
            </div>

            <!--Password-->
            <div class="a-row a-pspacing-base">
              <label for="ap_customer" class="a-form-label">Password</label>
              <input
                id="ap_customer_name"
                type="password"
                class="a-input-text form-contral auth-autofocus auth-required-field auth-contact-verification-request-info"
                v-model="password"
              />
              <div class="a-alert-container">
                <div class="a-alert-content">
                  Password must be at least 6 characteres
                </div>
              </div>
            </div>

            <!-- Button -->
            <div class="a-row a-spacing-extra-large md-4">
              <span class="a-button-primary">
                <span class="a-button-inner">
                  <span class="a-button-text" @click="onUpdateProfile()">
                    Update Profile
                  </span>
                </span>
              </span>
            </div>
          </div>
        </dev>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: '',
      email: '',
      password: ''
    }
  },
  methods: {
    async onUpdateProfile() {
      let data = {
        name: this.name,
        email: this.email,
        password: this.password
      }
      try {
        let response = await this.$axios.$put('/api/auth/user', data)
        if (response.success) {
          this.name = ''
          this.email = ''
          this.password = ''

          await this.$auth.fetchUser()
          this.$router.push('/')
        }
      } catch (err) {
        console.log(err)
      }
    },
    async onLogout() {
      await this.$auth.logout()
    }
  }
}
</script>