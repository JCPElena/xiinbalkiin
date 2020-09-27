<template>
    <div>
<v-app-bar
      color="deep-purple accent-4"
      dense
      dark
    >
      <v-app-bar-nav-icon @click="mostrarNavigateDrawer = true"></v-app-bar-nav-icon>

      <v-spacer></v-spacer><!--espacio proporcional-->
      <v-toolbar-title>xiinbalkiing</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-google-translate</v-icon>
        ES
      </v-btn>

    </v-app-bar>

<!-- En :drawer psamos la propiedad al componente padre
     En @cerra recibimos un evento personalizado -->

    <NavigateDrawe 
    :drawer="mostrarNavigateDrawer"
    @cerrar="mostrarNavigateDrawer = false"
   />
    </div>
</template>

<script>
  import NavigateDrawe from "./NavigationDrawer"

  export default {
  components: {
    NavigateDrawe 
  },
  data: () => ({
    mostrarNavigateDrawer: false
  })  
  };
</script>

<style lang="scss" scoped>

</style>