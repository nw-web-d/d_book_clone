<template>
  <div>
    <div class="text-center">
      <a href="#">
        <img src="/img/logo-black.png" style="width: 240px;" />
      </a>
    </div>
    <a href="#" @click="onLogout()">Logout</a>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  auth: 'guest',
  layout: 'none',
  methods: {
    async onLogout() {
      await this.$auth.logout
    }
  }
}
</script>
