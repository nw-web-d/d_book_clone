<template>
  <div>
    <h1>管理画面</h1>
    <ul>
      <li>
        <h3><nuxt-link to="/admin/author">作者登録</nuxt-link></h3>
      </li>
      <li>
        <h3><nuxt-link to="/admin/series">シリーズ登録</nuxt-link></h3>
      </li>
      <li>
        <h3><nuxt-link to="/admin/product">書籍登録</nuxt-link></h3>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  layout: 'none'
}
</script>