<template>
    <div ref="contenedorMapa" class="mapa"></div>
</template>

<script>
import L from "leaflet";
//esto son clases
    export default {
    name: "mapaComponent",
    mounted(){
this.init();
    },

    data: () => ({
        mapa:null
    }),

    methods: {
        async init(){
            await this.pintarMapa();

        },
            pintarMapa(){
                const contenedorMapa = this.$refs.contenedorMapa;
                //instanciamos el mapa
                this.mapa = L.map(contenedorMapa, {
                  center: [18.0765757,-94.3811401],
                  zoom: 13, 
                });
//le agregamos la capa personalizada del mapa leaflet
                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                 maxZoom: 18,
                 }).addTo(this.mapa);
            },
        },
    };
</script>

<style lang="scss" scoped>
.mapa {
    width: 100%;
    height: 70vh;
    z-index: 1;
}
</style>