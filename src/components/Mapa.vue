<template>
  <div ref="contenedorMapa" class="mapa"></div>
</template>

<script>
import L from "leaflet";
import { db } from "../common/Firebase";
import { ruta } from "../common/Ruta";
//esto son clases
export default {
  name: "mapaComponent",
  mounted() {
    this.init();
  },

  data: () => ({
    mapa: null,
  }),

  methods: {
    async init() {
      await this.pintarMapa();
      await this.obtenerMarcadores();
      await this.pintarRuta();

    },
    pintarMapa() {
      const contenedorMapa = this.$refs.contenedorMapa;
      //instanciamos el mapa
      this.mapa = L.map(contenedorMapa, {
        center: [18.0765757,-94.3811401],
        zoom: 12,
      });
      //le agregamos la capa personalizada del mapa leaflet
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
      }).addTo(this.mapa);
    },
    async obtenerMarcadores() {
      try {
        const response = await db.collection("estaciones").get();

        response.docs.forEach((e) => {
         let latitud = e.data().coordenadas.latitude;
         let longitud = e.data().coordenadas.longitude;

        this.pintarMarcador([latitud, longitud]);
        });
      } catch (error) {
        console.warn(error);
      }
    },
    pintarMarcador(coordenadas){
        L.marker(coordenadas).addTo(this.mapa);
    },
    pintarRuta(){
      L.geoJSON(ruta, {
        style: {
          color: "#6200EA",
          weight: 12,
        },
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
