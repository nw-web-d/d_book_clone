<template>
  <header class="nav-opt-sprite nav-locate-ja nav-ssl nav-unrec">
    <div class="container-fluid dekstop-nav">
      <div class="row">
        <!-- Logo -->
        <div class="col-sm-2">
          <div class="logo-area">
            <nuxt-link to="/"
              ><img src="/img/logo.png" alt="Logo" class="img-fluid"
            /></nuxt-link>
          </div>
        </div>

        <!-- Serch Bar -->
        <div class="col-sm-6 pt-0">
          <Search />
        </div>

        <div class="col-sm-4"></div>
      </div>

      <div class="row">
        <div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 pl-2">
          <div class="nav-global-location">
            <nuxt-link to="/address" class="nav-a nav-a-2">
              <div id="nav-packard-glow-loc-icon" class="nav-sprite"></div>
              <div id="glow-ingress-block">
                <span id="glow-ingress-line1" class="nav-line-1"
                  >Deliver to</span
                >
                <span id="glow-ingress-line2" class="nav-line-2">Chiba</span>
              </div>
            </nuxt-link>
          </div>
        </div>

        <!-- Shopping -->
        <div class="col-xl-6 col-lg-5 col-md-4 col-sm-6 pl-0">
          <div class="nav-fill">
            <div class="nav-shop">
              <nuxt-link
                to="/history"
                class="nav-a nav-a-2 nav-single-row-link"
              >
                <span class="nav-line-2">
                  Browsing History
                  <span
                    class="nav-icon nav-arrow"
                    style="visibilty: visble"
                  ></span>
                </span>
              </nuxt-link>
            </div>
            <div class="nav-xshop-container">
              <div class="nav-xshop">
                <a href="#" class="nav-a">Today's deales</a>
                <a href="#" class="nav-a">Your amazon.com</a>
                <a href="#" class="nav-a">Gift cards</a>
                <a href="#" class="nav-a">Registry</a>
                <a href="#" class="nav-a">sell</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Account -->
        <div class="col-xl-4 col-lg-5 col-md-6 col-sm-4 pl-0">
          <div class="nav-tools">
            <a
              id="icp-nav-flyout"
              href="#"
              class="nav-a nav-a-2 icp-link-style-2"
            >
              <span class="icp-nav-link-inner">
                <span class="nav-line-1">
                  <span class="icp-nav-globe-img-2"></span>
                  <span class="icp-nav-language">JP</span>
                </span>

                <span class="nav-line-2">
                  &nbsp;
                  <span
                    class="nav-icon nav-arrow"
                    style="visibillity: visible"
                  ></span>
                </span>
              </span>
            </a>
            <span class="icp-nav-link-border"></span>
            <template v-if="loggedIn">
              <nuxt-link
                id="nav-link-account-list"
                to="/auth/profile"
                class="nav-a nav-a-2"
                tabindex="0"
                ><span class="nav-line-1">Hello,</span>
                <span class="nav-line-2">{{ $auth.$state.user.name }}</span>
              </nuxt-link>
            </template>
            <template v-else>
              <nuxt-link
                id="nav-link-account-list"
                to="/auth/signup"
                class="nav-a nav-a-2"
                tabindex="0"
              >
                <span class="nav-line-1">Hello Sing in</span>
                <span class="nav-line-2">
                  Account &nbsp; Lists
                  <span
                    class="nav-icon nav-arrow"
                    style="visibillity: visible"
                  ></span>
                </span>
              </nuxt-link>
            </template>

            <!-- orders -->
            <nuxt-link to="/orders" class="nav-a nav-a-2 nav-single-row-link">
              <span aria-hidden="true" class="nav-line-1"></span>
              <span aria-hidden="true" class="nav-line-2">Orders</span>
            </nuxt-link>

            <!-- cart -->
            <nuxt-link id="nav-cart" to="/cart" class="nav-a nav-a-2">
              <span aria-hidden="true" class="nav-line-1"></span>
              <span aria-hidden="true" class="nav-line-2">Cart</span>
              <span class="nav-cart-icon nav-sprite"></span>
              <span
                id="nav-cart-count"
                aria-hidden="true"
                class="nav-cart-count nav-cart-0"
                >{{ getCartLength }}</span
              >
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
<script>
import { mapGetters } from 'vuex'
import Search from '~/components/Search'
export default {
  components: {
    Search
  },
  computed: {
    ...mapGetters(['getCartLength']),
    loggedIn() {
      // ログインするとtrue
      return this.$store.state.auth.loggedIn
    }
  }
}
</script>
