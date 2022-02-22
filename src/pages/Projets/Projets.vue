<template>
  <v-container fluid>
    <div class="projets-page">
      
      <div v-if="user!=null && user.currentUser!=undefined">
        <projet-add :user="user.currentUser"></projet-add>
      </div>
      
    </div>
  </v-container>
</template>

<script>
import {mapActions} from "vuex";
import ProjetAdd from "@/components/ProjetAdd/ProjetAdd.vue";

export default {
  name: "Projets",
  components: {
    ProjetAdd
  },
  data() {
    return {
      user: null
    };
  },
  methods: {
    ...mapActions("login", ['getCurrentUser']),
    validate () {
      console.log(this.$refs.form.validate())
    },
  },
  async mounted() {
    this.user = await this.getCurrentUser();
  },
};
</script>

<style src="./Projets.scss" lang="scss"/>
