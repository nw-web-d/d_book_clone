<template>
  <div>
    <StarRating :rating="1" :star-size="30" />
  </div>
</template>
<script>
import StarRating from '~/components/common/StarRating'
export default {
  components: { StarRating }
}
</script>
