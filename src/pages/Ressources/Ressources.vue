<template>
  <v-container fluid>
    <div class="ressources-page" v-if="user != undefined">
     
      <div v-if="user!=null && user.currentUser!=undefined">
        <vocabulary-add :user="user.currentUser"></vocabulary-add>
      </div>
    </div>
  </v-container>
</template>

<script>
import {mapActions} from "vuex";
import VocabularyAdd from "@/components/VocabularyAdd/VocabularyAdd.vue"; 

export default {
  name: "Ressources",
  components: {
    VocabularyAdd
  },
  data() {
    return {
      user: undefined
    };
  },
  methods: {
    ...mapActions("login", ['getCurrentUser'])
  },
  async mounted() {
    this.user = await this.getCurrentUser();
  },
};
</script>

<style src="./Ressources.scss" lang="scss"/>
