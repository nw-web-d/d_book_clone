<template>
  <div class="row">
    <div class="col-sm-4"></div>
    <div class="col-sm-4">
      <div class="text-center">
        <a href="#">
          <img src="/img/logo-black.png" style="width: 240px;" />
        </a>
      </div>
      <form class="mt-4">
        <dev class="a-box a-spacing-extra-large">
          <div class="a-box-inner">
            <h1 class="a-spacing-small">
              Create account
            </h1>
            <!--Your Name-->
            <div class="a-row a-pspacing-base">
              <label for="ap_customer" class="a-form-label">Your name</label>
              <input
                type="text"
                id="ap_customer_name"
                class="a-input-text form-contral auth-autofocus auth-required-field auth-contact-verification-request-info"
                v-model="name"
              />
            </div>

            <!--Email-->
            <div class="a-row a-pspacing-base">
              <label for="ap_customer" class="a-form-label">Email</label>
              <input
                type="email"
                id="ap_customer_name"
                class="a-input-text form-contral auth-autofocus auth-required-field auth-contact-verification-request-info"
                v-model="email"
              />
            </div>

            <!--Password-->
            <div class="a-row a-pspacing-base">
              <label for="ap_customer" class="a-form-label">Password</label>
              <input
                type="password"
                id="ap_customer_name"
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
                  <span class="a-button-text" @click="onSignup">
                    Create your Amazon account
                  </span>
                </span>
              </span>
            </div>
            <div class="a-row a-spacing-top-medium a-size-small">
              <b>
                by create an account
                <a href="#">of use</a>
                <a href="#">nottice</a>
              </b>
            </div>
            <hr />
            <div class="a-row">
              <b>
                Already have an account?
                <nuxt-link to="/login" class="a-link-emphasis"
                  >Sign in</nuxt-link
                >
              </b>
            </div>
          </div>
        </dev>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  auth: 'guest',
  layout: 'none',
  data() {
    return {
      name: '',
      email: '',
      password: ''
    }
  },
  methods: {
    async onSignup() {
      try {
        let data = {
          name: this.name,
          email: this.email,
          password: this.password
        }
        let response = await this.$axios.$post('/api/auth/signup', data)
        console.log(response)
        if (response.success) {
          this.$auth.loginWith('local', {
            data: {
              email: this.email,
              password: this.password
            }
          })
          this.$router.push('/')
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>