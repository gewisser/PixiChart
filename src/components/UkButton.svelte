<template lang="pug">
  div
    button.uk-button.uk-button-default({disabled})
      | Button asdasdasd
</template>

<script>
  export let disabled = false
</script>

<style lang="scss">
  @import "~/uikit/src/scss/variables-theme.scss";
  @import "~/uikit/src/scss/mixins-theme.scss";
  @import "~/uikit/src/scss/theme/button.scss";
  @import "~/uikit/src/scss/components/button.scss";

</style>
