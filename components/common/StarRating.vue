<template>
  <div>
    <star-rating
      :rating="String(rating)"
      :star-size="String(starSize)"
      :read-only="readOnly"
      :show-rating="false"
      :increment="0.2"
      :max-rating="5"
      inactive-color="#737373"
      active-color="#ed8a19"
    />
  </div>
</template>
<script>
export default {
  props: {
    rating: {
      type: Number,
      required: true,
      default: 0
    },
    starSize: {
      type: Number,
      required: true,
      default: 10
    },
    readOnly: {
      type: Boolean,
      required: false,
      default: true
    }
  }
}
</script>
