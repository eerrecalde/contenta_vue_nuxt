<template>
  <div class="has-text-centered container">
    <appSection>
      <h1 class="title is-4">Sorry, our API server is unreachable for now </h1>
      <img src="~assets/images/server-unreachable.gif" />
    </appSection>
  </div>
</template>

<script>
import AppSection from '~/components/AppSection'
export default {
  components: { AppSection }
}
</script>