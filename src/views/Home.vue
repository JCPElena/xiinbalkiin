<template>
  <div class="home">
  <Mapa />
  <SeccionPrincipal />
  </div>
</template>

<script>
 
 import Mapa from "../components/Mapa";
 import SeccionPrincipal from "../components/SeccionPrincipal"
  export default {
    name: "Home",
    components: {
      Mapa,
      SeccionPrincipal,
    },
  }
</script>

<style lang="scss" scoped>

</style>