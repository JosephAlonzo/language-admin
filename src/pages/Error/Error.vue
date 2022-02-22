<template>
  <v-app>
    <v-container fluid class="error-page">
      <v-row class="d-flex justify-center mt-5">
        <v-col cols="10">
          
          <div class="card">
            
            <span class="error-logo">404</span>
            <v-img
              max-height="205"
              min-width="190"
              src="@/assets/icons/eagle_1.svg" 
            ></v-img>
            <p class="error-text">Oups. Il semble que la page que vous recherchez n'existe plus</p>
            
            <v-btn
                dark
                x-large
                :color="config.light.secondary"
                to="home"
            >
              De retour à l'accueil
            </v-btn>
          </div>
        </v-col>
      </v-row>
  </v-container>
  </v-app>
</template>

<script>
import config from '@/config';

export default {
  name: 'Error',
  data(){
    return{
      config
    }
  }
};
</script>

<style src="./Error.scss" lang="scss"></style>
