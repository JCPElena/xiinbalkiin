<template>
  <v-row justify="center">
    <v-dialog v-model="dialogEdit" persistent max-width="800">
      <v-card>
        <v-card-title class="headline"> Editar Estación </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row>
              <v-col cols="12" class="mb-0 pb-0">
                <v-text-field
                  :rules="campoNecesario"
                  label="Ingresa el nombre de la estación"
                  outlined
                  dense
                  v-model="estacion.nombre"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="mb-0 mt-0 pb-0 pt-0">
                <v-text-field
                  disabled
                  label="Latitud"
                  outlined
                  dense
                  v-model="estacion.latitud"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="mb-0 mt-0 pb-0 pt-0">
                <v-text-field
                  disabled
                  label="Longitud"
                  outlined
                  dense
                  v-model="estacion.longitud"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>

          <!--Mapa-->
        <v-col cols="12">
            <div ref="mapaEditarEstacion" class="mapa"></div>
        </v-col>

          <v-col cols="12" class="mb-0 mt-0 pb-0 pt-0">
            <v-btn
              class="mb-5"
              block
              color="green"
              dark
              @click="$refs.boton.click()"
            >
              <v-icon left>mdi-image-outline</v-icon>Adjuntar foto de la
              estacion
            </v-btn>

            <input
              type="file"
              accept="image/*"
              ref="boton"
              @change="processImage($event)"
              class="d-none"
            />
            <v-img :src="estacion.imagen"></v-img>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" dark depressed @click="$emit('cancel')">
            Cancelar
          </v-btn>
          <v-btn color="green darken-1" dark depressed @click="guardar">
            Actualizar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

<!--Overlay-->
    <v-overlay :value="loading" z-index="999">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-row>
</template>

<script>
import { db, storage } from "../common/Firebase";
import { firestore } from "firebase/app";

import L from "leaflet";

export default {
  mounted() {
    this.init();
  },
  props: {
    dialogEdit: {
      type: Boolean,
      required: true,
    },
    estacion: {
        type: Object,
        required: true
    }
  },
  data: () => ({
    loading: false,
    valid: true,
    imagenActualizada: false,
    image: "",
    imageFile: "",
    mapa: null,
    campoNecesario: [
      (v) => !!v || "El campo es requerido", //se valida de forma automatica
      (v) => (v && v.length >= 5) || " El campo requiere al menos 5 caracteres",
    ],
  }),
  methods: {
    async init() {
      await this.pintarMapa();
      await this.iniciarMarcador();
    },
    pintarMapa() {
      const contenedorMapa = this.$refs.mapaEditarEstacion;
//instanciamos el mapa
      this.mapa = L.map(contenedorMapa, {
        center: [this.estacion.latitud, this.estacion.longitud],
        zoom: 12,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
      }).addTo(this.mapa);
    },
    iniciarMarcador() {
    //Pintamos el marcador y le pasamos la opcion para que se pueda arrastrar
      const marcador = L.marker([this.estacion.latitud, this.estacion.longitud], {
        draggable: true,
      }).addTo(this.mapa);

      marcador.on("drag", (e) => {
        this.estacion.latitud = e.latlng.lat;
        this.estacion.longitud = e.latlng.lng;
      });
    },
   async guardar() {
       //validamos las reglas del nombre de la estacion
      if (!this.$refs.form.validate()) return true;

      try {
        this.loading = true;
        if(this.imagenActualizada){
            await this.eliminarFoto(this.estacion.rutaStorage);
            await this.subirImagen();
        }
        await this.enviarDatosFirebase();
        this.image = "";
        this.$refs.form.reset();
        this.$emit("cancel");
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    async enviarDatosFirebase() {
      const coordenadas = new firestore.GeoPoint(
        parseFloat(this.estacion.latitud),
        parseFloat(this.estacion.longitud)
      );
      const data = {
        nombre: this.estacion.nombre,
        coordenadas: coordenadas,
        urlImagen: this.estacion.imagen,
        rutaStorage: this.estacion.rutaStorage
      };

      db.collection("estaciones").doc(this.estacion.idFirebase)
        .update(data)
        .then(() => {});
    },
    processImage(e) {
      this.imageFile = e.target.files[0]; //guardar el archivo
      const reader = new FileReader(); //crear un buffer de archivos
      reader.readAsDataURL(this.imageFile); //lee el archivo
      reader.onload = async (e) => {
        this.estacion.imagen = await e.target.result;
        this.imagenActualizada = true;
      };
    },
    async eliminarFoto(rutaStorage) {
      try {
        await storage.child(rutaStorage).delete();
      } catch (error) {
        console.log(error);
      }
    },
    async subirImagen() {
      const ruta = 'estaciones/" + this.imageFile.name}';
      try {
        const upload = await storage.child(ruta).put(this.imageFile);
        const urlImg = await upload.ref.getDownloadURL();
        this.estacion.imgUrl = urlImg;
        this.estacion.rutaStorage = ruta;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.mapa {
  width: 100%;
  height: 40vh;
  z-index: 1;
}
</style>
